# frozen_string_literal: true

module API
  module V1
    class ReportsAPI < API::V1::Base
      resource :reports do
        before { check_authorized! }

        params do
          optional :date_from, type: Date
          optional :date_to, type: Date
        end
        get do
          reports = Report.first

          present API::V1::Entities::Report.for_table.merge(Report.stats)
          present reports, with: API::V1::Entities::Report
        end
      end
    end
  end
end
