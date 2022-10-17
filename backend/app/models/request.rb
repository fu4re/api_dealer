class Request < ApplicationRecord
  enum status: %i[requested prescored consideration approved funded]

  include PlainSearch

  belongs_to :request_document

  def status_to_percent
    {
      'requested' => { 
        hint: 'Текст подсказки при наведении', 
        title: 'Заявка заполнена', 
        percent: 20, 
      },
      'prescored' => { 
        hint: 'Текст подсказки при наведении', 
        title: 'Прескоринг одобрен', 
        percent: 40, 
      },
      'consideration' => { 
        hint: 'Текст подсказки при наведении', 
        title: 'На рассмотрении банка', 
        percent: 60, 
      },
      'approved' => { 
        hint: 'Текст подсказки при наведении', 
        title: 'Одобрена', 
        percent: 80, 
      },
      'funded' => { 
        hint: 'Текст подсказки при наведении', 
        title: 'Профинансирована', 
        percent: 100, 
      }
    }[status]
  end
end
