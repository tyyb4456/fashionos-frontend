import { useState } from 'react'
import { BarChart2, Loader2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'
import { GOLD, TOOL_LABELS } from './constants'
import PrettyJSON from './PrettyJSON'

export default function ToolCallCard({ call }) {
  const [expanded, setExpanded] = useState(false)
  const label   = TOOL_LABELS[call.name] || call.name
  const hasData = call.status === 'done'

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid rgba(242,237,228,0.08)', width: '100%' }}>
      <div
        onClick={() => hasData && setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: hasData ? 'pointer' : 'default' }}
      >
        <BarChart2 size={11} color="rgba(242,237,228,0.4)" />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', letterSpacing: '0.06em', color: 'rgba(242,237,228,0.55)', flex: 1 }}>
          {call.status === 'running' ? 'Calling ' : 'Called '}
          <span style={{ color: GOLD }}>{label}</span>
        </span>
        {call.status === 'running'
          ? <Loader2 size={10} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
          : <CheckCircle2 size={10} color="#22c55e" />}
        {hasData && (expanded ? <ChevronUp size={11} color="rgba(242,237,228,0.3)" /> : <ChevronDown size={11} color="rgba(242,237,228,0.3)" />)}
      </div>
      {expanded && hasData && (
        <div style={{ padding: '4px 12px 12px', borderTop: '1px solid rgba(242,237,228,0.06)' }}>
          <PrettyJSON value={call.data} />
        </div>
      )}
    </div>
  )
}