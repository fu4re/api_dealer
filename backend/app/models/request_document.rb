class RequestDocument < ApplicationRecord
  include PlainSearch

  after_create :link_with_request
  
  def link_with_request
    Request.create!(
      name: "#{self.name} #{self.surname} #{self.patronomic}",
      dealer: 'Авилон премьер',
      source: ['Кредит онлайн', 'Отдел продаж'].sample,
      date: DateTime.now,
      status: :requested,
      osago: [true, false],
      casco:[true, false],
      request_document_id: self.id
    )
  end
end
