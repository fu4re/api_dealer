# frozen_string_literal: true
module API
  module V1
    class Base < Grape::API
      DATE_FORMAT = '%d.%m.%Y'

      use GrapeLogging::Middleware::RequestLogger,
          instrumentation_key: 'grape_base_logs',
          formatter: GrapeLogging::Formatters::Default.new,
          include: [
            GrapeLogging::Loggers::Response.new,
            GrapeLogging::Loggers::FilterParameters.new
          ]

      version 'v1', using: :path
      format :json

      helpers AuthHelper
      helpers do
        params :pagination do
          optional :all, using: API::V1::Entities::Pagination.for_filter
        end
      end

      rescue_from ActiveRecord::RecordNotFound do |_e|
        error!('Ресурс не найден', 404)
      end

      rescue_from ActiveRecord::RecordNotUnique do |_e|
        error!('Невозможно выполнить операцию', 422)
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        errors = e.record.errors.to_a.map { |msg| { message: msg } }
        # error!('Ошибка в формировании ресурса', 422)
        error!({ errors: errors }, 422)
      end

      rescue_from API::V1::Errors::Unauthorized do |e|
        errors = [{ title: e.message }]
        # error!('Необходимо пройти авторизацию', 401)
        error!({ errors: errors }, 401)
      end

      mount API::V1::MarketplaceAPI
      mount API::V1::ReportsAPI
      mount API::V1::RequestsAPI
      mount API::V1::UsersAPI
    end
  end
end
