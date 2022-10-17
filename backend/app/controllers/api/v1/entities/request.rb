# frozen_string_literal: true
module API
  module V1
    module Entities
      class Request < API::V1::Entities::Base
        root :rows, :rows

        expose :id, documentation: { type: String, desc: 'Идентификатор' }
        expose :name, documentation: { type: String, desc: 'ФИО клиента' }
        expose :dealer, documentation: { type: String, desc: 'Диллер' }
        expose :source, documentation: { type: String, desc: 'Источник' }
        expose :date, documentation: { type: DateTime, desc: 'Дата оформления' } do |request, _|
          request.date.strftime(API::V1::Base::DATE_FORMAT)
        end
        expose :status, documentation: { desc: 'Статус заявки', table_type: 'progress' } do |request, _|
          request.status_to_percent
        end
        expose :osago, documentation: { desc: 'ОСАГО', table_type: 'boolean' }
        expose :casco, documentation: { desc: 'КАСКО', table_type: 'boolean' }

        def self.for_form
          {
            switches: [
              {
                title: 'Пакет автолюбитель',
                hint: 'Пакет автолюбитель',
                name: 'motorist',
                sale: 1.5,
              },
              { title: 'КАСКО Лайт', hint: 'КАСКО Лайт', name: 'casco', sale: 7.7 },
              {
                title: 'Личное страхование',
                hint: 'Личное страхование',
                name: 'insurance',
                sale: 3.6,
              },
              {
                title: 'Зарплатный клиент ВТБ / Онлайн-заявка',
                hint: 'Зарплатный клиент ВТБ / Онлайн-заявка',
                name: 'request',
                sale: 1,
              },
            ],
            sliders: [
              {
                initialValue: 0,
                name: 'initialFee',
                hint: 'Какая-то подсказка для заголовка',
                title: 'Сумма первоначального взноса',
                step: 10000,
              },
              {
                initialValue: 1,
                name: 'term',
                title: 'Срок кредита',
                min: 1,
              },
            ],
            genders: [
              { id: 'male', label: 'Мужчина', value: false },
              { id: 'female', label: 'Женщина', value: false },
            ],
            collections: {
              education: {
                types: [
                  'elementary',
                  'middle',
                  'middle_special',
                  'incomplete_high',
                  'high',
                  'high_or_more',
                  'academic',
                ],
                titles: {
                  elementary: 'Начальное или неполное среднее',
                  middle: 'Среднее',
                  middle_special: 'Среднее специальное',
                  incomplete_high: 'Неполное высшее',
                  high: 'Высшее',
                  high_or_more: 'Два и более высших',
                  academic: 'Ученая степень',
                },
              },
              status: {
                types: [
                  'employee',
                  'individual',
                  'owner',
                  'working_retiree',
                  'not_working_retiree',
                  'maternity_vacation',
                ],
                titles: {
                  employee: 'Наемный работник',
                  individual: 'Индивидуальный предприниматель',
                  owner: 'Собственник бизнеса',
                  working_retiree: 'Работающий пенсионер',
                  not_working_retiree: 'Безработный пенсионер',
                  maternity_vacation: 'Декретный отпуск',
                },
              },
              position_type: {
                types: ['employee', 'division_head', 'organization_head'],
                titles: {
                  employee: 'Неруководящий сотрудник',
                  division_head: 'Руководитель подразделения',
                  organization_head: 'Руководитель организации',
                },
              },
              experience: {
                types: [
                  'less_six_months',
                  'between_six_months_and_year',
                  'between_one_and_three_years',
                  'between_three_and_five_years',
                  'between_five_and_ten_years',
                  'more_ten_years',
                ],
                titles: {
                  less_six_months: 'Менее 6 месяцев',
                  between_six_months_and_year: 'От 6 месяцев до одного года',
                  between_one_and_three_years: 'От 1 года до 3 лет',
                  between_three_and_five_years: 'От 3 лет до 5 лет',
                  between_five_and_ten_years: 'От 5 лет до 10 лет',
                  more_ten_years: 'Более 10 лет',
                },
              },
              family_status: {
                types: ['single', 'married', 'divorced', 'widower'],
                titles: {
                  single: 'Холост/не замужем',
                  married: 'Женат/замужем',
                  divorced: 'Разведен/разведена',
                  widower: 'Вдовец/вдова',
                },
              },
              registration_status: {
                types: ['own', 'relatives', 'removable', 'hostel'],
                titles: {
                  own: 'Свое',
                  relatives: 'У родственников',
                  removable: 'Съемное',
                  hostel: 'Общежитие',
                },
              },
            },
          }          
        end
      end
    end
  end
end
