import { marqueeItems } from './LandingData.jsx'

export default function IntegrationMarquee() {
  return (
    <div style={{ padding: '0 0 60px', position: 'relative', zIndex: 1 }}>
      <p style={{
        textAlign: 'center',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        Integrated with
      </p>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {/* Doubled for seamless infinite loop */}
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 22px', borderRadius: 999,
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                whiteSpace: 'nowrap',
              }}
            >
              <item.Icon size={16} color={item.color} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}