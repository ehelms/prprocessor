require File.join(File.dirname(__FILE__), 'redmine_resource')

# Issue model on the client side
class Issue < RedmineResource

  READY_FOR_TESTING = 7

  def base_path
    '/issues'
  end

  def project
    @raw_data['issue']['project']['id']
  end

  def version
    @raw_data['issue']['fixed_version']['id'] if @raw_data['issue']['fixed_version']
  end

  def set_version(version_id)
    @raw_data['issue']['fixed_version_id'] = version_id
    self
  end

  def closed?
    ['Closed', 'Resolved', 'Rejected', 'Duplicate'].include? @raw_data['issue']['status']['name']
  end

  def rejected?
    ['Rejected', 'Duplicate'].include? @raw_data['issue']['status']['name']
  end

  def set_status(status)
    @raw_data['issue']['status_id'] = status
    self
  end

  def pull_request
    field = @raw_data['issue']['custom_fields'].find { |f| f['id'] == 7 }
    return nil if field.nil?
    field['value']
  end

  def set_pull_request(url)
    @raw_data['issue']['custom_field_values'] = {'7' => url}
    self
  end

  def save!
    put(@raw_data['issue']['id'], @raw_data)
  end

end
