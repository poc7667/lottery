module ImportStaffHelper

  def setup_config(xls_file_path)
    @year = File.basename(xls_file_path, '.*').split("_").last
    @staff_sheet_number = 0
    @start_row = 2
  end

  def import_task(xls_file_path, sheet_number)
    xls = Roo::Excel.new(xls_file_path)
    xls.default_sheet = xls.sheets[sheet_number]    
    iterate_data_rows(xls)
  end
# ["董事長室", "A00001", "陳文昌", "2000/02/14", "2000/05/14", 1.0, nil, nil, nil, nil, nil, nil, nil, nil, nil]
  def iterate_data_rows(xls)
    (@start_row).upto(xls.last_row) do |line_no|
      row = xls.row(line_no)
      next if row[0].to_s.strip.length == 0
      staff = Staff.create(
          year: Date.strptime(@year,"%Y"),
          id: row[0],
          name: row[1],
          department: row[2],
          is_supervior: is_supervisor?(row[3]),
          arrival_date: get_arrival_date(row[4])
        )
      staff.trial_date = staff.arrival_date + 3.month
      ap(staff)
      staff.save
    end
  end

  def is_supervisor?(content)
    if 1 == content.to_i 
      return true
    else
      return false
    end
  end

  def get_arrival_date(date)
    if date.is_a?(Date)
      return date
    elsif date.to_s.length > 0
      return Date.strptime(date, "%Y/%m/%d")    
    else
      return Date.strptime("2000/01/01", "%Y/%m/%d")    
    end      
  end

end