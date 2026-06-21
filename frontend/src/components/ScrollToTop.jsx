import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { useLocation } from 'react-router-dom'

export const scrollToStart = (lenis) => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  lenis?.scrollTo?.(0, { immediate: true, force: true })
}

const forceScrollToStart = (lenis) => {
  scrollToStart(lenis)

  const frameOne = window.requestAnimationFrame(() => {
    scrollToStart(lenis)
    window.requestAnimationFrame(() => scrollToStart(lenis))
  })
  const timeoutShort = window.setTimeout(() => scrollToStart(lenis), 80)
  const timeoutLong = window.setTimeout(() => scrollToStart(lenis), 260)

  return () => {
    window.cancelAnimationFrame(frameOne)
    window.clearTimeout(timeoutShort)
    window.clearTimeout(timeoutLong)
  }
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const cleanupInitialReset = forceScrollToStart(lenis)

    const handlePageShow = () => {
      forceScrollToStart(lenis)
    }

    const handleLoad = () => {
      forceScrollToStart(lenis)
    }

    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('load', handleLoad)
    return () => {
      cleanupInitialReset()
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('load', handleLoad)
    }
  }, [lenis])

  useEffect(() => {
    return forceScrollToStart(lenis)
  }, [lenis, pathname])

  return null
}
