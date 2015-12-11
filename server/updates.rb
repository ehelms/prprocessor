require 'sinatra'
require 'json'

get '/api/upstream/:project/versions/update' do
  project = Redmine::Project.new(params[:project])
  versions = project.versions['versions']

  Version.index(versions, project)
  Project.index([
    {'id' => 19, 'name' => 'katello'},
    {'id' => 1, 'name' => 'foreman'}
  ])

  content_type :json
  {message: 'success'}.to_json
end

get '/api/upstream/:project/versions/:versionId/issues/update' do
  project = Redmine::Project.new(params[:project])
  issues = project.issues_for_version(params[:versionId])
  Issue.destroy_all(:fixed_version_id => params[:versionId].to_i)
  Issue.index(issues)

  content_type :json
  {message: 'success'}.to_json
end

get '/api/upstream/:project/trackers/update' do
  project = Redmine::Project.new(params[:project])
  issues = project.trackers

  Issue.destroy_all(:project_id => Project.where(:name => params[:project]).first.id, 'tracker.name' => 'Tracker')
  Issue.index(issues)

  content_type :json
  issues.to_json
end

get '/api/reviews/:repo/update' do
  pulls = PullRequest.get_reviews(params[:repo])

  Review.index(pulls)

  content_type :json
  {message: 'success'}.to_json
end
