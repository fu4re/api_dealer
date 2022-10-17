require 'logger'
require 'singleton'

class ConsumerLogger
  include Singleton

  attr_reader :logger

  def self.info(*args)
    instance.logger.info(*args)
  end

  def self.error(*args)
    instance.logger.error(*args)
  end

  def logger
    @logger ||= Logger.new(STDOUT, level: ENV.fetch('CONSUMER_LOGGER_LEVEL', Logger::INFO))
  end
end
