import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import BaseCard from 'components/cards/base/BaseCard'
import Row from 'components/base/row/Row'
import Image from 'components/base/image/Image'
import Text from 'components/base/text/Text'
import { formatPrice } from 'utils/common'
import './car.scss'

export type CarType = {
  id: number,
  brand?: string,
  logo?: string,
  count?: number,
  model?: string,
  photo?: string,
  type?: string,
  doors?: number,
  price?: number,
  title?: string,
}

export type CarCardProps = CarType & {
  isActive?: boolean,
  onClick?: (id: number) => void,
}

const CarCard = (props: CarCardProps) => {
  const {
    id,
    logo = '',
    count = 0,
    photo = '',
    type = '',
    doors = 0,
    title = '',
    price = 0,
    isActive = false,
    onClick,
  } = props

  const blocks = useMemo(
    () => [
      { title: 'В наличии', value: count },
      { title: 'Тип кузова', value: type },
      { title: 'Количество дверей', value: doors },
    ],
    [count, type, doors],
  )

  const renderContent = useCallback(
    () => (
      <>
        <Image src={photo} className="car-card__image" />
        <Image src={logo} className="car-card__logo" />
        <div className="car-card__content">
          <Text variant="lg" className="car-card__title">
            {title}
          </Text>
          <div className="car-card__features">
            {blocks.map(({ title, value }, index) => (
              <Row key={index} horizontal="between" className="car-card__row">
                <Text>{title}</Text>
                <Text type="bold">{value}</Text>
              </Row>
            ))}
          </div>
          <Text right variant="lg" className="car-card__price">
            {formatPrice(price)}
          </Text>
        </div>
      </>
    ),
    [photo, logo, title, price, blocks],
  )

  const onClickCard = useCallback(() => onClick?.(id), [id, onClick])

  return (
    <BaseCard
      onClick={onClickCard}
      className={classNames('car-card', { active: isActive })}
      renderContent={renderContent}
    />
  )
}

export default CarCard
