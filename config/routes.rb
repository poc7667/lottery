Rails.application.routes.draw do

  get 'marquee/index'

  get 'welcome/prizes'
  get 'welcome/winners'
  get 'welcome/donators'
  get 'welcome/verify_prizes'
  get 'welcome/check_prizes'
  get 'welcome/new_prizes_stream'
  get 'welcome/revert_taken_prize'

  get 'dashboard/index'
  get 'dashboard/show_prizes'
  get 'dashboard/show_staffs'

  get 'query/index'
  get 'query/staffs'
  get 'query/staff/:id' => 'query#staff'

  get 'query/slideshow'
  get 'query/summary'
  get 'query/prizes'
  get 'query/prize/:id' => 'query#prize'
  get 'query/winner_list'
  get 'query/loser_list'
  get 'query/remaining_prizes'

  match 'register/:prize_id/:full_staff_id' => 'query#register', :via => :all
  match 'unregister/:prize_id/:full_staff_id' => 'query#unregister', :via => :all
  match 'take/:prize_id/:full_staff_id' => 'query#take', :via => :all
  match 'untake/:prize_id/:full_staff_id' => 'query#untake', :via => :all

  root 'welcome#index'

end
