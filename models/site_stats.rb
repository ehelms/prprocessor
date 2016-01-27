class SiteStats
  include Mongoid::Document

  field :date, type: String
  field :total_visits, type: Integer
  field :unique_visits, type: Hash

  def self.update_stats(stats_data)

    stats = self.where(:date => stats_data[:date])

    if stats.count != 0
      stats = stats.first
      exists = true
    else
      stats = stats_object(stats_data[:date])
      exists = false
    end

    stats['total_visits'] += 1

    if stats_data[:github_username]
      if stats['unique_visits'][stats_data[:github_username]]
        stats_copy = deep_copy(stats['unique_visits'])
        stats_copy[stats_data[:github_username]] += 1
        stats['unique_visits'] = stats_copy
      else
        stats_copy = deep_copy(stats['unique_visits'])
        stats_copy[stats_data[:github_username]] = 1
        stats['unique_visits'] = stats_copy
        puts stats['unique_visits']
      end
    end

    if !exists
      self.create!(stats)
    else
      stats.update_attributes!
    end
  end

  def self.stats_object(date)
    {
      'date' => date,
      'total_visits' => 0,
      'unique_visits' => {}
    }
  end

  def self.total_visits_per_day
    stats = self.all
    (stats.collect(&:total_visits).reduce(&:+).to_f / stats.count.to_f).round(1)
  end

  def self.unique_users_per_day
    stats = self.all
    unique = stats.collect do |stat|
      stat['unique_visits'].keys.length
    end
    unique = unique.reduce(&:+)
    (unique.to_f / stats.count.to_f).round(1)
  end

  def self.deep_copy(object)
    Marshal.load(Marshal.dump(object))
  end
end
