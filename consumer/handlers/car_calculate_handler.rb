module Handlers
  class CarCalculateHandler < BaseRpcHandler
    def handle_payload!(body:, properties:)
      resp = @api_client.post(endpoint) do |req|
        req.body = body.to_json
        req.headers = headers
      end

      raise StandardError unless resp.status == 200

      resp.body
    rescue => e
      ConsumerLogger.error "Error while fetching #{self.class.name} | #{e.message}"
    end

    private

    def endpoint
      'api/auto/credit/calculator/hackathon/v1/calculate'
    end

    def headers
      {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
        'Authorization' => @token
      }
    end
  end
end
