import { useState } from 'react'
import { Cpu, Zap } from 'lucide-react'
import { agents } from './LandingData.jsx'

export default function AgentPipeline() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="agents" style={{ padding: '20px 24px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Cpu size={11} />
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
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 520, margin: '12px auto 0' }}>
          Agents run in sequence — inventory data flows into trend, trend signals inform pricing,
          pricing clearance flags reach marketing. Every agent shares state via LangGraph.
        </p>
      </div>

      {/* Pipeline indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, marginBottom: 32, flexWrap: 'wrap',
      }}>
        {agents.map((a, i) => (
          <div key={a.step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: '0.65rem', padding: '3px 9px', borderRadius: 999,
              background: hovered === i ? 'rgba(173,223,241,0.15)' : 'var(--card-bg)',
              border: `1px solid ${hovered === i ? 'rgba(173,223,241,0.4)' : 'var(--card-border)'}`,
              color: hovered === i ? '#ADDFF1' : 'var(--text-muted)',
              fontFamily: 'monospace', transition: 'all 0.2s', cursor: 'default',
            }}>
              {a.step} {a.title}
            </span>
            {i < agents.length - 1 && (
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.5 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Agent cards — 4-col grid */}
      <div
        className="agent-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
      >
        {agents.map((a, i) => {
          const Icon = a.icon
          const isHovered = hovered === i
          return (
            <div
              key={a.step}
              className="agent-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ animation: `slide-up 0.6s ease ${0.05 + i * 0.05}s both` }}
            >
              {/* Step number + icon row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: isHovered ? 'linear-gradient(135deg, #003152, #ADDFF1)' : 'var(--subtle-bg)',
                  border: '1px solid var(--subtle-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isHovered ? '0 4px 16px rgba(173,223,241,0.3)' : 'none',
                }}>
                  <Icon size={17} color={isHovered ? '#fff' : '#ADDFF1'} />
                </div>
                <span style={{
                  fontFamily: "'Fascinate Inline', cursive",
                  fontSize: '1.4rem', color: isHovered ? '#ADDFF1' : 'var(--text-muted)',
                  opacity: isHovered ? 1 : 0.3, transition: 'all 0.25s',
                  lineHeight: 1,
                }}>
                  {a.step}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Fascinate Inline', cursive",
                fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 8px',
              }}>{a.title}</h3>

              {/* Description */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.6 }}>
                {a.desc}
              </p>

              {/* Badge + auto-exec flag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                <span style={{
                  fontSize: '0.6rem', padding: '2px 7px', borderRadius: 999,
                  background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                  color: 'var(--text-muted)', fontFamily: 'monospace',
                }}>
                  {a.badge}
                </span>
                {a.autoExec ? (
                  <span style={{
                    fontSize: '0.58rem', padding: '2px 7px', borderRadius: 999,
                    background: 'rgba(173,223,241,0.08)', border: '1px solid rgba(173,223,241,0.2)',
                    color: '#ADDFF1', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Zap size={9} /> auto-exec
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.58rem', padding: '2px 7px', borderRadius: 999,
                    background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                    color: '#fbbf24',
                  }}>
                    approval queue
                  </span>
                )}
              </div>

              <div className="gradient-line" style={{ opacity: isHovered ? 1 : 0.35, transition: 'opacity 0.25s', marginTop: 14 }} />
            </div>
          )
        })}
      </div>

      {/* Pipeline note */}
      <div style={{
        marginTop: 24, padding: '16px 22px', borderRadius: 12,
        background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <Cpu size={14} color="#ADDFF1" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>LangGraph supervisor graph</strong> — the supervisor decides which agents to run based on trigger type (daily full sweep, hourly inventory, webhook-specific). Agents with{' '}
          <span style={{ color: '#ADDFF1' }}>auto-exec</span> run silently.{' '}
          <span style={{ color: '#fbbf24' }}>Approval queue</span> agents surface decisions for your review.
        </span>
      </div>
    </section>
  )
}
