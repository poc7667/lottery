namespace :import do
  task :prize => :environment do

    xls_file_path = File.expand_path('data_source/prizes_2016.xls', File.dirname(__FILE__))
    xls = Roo::Excel.new(xls_file_path)
    xls.default_sheet = xls.sheets[0]
    row_start_at = 2
    current_year = 2016

    (row_start_at).upto(xls.last_row) do |line_no|
      row = xls.row(line_no)
      if row[0].nil?
        can_accept_prize_now = false
      else
        can_accept_prize_now = true 
      end 
      Prize.create(
        id: row[1].to_i,
        year: Date.strptime(current_year.to_s, "%Y"),
        can_accept_prize_now: can_accept_prize_now,
        name: row[2],
        tax: row[3].to_i
      )
    end
  end
end
