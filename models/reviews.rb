class Reviews

  def self.data(repo = nil)
    client = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'] )
    repos = [repo] || ['smart-proxy']
    @reviews = {}

    repos.each do |repo|
      # Get open pulls
      # reject pulls where last comment is from the author
      # rationale: if last comment is the author, it's probably in response to
      # review comments and needs a re-review

      pulls = client.pulls("theforeman/#{repo}").map do |pull|
        comments = client.pull_comments("theforeman/#{repo}",pull.number) +
                   client.issue_comments("theforeman/#{repo}",pull.number)
        comments.reject! {|x| x.user.login == "theforeman-bot" }

        status = nil
        review = true
        if comments.nil? || comments.size == 0
          status = :no_comments
          review = true
        elsif client.issue("theforeman/#{repo}",pull.number).labels.map {|l| l.name}.include?("Waiting on contributor")
          status = :labelled_as_waiting
          review = false
        elsif comments.last.user.login != pull.user.login
          status = :last_comment_is_not_author
          review = false
        else
          status = :default
        end

        {
          :number   => pull.number,
          :title    => pull.title,
          :author   => pull.user.login,
          :status   => status,
          :review   => review,
          :reviewer => (pull.assignee? ? pull.assignee.login : nil)
        }
      end
      @reviews[repo] = pulls
    end
    @reviews
  end
end
