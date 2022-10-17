class CreatePrescoreDecisions < ActiveRecord::Migration[7.1]
  def change
    create_table :prescore_decisions do |t|
      t.string :client_id
      t.integer :application_status
      t.string :comment
      t.datetime :decision_date
      t.datetime :decision_end_date
      t.integer :monthly_payment
      t.datetime :datetime
      
      t.timestamps
    end
  end
end
