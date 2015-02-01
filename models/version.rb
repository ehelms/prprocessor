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

end
