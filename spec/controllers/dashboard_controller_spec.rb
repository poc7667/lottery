require 'rails_helper'

RSpec.describe DashboardController, :type => :controller do

  describe "GET index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET show_prizes" do
    it "returns http success" do
      get :show_prizes
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET show_staffs" do
    it "returns http success" do
      get :show_staffs
      expect(response).to have_http_status(:success)
    end
  end

end
