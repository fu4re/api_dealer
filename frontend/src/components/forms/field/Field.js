import React, { useCallback, ElementType, useMemo } from 'react'
import { useField } from 'formik'
import classNames from 'classnames'
import omit from 'lodash/omit'
import size from 'lodash/size'
import Input from 'components/inputs/input/Input'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import HintIcon from 'components/base/hint/HintIcon'
import RequiredMark from 'components/base/required/RequiredMark'
import Selector from 'components/selects/Selector'
import Checkbox from 'components/checkboxes/Checkbox'
import RadioGroup from 'components/radio/RadioGroup'
import BaseExtendedSelect from 'components/selects/BaseExtendedSelect'
import type { InputCallbackData, InputProps } from 'components/inputs/input/Input'
import type { CheckboxCallbackData, CheckboxProps } from 'components/checkboxes/Checkbox'
import type { ExtendedSelectProps } from 'components/selects/ExtendedSelect'
import type { SelectorProps } from 'components/selects/Selector'
import type { RadioGroupProps, RadioGroupCallbackData } from 'components/radio/RadioGroup'
import './field.scss'

export const FIELD_TYPES = {
  input: 'input',
  checkbox: 'checkbox',
  radio: 'radio',
  select: 'select',
  selector: 'selector',
  text: 'text',
  title: 'title',
}

export type FieldProps = {
  name: string,
  className?: string,
  fieldType?: $Values<typeof FIELD_TYPES>,
  caption?: string,
  hint?: string,
} & Partial<InputProps> &
  Partial<CheckboxProps> &
  Partial<ExtendedSelectProps> &
  Partial<SelectorProps> &
  Partial<RadioGroupProps>

export type FieldValueType =
  | InputCallbackData
  | CheckboxCallbackData
  | RadioGroupCallbackData
  | Record<string, any>

const Field = (props: FieldProps) => {
  const {
    name = '',
    onChange,
    className,
    containerClassname,
    fieldType = FIELD_TYPES.text,
    caption = '',
    text = '',
    isRequired,
    hint = '',
    radios = [],
  } = props

  const newProps = omit(props, 'className', 'containerClassname')

  const [field, meta, helpers] = useField(name)
  const { error, touched } = meta

  const _onChange = useCallback(
    ({ value, id }: FieldValueType) => {
      const newValue = id || value

      helpers.setTouched(true)
      helpers.setValue(newValue)

      onChange?.(newValue)
    },
    [onChange, helpers],
  )

  const onBlur = useCallback(({ event }: FieldValueType) => field.onBlur(event), [field])

  const onResetInput = useCallback(() => _onChange({ value: '' }), [_onChange])

  const renderInput = useCallback(
    (Component: ElementType) => (
      <Component
        {...newProps}
        onChange={_onChange}
        onBlur={onBlur}
        onReset={onResetInput}
        val={field.value}
        helpers={helpers}
      />
    ),
    [_onChange, onResetInput, field, newProps, helpers, onBlur],
  )

  const renderComponent = useCallback(
    (Component: ElementType) => (
      <Component
        {...newProps}
        value={field.value}
        onBlur={onBlur}
        onChange={_onChange}
        helpers={helpers}
      />
    ),
    [_onChange, field, newProps, helpers, onBlur],
  )

  const renderSelector = useCallback(
    () => (
      <Selector
        {...newProps}
        value={field.value}
        onClickMenuItem={_onChange}
        theme="alt"
      />
    ),
    [field, newProps, _onChange],
  )

  const renderTitle = useCallback(
    () =>
      text ? (
        <Text variant="lg" className="field__title">
          {text}
        </Text>
      ) : null,
    [text],
  )

  const radiosItems = useMemo(
    () =>
      Array.isArray(radios) && size(radios) > 0
        ? radios.map((radio) => ({ ...radio, value: radio.id === field.value }))
        : [],
    [radios, field.value],
  )

  const getActiveRadioId = useCallback(() => {
    return radiosItems.find(({ value }) => value === true)?.id ?? null
  }, [radiosItems])

  const renderRadio = useCallback(
    () => (
      <RadioGroup
        {...newProps}
        radios={radiosItems}
        activeId={getActiveRadioId()}
        onChange={_onChange}
      />
    ),
    [radiosItems, newProps, getActiveRadioId, _onChange],
  )

  const fieldByType = useMemo(
    () => ({
      [FIELD_TYPES.input]: renderInput(Input),
      [FIELD_TYPES.checkbox]: renderComponent(Checkbox),
      [FIELD_TYPES.radio]: renderRadio(),
      [FIELD_TYPES.select]: renderComponent(BaseExtendedSelect),
      [FIELD_TYPES.selector]: renderSelector(),
      [FIELD_TYPES.title]: renderTitle(),
    }),
    [renderInput, renderComponent, renderRadio, renderSelector, renderTitle],
  )

  const fieldContent = useMemo(() => fieldByType[fieldType], [fieldByType, fieldType])

  return (
    <div
      className={classNames(className, containerClassname, {
        field: Object.keys(fieldByType).includes(fieldType),
      })}
    >
      {size(caption) > 0 && (
        <Text variant="sm" className="field__caption">
          {caption}
          <RequiredMark is={isRequired} />
        </Text>
      )}
      {hint ? (
        <Row className="field-wrapper">
          {fieldContent}
          <HintIcon title={hint} />
        </Row>
      ) : (
        fieldContent
      )}
      {Boolean(error) && Boolean(touched) && (
        <Text className="field__error">{error}</Text>
      )}
    </div>
  )
}

export default Field
