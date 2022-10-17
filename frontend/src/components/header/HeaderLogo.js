import React from 'react'
import { Link } from 'react-router-dom'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { ROUTER_PATHS } from 'constants/router'

export type HeaderLogoProps = {
  className?: string,
}

const HeaderLogo = (props: HeaderLogoProps) => {
  const { className = '' } = props

  return (
    <Link to={ROUTER_PATHS.CRM} className={className}>
      <SvgIcon Icon={ICONS.logo} />
    </Link>
  )
}

export default HeaderLogo
