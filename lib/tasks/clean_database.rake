namespace :clean do
  task :database => :environment do
      Prize.delete_all
      Staff.delete_all
  end
end
