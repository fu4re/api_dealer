class CreateRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :requests do |t|
      t.string :name
      t.string :dealer
      t.string :source
      t.datetime :date
      t.integer :status
      t.boolean :osago
      t.boolean :casco

      t.references :request_document, index: true

      t.timestamps
    end
  end
end
