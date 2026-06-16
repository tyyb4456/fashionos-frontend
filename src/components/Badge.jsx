const badgeMap = {
  critical: { bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.35)',    text: '#f87171' },
  warning:  { bg: 'rgba(250,204,21,0.12)',   border: 'rgba(250,204,21,0.35)',   text: '#facc15' },
  info:     { bg: 'rgba(76,161,175,0.12)',   border: 'rgba(76,161,175,0.35)',   text: '#4CA1AF' },
  healthy:  { bg: 'rgba(74,222,128,0.12)',   border: 'rgba(74,222,128,0.35)',   text: '#4ade80' },
  pending:  { bg: 'rgba(251,146,60,0.12)',   border: 'rgba(251,146,60,0.35)',   text: '#fb923c' },
  posted:   { bg: 'rgba(74,222,128,0.12)',   border: 'rgba(74,222,128,0.35)',   text: '#4ade80' },
  skipped:  { bg: 'rgba(148,163,184,0.12)',  border: 'rgba(148,163,184,0.35)',  text: '#94a3b8' },
}

export default function Badge({ level }) {
  const s = badgeMap[level] || badgeMap.info
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      {level}
    </span>
  )
}