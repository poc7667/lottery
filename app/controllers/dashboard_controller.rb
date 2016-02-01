class DashboardController < ApplicationController
  def index
  end

  def show_prizes
    per_page = 50
    prizes = Prize.unscoped.sort(_id: 1).to_a.flatten
    if params.has_key? :page 
      @prizes = Kaminari.paginate_array(prizes).page(params[:page]).per(per_page)
    else
      @prizes = Kaminari.paginate_array(prizes).page(1).per(per_page)
    end
  end

  def show_staffs
  end
end
