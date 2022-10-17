# frozen_string_literal: true
module UserService
  class Creator
    def initialize(params)
      @registration_params = params.except(:file)
      @avatar = params[:file]
    end

    attr_reader :user, :token, :payload

    def call!
      @user = User.registrate!(@registration_params)

      AvatarUploadService.new(user, @avatar).call

      @token, @payload = user.as_jwt_payload

      self
    end
  end
end
