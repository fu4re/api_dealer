class CreateRequestDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :request_documents do |t|
      t.string :name
      t.string :surname
      t.string :patronomic
      t.string :birthday
      t.string :phone
      t.string :email
      t.string :gender
      t.string :education
      t.string :status
      t.string :work_name
      t.string :position
      t.string :experience
      t.string :position_type
      t.string :office_phone
      t.string :family_status

      t.string :proxy_name
      t.string :proxy_surname
      t.string :proxy_patronomic
      t.string :proxy_birthday
      t.string :proxy_phone
      t.string :proxy_email

      t.string :passport_number
      t.string :passport_date
      t.string :passport_code
      t.string :passport_issued_by
      t.string :birth_place
      t.string :registration_address
      t.string :registration_index
      t.string :registration_date
      t.string :registration_status

      t.integer :salary
      t.integer :children
      t.integer :dependents
      t.integer :required_payments
      t.integer :repayment
      t.boolean :agree, default: false
      t.boolean :registration_matches, default: false
  
      t.timestamps
    end
  end
end
