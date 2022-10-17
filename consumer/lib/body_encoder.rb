class BodyEncoder
  def self.call(body)
    return nil if body.empty?

    encoded_body = JWT.encode body, ENV['CONSUMER_JWT_SECRET'], ENV['CONSUMER_JWT_ALGORITHM']

    return encoded_body
  rescue => e
    ConsumerLogger.error "[x] JWT encode error in #{self.class.name} | #{e.message}"
  end
end
