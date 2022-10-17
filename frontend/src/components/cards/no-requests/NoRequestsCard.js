import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Text from 'components/base/text/Text'
import Button from 'components/base/button/Button'
import NoItemsCard from 'components/cards/no-items/NoItemsCard'
import { ROUTER_PATHS } from 'constants/router'
import './no-requests.scss'

export type NoRequestsCardProps = {
  isArchive?: boolean,
}

const NoRequestsCard = (props: NoRequestsCardProps) => {
  const { isArchive = false } = props

  const navigate = useNavigate()

  const onClickCreate = useCallback(() => navigate(ROUTER_PATHS.REQUEST), [navigate])

  const renderAtEnd = useCallback(() => {
    if (isArchive) {
      return null
    }

    return (
      <>
        <Text center className="no-requests__text">
          {'Создайте свою первую заявку'}
        </Text>
        <Button text="Создать заявку" onClick={onClickCreate} />
      </>
    )
  }, [isArchive, onClickCreate])

  return (
    <NoItemsCard
      className="no-requests"
      renderAtEnd={renderAtEnd}
      title={[isArchive ? 'Архив' : 'Список заявок', 'пуст'].join(' ')}
    />
  )
}

export default NoRequestsCard
