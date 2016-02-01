module WelcomeHelper
  def get_staff_name_by_prize(prize)
    Staff.where(id: prize.staff_id).first.name
  end
end
