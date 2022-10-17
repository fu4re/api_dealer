class Report < ApplicationRecord
  enum report_type: %i[calculation total]

  # TODO: Грамотное формирование отчетов на основе ТЗ диллера

  def difference
    fact - plan
  end

  def funnel_count
    Report.where(report_group: 'funnel', report_type: 'calculation')
  end

  def funnel_sum
    Report.where(report_group: 'funnel', report_type: 'total')
  end

  def income_count
    Report.where(report_group: 'income', report_type: 'calculation')
  end

  def income_sum
    Report.where(report_group: 'income', report_type: 'total')
  end

  def self.stats
    {
      stats: {
        approve_level: approve_level,
        avg_loan: avg_loan,
        total_loan: total_loan,
        avg_car_price: avg_car_price,
        mean_square: mean_square,
        fraction: fraction
      }
    }
  end

  def self.approve_level
    40
  end

  def self.avg_loan
    540000
  end

  def self.total_loan
    67896547
  end

  def self.avg_car_price
    1100560
  end

  def self.mean_square
    32
  end

  def self.fraction
    40
  end
end
