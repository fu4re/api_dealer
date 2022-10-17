#!/usr/bin/env ruby
require 'bunny'

class BaseRpcHandler
  def initialize
    @bunny_conn = Bunny.new(ENV['RABBITMQ_URL'], automatically_recover: false)
    @bunny_conn.start
    @channel = @bunny_conn.create_channel

    initialize_api_client
  end

  def start(queue_name)
    @queue = @channel.queue(queue_name)
    @exchange = @channel.default_exchange

    ConsumerLogger.info "[*] Started RPC with '#{queue_name}' queue"

    subscribe_to_queue do |body, properties|
      handle_payload!(body: body, properties: properties)
    end
  end

  def stop
    @channel.close
    @bunny_conn.close
  end

  def handle_payload!(body:, properties:)
    raise NotImplementedError
  end

  private

  def initialize_api_client
    base_url = ENV['CONSUMER_ENV'] == 'development' ? ENV['CONSUMER_FAKE_API_URL'] : ENV['CONSUMER_API_URL']

    @api_client = Faraday.new(base_url)
    @token = authorization_token
  end

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
    ConsumerLogger.error "Failed to fetch access_token | #{e.message}\n#{e.backtrace.first(3)}"
  end

  def subscribe_to_queue
    @queue.subscribe do |_delivery_info, properties, payload|
      body = BodyDecoder.call(payload)

      ConsumerLogger.info "[#{@queue.name}] Received payload: #{payload}"
      result = BodyEncoder.call(
        yield(body, properties)
      )
      ConsumerLogger.info "[#{@queue.name}] Sended payload: #{result}"

      @exchange.publish(
        result,
        routing_key: properties.reply_to,
        correlation_id: properties.correlation_id
      )
      ConsumerLogger.info "[#{@queue.name}] Response published: routing_key -- #{properties.reply_to} | correlation_id -- #{properties.correlation_id}"
    end
  end
end
