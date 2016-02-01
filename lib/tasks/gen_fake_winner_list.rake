namespace :gen do
  task :winner_list => :environment do
    staffs = Staff.unscoped.all.to_a.shuffle
    prizes = Prize.unscoped.order_by(:id.asc).to_a
    1.upto(122) do 
      staff = staffs.pop
      prize = prizes.pop
      prize.registered_at = Time.now
      staff.prizes.push(prize)
      staff.save
      prize.save
    end
  end
end
