require 'bunny'

module Adapters
  class BunnyAdapter
    def initialize
      @conn = Bunny.new(ENV['RABBITMQ_URL'], automatically_recover: false)
    end

    def listen
      establish_connection
      @channel.prefetch(1)

      ConsumerLogger.info '[*] Waiting for messages. To exit send SIGTERM or SIGINT'

      begin
        @queue.subscribe(manual_ack: true) do |delivery_info, _properties, body|
          ConsumerLogger.info " [x] Received '#{body}'"
          decoded_body, handler = BodyDecoder.call(body)

          response = handler.new(decoded_body).fetch!
          ConsumerLogger.info "Response: #{response}"
          @queue.publish(response, persistent: true)

          ConsumerLogger.info '[x] Response published'
          @channel.ack(delivery_info.delivery_tag)
        end
      rescue => e
        ConsumerLogger.error e.message
        @conn.close
      end
    end

    private

    def establish_connection
      @conn.start
      @channel = @conn.create_channel
      @queue = @channel.queue(ENV['RABBITMQ_QUEUE'], durable: true)
    end
  end
end
