require 'sinatra'
require 'json'
require 'openssl'
require 'mongoid'

require File.join(File.dirname(__FILE__), 'redmine/issue')
require File.join(File.dirname(__FILE__), 'redmine/project')
require File.join(File.dirname(__FILE__), 'github/pull_request')
require File.join(File.dirname(__FILE__), 'jenkins')
require File.join(File.dirname(__FILE__), 'bugzilla')
require File.join(File.dirname(__FILE__), 'models/version')
require File.join(File.dirname(__FILE__), 'models/project')
require File.join(File.dirname(__FILE__), 'models/issue')
require File.join(File.dirname(__FILE__), 'models/reviews')
require File.join(File.dirname(__FILE__), 'server/updates')
require File.join(File.dirname(__FILE__), 'server/auth')

set :public_folder, Proc.new { File.join(root, "app") }

enable :sessions
set :session_secret, 'super secret'

Mongoid.load!(File.expand_path(File.join("mongoid.yml")))
puts Mongoid.sessions

post '/pull_request' do
  request.body.rewind
  payload_body = request.body.read
  verify_signature(payload_body)

  payload = JSON.parse(payload_body)
  raise "unknown repo" unless payload['repository'] && (repo = payload['repository']['name'])

  pull_request = PullRequest.new(payload['pull_request'])
  pr_number = pull_request.raw_data['number']
  pr_action = payload['action']

  halt if ['labeled', 'unlabeled'].include?(pr_action)

  pull_request.issue_numbers.each do |issue_number|
    issue = Redmine::Issue.new(issue_number)
    project = Redmine::Project.new(issue.project)
    current_version = project.current_version

    unless issue.rejected?
      issue.set_version(current_version['id']) if issue.version.nil? && current_version
      issue.set_pull_request(pull_request.raw_data['html_url']) if issue.pull_request.nil? || issue.pull_request.empty?
      issue.set_status(Redmine::Issue::READY_FOR_TESTING) unless issue.closed?
      issue.save!
    end
  end

  if payload['action'] == 'opened'
    pull_request.set_labels
  end

  jenkins = Jenkins.new
  jenkins.build(repo, pr_number)

end

get '/reviews/:repo' do
  reviews = Reviews.data(params[:repo])

  content_type :json
  reviews.to_json
end

get '/status' do
  locals = {}
  locals[:jenkins_token] = ENV['JENKINS_TOKEN'] ? true : false
  locals[:github_secret] = ENV['GITHUB_SECRET_TOKEN'] ? true : false
  locals[:redmine_key] = ENV['REDMINE_API_KEY'] ? true : false
  locals[:github_oauth_token] = ENV['GITHUB_OAUTH_TOKEN'] ? true : false

  erb :status, :locals => locals
end

get '/api/upstream/:project/versions' do
  project = Redmine::Project.new(params[:project])

  versions = Version.where(:project_id => project.raw_data['project']['id'])

  content_type :json
  versions.to_json
end

get '/api/upstream/:project/versions/:versionId/issues' do
  issues = Issue.where(:fixed_version_id => params[:versionId].to_i)

  content_type :json
  issues.to_json
end

get '/api/upstream/release/:project/:id' do
  project = Redmine::Project.new(params[:project])
  issues = project.get_issues_for_release(params[:id])

  content_type :json
  issues.to_json
end

get '/api/upstream/:project/trackers' do
  issues = Issue.where(:project_id => Project.where(:name => params[:project]).first.id).where('tracker.name' => 'Tracker')

  content_type :json
  issues.to_json
end

get '/api/downstream/release/:id' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bugs = bugzilla.bugs_for_release(params[:id], params)

  content_type :json
  bugs
end

get '/api/issue/:id' do
  issue = Redmine::Issue.new(params[:id])

  content_type :json
  issue.raw_data.to_json
end

get '/api/bugzilla/:id/clones' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bug = bugzilla.find_clone(params[:id], params[:blocker_ids])

  content_type :json
  bug
end

get '/api/bugzilla/:id' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bug = bugzilla.get_bug(params[:id])

  content_type :json
  bug
end

get %r{^(?!/api*)} do
  send_file 'app/index.html'
end

def verify_signature(payload_body)
  signature = 'sha1=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), ENV['GITHUB_SECRET_TOKEN'], payload_body)
  return halt 500, "Signatures didn't match!" unless Rack::Utils.secure_compare(signature, request.env['HTTP_X_HUB_SIGNATURE'])
end
