import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  {
    heading: <>Welcome to<br /><span>The Architect Program</span></>,
    body: null,
    cta: 'Tap to continue'
  },
  {
    heading: 'We build men who compound.',
    body: 'In their work, their faith, their families, and their finances. Not through motivation — through architecture.',
    cta: 'Tap to continue'
  },
  {
    heading: "Let's do that for you.",
    body: '21 days. One goal. 1% better every day.',
    cta: "Let's begin"
  }
]

export default function Intro() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  function advance() {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1)
    } else {
      localStorage.setItem('architect_intro_seen', '1')
      navigate('/auth')
    }
  }

  return (
    <div className="screen intro" onClick={advance}>
      {SLIDES.map((slide, i) => (
        <div key={i} className={`intro-slide ${i === current ? 'active' : ''}`}>
          <img className="intro-logo" src="/icons/Gold.png" alt="Architect Programs" />

          <h1 className="intro-heading">{slide.heading}</h1>

          {slide.body && (
            <p className="intro-body">{slide.body}</p>
          )}

          <p className="intro-cta">{slide.cta}</p>
        </div>
      ))}

      <div className="intro-dots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`intro-dot ${i === current ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
