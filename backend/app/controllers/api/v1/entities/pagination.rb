# frozen_string_literal: true
module API
  module V1
    module Entities
      class Pagination < API::V1::Entities::Base
        expose :page, default: 1, documentation: { type: Integer, desc: 'Номер страницы' }
        expose :per_page, default: 10, documentation: { type: Integer, desc: 'Количество записей на странице' }
      end
    end
  end
end
