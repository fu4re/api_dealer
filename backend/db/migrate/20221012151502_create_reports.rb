class CreateReports < ActiveRecord::Migration[7.1]
  def change
    create_table :reports do |t|
      t.string :name
      t.bigint :plan 
      t.bigint :fact 
      t.integer :report_type
      t.string :report_group

      t.json :progress, default: {}

      t.timestamps
    end
  end
end
