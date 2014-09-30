require 'sinatra'
require 'json'
require 'openssl'

require File.join(File.dirname(__FILE__), 'redmine/issue')
require File.join(File.dirname(__FILE__), 'redmine/project')
require File.join(File.dirname(__FILE__), 'github/pull_request')
require File.join(File.dirname(__FILE__), 'jenkins')
require File.join(File.dirname(__FILE__), 'bugzilla')

set :public_folder, Proc.new { File.join(root, "app") }

enable :sessions
set :session_secret, 'super secret'

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
    issue = Issue.new(issue_number)
    project = Project.new(issue.project)
    current_version = project.current_version

    unless issue.rejected?
      issue.set_version(current_version['id']) if issue.version.nil? && current_version
      issue.set_pull_request(pull_request.raw_data['html_url']) if issue.pull_request.nil? || issue.pull_request.empty?
      issue.set_status(Issue::READY_FOR_TESTING) unless issue.closed?
      issue.save!
    end
  end

  if payload['action'] == 'opened'
    pull_request.set_labels
  end

  jenkins = Jenkins.new
  jenkins.build(repo, pr_number)

end

get '/status' do
  locals = {}
  locals[:jenkins_token] = ENV['JENKINS_TOKEN'] ? true : false
  locals[:github_secret] = ENV['GITHUB_SECRET_TOKEN'] ? true : false
  locals[:redmine_key] = ENV['REDMINE_API_KEY'] ? true : false
  locals[:github_oauth_token] = ENV['GITHUB_OAUTH_TOKEN'] ? true : false

  erb :status, :locals => locals
end

get '/user' do
  content_type :json
  {:user => session[:user]}.to_json
end

post '/login' do
  data = JSON.parse(request.body.read)

  session[:user] = data['user']
  session[:password] = data['password']

  'success'
end

post '/logout' do
  session.clear

  'success'
end

get '/upstream/release/:project/:id' do
  project = Project.new(params[:project])
  issues = project.get_issues_for_release(params[:id])

  content_type :json
  issues.to_json
end

get '/downstream/release/:id' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bugs = bugzilla.bugs_for_release(params[:id], params)

  content_type :json
  bugs
end

get '/issue/:id' do
  issue = Issue.new(params[:id])

  content_type :json
  issue.raw_data.to_json
end

get '/bugzilla/:id/clones' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bug = bugzilla.find_clone(params[:id], params[:blocker_ids])

  content_type :json
  bug
end

get '/bugzilla/:id' do
  bugzilla = RedHatBugzilla.new(session[:user], session[:password])
  bug = bugzilla.get_bug(params[:id])

  content_type :json
  bug
end

get '/*' do
  send_file 'app/index.html'
end

def verify_signature(payload_body)
  signature = 'sha1=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), ENV['GITHUB_SECRET_TOKEN'], payload_body)
  return halt 500, "Signatures didn't match!" unless Rack::Utils.secure_compare(signature, request.env['HTTP_X_HUB_SIGNATURE'])
end
