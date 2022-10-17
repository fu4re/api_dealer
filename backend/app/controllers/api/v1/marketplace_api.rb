# frozen_string_literal: true

module API
  module V1
    class MarketplaceAPI < API::V1::Base
      helpers MarketplaceHelper

      resource :marketplace do
        # before { check_authorized! }

        get do
          response = OpenAPIService::CarMarketplaceService.new.fetch!

          present rebuilded_marketplace_response(response)
        end
      end
    end
  end
end
