import React from 'react'
import ExtendedSelect, { formatOptionsForSelect } from 'components/selects/ExtendedSelect'
import type { ExtendedSelectProps } from 'components/selects/ExtendedSelect'

const BaseExtendedSelect = (props: Partial<ExtendedSelectProps>) => {
  const { defaultOptions, allowCustomOption = false, ...other } = props

  const canAddText = allowCustomOption
    ? 'Вы можете добавить свой вариант, убрав фокус с поля или нажав Enter.'
    : ''

  return (
    <ExtendedSelect
      isMulti={false}
      allowRemoveItems
      allowCustomOption={allowCustomOption}
      addCustomOptionOnBlur={allowCustomOption}
      clearOnBlur={!allowCustomOption}
      allowEmptyValue={false}
      noOptionsText={['Ничего не найдено', canAddText].filter(Boolean).join('.<br>')}
      defaultOptions={formatOptionsForSelect(defaultOptions)}
      isMenuListFloat
      {...other}
    />
  )
}

export default BaseExtendedSelect
