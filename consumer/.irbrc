require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

require 'require_all'

require_all "#{File.expand_path(__dir__)}/lib"
require_all "#{File.expand_path(__dir__)}/adapters"
require_all "#{File.expand_path(__dir__)}/handlers"
