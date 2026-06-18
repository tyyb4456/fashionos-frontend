import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      padding: '28px 40px',
      borderTop: '1px solid var(--card-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={11} color="white" />
        </div>
        <span style={{ fontFamily: "'Grape Nuts', cursive", color: 'var(--text-secondary)', fontSize: '1rem' }}>
          FashionOS
        </span>
      </div>

      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        Autonomous fashion brand management. Built for scale.
      </span>
    </footer>
  )
}