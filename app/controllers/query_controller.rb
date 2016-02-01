class QueryController < ApplicationController
  include ActionController::Live
  respond_to :json
  before_action :get_prize_and_staff, only: [:register, :unregister, :take, :untake]

  def staffs
    render json: Oj.dump( Staff.all)
  end

  def staff
    render json: Oj.dump( Staff.where(:id => params["id"]) )
  end

  def prizes
    render json: Oj.dump( Prize.all.without(:staff_id, :price) )
  end

  def prize
    render json: Oj.dump( Prize.where(:id => params["id"].to_i) )
  end

  def summary
    result = Prize.unscoped.order_by(:id.asc).collect do | prize |
      unless prize.staff_id.nil?
        staff = Staff.where(:id => prize.staff_id).first
        staff_name = staff.name
        department = staff.department
      else
        staff_name, department = nil, nil
      end
      prize.attributes.merge({staff_name: staff_name, department: department})
    end
    render json: Oj.dump( result )
  end

  def slideshow
  end

  def remaining_prizes
    render json: Oj.dump( Prize.where(:staff_id => nil).without(:staff_id, :price) )
  end

  def winner_list
    result = Prize.winner_list.order_by(:id.desc).collect do | prize |
      prize.attributes.merge({staff_name: prize.staff.name})
    end
    render json: Oj.dump(result)
  end

  def loser_list
    staffs = Staff.unscoped.all.to_a.reject do |staff|
      staff.prizes.length >= 1
    end
    render json: Oj.dump(staffs)
  end  

  def register
    response.headers["Content-Type"] = "text/javascript"
    @prize.registered_at = Time.now
    if @staff.prizes.count == 0
      @staff.prizes.push(@prize)
      @staff.save
      status = "ok"
      message = "prize registered sucessfully"
    else
      status = "fail"
      message = "can not accept more than 1 prize"
    end
    response = { status: status,
                 message: message,
                 prize: @prize, 
                 staff: @staff }
    $redis.publish('messages.create', response.to_json) if "ok" == status
    render json: Oj.dump(response)
  end

  def unregister
    @prize.registered_at = nil
    @prize.staff = nil
    @prize.save
    render json: Oj.dump({status: "ok", prize: @prize, staff: @staff})
  end

  def take
    @prize.taken_at = Time.now
    @prize.save
    render json: Oj.dump({status: "ok", prize: @prize, staff: @staff})
  end

  def untake
    @prize.taken_at = nil
    @prize.save
    render json: Oj.dump({status: "ok", prize: @prize, staff: @staff})
  end  


  private

    def get_prize_and_staff
      @prize = Prize.unscoped.where(:id => params["prize_id"].to_i).first
      @staff = Staff.unscoped.where(:id => params["full_staff_id"]).first
    end

end
