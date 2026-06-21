import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { Play, Trophy } from 'lucide-react'
import { AnimatedCounter } from './AnimatedCounter'
import { FootballBall3D } from './FootballBall3D'
import { ProtectedLink } from './ProtectedLink'

function LetterReveal({ text, className = '' }) {
  const words = useMemo(() => text.split(' '), [text])

  return (
    <span className={className} aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="hero-word">
          {word.split('').map((char, charIndex) => (
            <span key={`${char}-${charIndex}`} className="hero-char">
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-char',
        { yPercent: 110, opacity: 0, rotateX: -45 },
        { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.72, stagger: 0.015, ease: 'power3.out', delay: 0.1 }
      )

      gsap.fromTo(
        '.hero-stagger',
        { y: 28, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, stagger: 0.11, ease: 'power3.out', delay: 0.35 }
      )

      gsap.fromTo(
        '.hero-visual',
        { x: 36, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.45 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="premium-hero" aria-label="Liga 1 Pro">
      <div className="stadium-grid" />
      <div className="stadium-lights" />
      <div className="particle-field" />

      <div className="hero-content">
        <div className="hero-copy-block">
          <div className="hero-stagger eyebrow">
            <Trophy className="h-4 w-4" />
            <span>Temporada 2026</span>
          </div>

          <h1 className="hero-title" aria-label="Liga 1 Pro: futbol peruano en tiempo real">
            <LetterReveal text="Liga 1 Pro" />
            <br />
            <LetterReveal text="futbol en tiempo real" className="accent" />
          </h1>

          <p className="hero-stagger hero-copy">
            Fixture, tabla, clubes, estadisticas, chat en vivo y prediccion IA en una experiencia deportiva
            de alto rendimiento para seguir cada jornada con precision.
          </p>

          <div className="hero-stagger hero-actions">
            <ProtectedLink to="/fixture" className="btn-secondary">
              <Play className="h-5 w-5" />
              Explorar fixture
            </ProtectedLink>
          </div>

          <div className="hero-stagger hero-metrics">
            <AnimatedCounter value={18} label="Clubes profesionales" />
            <AnimatedCounter value={126} label="Partidos en calendario" />
            <AnimatedCounter value={97} suffix="%" label="Cobertura competitiva" />
          </div>
        </div>

        <div className="hero-visual">
          <FootballBall3D />
        </div>
      </div>
    </section>
  )
}
