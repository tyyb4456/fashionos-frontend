import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { trendSources } from './LandingData.jsx'

export default function TrendIntelligence() {
  const [hoveredTrend, setHoveredTrend] = useState(null)

  return (
    <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <TrendingUp size={11} />
          Trend Intelligence
        </div>
        <h2 style={{
          fontFamily: "'Fascinate Inline', cursive",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
        }}>
          Know what's trending. Act first.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.7 }}>
          The Trend agent combines real social scraping via Apify with free keyword signals from Google Trends to map rising demand to your live catalog — before your competitors react.
        </p>
      </div>

      {/* Source cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {trendSources.map((src, i) => {
          const isHovered = hoveredTrend === i
          const IconComp = src.icon
          return (
            <div
              key={src.id}
              onMouseEnter={() => setHoveredTrend(i)}
              onMouseLeave={() => setHoveredTrend(null)}
              style={{
                borderRadius: 18,
                background: 'var(--card-bg)',
                border: `1px solid ${isHovered ? src.color + '45' : 'var(--card-border)'}`,
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? `0 24px 48px ${src.color}15` : 'none',
                animation: `slide-up 0.6s ease ${0.1 + i * 0.12}s both`,
              }}
            >
              {/* Header stripe */}
              <div style={{
                padding: '22px 24px 18px',
                borderBottom: '1px solid var(--item-border)',
                background: isHovered ? `${src.color}08` : 'transparent',
                transition: 'background 0.25s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Source icon */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 13,
                      background: isHovered ? `${src.color}18` : 'var(--subtle-bg)',
                      border: `1px solid ${isHovered ? src.color + '40' : 'var(--subtle-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.25s', flexShrink: 0,
                    }}>
                      <IconComp size={22} color={src.color} />
                    </div>

                    {/* Source name + platform meta */}
                    <div>
                      <h3 style={{
                        fontFamily: "'Fascinate Inline', cursive",
                        fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 3px',
                      }}>{src.label}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {src.platforms.map(p => (
                          <span key={p.name} style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: '0.7rem', color: 'var(--text-secondary)',
                          }}>
                            <p.PIcon size={11} color={p.color} />
                            {p.name}
                            <span style={{ color: 'var(--text-muted)' }}>·</span>
                            <span style={{ color: 'var(--text-muted)' }}>{p.posts}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* MCP badge */}
                  <span style={{
                    fontSize: '0.65rem', padding: '3px 8px', borderRadius: 999,
                    background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                    color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap',
                  }}>
                    {src.badge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                  {src.desc}
                </p>

                {/* Mini stat row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {src.bullets.map(b => (
                    <div key={b.unit} style={{
                      padding: '12px 10px', borderRadius: 10,
                      background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                      textAlign: 'center',
                    }}>
                      <span style={{
                        fontFamily: "'Fascinate Inline', cursive",
                        fontSize: '1.3rem', color: src.color, display: 'block', lineHeight: 1,
                      }}>{b.stat}</span>
                      <span style={{ fontSize: '0.65rem', color: '#4CA1AF', display: 'block', marginTop: 2 }}>{b.unit}</span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4, display: 'block', lineHeight: 1.4 }}>{b.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Hashtag / keyword pills */}
                <div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {src.pillLabel}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {src.pills.map(pill => (
                      <span key={pill} style={{
                        fontSize: '0.7rem', padding: '3px 10px', borderRadius: 999,
                        background: isHovered ? `${src.color}12` : 'var(--subtle-bg)',
                        border: `1px solid ${isHovered ? src.color + '35' : 'var(--subtle-border)'}`,
                        color: isHovered ? src.color : 'var(--text-secondary)',
                        transition: 'all 0.25s', fontFamily: 'monospace',
                      }}>
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div style={{
                  height: 2, borderRadius: 4,
                  background: `linear-gradient(90deg, ${src.color}70, transparent)`,
                  opacity: isHovered ? 1 : 0.25,
                  transition: 'opacity 0.25s',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Pipeline order note */}
      <div style={{
        marginTop: 24, padding: '16px 22px', borderRadius: 12,
        background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <TrendingUp size={14} color="#4CA1AF" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Pipeline order matters —</strong> the Trend agent runs after Inventory and <em>before</em> Pricing, so trend signals are available when the Pricing agent decides hold vs. markdown.
        </span>
      </div>
    </section>
  )
}