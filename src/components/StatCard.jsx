const palette = {
  teal:   { border: 'rgba(76,161,175,0.3)',  bg: 'rgba(76,161,175,0.07)',  icon: 'rgba(76,161,175,0.15)',  text: '#4CA1AF' },
  purple: { border: 'rgba(76,161,175,0.3)',  bg: 'rgba(76,161,175,0.07)',  icon: 'rgba(76,161,175,0.15)',  text: '#4CA1AF' },
  red:    { border: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.07)',   icon: 'rgba(239,68,68,0.15)',   text: '#f87171' },
  yellow: { border: 'rgba(250,204,21,0.3)',  bg: 'rgba(250,204,21,0.07)',  icon: 'rgba(250,204,21,0.15)',  text: '#facc15' },
  green:  { border: 'rgba(74,222,128,0.3)',  bg: 'rgba(74,222,128,0.07)',  icon: 'rgba(74,222,128,0.15)',  text: '#4ade80' },
  blue:   { border: 'rgba(96,165,250,0.3)',  bg: 'rgba(96,165,250,0.07)',  icon: 'rgba(96,165,250,0.15)',  text: '#60a5fa' },
}

export default function StatCard({ label, value, sub, color = 'teal', icon: Icon }) {
  const c = palette[color] || palette.teal
  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.border}` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: '#7a9ab5' }}>{label}</span>
        {Icon && (
          <div style={{ width: 28, height: 28, borderRadius: 8, background: c.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} style={{ color: c.text }} />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value ?? '—'}</div>
      {sub && <div className="text-xs mt-1.5" style={{ color: c.text }}>{sub}</div>}
    </div>
  )
}