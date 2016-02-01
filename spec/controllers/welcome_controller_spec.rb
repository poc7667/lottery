require 'rails_helper'

RSpec.describe WelcomeController, :type => :controller do

  describe "GET prizes" do
    it "returns http success" do
      get :prizes
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET winners" do
    it "returns http success" do
      get :winners
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET donators" do
    it "returns http success" do
      get :donators
      expect(response).to have_http_status(:success)
    end
  end

end
