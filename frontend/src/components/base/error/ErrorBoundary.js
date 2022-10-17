import React, { Component, ErrorInfo } from 'react'
import { connect } from 'react-redux'
import trim from 'lodash/trim'
import WithRouter from 'components/base/with-router/WithRouter'
import Text from 'components/base/text/Text'
import Button from 'components/base/button/Button'
import SvgIcon from 'components/base/icon/SvgIcon'
import { dataSelector } from 'store/Settings/reducers'
import { ICONS } from 'assets/icons/icons'
import { removeSymbols, removeUrl } from 'utils/common'
import './error.scss'

/**
 * @see https://ru.reactjs.org/docs/error-boundaries.html
 */
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { data } = this.props

    const withoutUrl = removeUrl(errorInfo.componentStack)
    const path = removeSymbols(withoutUrl, ['(', ')', '\n', '/n'])
    const pathParts = path.split('at').map(trim).filter(Boolean)

    const errorData = {
      message: error.message,
      stack: pathParts.reverse().join(' -> '),
      url: window.location.href,
      data,
    }

    console.log(errorData)
  }

  onClickBack = () => {
    this.props.navigate(-2)
    window.requestAnimationFrame(() => window.location.reload())
  }

  render() {
    const { error } = this.state
    const { children } = this.props

    if (error) {
      return (
        <div className="error-message">
          <div className="error-message__icon">
            <SvgIcon Icon={ICONS.warning} />
          </div>
          <Text variant="lg" center className="error-message__title">
            {'При работе приложения возникла ошибка'}
          </Text>
          <Text center className="error-message__text">
            {
              'Разработчики уже оповещены об ошибке. Приносим извинения за доставленные неудобства.'
            }
          </Text>
          <Button
            size="small"
            onClick={this.onClickBack}
            text="Вернуться назад"
          />
        </div>
      )
    }

    return children
  }
}

const mapStateToProps = (state) => ({
  data: dataSelector(state),
})

export default connect(mapStateToProps)(WithRouter(ErrorBoundary))
