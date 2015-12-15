require 'octokit'


class PullRequest

  attr_accessor :raw_data, :title, :issue_numbers, :repo, :number, :client

  def initialize(raw_data)
    self.raw_data = raw_data
    self.title = raw_data['title']
    self.repo = raw_data['base']['repo']['full_name']
    self.number = raw_data['number']
    self.client = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'])

    self.issue_numbers = []
    title.scan(/([\s\(\[,-]|^)(fixes|refs)[\s:]+(#\d+([\s,;&]+#\d+)*)(?=[[:punct:]]|\s|<|$)/i) do |match|
      action, refs = match[1].to_s.downcase, match[2]
      next if action.empty?
      refs.scan(/#(\d+)/).each { |m| self.issue_numbers << m[0].to_i }
    end
  end

  def new?
    @raw_data['created_at'] == @raw_data['updated_at']
  end

  def set_labels
    labels = ["Needs testing", "Not yet reviewed"]
    @client.add_labels_to_an_issue(@repo, @number, labels)
  end

  def self.get_for_user(username)
    client = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'] )

    pulls = client.search_issues("author:#{username} is:open")[:items].collect do |pull|
      repo_splitter = pull.html_url.include?('/pull') ? '/pull' : '/issue'
      repo = pull.html_url.split('https://github.com/')[1].split(repo_splitter)[0]

      {
        'id'       => pull.number,
        'title'    => pull.title,
        'author'   => pull.user.login,
        'url'      => pull.html_url,
        'repo'     => repo
      }
    end

    pulls
  end

  # Move to a Repository class?
  def self.get_reviews(repo=nil)

    client   = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'] )
    repos    = Review.repos if repos.nil?
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
          'id'       => pull.number,
          'repo'     => repo,
          'title'    => pull.title,
          'author'   => pull.user.login,
          'status'   => status,
          'age'      => age,
          'review'   => review,
          'reviewer' => (pull.assignee? ? pull.assignee.login : nil)
        }
      end
      @reviews[repo] = pulls
    end
    @reviews
  end
end
