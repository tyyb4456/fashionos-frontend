import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { features } from './LandingData.jsx'

export default function FeaturesGrid() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    <section id="features" style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Sparkles size={11} />
          Agent Pipeline
        </div>
        <h2 style={{
          fontFamily: "'Fascinate Inline', cursive",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)',
          margin: 0, lineHeight: 1.2,
        }}>
          Eight agents. One pipeline.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 480, margin: '12px auto 0' }}>
          Each agent specialises in one domain. They run in sequence, share state, and surface only what needs your eye.
        </p>
      </div>

      {/* 4-column grid */}
      <div
        className="features-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
      >
        {features.map((f, i) => {
          const Icon = f.icon
          const isHovered = hoveredFeature === i
          return (
            <div
              key={f.title}
              className="feature-card"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{ animation: `slide-up 0.6s ease ${0.1 + i * 0.05}s both` }}
            >
              {/* Icon box */}
              <div style={{
                width: 42, height: 42, borderRadius: 11,
                background: isHovered ? 'linear-gradient(135deg, #2C3E50, #4CA1AF)' : 'var(--subtle-bg)',
                border: '1px solid var(--subtle-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                transition: 'all 0.25s ease',
                boxShadow: isHovered ? '0 4px 16px rgba(76,161,175,0.3)' : 'none',
              }}>
                <Icon size={18} color={isHovered ? '#fff' : '#4CA1AF'} />
              </div>

              <h3 style={{
                fontFamily: "'Fascinate Inline', cursive",
                fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 8px',
              }}>{f.title}</h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {f.desc}
              </p>

              <div className="gradient-line" style={{ opacity: isHovered ? 1 : 0.4, transition: 'opacity 0.25s' }} />
            </div>
          )
        })}
      </div>
    </section>
  )
}