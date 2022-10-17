import React from 'react'
import Notice from 'components/base/notice/Notice'

const LoadErrorNotice = () => {
  return (
    <Notice
      title="При загрузке произошла ошибка"
      subtitle="Попробуйте повторить попытку позже"
    />
  )
}

export default LoadErrorNotice
