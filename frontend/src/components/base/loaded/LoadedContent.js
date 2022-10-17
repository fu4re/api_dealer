import React from 'react'
import lodashSize from 'lodash/size'
import Preloader from 'components/base/preloader/Preloader'

export type LoadedContentProps = {
  isLoading: boolean,
  data: Record<string, any>,
  renderContent: () => ReactNode,
  isStatic?: boolean,
  size?: number,
}

const LoadedContent = (props: LoadedContentProps) => {
  const { isLoading = true, data = {}, renderContent, isStatic = false, size } = props

  const preloaderSize = isStatic ? 30 : 80

  return isLoading ? (
    <Preloader isStatic={isStatic} size={Boolean(size) ? size : preloaderSize} />
  ) : lodashSize(data) > 0 ? (
    renderContent?.()
  ) : null
}

export default LoadedContent
