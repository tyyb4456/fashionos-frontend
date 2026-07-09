import { useState } from 'react'
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import MarkdownContent from './MarkdownContent'

export default function ReasoningBlock({ text, streaming }) {
  const [expanded, setExpanded] = useState(false)
  if (!text) return null

  return (
    <div style={{ background: '#111A15', border: '1px solid rgba(167,139,250,0.18)', width: '100%' }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer' }}>
        <span style={{ fontSize: '0.75rem' }}>🧠</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', flex: 1 }}>
          {streaming ? 'Thinking…' : 'Reasoning'}
        </span>
        {streaming && <Loader2 size={10} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />}
        {expanded ? <ChevronUp size={11} color="rgba(167,139,250,0.6)" /> : <ChevronDown size={11} color="rgba(167,139,250,0.6)" />}
      </div>
      {expanded && (
        <div style={{ padding: '2px 12px 12px' }}>
          <MarkdownContent text={text} color="rgba(242,237,228,0.5)" fontSize="0.68rem" italic />
        </div>
      )}
    </div>
  )
}