class Project
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  field :name, type: String

  has_many :versions
  has_many :issues

  def self.index(projects)
    projects.each do |project_data|
      project_data['refreshed_on'] = Time.now

      begin
        project = self.find(project_data['id'])
      rescue Mongoid::Errors::DocumentNotFound => e
      end

      if project
        project.update_attributes!(project_data)
      else
        self.create!(:id => project_data['id'], :name => project_data['name'])
      end

    end
  end
end
