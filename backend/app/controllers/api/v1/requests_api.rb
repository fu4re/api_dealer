# frozen_string_literal: true

module API
  module V1
    class RequestsAPI < API::V1::Base
      resource :loan do
       # before { check_authorized! }

        helpers CarLoanHelper

        params do
          optional :comment, type: String, default: 'Комментарий'
          optional :customer_party, type: Hash do
            optional :email
            optional :income_amount
            optional :person, type: Hash do
              optional :birth_date_time
              optional :birth_place
              optional :family_name
              optional :first_name
              optional :gender
              optional :middle_name
              optional :nationality_country_code
            end
            optional :phone
          end
          optional :datetime, type: DateTime, default: DateTime.now
          optional :interest_rate
          optional :requested_amount
          optional :requested_term
          optional :trade_mark
          optional :vehicle_cost
        end
        post 'prescore' do
          response = DeliverService::ConsumerRpcClient.new('car_loan').call(params)
          prescore_decision = process_prescore_response(response)

          { application_status: prescore_decision.application_status }
        end

        resource :calculate do
          helpers CalculateHelper

          params do
            requires :cost
            optional :initialFee
            optional :term, default: 3
          end
          post do
            response = DeliverService::ConsumerRpcClient.new('car_calculate')
                                                        .call(rebuilded_calculate_params(params))

            present rebuilded_calculate_response(response)
          end
        end

        resource :requests do
          params do
            optional :name, type: String, desc: 'Имя заявителя'
            optional :archive, type: Boolean, desc: 'Архивная'
            use :pagination
          end
          get do
            declared_params = declared(params, include_missing: false).except(:page, :per_page)

            requests = Request.search(declared_params)

            present API::V1::Entities::Request.for_table
            present requests, with: API::V1::Entities::Request
          end

          params do
            requires :ids, type: Array[Integer], desc: 'Заявки в архив'
          end
          patch 'archive' do
            Request.where(id: params[:ids]).update_all(archive: true)
          end

          params do
            requires :ids, type: Array[Integer], desc: 'Заявки на восстановление'
          end
          patch 'active' do
            Request.where(id: params[:ids]).update_all(archive: false)
          end
        end

        resource :request_document do
          params do
            requires :all, using: API::V1::Entities::RequestDocument.for_create
          end
          post do
            declared_params = declared(params, include_missing: false)

            RequestDocument.create!(declared_params)

            status 201
          end
        end

        resource :form do
          get do
            present API::V1::Entities::Request.for_form
          end
        end

        resource :identity_recognition do
          params do
            optional :file, type: File
          end
          post do
            # file = File.new("/opt/app/pasports/#{File.basename(params[:file][:tempfile])}", 'wb')
            # file.write params[:file][:tempfile].read
            # result = DeliverService::ConsumerRpcClient.new('identitiy_recognition')
            #                                           .call({ filename: File.basename(file) })

            # result

            {
              name: "Тирион", 
              surname: "Ланнистер", 
              patronomic: "Тайвинович", 
              birthday: "12.09.1982",
              passport_number: "1104 000000", 
              passport_date: "17.12.2004", 
              passport_code: "292-000", 
              passport_issued_by: "ОТДЕЛОМ ВНУТРЕННИХ ДЕЛ ОКТЯБРЬСКОГО ОКРУГА КОРОЛЕВСКОЙ ГАВАНИ"
            }.to_json
          end
        end
      end
    end
  end
end