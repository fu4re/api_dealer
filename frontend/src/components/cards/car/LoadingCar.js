import React, { useCallback } from 'react'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import BaseCard from 'components/cards/base/BaseCard'
import './car.scss'

const LoadingCar = () => {
  const renderContent = useCallback(
    () => (
      <>
        <rect cx="0" cy="0" width="344" height="230" />
        <rect x="16" y="246" rx="6" ry="6" width="100" height="28" />
        <rect x="16" y="290" rx="6" ry="6" width="312" height="20" />
        <rect x="16" y="322" rx="6" ry="6" width="312" height="20" />
        <rect x="16" y="354" rx="6" ry="6" width="312" height="20" />
        <rect x="228" y="390" rx="6" ry="6" width="100" height="28" />
      </>
    ),
    [],
  )

  return (
    <BaseCard
      Component={ContentLoader}
      className={classNames('car-card', 'loading')}
      renderContent={renderContent}
      speed={2}
      viewBox="0 0 344 434"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    />
  )
}

export default LoadingCar
