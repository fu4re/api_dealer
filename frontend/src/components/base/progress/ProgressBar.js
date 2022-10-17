import React from 'react'
import classNames from 'classnames'
import Text from 'components/base/text/Text'
import Row from 'components/base/row/Row'
import './progress.scss'

export type ProgressBarProps = {
  progress?: number,
  size?: 'small' | 'big',
  showPercent?: boolean,
}

const ProgressBar = (props: ProgressBarProps) => {
  const { progress = 0, size = 'small', showPercent = false } = props

  return (
    <Row>
      {showPercent && size !== 'small' && (
        <Text right variant="sm" type="bold" className="progress-bar__value">
          {progress}
        </Text>
      )}
      <div className={classNames('progress-bar', { [size]: size !== 'small' })}>
        <div className="progress-bar__progress" style={{ width: `${progress}%` }}></div>
      </div>
    </Row>
  )
}

export default ProgressBar
