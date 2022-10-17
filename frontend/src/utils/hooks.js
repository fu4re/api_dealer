import { useState, useCallback } from 'react'
import { useQuery } from 'react-query'
import size from 'lodash/size'
import type { FetchConfigType } from 'network/types'

export type SliderProgressParamsType = {
  onSlideChange?: (newIndex: number, data: SwiperClass) => void,
  initialSlide?: number,
}

export const useSliderProgress = (params: SliderProgressParamsType = {}) => {
  const { onSlideChange, initialSlide } = params

  const [index, setIndex] = useState(initialSlide || 0)

  const _onSlideChange = useCallback(
    (data: Record<string, any>) => {
      const { activeIndex } = data

      setIndex(activeIndex)
      onSlideChange?.(activeIndex, data)
    },
    [onSlideChange],
  )

  return { progress: index, onSlideChange: _onSlideChange }
}

export const useFetch = (
  request: (params?: Record<string, any>) => void,
  config: FetchConfigType = {},
) => {
  const { params, queryOptions, dependencies } = config

  const name = [request?.name, new Date()].filter(Boolean).join('_')

  return useQuery(
    size(dependencies) > 0 ? [name, ...dependencies] : name,
    () => request?.(params),
    queryOptions,
  )
}
