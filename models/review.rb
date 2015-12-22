class Review

  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def self.index(repos)
    repos.each do |repo,repo_data|
      repo_data.each do |pull_data|
        pull_data['refreshed_on'] = Time.now

        begin
          pull = self.find(pull_data['id'])
        rescue Mongoid::Errors::DocumentNotFound => e
        end

        if pull
          pull.update_attributes!(pull_data)
        else
          self.create!(pull_data)
        end

      end

      # Delete old closed PRs
      db_prs = self.where(repo:repo).map(&:id)
      (db_prs - repo_data.map{|x| x["id"]}).each do |old_pr|

        begin
          pull = self.find(old_pr)
        rescue Mongoid::Errors::DocumentNotFound => e
        end

        pull.destroy if pull
      end

    end
  end

  def self.get_for_user(github_id)
    db_reviews = self.where(reviewer:github_id)
    db_reviews.map { |r|
      {
        'id'       => r.number,
        'title'    => r.title,
        'author'   => r.author,
        'url'      => "https://github.com/#{r.repo}/pull/#{r.number}",
        'repo'     => r.repo.split('/')[1]
      }
    }
  end

end
