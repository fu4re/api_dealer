import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from 'react'
import InputMask from 'react-input-mask'
import moment from 'moment'
import classNames from 'classnames'
import AutoNumeric from 'autonumeric'
import lodashSize from 'lodash/size'
import isNil from 'lodash/isNil'
import isNaN from 'lodash/isNaN'
import isEqual from 'lodash/isEqual'
import min from 'lodash/min'
import max from 'lodash/max'
import DatePicker, {
  DATE_PICKER_DATE_FORMAT,
  formatDateForPicker,
  formatDateFromPicker,
} from 'components/inputs/date/DatePicker'
import TimePicker, { TIME_PICKER_FORMAT } from 'components/inputs/time/TimePicker'
import YearPicker from 'components/inputs/year/YearPicker'
import Warning from 'components/base/warning/Warning'
import Row from 'components/base/row/Row'
import ErrorBoundary from 'components/base/error/ErrorBoundary'
import SvgIcon from 'components/base/icon/SvgIcon'
import SnackbarUtils from 'config/snackbars/snackbarConfig'
import { ICONS } from 'assets/icons/icons'
import { CURRENCY_SYMBOLS, CURRENCIES } from 'constants/common'
import { DATE_INPUT, TIME_INPUT, YEAR_INPUT } from 'constants/date-time'
import { stopPropagationEvent, getMaskFromFormat } from 'utils/common'
import { compareDates } from 'utils/date-time'
import type { DateValue } from 'components/inputs/date/DatePicker'
import './input.scss'

const CurrencyBaseOptions = {
  digitGroupSeparator: ' ',
  decimalCharacter: '.',
  decimalCharacterAlternative: ',',
  watchExternalChanges: true,
  modifyValueOnWheel: false,
  currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix,
}

export const INPUT_TYPES = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
  YEAR: 'year',
  COUNTER: 'counter',
  NUMBER: 'number',
  CURRENCY: 'currency',
  PASSWORD: 'password',
}

export type InputCallbackData = {
  id?: string | number,
  name?: string | number,
  value: string | number,
  event?: Record<string, any>,
}

export type InputProps = {
  className?: string,
  val: string | number | Record<string, any> | Array<string>,
  disabled?: boolean,
  type?: $Values<typeof INPUT_TYPES>,
  id?: string,
  name?: string,
  placeholder?: string,
  size?: 'base',
  tabindex?: string,
  icons?: Array,
  required?: boolean,
  format?: string,
  noFocusOnError?: boolean,
  alert?: boolean | string,
  onChange: () => void,
  onReset?: () => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onEnter?: () => void,
  isDropDownOpen?: boolean,
  isRangeDate?: boolean,
  datePickerToLeft?: boolean,
  datePickerMinDate?: string,
  datePickerMaxDate?: string,
  disableDateBlurCheck?: boolean,
  allowClearForRangeDates?: boolean,
  focusOnMount?: boolean,
  intMinValue?: number,
  intMaxValue?: number,
  decimalPlaces?: number,
  isInvalid?: boolean,
  warning?: string,
  noDateCheck?: boolean,
  allowEmptyValue?: boolean,
  hasPlaceholderOnFocus?: boolean,
  isArrayDate?: boolean,
  hasDisabledDays?: boolean,
  renderAtStart?: () => ReactNode,
  containerClassname?: string,
  currency?: $Values<typeof CURRENCIES>,
}

const Input = (props: InputProps) => {
  const {
    val,
    focusOnMount,
    decimalPlaces,
    intMinValue = 0,
    intMaxValue = 1_000_000_000,
    noDateCheck,
    isRangeDate = false,
    format,
    type,
    disabled = false,
    icons,
    id,
    allowClearForRangeDates,
    datePickerMinDate,
    datePickerMaxDate,
    disableDateBlurCheck,
    className,
    size = 'base',
    name,
    placeholder,
    required,
    noFocusOnError,
    tabindex = '-1',
    alert,
    warning,
    isDropDownOpen,
    datePickerToLeft,
    isInvalid = false,
    hasPlaceholderOnFocus = false,
    allowEmptyValue,
    onChange,
    onEnter,
    onReset,
    onKeyDown,
    onFocus,
    onBlur,
    isArrayDate = false,
    hasDisabledDays = true,
    renderAtStart,
    containerClassname = '',
    currency = CURRENCIES.rub,
  } = props

  const currencyOptions = useMemo(
    () => ({
      ...CurrencyBaseOptions,
      currencySymbol: currency ? [' ', CURRENCY_SYMBOLS[currency]].join('') : '',
    }),
    [currency],
  )

  const input = useRef()
  const container = useRef()
  const datePickerRef = useRef()

  const isTypePassword = useMemo(() => type === INPUT_TYPES.PASSWORD, [type])
  const isTypeDate = useMemo(() => type === INPUT_TYPES.DATE, [type])
  const isTypeTime = useMemo(() => type === INPUT_TYPES.TIME, [type])
  const isTypeYear = useMemo(() => type === INPUT_TYPES.YEAR, [type])
  const isTypeCounter = useMemo(() => type === INPUT_TYPES.COUNTER, [type])
  const isTypeNumber = useMemo(() => type === INPUT_TYPES.NUMBER, [type])
  const isTypeCurrency = useMemo(() => type === INPUT_TYPES.CURRENCY, [type])

  const hasFormat = useMemo(() => Boolean(format), [format])

  const dateValue = isTypeDate ? formatDateForPicker(val) : null
  const displayDateValue = isTypeDate ? formatDateFromPicker(dateValue) : null

  const [date, setDate] = useState(dateValue)
  const [displayDate, setDisplayDate] = useState(displayDateValue)
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [textHidden, setTextHidden] = useState(isTypePassword)
  const [currencyAutoNumeric, setCurrencyAutoNumeric] = useState(null)

  const focus = useCallback(() => input?.current?.focus?.(), [input])
  const blur = useCallback(() => input?.current?.blur?.(), [input])

  const withDateCheck = useCallback(
    (v: string) => {
      if (!v || v.includes('_')) {
        return ''
      }

      if (noDateCheck) {
        return v
      }

      const m = moment(v, DATE_PICKER_DATE_FORMAT)
      return m.isValid() ? v : ''
    },
    [noDateCheck],
  )

  const getValueFromDisplayDate = useCallback(
    (displayDate: string) => {
      let formatted

      if (isRangeDate) {
        const s = displayDate.split(DATE_INPUT.RANGE_DELIMITER)
        formatted = { from: withDateCheck(s[0]), to: withDateCheck(s[1]) }
      } else if (Array.isArray(val)) {
        formatted = displayDate
          .split(DATE_INPUT.MULTI_DELIMITER)
          .map((date) => withDateCheck(date))
      } else {
        formatted = withDateCheck(displayDate)
      }

      return formatted
    },
    [isRangeDate, withDateCheck, val],
  )

  const prepareCallbackData = useCallback(
    (event: MouseEvent<HTMLDivElement>, value: boolean = false) => {
      const newValue = value === false ? event?.target?.value ?? '' : value
      return { id, name, value: newValue, event }
    },
    [id, name],
  )

  const change = useCallback(
    (value: boolean, event: MouseEvent<HTMLDivElement> = null) => {
      onChange?.(prepareCallbackData(event, value))
    },
    [onChange, prepareCallbackData],
  )

  const changeDate = useCallback(
    (displayDate: string, callback: () => void, event: MouseEvent<HTMLDivElement>) => {
      setDisplayDate(displayDate)
      setDate(formatDateForPicker(getValueFromDisplayDate(displayDate)))

      window.requestAnimationFrame(() => {
        callback?.()
        change(displayDate, event)
      })
    },
    [change, getValueFromDisplayDate],
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    focusOnMount && focus()
  }, [])

  useEffect(() => {
    if (isTypeCurrency) {
      setCurrencyAutoNumeric(
        new AutoNumeric(input.current, {
          ...currencyOptions,
          decimalPlaces: decimalPlaces || 0,
          minimumValue: intMinValue || 0,
          maximumValue: intMaxValue || 1_000_000_000,
        }),
      )
    }
  }, [currencyOptions])

  useEffect(() => {
    const isValueEmpty = !val || (isRangeDate && (!val?.from || !val?.to))

    if (!allowEmptyValue && isValueEmpty) return

    // Если дата изменилась из вне, то меняем локальное значение
    const dateValue = formatDateForPicker(val)
    const displayDateValue = formatDateFromPicker(dateValue)

    if (!isEqual(displayDateValue, displayDate)) {
      setDate(dateValue)
      setDisplayDate(displayDateValue)
    }
  }, [val, displayDate, isTypeDate, allowEmptyValue, isRangeDate])

  const openPicker = useCallback(() => setIsPickerVisible(true), [setIsPickerVisible])
  const hidePicker = useCallback(() => setIsPickerVisible(false), [setIsPickerVisible])

  const getValue = useCallback(() => {
    if (isTypeDate) {
      return displayDate
    }

    return isNil(val) || isNaN(val) ? '' : val.toString()
  }, [displayDate, val, isTypeDate])

  const isEmptyDate = useCallback(() => {
    const value = getValueFromDisplayDate(displayDate)

    return isRangeDate
      ? !value.from || !value.to
      : Array.isArray(value)
      ? lodashSize(value) === 0 || (lodashSize(value) === 1 && value[0] === '')
      : !value
  }, [isRangeDate, displayDate, getValueFromDisplayDate])

  const isEmpty = useCallback(() => {
    const value = getValue()

    return isTypeYear
      ? !parseInt(value)
      : isTypeDate
      ? isEmptyDate()
      : lodashSize(value) === 0
  }, [getValue, isEmptyDate, isTypeDate, isTypeYear])

  const getCurrencyNumber = useCallback(
    (value): number | null => {
      const result = parseFloat(AutoNumeric.unformat(value, currencyOptions))
      return isNaN(result) || isNil(result) ? null : result
    },
    [currencyOptions],
  )

  const fakeBlur = useCallback(() => {
    focus()
    blur()
  }, [focus, blur])

  const onChangePickerDate = useCallback(
    (value: DateValue) => {
      const displayDate = formatDateFromPicker(value)

      setDate(value)
      setDisplayDate(displayDate)

      !isEmpty() && fakeBlur()
      change(getValueFromDisplayDate(displayDate))
    },
    [fakeBlur, change, isEmpty, getValueFromDisplayDate],
  )

  const onChangePickerYear = useCallback(
    (value: number) => {
      hidePicker()
      change(value)
      fakeBlur()
    },
    [hidePicker, change, fakeBlur],
  )

  const onKeyDownHandler = useCallback(
    (event: SyntheticKeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event)

      if (event.key === 'Enter') {
        blur()
        onEnter?.()
      }
    },
    [blur, onEnter, onKeyDown],
  )

  const validateNumberValue = useCallback(
    (value: string) => {
      const intValue = parseInt(value)
      return isNaN(intValue) ? '' : min([max([intMinValue, intValue]), intMaxValue])
    },
    [intMinValue, intMaxValue],
  )

  const validateTimeValue = useCallback((value: string) => {
    const m = moment(value, TIME_PICKER_FORMAT)
    return m.isValid() ? value : ''
  }, [])

  const onChangeInput = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const { type, target } = event

      if (['focus', 'blur'].includes(type)) {
        return
      }

      focus()

      let value = target.value

      if (isTypeDate) {
        const formatted = getValueFromDisplayDate(value)
        const date = formatDateForPicker(formatted)

        setDate(date)
        setDisplayDate(value)

        change(formatted, event)
        return
      }

      if (isTypeCounter || isTypeNumber) {
        value = validateNumberValue(value)
      } else if (isTypeTime) {
        value = validateTimeValue(value)
      } else if (isTypeCurrency) {
        const hasNumber = getCurrencyNumber(value) !== null
        const isCurrency = value === currencyOptions.currencySymbol

        if (!hasNumber || isCurrency) {
          value = null
          currencyAutoNumeric?.clear()
        }
      }

      change(value, event)
    },
    [
      currencyAutoNumeric,
      change,
      focus,
      getCurrencyNumber,
      getValueFromDisplayDate,
      isTypeCounter,
      isTypeCurrency,
      isTypeDate,
      isTypeNumber,
      isTypeTime,
      currencyOptions,
      validateNumberValue,
      validateTimeValue,
    ],
  )

  const changeNumber = useCallback(
    (diff: number) => change(validateNumberValue(val + diff)),
    [val, change, validateNumberValue],
  )

  const onResetHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isTypeDate) {
        changeDate('', fakeBlur, event)
      } else {
        change('', event)
        fakeBlur() // Без этого не срабатывает onBlur и соответственно onSave для полей
        isTypeCurrency && currencyAutoNumeric?.clear()
      }

      onReset?.(event)
    },
    [
      onReset,
      change,
      changeDate,
      currencyAutoNumeric,
      fakeBlur,
      isTypeCurrency,
      isTypeDate,
    ],
  )

  const getMask = useCallback(() => {
    if (hasFormat) {
      return getMaskFromFormat(format)
    }

    if (isTypeDate) {
      return isRangeDate
        ? [DATE_INPUT.MASK, DATE_INPUT.MASK].join(DATE_INPUT.RANGE_DELIMITER)
        : Array.isArray(val)
        ? Array.from(Array(lodashSize(val)).keys())
            .map((_) => DATE_INPUT.MASK)
            .join(DATE_INPUT.MULTI_DELIMITER)
        : DATE_INPUT.MASK
    }

    return isTypeTime ? TIME_INPUT.MASK : isTypeYear ? YEAR_INPUT.MASK : null
  }, [format, isRangeDate, hasFormat, isTypeDate, isTypeTime, isTypeYear, val])

  const getIcons = useCallback(() => {
    const resultIcons = [...(icons || [])]

    if (!disabled) {
      const needReset =
        !isTypeCounter &&
        !isEmpty() &&
        (!isRangeDate || (isRangeDate && allowClearForRangeDates))

      // Reset
      if (needReset) {
        resultIcons.push({
          Icon: ICONS.close,
          onMouseDown: onResetHandler, // Используем onMouseDown, чтобы не возникало корреляций с блюром и фокусировкой
        })
      }

      const needPickerIcon = isTypeDate || isTypeTime || isTypeYear

      // Pickers
      if (needPickerIcon) {
        resultIcons.push({
          Icon: isTypeTime ? ICONS.time : ICONS.calendar,
          onClick: openPicker,
        })
      }
    }

    return resultIcons
  }, [
    isRangeDate,
    disabled,
    icons,
    allowClearForRangeDates,
    isEmpty,
    isTypeCounter,
    isTypeDate,
    isTypeTime,
    isTypeYear,
    onResetHandler,
    openPicker,
  ])

  const onFocusHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.persist()
      setIsFocused(true)
      window.requestAnimationFrame(() => onFocus?.(prepareCallbackData(event)))
    },
    [onFocus, prepareCallbackData],
  )

  const onBlurHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.persist()
      setIsFocused(false)

      window.requestAnimationFrame(() => {
        const callback = () => {
          onBlur?.(prepareCallbackData(event, val))
          datePickerRef.current?.onChange?.(formatDateForPicker(val))
        }

        if (isTypeDate && isEmpty()) {
          // Очищаем некорректную дату
          // И после сохранения нового значения вызываем колбэк
          changeDate('', callback, event)
        } else if (isTypeDate && !disableDateBlurCheck) {
          const min = datePickerMinDate
          const max = datePickerMaxDate
          const value = formatDateForPicker(val)

          if (max && compareDates(value, formatDateForPicker(max)) === 'after') {
            changeDate(max, callback, event)
            SnackbarUtils.enqueueSnackbar(
              `Значение даты изменено на максимально допустимое: ${max}`,
            )
          } else if (min && compareDates(value, formatDateForPicker(min)) === 'before') {
            changeDate(min, callback, event)
            SnackbarUtils.enqueueSnackbar(
              `Значение даты изменено на минимально допустимое: ${min}`,
            )
          } else {
            callback()
          }
        } else {
          callback()
        }
      })
    },
    [
      val,
      datePickerMinDate,
      datePickerMaxDate,
      disableDateBlurCheck,
      datePickerRef,
      isTypeDate,
      changeDate,
      isEmpty,
      prepareCallbackData,
      onBlur,
    ],
  )

  const isActive = useCallback(
    () => !disabled && (isFocused || !isEmpty()),
    [disabled, isFocused, isEmpty],
  )

  const getDatePickerValue = useCallback(() => {
    const isAfterMax =
      datePickerMaxDate && compareDates(val, datePickerMaxDate) === 'after'
    const isBeforeMin =
      datePickerMinDate && compareDates(val, datePickerMinDate) === 'before'

    if (isAfterMax || isBeforeMin || isEmpty()) {
      return Array.isArray(val) ? [] : isRangeDate ? { from: '', to: '' } : null
    }

    return date
  }, [date, val, datePickerMinDate, datePickerMaxDate, isEmpty, isRangeDate])

  const onPassIconClick = useCallback(() => setTextHidden((p) => !p), [setTextHidden])

  const isFormatted = isTypeDate || isTypeTime || isTypeYear || hasFormat
  const InputComponent = isFormatted ? InputMask : 'input'

  const value = getValue()
  const iconsArray = getIcons()
  const hasErrors = Boolean(alert) || isInvalid

  const field = (
    <div
      ref={container}
      className={classNames('input', 'input-wrapper', className, {
        active: isActive(),
        disabled,
        date: isTypeDate,
        alert: hasErrors,
        focused: isFocused,
        'is-open': isDropDownOpen,
        'visible-placeholder': hasPlaceholderOnFocus,
      })}
    >
      <div className={classNames('input-container', `input-container_size_${size}`)}>
        <ErrorBoundary>
          <InputComponent
            name={name}
            ref={input}
            className={classNames('input', { alert: hasErrors, active: isActive() })}
            type={textHidden ? INPUT_TYPES.PASSWORD : INPUT_TYPES.TEXT}
            mask={getMask()}
            value={value}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onKeyDown={onKeyDownHandler}
            onChange={onChangeInput}
            onClick={stopPropagationEvent}
            data-name={name}
            data-required={Boolean(required)}
            data-no-focus={Boolean(noFocusOnError)}
            data-is-empty={isEmpty()}
            disabled={Boolean(disabled)}
            tabIndex={tabindex}
            placeholder={placeholder}
            size="1" // Важно для input auto-size
          />
        </ErrorBoundary>
        {isTypeDate && (
          <DatePicker
            ref={datePickerRef}
            anchorEl={container}
            visible={isPickerVisible}
            value={getDatePickerValue()}
            inputValue={value}
            onChange={onChangePickerDate}
            onClose={hidePicker}
            toLeft={datePickerToLeft}
            minDate={datePickerMinDate ? formatDateForPicker(datePickerMinDate) : void 0}
            maxDate={datePickerMaxDate ? formatDateForPicker(datePickerMaxDate) : void 0}
            isRange={isRangeDate}
            isArray={isArrayDate}
            hasDisabledDays={hasDisabledDays}
          />
        )}
        {isTypeTime && (
          <TimePicker
            anchorEl={container}
            visible={isPickerVisible}
            value={value}
            onChange={change}
            onClose={hidePicker}
          />
        )}
        {isTypeYear && (
          <YearPicker
            anchorEl={container}
            visible={isPickerVisible}
            value={value}
            onChange={onChangePickerYear}
            onClose={hidePicker}
          />
        )}
        {isTypePassword && (
          <SvgIcon
            key="SvgIcon_pass"
            className={classNames('input__icons__icon', 'eye', {
              'eye-closed': textHidden,
            })}
            Icon={textHidden ? ICONS.eyeClosed : ICONS.eyeOpened}
            onClick={onPassIconClick}
          />
        )}
        {(lodashSize(iconsArray) > 0 || isTypeCounter) && (
          <div className="input__icons">
            {isTypeCounter && !disabled && (
              <div className="input__counter-control">
                <SvgIcon Icon={ICONS.chevronDown} onClick={() => changeNumber(+1)} />
                <SvgIcon Icon={ICONS.chevronDown} onClick={() => changeNumber(-1)} />
              </div>
            )}
            {iconsArray.map(({ id, Icon, onClick, onMouseDown }, index) => (
              <SvgIcon
                key={`SvgIcon_${id || index}`}
                className="input__icons__icon"
                Icon={Icon}
                onClick={onClick}
                onMouseDown={onMouseDown}
              />
            ))}
          </div>
        )}
      </div>
      <Warning text={warning} />
    </div>
  )

  return renderAtStart ? (
    <Row className={classNames('input-row', containerClassname, { active: isActive() })}>
      {renderAtStart?.()}
      {field}
    </Row>
  ) : (
    field
  )
}

export default Input
