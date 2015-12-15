require 'sinatra'
require 'json'


get '/api/user' do
  content_type :json
  {:user => session[:user], :github => session[:github_username]}.to_json
end

post '/api/login' do
  data = JSON.parse(request.body.read)

  session[:user] = data['user']
  session[:password] = data['password']
  session[:github_username] = data['github']

  'success'
end

post '/api/logout' do
  session.clear

  'success'
end

