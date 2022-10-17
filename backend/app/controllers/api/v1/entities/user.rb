# frozen_string_literal: true
module API
  module V1
    module Entities
      class User < API::V1::Entities::Base
        expose :name, documentation: { type: String, desc: 'Имя' }
        expose :surname, documentation: { type: String, desc: 'Фамилия' }
        expose :lastname, documentation: { type: String, desc: 'Отчество' }
        expose :email, documentation: { type: String, desc: 'Почта' }
        expose :avatar, documentation: { type: String, desc: 'Аватар профиля' }
      end
    end
  end
end
