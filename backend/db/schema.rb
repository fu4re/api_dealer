# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2022_10_13_182344) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "prescore_decisions", force: :cascade do |t|
    t.string "client_id"
    t.integer "application_status"
    t.string "comment"
    t.datetime "decision_date"
    t.datetime "decision_end_date"
    t.integer "monthly_payment"
    t.datetime "datetime"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reports", force: :cascade do |t|
    t.string "name"
    t.bigint "plan"
    t.bigint "fact"
    t.integer "report_type"
    t.string "report_group"
    t.json "progress", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "request_documents", force: :cascade do |t|
    t.string "name"
    t.string "surname"
    t.string "patronomic"
    t.string "birthday"
    t.string "phone"
    t.string "email"
    t.string "gender"
    t.string "education"
    t.string "status"
    t.string "work_name"
    t.string "position"
    t.string "experience"
    t.string "position_type"
    t.string "office_phone"
    t.string "family_status"
    t.string "proxy_name"
    t.string "proxy_surname"
    t.string "proxy_patronomic"
    t.string "proxy_birthday"
    t.string "proxy_phone"
    t.string "proxy_email"
    t.string "passport_number"
    t.string "passport_date"
    t.string "passport_code"
    t.string "passport_issued_by"
    t.string "birth_place"
    t.string "registration_address"
    t.string "registration_index"
    t.string "registration_date"
    t.string "registration_status"
    t.integer "salary"
    t.integer "children"
    t.integer "dependents"
    t.integer "required_payments"
    t.integer "repayment"
    t.boolean "agree", default: false
    t.boolean "registration_matches", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "requests", force: :cascade do |t|
    t.string "name"
    t.string "dealer"
    t.string "source"
    t.datetime "date"
    t.integer "status"
    t.boolean "osago"
    t.boolean "casco"
    t.bigint "request_document_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "archive", default: false
    t.index ["request_document_id"], name: "index_requests_on_request_document_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "surname"
    t.string "lastname"
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
