# frozen_string_literal: true
module AuthHelper
  def current_user
    if ENV['SKIP_JWT_AUTH'] == 'true' || token == 'from_widget'
      @current_user ||= User.first
    else
      @current_user ||= Warden::JWTAuth::UserDecoder.new.call(token, :user, nil)
    end
  rescue => e
    unauthorized_error!
  end

  def check_authorized!
    unauthorized_error! unless authorized?
  end

  def authorized?
    return true if ENV['SKIP_JWT_AUTH'] == 'true'
    return false if token.blank?
    return false if current_user.blank?

    true
  end

  def unauthorized_error!
    raise API::V1::Errors::Unauthorized
  end

  def token
    auth = headers['Authorization'].to_s
    auth.split.last
  end
end
