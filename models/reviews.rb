class Reviews

  def self.data(repo = nil)
    client   = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'] )
    repos    = [repo] || ['smart-proxy']
    @reviews = {}
    @now     = Time.now

    repos.each do |repo|
      # Get open pulls
      # reject pulls where last comment is from the author
      # rationale: if last comment is the author, it's probably in response to
      # review comments and needs a re-review

      pulls = client.pulls("theforeman/#{repo}").map do |pull|
        comments = client.pull_comments("theforeman/#{repo}",pull.number) +
                   client.issue_comments("theforeman/#{repo}",pull.number)
        comments.reject! {|x| x.user.login == "theforeman-bot" }
        comments.sort_by! {|c| c.created_at }

        status = nil
        age    = ((@now - pull.created_at)/60.0/60.0/24.0).round(2)  # time since creation
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
          # last comment is from the author, so age is now the time since that comment
          age    = ((@now - (comments.select {|c| c.user.login == pull.user.login}.last.created_at))/60.0/60.0/24.0).round(2)
          status = :default
        end

        {
          :number   => pull.number,
          :title    => pull.title,
          :author   => pull.user.login,
          :status   => status,
          :age      => age,
          :review   => review,
          :reviewer => (pull.assignee? ? pull.assignee.login : nil)
        }
      end
      @reviews[repo] = pulls
    end
    @reviews
  end
end
