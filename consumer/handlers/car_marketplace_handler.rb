module Handlers
  class CarMarketplaceHandler < BaseRpcHandler
    def handle_payload!(body:, properties:)
      resp = @api_client.get(endpoint) do |req|
        req.headers = headers
      end

      raise StandardError unless resp.status == 200

      resp.body
    rescue => e
      ConsumerLogger.error "Error while fetching #{self.class.name} | #{e.message}"
    end

    private

    def endpoint
      'api/auto/credit/car/marketplace/hackathon/v1/marketplace'
    end

    def headers
      {
        'Accept' => 'application/json',
        'Authorization' => @token
      }
    end
  end
end
