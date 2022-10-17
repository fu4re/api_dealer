import React, { useCallback, ReactNode } from 'react'
import { Formik } from 'formik'
import classNames from 'classnames'
import upperFirst from 'lodash/upperFirst'
import size from 'lodash/size'
import isFinite from 'lodash/isFinite'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'
import isEqual from 'lodash/isEqual'
import LoadedContent from 'components/base/loaded/LoadedContent'
import BaseCard from 'components/cards/base/BaseCard'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import Button from 'components/base/button/Button'
import Field from 'components/forms/field/Field'
import { FIELD_TYPES } from 'components/forms/field/Field'
import { getModifiers } from 'utils/common'
import type {
  FormikOnSubmit,
  FormikType,
  InitialValuesType,
  ValidationSchemeType,
} from 'utils/forms/utils'
import type { ButtonProps } from 'components/base/button/Button'
import type { InputProps } from 'components/inputs/input/Input'
import type { CheckboxProps } from 'components/checkboxes/Checkbox'
import type { ExtendedSelectProps } from 'components/selects/ExtendedSelect'
import './form.scss'

export type FormBlockType = {
  renderContent?: () => ReactNode,
  blocks?: Array<FormBlockType>,
} & Partial<InputProps> &
  Partial<CheckboxProps> &
  Partial<ExtendedSelectProps>

export type FormBlocksType =
  | Record<string, FormBlockType>
  | ((values: FormikValues) => Record<string, FormBlockType>)

export type FormProps = {
  className?: string,
  initialValues?: InitialValuesType,
  validationSchema?: ValidationSchemeType,
  validateOnChange?: boolean,
  validateOnBlur?: boolean,
  onSubmit?: FormikOnSubmit,
  blocks: FormBlocksType,
  isLoading?: boolean,
  data?: Array<any> | Record<string, any>,
  buttonProps?: ButtonProps,
  renderBeforeButton?: () => ReactNode,
  renderAfterButton?: () => ReactNode,
  isButtonEnabled?: boolean,
  withReset?: boolean,
  forceButtonEnabled?: boolean,
  isAnotherFieldsChanged?: boolean,
  withInitialCheck?: boolean,
  title?: string,
  renderAtTitleEnd?: () => ReactNode,
  renderBeforeTitle?: () => ReactNode,
}

const Form = (props: FormProps) => {
  const {
    className = '',
    initialValues = {},
    validationSchema = null,
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit,
    blocks = {},
    isLoading,
    data = {},
    buttonProps = {},
    renderBeforeButton,
    renderAfterButton,
    isButtonEnabled = true,
    withReset = true,
    forceButtonEnabled = false,
    isAnotherFieldsChanged = false,
    withInitialCheck = true,
    title = '',
    renderAtTitleEnd,
    renderBeforeTitle,
  } = props

  const getClassName = useCallback(
    (parts: string | Array<string>) => getModifiers(className, parts, '__'),
    [className],
  )

  const renderBlocks = useCallback(
    (blocks: FormBlocksType, formik?: FormikType) => {
      const _blocks = isFunction(blocks) ? blocks(formik.values) : blocks

      return (
        <>
          {Object.keys(_blocks).map((name) => {
            const block = _blocks[name]

            const {
              renderContent,
              fieldType = FIELD_TYPES.text,
              isRequired = true,
              placeholder = '',
              blocks: nestedBlocks = {},
              caption = '',
              visible,
              type = FIELD_TYPES.text,
              ...other
            } = block

            const isVisible = visible?.(formik) ?? true

            if (!isVisible) {
              return null
            }

            const showCaption = ![FIELD_TYPES.text, FIELD_TYPES.title].includes(fieldType)

            return renderContent ? (
              renderContent(name, formik, getClassName(name))
            ) : size(nestedBlocks) > 0 || isFunction(nestedBlocks) ? (
              <Row
                key={name}
                vertical="top"
                className={classNames(getClassName('row'), 'form__row', name)}
              >
                {renderBlocks(nestedBlocks, formik)}
              </Row>
            ) : (
              <Field
                key={name}
                isRequired={isRequired}
                fieldType={fieldType}
                type={type}
                caption={showCaption ? caption || upperFirst(placeholder) : ''}
                placeholder={[
                  upperFirst(placeholder),
                  isRequired && Boolean(placeholder) && '*',
                ]
                  .filter(Boolean)
                  .join('')}
                name={name}
                className={getClassName(name)}
                {...other}
              />
            )
          })}
        </>
      )
    },
    [getClassName],
  )

  const renderContent = useCallback(
    (formik: FormikType) => {
      const { isValid, isSubmitting, resetForm, values, setSubmitting } = formik

      const withInitialValues = Object.keys(values).every((key) => {
        const value = values[key]
        const isInitial = withInitialCheck && isEqual(value, initialValues[key])
        const isEmpty = size(isFinite(value) ? String(value) : value) === 0

        return isInitial || isEmpty
      })

      const hasDisabled = !isValid || isSubmitting || withInitialValues
      const isDisabled = size(validationSchema) > 0 && hasDisabled
      const isButtonDisabled = (isDisabled && !isAnotherFieldsChanged) || !isButtonEnabled

      const _onClick = () => {
        onSubmit?.(values)
        withReset && resetForm(initialValues)
        setSubmitting(false)
      }

      const submitButton = (
        <Button
          disabled={isButtonDisabled && !forceButtonEnabled}
          stretch
          className={classNames('form__button', getClassName('button'))}
          onClick={_onClick}
          {...buttonProps}
        />
      )

      return (
        <>
          {renderBeforeTitle?.()}
          {size(title) > 0 && (
            <Row horizontal="between" className="form__title">
              <Text variant="xl">{title}</Text>
              {renderAtTitleEnd?.()}
            </Row>
          )}
          <div className="form__content">{renderBlocks(blocks, formik)}</div>
          {renderBeforeButton || renderAfterButton ? (
            <Row className={classNames('form__buttons', getClassName('buttons'))}>
              {renderBeforeButton?.()}
              {submitButton}
              {renderAfterButton?.()}
            </Row>
          ) : (
            submitButton
          )}
        </>
      )
    },
    [
      renderBlocks,
      renderBeforeButton,
      renderAfterButton,
      renderAtTitleEnd,
      renderBeforeTitle,
      getClassName,
      blocks,
      initialValues,
      buttonProps,
      onSubmit,
      withInitialCheck,
      withReset,
      validationSchema,
      forceButtonEnabled,
      isButtonEnabled,
      isAnotherFieldsChanged,
      title,
    ],
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validationOnBlur={validateOnBlur}
      validateOnChange={validateOnChange}
    >
      {(formik: FormikType) => (
        <BaseCard
          className={classNames('form', className)}
          renderContent={() =>
            isNil(isLoading) ? (
              renderContent(formik)
            ) : (
              <LoadedContent
                isLoading={isLoading}
                data={data}
                size={60}
                renderContent={() => renderContent(formik)}
              />
            )
          }
        />
      )}
    </Formik>
  )
}

export default Form
