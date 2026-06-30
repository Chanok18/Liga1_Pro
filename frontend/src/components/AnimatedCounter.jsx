import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedCounter({ value, suffix = '', label }) {
  const numberRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const element = numberRef.current
    const card = cardRef.current
    if (!element || !card) return undefined

    const target = { value: 0 }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (media.matches) {
      element.textContent = `${value}${suffix}`
      return
    }

    let tween = null
    let hasPlayed = false

    const play = () => {
      if (hasPlayed) return
      hasPlayed = true
      tween = gsap.to(target, {
        value,
        duration: 1.8,
        ease: 'power3.out',
        onUpdate: () => {
          element.textContent = `${Math.round(target.value)}${suffix}`
        },
      })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play()
          observer.disconnect()
        }
      })
    }, {
      threshold: 0.45,
    })

    observer.observe(card)

    return () => {
      observer.disconnect()
      tween?.kill()
    }
  }, [value, suffix])

  return (
    <article ref={cardRef} className="metric-tile">
      <strong ref={numberRef}>0{suffix}</strong>
      <span>{label}</span>
    </article>
  )
}
