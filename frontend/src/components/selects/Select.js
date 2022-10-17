import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import BaseSelect, { components } from 'react-select'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import size from 'lodash/size'
import filter from 'lodash/filter'
import classNames from 'classnames'
import ItemBox from 'components/base/box/ItemBox'
import Rotate from 'components/base/rotate/Rotate'
import SvgIcon from 'components/base/icon/SvgIcon'
import { ICONS } from 'assets/icons/icons'
import { useSelectContext } from 'components/selects/SelectContext'
import { stopPropagationEvent } from 'utils/common'
import type { ItemBoxProps } from 'components/base/box/ItemBox'
import './select.scss'

export type SelectOption = {
  value: string,
  label: string,
  childs?: Array<SelectOption>,
  initialData?: { [key: string]: any },
}

export type SelectCallbackData = {
  id: string | number,
  value: SelectOption | Array<SelectOption>,
  action: 'select-option' | 'set-value',
}

export type SelectProps = {
  className?: string,
  menuClassName?: string,
  id?: string,
  defaultOptions?: Array<SelectOption>,
  value: SelectOption | Array<SelectOption>,
  isInvalid?: boolean,
  error?: string,
  loadOptions?: (
    inputValue: string,
    callback: (data: Array<SelectOption>) => void,
  ) => void,
  isDisabled?: boolean,
  isMulti?: boolean,
  onChange?: (data: SelectCallbackData) => void,
  onEnter?: (inputValue: string) => void,
  onBlur?: (inputValue: string) => void,
  noOptionsMessage?: (data: { inputValue: string }) => string,
  components?: Record<string, any>,
  allowRemoveItems?: boolean,
  onRemoveItem?: (item: SelectOption) => void,
  filterOptions?: (options: Array<SelectOption>, search: string) => void,
  itemBoxProps?: Partial<ItemBoxProps>,
  placeholder?: string,
}

export const doingSelectSearch = (value: string) => size(value) > 0

const Select = (props: SelectProps, ref: Ref) => {
  const {
    className = '',
    menuClassName = '',
    id,
    defaultOptions = [],
    value,
    isInvalid = false,
    error,
    loadOptions,
    isDisabled = false,
    isMulti = false,
    onChange,
    onEnter,
    onBlur,
    noOptionsMessage,
    components,
    filterOptions,
    isInPortal,
    placeholder = '',
    ...other
  } = props

  const selectRef = useRef()

  const [, update] = useReducer((p) => p + 1, 1)

  const isBaseSelect = Boolean(filterOptions)
  const Component = isBaseSelect ? BaseSelect : AsyncSelect

  const getLoadingMessage = useCallback(() => 'Загрузка...', [])

  const [_inputValue, _setInputValue] = useState('')

  const context = useSelectContext()

  const _loadOptions = useCallback(
    (inputValue, callback) => {
      doingSelectSearch(inputValue)
        ? loadOptions(inputValue, callback)
        : callback(defaultOptions)
    },
    [defaultOptions, loadOptions],
  )

  const _onChange = useCallback(
    (value: SelectOption, selectData) =>
      onChange?.({ id, value, action: selectData.action }),
    [id, onChange],
  )

  const _components = useMemo(
    () => ({ ...baseComponents, ...(components || {}) }),
    [components],
  )

  const _onKeyDown = useCallback(
    (event: SyntheticKeyboardEvent<HTMLElement>) => {
      if (!_inputValue) {
        return
      }

      if (event.key === 'Enter') {
        _setInputValue('')
        onEnter(_inputValue)
        event.preventDefault()
      } else {
        _setInputValue(_inputValue)
      }
    },
    [onEnter, _inputValue],
  )

  const _onInputChange = useCallback(
    (inputValue: string) => _setInputValue(inputValue),
    [],
  )

  const resultOptions = useMemo(
    () =>
      size(_inputValue) > 0 && filterOptions
        ? filterOptions(defaultOptions, _inputValue)
        : defaultOptions,
    [_inputValue, defaultOptions, filterOptions],
  )

  useImperativeHandle(
    ref,
    () => ({
      setInputValue: (value: string) => {
        selectRef.current.select.onInputChange(value, {
          action: 'input-change',
          isCustomAction: true,
        })
      },
      focus: () => selectRef.current?.focus(),
      blur: () => selectRef.current?.blur(),
      getSelect: () => selectRef.current?.select,
    }),
    [],
  )

  useEffect(() => {
    window.requestAnimationFrame(() => update())
  }, [value])

  const portalProps = useMemo(
    () =>
      context.isInPortal || isInPortal
        ? {
            menuPortalTarget: document.body,
            menuPosition: 'fixed',
            menuShouldBlockScroll: true,
            menuShouldScrollIntoView: true,
          }
        : {},
    [context, isInPortal],
  )

  const _noOptionsMessage = useCallback(({ inputValue }) => {
    return doingSelectSearch(inputValue) ? 'Ничего не найдено' : 'Начните поиск'
  }, [])

  return (
    <Component
      loadingMessage={getLoadingMessage}
      placeholder={placeholder}
      inputValue={_inputValue}
      onInputChange={_onInputChange}
      onKeyDown={onEnter && _onKeyDown}
      {...other}
      {...(isBaseSelect ? { options: resultOptions } : { defaultOptions: resultOptions })}
      {...portalProps}
      ref={selectRef}
      className={classNames('select', className, isMulti ? 'multi' : 'single', {
        active: size(value) > 0 && !isDisabled,
        disabled: isDisabled,
        isInvalid,
      })}
      menuClassName={menuClassName}
      classNamePrefix="select"
      value={value}
      isMulti={isMulti}
      isDisabled={isDisabled}
      components={_components}
      loadOptions={loadOptions ? _loadOptions : void 0}
      onChange={_onChange}
      onBlur={onBlur ? () => onBlur(_inputValue) : void 0}
      error={error}
      noOptionsMessage={noOptionsMessage || _noOptionsMessage}
    />
  )
}

const baseComponents = {
  Menu: (props) => (
    <components.Menu
      {...props}
      className={classNames(props.className, props.selectProps?.menuClassName)}
    >
      {props.children}
    </components.Menu>
  ),
  SelectContainer: ({ innerProps, children, selectProps, className }) => (
    <div {...innerProps} className={className}>
      {children}
      {selectProps.error && <div className="select__error">{selectProps.error}</div>}
    </div>
  ),
  DropdownIndicator: ({ selectProps }) => {
    const { menuIsOpen } = selectProps
    return (
      <Rotate when={menuIsOpen}>
        <SvgIcon
          Icon={ICONS.chevronDown}
          className={classNames('select-indicator', 'icon-select', {
            active: menuIsOpen,
          })}
        />
      </Rotate>
    )
  },
  MultiValue: ({ data, selectProps, getValue, setValue }) => {
    const { value, label, initialData } = data
    const { itemBoxProps, isDisabled, onRemoveItem, allowRemoveItems } = selectProps

    const onClickRemove = () => {
      allowRemoveItems && setValue(filter(getValue(), (i) => i.value !== value))
      onRemoveItem?.(data)
    }

    return (
      <ItemBox
        {...(itemBoxProps || {})}
        onMouseDown={stopPropagationEvent}
        item={initialData || label || value}
        disabled={isDisabled}
        onClickRemove={Boolean(onRemoveItem || allowRemoveItems) ? onClickRemove : void 0}
      />
    )
  },
}

export default forwardRef(Select)
