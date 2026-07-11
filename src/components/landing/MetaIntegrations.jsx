import { useState } from 'react'
import { Wifi, Zap } from 'lucide-react'
import { integrations } from './LandingData.jsx'

export default function Integrations() {
  const [hovered, setHovered] = useState(null)

  return (
    <section style={{ padding: '20px 24px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Wifi size={11} />
          Platform Integrations
        </div>
        <h2 style={{
          fontFamily: "'Alfa Slab One', serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)',
          margin: 0, lineHeight: 1.2,
        }}>
          Every platform. One OS.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.7 }}>
          FashionOS connects Shopify, Meta Ads, Instagram, Facebook, and WhatsApp through
          isolated MCP servers — agents call real APIs without ever holding credentials in the pipeline.
        </p>
      </div>

      {/* Cards — 5 in a row, responsive */}
      <div
        className="integrations-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}
      >
        {integrations.map((m, i) => {
          const isHovered = hovered === i
          return (
            <div
              key={m.name}
              className="meta-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                animation: `slide-up 0.6s ease ${0.1 + i * 0.07}s both`,
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
                  fontSize: '0.6rem', padding: '3px 8px', borderRadius: 999,
                  background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                  color: 'var(--text-muted)', fontFamily: 'monospace',
                }}>
                  {m.badge}
                </span>
              </div>

              {/* Name + description */}
              <div>
                <h3 style={{
                  fontFamily: "'Alfa Slab One', serif",
                  fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 6px',
                }}>{m.name}</h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  {m.desc}
                </p>
              </div>

              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {m.pills.map(pill => (
                  <span key={pill} style={{
                    fontSize: '0.65rem', padding: '3px 8px', borderRadius: 999,
                    background: isHovered ? `${m.color}12` : 'var(--subtle-bg)',
                    border: `1px solid ${isHovered ? m.color + '35' : 'var(--subtle-border)'}`,
                    color: isHovered ? m.color : 'var(--text-secondary)',
                    transition: 'all 0.25s',
                  }}>
                    {pill}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
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
        marginTop: 24, padding: '16px 22px', borderRadius: 12,
        background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <Zap size={14} color="#ADDFF1" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Model Context Protocol (MCP)</strong> — each integration runs as an isolated MCP server (shopify_mcp · ads_mcp · social_mcp · trends_mcp · notify_mcp). Agents call tools via MCP without ever holding credentials in the LangGraph pipeline itself.
        </span>
      </div>
    </section>
  )
}