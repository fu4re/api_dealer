# frozen_string_literal: true

require 'active_support/concern'

module PlainSearch
  extend ActiveSupport::Concern

  included do
    scope :search, lambda { |params = {}|
      object_with_filter_like = all
      params.each do |key_param_like, value|
        object_with_filter_like = object_with_filter_like.where(
          "#{key_param_like}::TEXT ILIKE ?", "%#{sanitize_sql_like(value.to_s.strip)}%"
        )
      end
      object_with_filter_like
    }
  end
end
