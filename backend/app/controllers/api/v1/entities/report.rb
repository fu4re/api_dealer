# frozen_string_literal: true
module API
  module V1
    module Entities
      class Report < API::V1::Entities::Base
        root :rows, :rows

        expose :funnel_count, using: API::V1::Entities::ReportShort
        expose :funnel_sum, using: API::V1::Entities::ReportShort
        expose :income_count, using: API::V1::Entities::ReportShort
        expose :income_sum, using: API::V1::Entities::ReportShort

        def self.for_table
          {
            columns: { 
              funnel_count: [ 
                { id: 'name', label: 'Название' }, 
                { id: 'plan', label: 'План', type: 'number' }, 
                { id: 'fact', label: 'Факт', type: 'number' }, 
                { id: 'difference', label: 'Разница', type: 'number' }, 
                { id: 'progress', label: '% выполнения', type: 'progress' }, 
              ], 
              funnel_sum: [ 
                { id: 'name', label: 'Название' }, 
                { id: 'plan', label: 'План', type: 'price' }, 
                { id: 'fact', label: 'Факт', type: 'price' }, 
                { id: 'difference', label: 'Разница', type: 'price' }, 
                { id: 'progress', label: '% выполнения', type: 'progress' }, 
              ], 
              income_count: [ 
                { id: 'name', label: 'Название' }, 
                { id: 'plan', label: 'План', type: 'number' }, 
                { id: 'fact', label: 'Факт', type: 'number' }, 
                { id: 'difference', label: 'Разница', type: 'number' }, 
                { id: 'progress', label: '% выполнения', type: 'progress' }, 
              ], 
              income_sum: [ 
                { id: 'name', label: 'Название' }, 
                { id: 'plan', label: 'План', type: 'price' }, 
                { id: 'fact', label: 'Факт', type: 'price' }, 
                { id: 'difference', label: 'Разница', type: 'price' }, 
                { id: 'progress', label: '% выполнения', type: 'progress' }, 
              ], 
            }
          }
        end
      end
    end
  end
end


