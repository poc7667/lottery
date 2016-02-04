class Staff  
  include Mongoid::Document
  include Mongoid::Timestamps
  has_many :prizes
  field :year, type: Time
  field :department, type: String
  field :name, type: String
  field :arrival_date, type: Time
  field :trial_date, type: Time
  field :is_supervior, type: Boolean

  def prize_name
    begin
      prizes.first.name
    rescue Exception => e
      nil
    end
  end

  def donation
    min_donation = 3000
    begin
      return min_donation if self.prizes.first.tax < min_donation
      return self.prizes.first.tax
    rescue Exception => e
      return min_donation
    end
  end


  scope :by_year, ->(year) { where(:year.gte => Date.strptime( year.to_s,"%Y"), :year.lte => Date.strptime( (year+1).to_s,"%Y")) }
  default_scope -> { by_year(2016).without(:comment, :arrival_date, :created_at, :updated_at, :year) }
end
