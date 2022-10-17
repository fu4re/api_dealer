module DeliverService
  class ConsumerRpcClient
    attr_accessor :call_id, :response, :lock, :condition, :connection,
                  :channel, :server_queue_name, :reply_queue, :exchange

    def initialize(server_queue_name)
      @connection = Bunny.new(ENV['RABBITMQ_URL'], automatically_recover: false)
      @connection.start

      @channel = connection.create_channel
      @exchange = channel.default_exchange
      @server_queue_name = server_queue_name

      setup_reply_queue
    end

    def call(payload = '')
      @call_id = generate_uuid
      message = JWT.encode(payload, ENV['CONSUMER_JWT_SECRET'], ENV['CONSUMER_JWT_ALGORITHM'])

      exchange.publish(message,
                      routing_key: server_queue_name,
                      correlation_id: call_id,
                      reply_to: reply_queue.name
      )

      # wait for the signal to continue the execution
      lock.synchronize { condition.wait(lock) }

      JSON.parse(
        JWT.decode(response, ENV['CONSUMER_JWT_SECRET'], true, { algorithm: ENV['CONSUMER_JWT_ALGORITHM'] }).first
      )
    end

    def stop
      channel.close
      connection.close
    end

    private

    def setup_reply_queue
      @lock = Mutex.new
      @condition = ConditionVariable.new
      that = self
      @reply_queue = channel.queue('', exclusive: true)

      reply_queue.subscribe do |_delivery_info, properties, payload|
        if properties[:correlation_id] == that.call_id
          that.response = payload

          # sends the signal to continue the execution of #call
          that.lock.synchronize { that.condition.signal }
        end
      end
    end

    def generate_uuid
      SecureRandom.uuid
    end
  end
end
