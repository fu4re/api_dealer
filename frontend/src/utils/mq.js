import { useEffect, useState } from 'react'
import isPlainObject from 'lodash/isPlainObject'
import isFinite from 'lodash/isFinite'

export type BreakPointsParamsType = {
  slidesPerView?: number,
  spaceBetween?: number,
}

export type BreakPoints = Record<number, BreakPointsParamsType>

export const MQ = {
  laptopXL: 1440,
}

export const sliderBreakPoints = (breakpoints: BreakPoints): BreakPoints => {
  const result = {}

  Object.keys(breakpoints).forEach((width: string) => {
    const _width = +width
    result[_width] = isPlainObject(breakpoints[width])
      ? breakpoints[width]
      : { slidesPerView: breakpoints[_width], spaceBetween: 45 }
  })

  return result
}

export const getMatches = (query: string): boolean => {
  // Prevents SSR issues
  return typeof window !== 'undefined' ? window.matchMedia(query).matches : false
}

export const useMediaQuery = (params: { media?: string, maxWidth?: number }): boolean => {
  const { media, maxWidth } = params

  const query = isFinite(maxWidth) ? `(max-width: ${maxWidth}px)` : media

  const [matches, setMatches] = useState(getMatches(query))

  const handleChange = () => setMatches(getMatches(query))

  useEffect(() => {
    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handleChange()

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener('change', handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener('change', handleChange)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}
