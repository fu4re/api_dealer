import React from 'react'
import Notice from 'components/base/notice/Notice'

const NotFoundNotice = () => {
  return (
    <Notice
      title="Поиск не дал результатов"
      subtitle="Измените поисковый запрос и попробуйте снова"
    />
  )
}

export default NotFoundNotice
