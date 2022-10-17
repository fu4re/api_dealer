# frozen_string_literal: true
module API
  module V1
    module Entities
      class ReportShort < API::V1::Entities::Base
        expose :name, documentation: { type: String }
        expose :plan, documentation: { type: Integer }
        expose :fact, documentation: { type: Integer }
        expose :difference, documentation: { type: Integer }
        expose :progress, default: {}
      end
    end
  end
end