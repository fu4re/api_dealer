module Handlers
  class RecognitionHandler < BaseRpcHandler
    def handle_payload!(body:, properties:)
      resp = Faraday.new('http://recognition:5678/').post(endpoint) do |req|
        req.body = body.to_json
      end

      raise StandardError unless resp.status == 200

      resp.body
    rescue => e
      ConsumerLogger.error "Error while fetching #{self.class.name} | #{e.message}"
    end

    private

    def endpoint
      'recognititon'
    end

    def headers
      {
        'Accept' => 'application/json',
        'Authorization' => @token
      }
    end
  end
end
