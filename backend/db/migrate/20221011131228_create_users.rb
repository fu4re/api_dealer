class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :surname
      t.string :lastname
      t.string :avatar

      t.timestamps
    end
  end
end
