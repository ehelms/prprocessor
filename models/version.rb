require './models/issue.rb'

class Version
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  belongs_to :project
  has_many :issues

  def self.index(versions, project)
    versions.each do |version|
      issues = project.issues_for_version(version['id'])
      issues = issues['issues'] if issues.is_a?(Hash) && issues['issues']

      version['refreshed_on'] = Time.now
      version['stats'] = self.stats(version, issues)

      begin
        sprint = self.find(version['id'])
      rescue Mongoid::Errors::DocumentNotFound => e
      end

      if sprint
        sprint.update_attributes!(version)
      else
        self.create!(version)
      end
    end
  end

  def self.stats(version, issues)
    stats = {
      'closed' => {
        'ungroomed' => 0,
        'story_points' => 0,
        'features' => 0,
        'bugs' => 0
      },
      'open' => {
        'ungroomed' => 0,
        'story_points' => 0,
        'features' => 0,
        'bugs' => 0
      }
    }

    issues.each do |issue|
      status = Issue.closed?(issue) ? 'closed' : 'open'

      if issue['tracker']['name'] == 'Feature'
        stats[status]['ungroomed'] += 1 if issue['story_points'].nil?
        stats[status]['story_points'] += issue['story_points'] if !issue['story_points'].nil?
      end

      stats[status]['features'] += 1 if issue['tracker']['name'] == 'Feature'
      stats[status]['bugs'] += 1 if issue['tracker']['name'] == 'Bug'
    end

    stats
  end

end
