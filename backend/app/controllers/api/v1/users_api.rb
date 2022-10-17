# frozen_string_literal: true

module API
  module V1
    class UsersAPI < API::V1::Base
      resource :users do
        resource :me do
          before { check_authorized! }
  
          get do
            present current_user, with: API::V1::Entities::User
          end
  
          params do
            optional :json, type: Hash, coerce_with: ->(s) { JSON s } do
              optional :all, using: API::V1::Entities::User.for_update(except: %i[avatar])
            end
            optional :file, allow_blank: true, desc: 'Аватар профиля'
          end
          patch do
            declared_params = declared(params, include_missing: false)
            declared_params = declared_params.except(:json).merge(declared_params[:json]).with_indifferent_access
  
            updater = UserService::Updater.new(current_user, declared_params).call!
          end
        end

        params do
          optional :json, type: Hash, coerce_with: ->(s) { JSON s } do
            requires :all, using: API::V1::Entities::User.for_create(except: %i[avatar])
            requires :password, type: String, allow_blank: false, desc: 'Пароль'
          end

          optional :file, type: File, allow_blank: true, coerce_with: ->(s) { s == 'null' ? nil : s }, desc: 'Аватар профиля'
        end
        post 'registrate' do
          declared_params = declared(params, include_missing: false)
          declared_params = declared_params.except(:json).merge(declared_params[:json]).with_indifferent_access

          creator = UserService::Creator.new(declared_params).call!

          header 'Authorization', creator.token
          { token: creator.token }
        end

        params do
          requires :email, type: String, allow_blank: false, regexp: /.+@.+/, desc: 'Электронная почта'
          requires :password, type: String, allow_blank: false, desc: 'Пароль'
          all_or_none_of :email, :password, message: 'Не введена почта или пароль'
        end
        post 'login' do
          declared_params = declared(params, include_missing: false)

          token, = User.authenticate!(declared_params)
                       .as_jwt_payload

          header 'Authorization', token
          { token: token }
        end
      end
    end
  end
end