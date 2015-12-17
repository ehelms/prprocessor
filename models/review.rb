class Review

  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  # Generated with
  # (client.repos('theforeman').map(&:full_name) + client.repos('katello').map(&:full_name)).sort
  def self.repos
    [
      "Katello/bastion",
      "Katello/foreman-gutterball",
      "Katello/foreman-installer-modulesync",
      "Katello/foreman_sam",
      "Katello/generator-bastion",
      "Katello/grinder",
      "Katello/hammer-cli-csv",
      "Katello/hammer-cli-gutterball",
      "Katello/hammer-cli-import",
      "Katello/hammer-cli-katello",
      "Katello/hammer-cli-katello-bridge",
      "Katello/hammer-cli-sam",
      "Katello/katello",
      "Katello/katello-agent",
      "Katello/katello_api",
      "Katello/katello-certs-tools",
      "Katello/katello-cli",
      "Katello/katello-deploy",
      "Katello/katello-foreman-engine",
      "Katello/katello-installer",
      "Katello/katello-installer-legacy",
      "Katello/katello-misc",
      "Katello/katello.org",
      "Katello/katello-packaging",
      "Katello/katello-redhat-access-engine",
      "Katello/katello-reports-engine",
      "Katello/katello-selinux",
      "Katello/katello-selinux-legacy",
      "Katello/katello-utils",
      "Katello/katello-website",
      "theforeman/chef-handler-foreman",
      "theforeman/community-templates",
      "theforeman/fog",
      "theforeman/foreman",
      "theforeman/foreman_abrt",
      "theforeman/foreman_api",
      "theforeman/foreman-bats",
      "theforeman/foreman_bootdisk",
      "theforeman/foreman_chef",
      "theforeman/foreman_cockpit",
      "theforeman/foreman_content",
      "theforeman/foreman_custom_parameters",
      "theforeman/foreman_default_hostgroup",
      "theforeman/foreman_deployments",
      "theforeman/foreman_dhcp_browser",
      "theforeman/foreman-digitalocean",
      "theforeman/foreman_discovery",
      "theforeman/foreman-discovery-image",
      "theforeman/foreman-docker",
      "theforeman/foreman-graphics",
      "theforeman/foreman-infra",
      "theforeman/foreman-installer",
      "theforeman/foreman-installer-modulesync",
      "theforeman/foreman-installer-staypuft",
      "theforeman/foreman-live",
      "theforeman/foreman-one",
      "theforeman/foreman-packaging",
      "theforeman/foreman-selinux",
      "theforeman/foreman-tasks",
      "theforeman/foreman-xen",
    ]
  end

  def self.index(repos)
    repos.each do |repo,repo_data|
      repo_data.each do |pull_data|
        pull_data['refreshed_on'] = Time.now

        begin
          pull = self.find(pull_data['id'])
        rescue Mongoid::Errors::DocumentNotFound => e
        end

        if pull
          pull.update_attributes!(pull_data)
        else
          self.create!(pull_data)
        end

      end

      # Delete old closed PRs
      db_prs = self.where(repo:repo).map(&:id)
      (db_prs - repo_data.map{|x| x["id"]}).each do |old_pr|

        begin
          pull = self.find(old_pr)
        rescue Mongoid::Errors::DocumentNotFound => e
        end

        pull.destroy if pull
      end

    end
  end
end
