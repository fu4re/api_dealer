class PrescoreDecision < ApplicationRecord
  enum application_status: %i[processing prescore_approved prescore_denied]
end
