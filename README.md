# Pull Request Processor for Foreman

## Environment Variables

* `ENV['GITHUB_OAUTH_TOKEN']`: An OAuth token with repos access to update PR labels
* `ENV['GITHUB_SECRET_TOKEN']`: The secret token for verifying GitHub webhooks
* `ENV['REDMINE_API_KEY']`: Redmine API key to use for making API update
* `ENV['JENKINS_TOKEN']`: Jenkins secret token for activating builds
