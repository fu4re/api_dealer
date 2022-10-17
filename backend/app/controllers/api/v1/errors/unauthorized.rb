# frozen_string_literal: true
module API
  module V1
    module Errors
      class Unauthorized < StandardError
        def initialize(msg = 'Пользователь не авторизован')
          super(msg)
        end
      end
    end
  end
end
