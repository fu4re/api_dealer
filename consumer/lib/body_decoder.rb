require 'json'

class BodyDecoder
  def self.call(body)
    return nil if body.empty?
    parsed_body = JSON.parse(
      JWT.decode(body, ENV['CONSUMER_JWT_SECRET'], true, { algorithm: ENV['CONSUMER_JWT_ALGORITHM'] }).first
    )

    return parsed_body
  rescue NameError => e
    ConsumerLogger.error "[x] Unsopported handler: #{parsed_body['handler']}"
  rescue => e
    ConsumerLogger.error "[x] JWT decode error in #{self.class.name} | #{e.message}"
  end
end
