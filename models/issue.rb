class Issue
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  belongs_to :fixed_version, :class_name => 'Version'
  belongs_to :project

  def self.index(issues)
    issues.each do |issue_data|
      issue_data['refreshed_on'] = Time.now

      begin
        issue = self.find(issue_data['id'])
      rescue Mongoid::Errors::DocumentNotFound => e
      end

      if issue
        issue.update_attributes!(issue_data)
      else
        self.create!(issue_data)
      end
    end
  end

end
