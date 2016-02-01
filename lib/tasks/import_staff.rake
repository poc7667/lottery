namespace :import do
  task :staff => :environment do
    require File.expand_path('import_staff_helper.rb', File.dirname(__FILE__))
    include ImportStaffHelper

    xls_file_path = File.expand_path('data_source/staff_2016.xls', File.dirname(__FILE__))
    setup_config(xls_file_path)
    import_task(xls_file_path, @staff_sheet_number)
  end
end
