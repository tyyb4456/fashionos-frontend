import { useState } from 'react'
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import MarkdownContent from './MarkdownContent'

export default function ReasoningBlock({ text, streaming }) {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  const purpleColor = isDark ? '#a78bfa' : '#6d28d9'
  const purpleBorder = isDark ? 'rgba(167,139,250,0.18)' : 'rgba(109,40,217,0.18)'
  const purpleBg = isDark ? 'rgba(167,139,250,0.04)' : 'rgba(109,40,217,0.03)'

  return (
    <div style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, width: '100%' }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer' }}>
        <span style={{ fontSize: '0.75rem' }}>🧠</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: purpleColor, flex: 1 }}>
          {streaming ? 'Thinking…' : 'Reasoning'}
        </span>
        {streaming && <Loader2 size={10} color={purpleColor} style={{ animation: 'spin 1s linear infinite' }} />}
        {expanded ? <ChevronUp size={11} color={purpleColor} style={{ opacity: 0.8 }} /> : <ChevronDown size={11} color={purpleColor} style={{ opacity: 0.8 }} />}
      </div>
      {expanded && (
        <div style={{ padding: '2px 12px 12px' }}>
          <MarkdownContent text={text} color="var(--text-secondary)" fontSize="0.68rem" italic />
        </div>
      )}
    </div>
  )
}