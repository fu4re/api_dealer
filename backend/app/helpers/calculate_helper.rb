module CalculateHelper
  def default_initial_fee(cost)
    cost * 0.3
  end

  def rebuilded_calculate_params(params)
    {
      cost: params[:cost],
      initialFee: params[:initialFee] || default_initial_fee(params[:cost]),
      term: params[:term]
    }
  end

  def rebuilded_calculate_response(response)
    {
      initialFee: response['ranges']['initialFee'].slice('min', 'max'),
      term: response['ranges']['term'].slice('min', 'max'),
      sum: response['result']['loanAmount'],
      percent: response['result']['contractRate'],
      month_payment: response['result']['payment']
    }
  end
end