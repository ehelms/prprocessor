class Repo
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  # Update this daily with a cron job, it doesnt change often
  def self.index
    client   = Octokit::Client.new(:access_token => ENV['GITHUB_OAUTH_TOKEN'] )

    # Needed to fetch all repos, instead of the first 30
    client.auto_paginate = true
    repos = (client.repos('theforeman').map(&:full_name) + client.repos('katello').map(&:full_name)).sort

    # Just in case of API timeouts, etc...
    return unless repos.size > 0

    # Just store the array as a single record, so we can pull it back out easily
    data = { 'repos' => repos, 'refreshed_on' => Time.now, }

    begin
      db_record = self.first
    rescue Mongoid::Errors::DocumentNotFound => e
    end

    if db_record
      db_record.update_attributes!(data)
    else
      self.create!(data)
    end
  end

  def self.repos
    begin
      db_record = self.first
    rescue Mongoid::Errors::DocumentNotFound => e
    end

    if db_record
      db_record.repos
    else
      []
    end
  end

end
