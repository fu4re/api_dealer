require 'faker'
Faker::Config.locale = :ru

10.times do |_|
  User.create!(
    name: Faker::Name.first_name,
    surname: Faker::Name.middle_name,
    lastname: Faker::Name.last_name,
    avatar: Faker::Avatar.image,
    email: Faker::Internet.email,
    password: 'password'
  )
end

User.create!(
  name: Faker::Name.first_name,
  surname: Faker::Name.middle_name,
  lastname: Faker::Name.last_name,
  avatar: Faker::Avatar.image,
  email: 'user@mail.ru',
  password: 'password'
)

100.times do |_|
  RequestDocument.create!(
    name: Faker::Name.first_name,
    surname: Faker::Name.middle_name,
    patronomic: Faker::Name.last_name,
    birthday: Faker::Date.between(from: 100.year.ago, to: 17.year.from_now),
    phone: Faker::PhoneNumber.cell_phone_in_e164,
    email: Faker::Internet.email,
    gender: Faker::Gender.binary_type,
    education: [ 
      'Начальное или неполное среднее', 
      'Среднее', 
      'Среднее специальное', 
      'Неполное высшее', 
      'Высшее', 
      'Два и более высших', 
      'Ученая степень', 
    ].sample,
    status: [ 
      'Наемный работник', 
      'Индивидуальный предприниматель', 
      'Собственник бизнеса', 
      'Работающий пенсионер', 
      'Безработный пенсионер', 
      'Декретный отпуск', 
    ].sample,
    work_name: Faker::Job.title,
    position: Faker::Job.position,
    experience: [ 
      'Менее 6 месяцев', 
      'От 6 месяцев до одного года', 
      'От 1 года до 3 лет', 
      'От 3 лет до 5 лет', 
      'От 5 лет до 10 лет', 
      'Более 10 лет', 
    ].sample,
    position_type: [ 
      'Неруководящий сотрудник', 
      'Руководитель подразделения', 
      'Руководитель организации', 
    ].sample,
    office_phone: Faker::PhoneNumber.cell_phone_in_e164,
    family_status: [ 
      'Холост/не замужем', 
      'Женат/замужем', 
      'Разведен/разведена', 
      'Вдовец/вдова', 
    ].sample, 
    proxy_name: Faker::Name.first_name,
    proxy_surname: Faker::Name.middle_name,
    proxy_patronomic: Faker::Name.last_name,
    proxy_birthday: Faker::Date.between(from: 100.year.ago, to: 17.year.from_now),
    proxy_phone: Faker::PhoneNumber.cell_phone_in_e164,
    proxy_email: Faker::Internet.email,
    passport_number: rand(1000000000..9999999999).to_s,
    passport_date: Faker::Date.between(from: 100.year.ago, to: 17.year.from_now),
    passport_code: "#{rand(100..999)}-#{rand(100..999)}",
    passport_issued_by: Faker::Address.community,
    birth_place: Faker::Address.city,
    registration_address: Faker::Address.full_address,
    registration_index: Faker::Address.postcode,
    registration_date: Faker::Date.between(from: 100.year.ago, to: 17.year.from_now),
    registration_status: [ 
      'Свое', 
      'У родственников', 
      'Съемное', 
      'Общежитие', 
    ].sample,
    salary: rand(1000000),
    children: rand(10),
    dependents: rand(5),
    required_payments: rand(100000),
    repayment: rand(10),
    agree: [true, false].sample,
    registration_matches: [true, false].sample
  )
end

['Количество расчетов', 'Подано заявок', 'Одобрено заявок', 'Выдано кредитов'].each do |name|
  plan = rand(100)
  fact = rand(100)

  Report.create!(
    name: name,
    plan: plan,
    fact: fact,
    report_type: 'calculation',
    report_group: 'funnel',
    progress: { 
      percent: (([plan, fact].min.to_f / [plan, fact].max.to_f) * 100).to_i, 
      size: 'big', 
      show_percent: true, 
    }
  )

  plan = rand(100000000)
  fact = rand(100000000)

  Report.create!(
    name: name,
    plan: plan,
    fact: fact,
    report_type: 'total',
    report_group: 'funnel',
    progress: { 
      percent: (([plan, fact].min.to_f / [plan, fact].max.to_f) * 100).to_i, 
      size: 'big', 
      show_percent: true, 
    }
  )
end

['ОСАГО', 'КАСКО', 'Расширенное КАСКО', 'Пакет Автолюбитель', 'Личное Страхование', 'Расширенная гарантия'].each do |name|
  plan = rand(100)
  fact = rand(100)

  Report.create!(
    name: name,
    plan: plan,
    fact: fact,
    report_type: 'calculation',
    report_group: 'income',
    progress: { 
      percent: (([plan, fact].min.to_f / [plan, fact].max.to_f) * 100).to_i, 
      size: 'big', 
      show_percent: true, 
    }
  )

  plan = rand(100000000)
  fact = rand(100000000)

  Report.create!(
    name: name,
    plan: plan,
    fact: fact,
    report_type: 'total',
    report_group: 'income',
    progress: { 
      percent: (([plan, fact].min.to_f / [plan, fact].max.to_f) * 100).to_i, 
      size: 'big', 
      show_percent: true, 
    }
  )
end

