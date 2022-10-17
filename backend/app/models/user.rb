class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  def self.registrate!(params)
    create!(params)
  end

  def self.authenticate!(params)
    user = find_by(email: params[:email])

    raise ActiveRecord::RecordNotFound, 'Неправильный email или пароль' unless user.present?
    raise ActiveRecord::RecordNotFound, 'Неправильный email или пароль' unless user.valid_password?(params[:password])

    user
  end

  def as_jwt_payload
    Warden::JWTAuth::UserEncoder.new.call(self, :user, nil)
  end
end
