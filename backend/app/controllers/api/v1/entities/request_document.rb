# frozen_sexpose true
module API
  module V1
    module Entities
      class RequestDocument < API::V1::Entities::Base
        expose :name, documentation: { type: String }
        expose :surname, documentation: { type: String }
        expose :patronomic, documentation: { type: String }
        expose :birthday, documentation: { type: String }
        expose :phone, documentation: { type: String }
        expose :email, documentation: { type: String }
        expose :gender, documentation: { type: String }
        expose :education, documentation: { type: String }
        expose :status, documentation: { type: String }
        expose :work_name, documentation: { type: String }
        expose :position, documentation: { type: String }
        expose :experience, documentation: { type: String }
        expose :position_type, documentation: { type: String }
        expose :office_phone, documentation: { type: String }
        expose :family_status, documentation: { type: String }
  
        expose :proxy_name, documentation: { type: String }
        expose :proxy_surname, documentation: { type: String }
        expose :proxy_patronomic, documentation: { type: String }
        expose :proxy_birthday, documentation: { type: String }
        expose :proxy_phone, documentation: { type: String }
        expose :proxy_email, documentation: { type: String }
  
        expose :passport_number, documentation: { type: String }
        expose :passport_date, documentation: { type: String }
        expose :passport_code, documentation: { type: String }
        expose :passport_issued_by, documentation: { type: String }
        expose :birth_place, documentation: { type: String }
        expose :registration_address, documentation: { type: String }
        expose :registration_index, documentation: { type: String }
        expose :registration_date, documentation: { type: String }
        expose :registration_status, documentation: { type: String }
  
        expose :salary, documentation: { type: Integer }
        expose :children, documentation: { type: Integer }
        expose :dependents, documentation: { type: Integer }
        expose :required_payments, documentation: { type: Integer }
        expose :repayment, documentation: { type: Integer }

        expose :agree
        expose :registration_matches
      end
    end
  end
end
