# frozen_string_literal: true
module UserService
  class Updater
    def initialize(user, params)
      @for_update_params = params.except(:file)
      @avatar = params[:file]

      @user = user
    end

    attr_reader :user, :token, :payload

    def call!
      @user.update!(@for_update_params)

      AvatarUploadService.new(user, @avatar).call

      @token, @payload = user.as_jwt_payload

      self
    end

    private

    def update_avatar
      return if @avatar.blank? || @avatar == 'null'

      if @avatar == 'delete'
        AvatarUploadService.new(user, @avatar).destroy!
      else
        AvatarUploadService.new(user, @avatar).call
      end
    end
  end
end
