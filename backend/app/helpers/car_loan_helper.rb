module CarLoanHelper
  def process_prescore_response(response)
    for_create_params = {
      client_id: response['application']['VTB_client_ID']
    }
    for_create_params.merge!(response['application']['decision_report'])
    for_create_params.merge!(datetime: response['datetime'])

    PrescoreDecision.create!(for_create_params)
  end
end
