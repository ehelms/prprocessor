class Review

  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  def self.repos
    [
      'foreman',
      'smart-proxy',
      'theforeman.org',
      'foreman_discovery',
    ]
  end

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

    end
  end
end
