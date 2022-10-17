module OpenAPIService
  class Base
    def initialize
      base_url = ENV['CONSUMER_ENV'] == 'development' ? ENV['CONSUMER_FAKE_API_URL'] : ENV['CONSUMER_API_URL']

      @api_client = Faraday.new(base_url)
      @token = authorization_token
    end

    def fetch!
      raise NotImplementedError
    end

    protected

    def authorization_token
      # redis = Redis.new(url: ENV['REDIS_URL'], password: ENV['REDIS_PASSWORD'])
      # token = redis.get('vtb_api_token')

      # return token if token.present?

      auth_url = ENV['CONSUMER_ENV'] == 'development' ? ENV['CONSUMER_FAKE_API_AUTH_URL'] : ENV['CONSUMER_API_AUTH_URL']
      auth_resp = JSON.parse(
        Faraday.post(auth_url) do |req|
          req.body = {
            grant_type: ENV['CONSUMER_GRANT_TYPE'],
            client_id: ENV['CONSUMER_CLIENT_ID'],
            client_secret: ENV['CONSUMER_CLIENT_SECRET']
          }
        end.body
      )

      # redis.set('vtb_api_token', auth_resp['access_token'], ex: auth_resp['expires_in'])
      auth_resp['access_token']
    rescue => e
      Rails.logger.error "Failed to fetch access_token | #{e.message}\n#{e.backtrace.first(3).join('\n')}"
    end
  end
end