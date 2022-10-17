import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  ReactNode,
  ReactElement,
} from 'react'
import classNames from 'classnames'
import Row from 'components/base/row/Row'
import Text from 'components/base/text/Text'
import { stopPropagationEvent } from 'utils/common'
import './text.scss'

export type TextOverflowProps = {
  children?: ReactNode,
  linesCount?: number,
  className?: string,
  Component?: ReactElement,
  onToggle?: (collapsed: boolean) => void,
  onClick?: (collapsed: boolean, event: MouseEvent<HTMLDivElement>) => void,
  onChangeCollapsedHeight?: (height: number) => void,
  doNotTrackResize?: boolean,
  renderAtBottom?: (notCollapse: boolean) => ReactNode,
  renderAfterText?: () => ReactNode,
  renderAtTopRight?: () => ReactNode,
}

const TextOverflow = (props: TextOverflowProps, ref) => {
  const {
    children,
    linesCount = 6,
    className = '',
    Component = 'div',
    onToggle = void 0,
    onClick = void 0,
    onChangeCollapsedHeight = void 0,
    doNotTrackResize = false,
    renderAtBottom,
    renderAfterText,
    renderAtTopRight,
  } = props

  const [collapsible, setCollapsible] = useState(false)
  const [collapsedHeight, setCollapsedHeight] = useState(0)
  const [collapsed, setCollapsed] = useState(true)
  const contentRef = useRef(null)

  const getContentHeight = useCallback(() => contentRef.current?.offsetHeight || '', [])

  const processCollapsible = useCallback(
    (saveState: boolean = false) => {
      const content = contentRef.current

      if (content) {
        let height = getContentHeight() || 0

        const computed = window.getComputedStyle(content).getPropertyValue('line-height')
        const lineHeight = parseFloat(computed)
        const ch = lineHeight * linesCount
        setCollapsedHeight(ch)

        const collapsible = height > ch
        setCollapsible(collapsible)

        collapsible && !saveState && setCollapsed(true)
      }
    },
    [linesCount, getContentHeight],
  )

  const toggleCollapse = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      stopPropagationEvent(event)
      collapsible && setCollapsed((collapsed) => !collapsed)
    },
    [collapsible],
  )

  const _onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      toggleCollapse(event)
      onClick?.(!collapsed, event)
    },
    [toggleCollapse, onClick, collapsed],
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    collapsible && setCollapsed(true)
    processCollapsible(true)
  }, [collapsible, contentRef.current?.offsetHeight])

  useEffect(() => {
    onChangeCollapsedHeight?.(collapsedHeight)
  }, [onChangeCollapsedHeight, collapsedHeight])

  useEffect(() => {
    collapsible && setTimeout(() => onToggle?.(collapsed), 300)
  }, [collapsible, collapsed, onToggle])

  useEffect(() => {
    const onResize = () => processCollapsible(true)

    if (!doNotTrackResize) {
      window.addEventListener('resize', onResize)

      return () => window.removeEventListener('resize', onResize)
    }
  }, [doNotTrackResize, processCollapsible])

  useImperativeHandle(
    ref,
    () => ({
      toggle: (callback) => {
        if (collapsible) {
          const newCollapsed = !collapsed
          collapsible && setCollapsed(newCollapsed)
          callback?.(newCollapsed)
        }
      },
      open: () => collapsible && setCollapsed(false),
    }),
    [collapsible, collapsed],
  )

  let height = (collapsible && (collapsed ? collapsedHeight : getContentHeight())) || null

  const renderInner = useCallback(() => {
    return (
      <div className="text-overflow__inner" style={{ height }}>
        <div ref={contentRef} className="text-overflow__content">
          {children}
        </div>
      </div>
    )
  }, [height, contentRef, children])

  const hasRenderAtTopRight = Boolean(renderAtTopRight)

  return (
    <Component
      className={classNames(
        className,
        'text-overflow',
        collapsible ? 'collapsible' : 'not-collapsible',
        collapsed ? 'collapsed' : 'expanded',
      )}
      onClick={collapsible ? _onClick : void 0}
    >
      {hasRenderAtTopRight ? (
        <Row vertical="top" horizontal={null}>
          {renderInner()}
          {renderAtTopRight()}
        </Row>
      ) : (
        renderInner()
      )}
      {renderAfterText?.()}
      {collapsible ? (
        <Text underline onClick={_onClick} className="more">
          {collapsed ? 'Показать еще' : 'Скрыть'}
        </Text>
      ) : (
        renderAtBottom?.(true)
      )}
    </Component>
  )
}

export default forwardRef(TextOverflow)
