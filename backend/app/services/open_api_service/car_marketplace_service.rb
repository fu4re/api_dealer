module OpenAPIService
  class CarMarketplaceService < Base
    def fetch!
      resp = @api_client.get(endpoint) do |req|
        req.headers = headers
      end

      raise StandardError unless resp.status == 200

      JSON.parse(resp.body)
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