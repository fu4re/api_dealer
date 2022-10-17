# frozen_string_literal: true
module API
  class Base < Grape::API
    mount API::V1::Base

    add_swagger_documentation(array_use_braces: true)
  end
end
