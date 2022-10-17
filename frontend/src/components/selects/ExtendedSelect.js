import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import autosize from 'autosize'
import classNames from 'classnames'
import size from 'lodash/size'
import has from 'lodash/has'
import { components as ReactSelectComponents } from 'react-select'
import Select, { doingSelectSearch } from 'components/selects/Select'
import SelectMenuList from 'components/selects/SelectMenuList'
import DropDown from 'components/base/dropdown/DropDown'
import Row from 'components/base/row/Row'
import HttpClient from 'network/HttpClient'
import { formatOption } from 'utils/common'
import type {
  SelectCallbackData,
  SelectOption,
  SelectProps,
} from 'components/selects/Select'
import type { HttpResponseError, HttpResponseSuccess } from 'network/HttpClient'

export type ExtendedSelectProps = {
  className?: string,
  serviceSearch?: string,
  allowRemoveItems?: boolean,
  allowCustomOption?: boolean,
  allowEditingValue?: boolean,
  addCustomOptionOnBlur?: boolean,
  value: SelectOption | string,
  params: { [key: string]: any },
  noOptionsText?: string,
  startSearchText?: string,
  components?: Record<string, any>,
  allowEmptyValue?: boolean,
  renderAtOptionEnd?: () => ReactNode,
  placeholder?: string,
  closeMenuAfterSelect?: boolean,
  hideMenuWhenEmpty?: boolean,
  clearOnBlur?: boolean,
  isMenuListFloat?: boolean,
  isParentOptionClickable?: boolean,
} & $Shape<SelectProps>

export const formatOptionsForSelect = (data: Array<Record<string, any>>) => {
  return size(data) > 0 ? data.map(formatOption) : []
}

const ExtendedSelect = (props: ExtendedSelectProps) => {
  const {
    className,
    id,
    value,
    serviceSearch,
    allowRemoveItems,
    allowCustomOption,
    allowEditingValue,
    addCustomOptionOnBlur,
    onChange,
    allowEmptyValue,
    params,
    isMulti,
    noOptionsText,
    defaultOptions,
    components,
    renderAtOptionEnd,
    startSearchText,
    isDisabled = false,
    closeMenuAfterSelect = false,
    hideMenuWhenEmpty = false,
    clearOnBlur = false,
    placeholder = '',
    isMenuListFloat = false,
    isParentOptionClickable = false,
    ...other
  } = props

  const selectRef = useRef(null)
  const textAreaRef = useRef(null)
  const cancelSearch = useRef(null)
  const isAddingNewValue = useRef(false)

  const [inputValue, setInputValue] = useState('')
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [options, setOptions] = useState([]) // Используется только для определения наличия найденных элементов

  const withTextArea = allowEditingValue

  const hasSearchValue = size(inputValue) > 2
  const activeOptions = hasSearchValue ? options : defaultOptions
  const hasOptions = size(activeOptions) > 0
  const isFocused = !isDisabled && menuIsOpen

  const fetchItems = useCallback(
    (search: string, callback: () => void) => {
      cancelSearch.current?.()
      cancelSearch.current = null

      HttpClient.request(
        {
          path: serviceSearch,
          getCancel: (cancel) => (cancelSearch.current = cancel),
        },
        { ...params, displayname: search },
      )
        .then((r: HttpResponseSuccess) => {
          const data = r.responseData
          const newOptions = formatOptionsForSelect(data)

          if (allowEditingValue && value) {
            const select = selectRef.current?.getSelect?.()?.select
            const focusedOption = newOptions.find((i) => i.value === value.value)
            Boolean(select) && select.setState({ focusedOption })
          }

          callback(newOptions)
          setOptions(newOptions)
        })
        .catch((r: HttpResponseError) => {
          callback([])
          setOptions([])
        })
    },
    [serviceSearch, params, value, allowEditingValue, setOptions],
  )

  const mergeValueWithOption = useCallback(
    (option: Record<string, any>) => {
      const newOption = formatOption(option)

      const newValue = isMulti
        ? [...(Array.isArray(value) ? value : []), newOption]
        : newOption

      return { id, value: newValue }
    },
    [id, isMulti, value],
  )

  const _onChange = useCallback(
    (data: SelectCallbackData) => {
      if (data.action === 'select-option') {
        // Когда выбираем элемент вручную, то нужно избежать обработки значения при блюре.
        // Для этого сохраняем здесь флаг, а при блюре сбросим его
        isAddingNewValue.current = true

        // При выборе опции - очищаем инпут
        setInputValue('')

        !isMulti && selectRef.current?.blur()
        closeMenuAfterSelect && setMenuIsOpen(false)
      } else if (allowEditingValue && !isMulti && data.action === 'clear') {
        const inputText = value?.label || ''

        // Если длина равна 1, то значение будет очищено.
        // А если больше 1, то "стираем" часть его и помещаем в инпут поиска:
        if (size(inputText) > 1) {
          const value = inputText.slice(0, size(inputText) - 1)
          selectRef.current.setInputValue(value)

          return
        }
      }

      onChange(
        data?.value === null && allowEmptyValue
          ? { ...data, value: '' }
          : Array.isArray(data?.value) && size(data.value) === 0
          ? { ...data, value: null } // Зануляем массивное значение, чтобы было проще проходить проверку валидации в Yup
          : data,
      )
    },
    [onChange, isMulti, value, allowEditingValue, closeMenuAfterSelect, allowEmptyValue],
  )

  const addSearchItem = useCallback(() => {
    if (size(inputValue) > 0 && allowCustomOption) {
      onChange(
        mergeValueWithOption({
          displayname: inputValue,
          id: inputValue,
          isSearchItem: true,
        }),
      )

      setInputValue('')
    }
  }, [inputValue, allowCustomOption, mergeValueWithOption, onChange])

  const _onBlur = useCallback(() => {
    // Когда добавляем элемент, то не нужно обрабатывать значение в инпуте
    if (addCustomOptionOnBlur && !isAddingNewValue.current) {
      addSearchItem()
    } else if ((allowEditingValue || clearOnBlur) && size(inputValue) > 0) {
      // При блюре стираем значение в инпуте
      setInputValue('')
    }

    setMenuIsOpen(false)
    isAddingNewValue.current = false
  }, [addSearchItem, addCustomOptionOnBlur, allowEditingValue, clearOnBlur, inputValue])

  const onInputChange = (
    query: string,
    { action, isCustomAction }: Record<string, any>,
  ) => {
    if (action === 'input-change') {
      let result = query
      if (allowEditingValue && value?.value && !isCustomAction) {
        if (!query) {
          // Если был стерт последний символ, то очищаем текущее значение
          onChange({ value: null })
        } else if (!inputValue) {
          // Если не было значения, то выставляем в инпут текущее значение + новый символ
          result = value?.value + query
        }
      }

      setInputValue(result)
      return result
    }

    return inputValue
  }

  const onKeyDown = useCallback(
    ({ key }: SyntheticKeyboardEvent<HTMLElement>) => {
      if (key === 'Enter') {
        const activeItemClass = '.dropmenu__item.selected'

        // Обрабатываем оба случая: меню в портале и без него
        const menuSelector = ['.select__menu', activeItemClass].join(' ')
        const portalSelector = ['.select__menu-portal', activeItemClass].join(' ')
        const selectedItem =
          document.querySelector(portalSelector) || document.querySelector(menuSelector)

        !selectedItem && addSearchItem()

        if (!isMulti && (!allowEditingValue || closeMenuAfterSelect)) {
          setMenuIsOpen(false)
        }
      } else {
        closeMenuAfterSelect && setMenuIsOpen(true)
      }
    },
    [addSearchItem, isMulti, allowEditingValue, closeMenuAfterSelect],
  )

  const renderItem = useCallback(
    (item: Record<string, any>) => {
      const { data, innerProps, isFocused, isSelected } = item.props

      return (
        <div
          className={classNames('select__option', {
            added: isSelected,
            selected: isFocused,
          })}
          {...innerProps}
        >
          <Row className="select__option__row">
            <Row className="select__option__row-content" wrap>
              <p className="select__option-text">{data.label}</p>
            </Row>
            <Row>{renderAtOptionEnd?.(data)}</Row>
          </Row>
        </div>
      )
    },
    [renderAtOptionEnd],
  )

  const _components = useMemo(() => {
    const result = {
      Option: (_props) => renderItem({ props: _props }),
      ClearIndicator: () => null,
      SingleValue: ({ data: { label, value } }) => (
        <div className="select__single-value">{label || value}</div>
      ),
    }

    if (withTextArea) {
      result['ValueContainer'] = ({ children, ..._props }) => (
        <div onMouseDown={() => textAreaRef.current?.focus()} style={{ flex: 1 }}>
          <ReactSelectComponents.ValueContainer {..._props}>
            {children}
          </ReactSelectComponents.ValueContainer>
        </div>
      )

      result['Input'] = (_props) => (
        <div
          className={classNames('select__textarea-container', {
            'select__textarea-container--has-value': size(_props.value) > 0,
          })}
        >
          <textarea {..._props} ref={textAreaRef} className="select__textarea-input" />
        </div>
      )
    }

    if (defaultOptions?.some((i) => has(i, 'childs'))) {
      result['MenuList'] = (_props) => {
        const { selectProps, options, selectOption, setValue } = _props
        const { value, inputValue, noOptionsMessage } = selectProps

        const activeItems = value
          ? Array.isArray(value)
            ? value.map((i) => i.value)
            : [value.value]
          : []

        const onClickItem = (item: SelectOption) => {
          const newValue = value.filter((i) => i.value !== item.value)

          activeItems.includes(item.value)
            ? setValue(newValue, undefined, item)
            : selectOption(item)
        }

        return (
          <SelectMenuList {..._props}>
            {size(options) > 0 ? (
              <DropDown
                items={options}
                defaultOpen={false}
                allowClickParent={isParentOptionClickable}
                allOpen={doingSelectSearch(inputValue)}
                onClickItem={onClickItem}
                activeItems={activeItems}
              />
            ) : (
              <div className="select__menu-notice">
                {noOptionsMessage({ inputValue })}
              </div>
            )}
          </SelectMenuList>
        )
      }
    }

    return result
  }, [withTextArea, defaultOptions, isParentOptionClickable, renderItem])

  const selectComponents = useMemo(
    () => ({ ..._components, ...(components || {}) }),
    [components, _components],
  )

  const noOptionsMessageCallback = useCallback(
    ({ inputValue }) => {
      const isSearching = doingSelectSearch(inputValue)
      const hasDefault = size(defaultOptions) > 0
      const hasValue = size(inputValue) > 0

      return isSearching || (hasDefault && hasValue) ? (
        <div dangerouslySetInnerHTML={{ __html: noOptionsText }} />
      ) : (
        'Начните поиск'
      )
    },
    [defaultOptions, noOptionsText],
  )

  const openMenu = useCallback(() => setMenuIsOpen(true), [setMenuIsOpen])

  useEffect(() => {
    withTextArea && textAreaRef.current && autosize(textAreaRef.current)
  }, [withTextArea])

  useEffect(() => {
    withTextArea && autosize.update(textAreaRef.current)
  }, [inputValue, withTextArea])

  return (
    <Select
      {...other}
      className={classNames(className, { 'float-menu': isMenuListFloat })}
      ref={selectRef}
      id={id}
      value={value}
      onChange={_onChange}
      defaultOptions={defaultOptions}
      components={selectComponents}
      loadOptions={serviceSearch ? fetchItems : undefined}
      isClearable={allowRemoveItems}
      escapeClearsValue={false}
      backspaceRemovesValue={allowRemoveItems}
      allowRemoveItems={allowRemoveItems}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onBlur={_onBlur}
      onKeyDown={onKeyDown}
      menuIsOpen={hideMenuWhenEmpty ? isFocused && hasOptions : isFocused}
      isFocused={isFocused}
      onFocus={openMenu}
      isDisabled={isDisabled}
      placeholder={placeholder}
      isMulti={isMulti}
      noOptionsMessage={noOptionsText ? noOptionsMessageCallback : undefined}
    />
  )
}

export default ExtendedSelect
