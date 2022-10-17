require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

require 'require_all'

require_all "#{File.expand_path(__dir__)}/lib"
require_all "#{File.expand_path(__dir__)}/adapters"
require_all "#{File.expand_path(__dir__)}/handlers"

Handlers::CarCalculateHandler.new.start('car_calculate')
Handlers::CarLoanHandler.new.start('car_loan')
Handlers::CarMarketplaceHandler.new.start('car_marketplace')
Handlers::RecognitionHandler.new.start('identitiy_recognition')

loop do
  sleep
end