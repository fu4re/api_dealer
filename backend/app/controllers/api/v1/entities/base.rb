# frozen_string_literal: true
module API
  module V1
    module Entities
      class Base < Grape::Entity
        def self.for_filter(include: documentation.keys, except: %i[id created_at updated_at deleted_at], delete: %i[required is_array], allow_blank: false)
          documentation.slice(*include).except(*except).transform_values do |v|
            v.except(*delete).merge({ allow_blank: allow_blank })
          end
        end

        def self.for_create(include: documentation.keys, except: %i[id created_at updated_at deleted_at], delete: %i[required is_array], allow_blank: false)
          documentation.slice(*include).except(*except).transform_values do |v|
            v.except(*delete).merge({ allow_blank: allow_blank })
          end
        end

        def self.for_update(include: documentation.keys, except: %i[id created_at updated_at deleted_at], delete: %i[required is_array], allow_blank: false)
          documentation.slice(*include).except(*except).transform_values do |v|
            v.except(*delete).merge({ allow_blank: allow_blank })
          end
        end

        def self.for_table(include: documentation.keys, except: %i[id created_at updated_at deleted_at], delete: %i[required is_array], allow_blank: false)
          { columns: documentation.slice(*include).except(*except).map { |k, v| { id: k.to_s, label: v[:desc], type: v[:table_type] || 'text' } } }
        end
      end
    end
  end
end
