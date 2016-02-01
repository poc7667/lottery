class Prize
  include Mongoid::Document
  belongs_to :staff
  field :year, type: Time
  field :can_accept_prize_now, type: Mongoid::Boolean
  field :name, type: String
  field :tax, type: Integer
  field :registered_at, type: Time
  field :taken_at, type: Time
  default_scope -> { without(:year)}
  
  scope :winner_list, -> (){
    unscoped.where(:staff_id.exists => true).ne(:staff_id => nil)
  }
end