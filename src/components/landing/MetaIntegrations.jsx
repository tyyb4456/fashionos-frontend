import { useState } from 'react'
import { Wifi, Zap } from 'lucide-react'
import { metaIntegrations } from './LandingData.jsx'

export default function MetaIntegrations() {
  const [hoveredMeta, setHoveredMeta] = useState(null)

  return (
    <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Wifi size={11} />
          Meta Ecosystem
        </div>
        <h2 style={{
          fontFamily: "'Grape Nuts', cursive",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)',
          margin: 0, lineHeight: 1.2,
        }}>
          Built on Meta's stack.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 500, margin: '12px auto 0', lineHeight: 1.7 }}>
          FashionOS connects directly to Meta Ads, Instagram, Facebook, and WhatsApp through dedicated MCP servers — no manual exports, no copy-paste.
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="meta-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
      >
        {metaIntegrations.map((m, i) => {
          const isHovered = hoveredMeta === i
          return (
            <div
              key={m.name}
              className="meta-card"
              onMouseEnter={() => setHoveredMeta(i)}
              onMouseLeave={() => setHoveredMeta(null)}
              style={{
                animation: `slide-up 0.6s ease ${0.1 + i * 0.08}s both`,
                borderColor: isHovered ? `${m.color}40` : 'var(--card-border)',
                boxShadow: isHovered ? `0 20px 40px ${m.color}15` : 'none',
              }}
            >
              {/* Icon + badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: isHovered ? `${m.color}18` : 'var(--subtle-bg)',
                  border: `1px solid ${isHovered ? m.color + '40' : 'var(--subtle-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s',
                }}>
                  <m.Icon size={20} color={m.color} />
                </div>
                <span style={{
                  fontSize: '0.65rem', padding: '3px 8px', borderRadius: 999,
                  background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                  color: 'var(--text-muted)', fontFamily: 'monospace',
                }}>
                  {m.badge}
                </span>
              </div>

              {/* Name + description */}
              <div>
                <h3 style={{
                  fontFamily: "'Grape Nuts', cursive",
                  fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 6px',
                }}>{m.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  {m.desc}
                </p>
              </div>

              {/* Capability pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.pills.map(pill => (
                  <span key={pill} style={{
                    fontSize: '0.68rem', padding: '3px 9px', borderRadius: 999,
                    background: isHovered ? `${m.color}12` : 'var(--subtle-bg)',
                    border: `1px solid ${isHovered ? m.color + '35' : 'var(--subtle-border)'}`,
                    color: isHovered ? m.color : 'var(--text-secondary)',
                    transition: 'all 0.25s',
                  }}>
                    {pill}
                  </span>
                ))}
              </div>

              {/* Bottom accent line */}
              <div style={{
                height: 2, borderRadius: 4,
                background: `linear-gradient(90deg, ${m.color}60, transparent)`,
                opacity: isHovered ? 1 : 0.3,
                transition: 'opacity 0.25s',
              }} />
            </div>
          )
        })}
      </div>

      {/* MCP architecture note */}
      <div style={{
        marginTop: 28, padding: '18px 24px', borderRadius: 12,
        background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <Zap size={15} color="#4CA1AF" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Model Context Protocol (MCP)</strong> — each integration runs as an isolated MCP server, so agents talk to real APIs without ever holding credentials in the pipeline itself.
        </span>
      </div>
    </section>
  )
}