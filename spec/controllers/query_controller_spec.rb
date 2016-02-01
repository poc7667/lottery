require 'rails_helper'

RSpec.describe QueryController, :type => :controller do

  describe "GET index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET staffs" do
    it "returns http success" do
      get :staffs
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET prizes" do
    it "returns http success" do
      get :prizes
      expect(response).to have_http_status(:success)
    end
  end

end
