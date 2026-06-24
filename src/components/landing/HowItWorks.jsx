import { Clock } from 'lucide-react'
import { howItWorksSteps } from './LandingData.jsx'

export default function HowItWorks() {
  return (
    <section style={{ padding: '20px 24px 80px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Clock size={11} />
          Workflow
        </div>
        <h2 style={{
          fontFamily: "'Fascinate Inline', cursive",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)', margin: 0,
        }}>
          Set it. Supervise it.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 480, margin: '12px auto 0' }}>
          From OAuth connect to daily AI digest — everything runs on schedule.
          You stay in control of what matters.
        </p>
      </div>

      {/* Step cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {howItWorksSteps.map((item, i) => (
          <div
            key={item.step}
            className="step-card"
            style={{ animation: `slide-up 0.6s ease ${0.1 + i * 0.1}s both` }}
          >
            {/* Step number badge */}
            <div style={{
              minWidth: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, #003152, #ADDFF1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Fascinate Inline', cursive", fontSize: '1.1rem', color: '#fff', flexShrink: 0,
            }}>
              {item.step}
            </div>

            <div>
              <h4 style={{ fontFamily: "'Fascinate Inline', cursive", fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}