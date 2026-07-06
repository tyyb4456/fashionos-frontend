import { useState } from 'react'
import { Bot, Loader2, CheckCircle2, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { SUBAGENT_META, GOLD } from './constants'
import { InventoryData, TrendData, PricingData, MarketingData, ContentData } from './SubagentDataViews'

export default function SubagentCard({ name, status, summary, data }) {
  const { Icon, label, color } = SUBAGENT_META[name] || { label: name, Icon: Bot, color: GOLD }
  const [expanded, setExpanded] = useState(false)
  const hasData = data && status === 'done'

  const DataView = name === 'inventory-agent' ? InventoryData
    : name === 'trend-agent'     ? TrendData
    : name === 'pricing-agent'   ? PricingData
    : name === 'marketing-agent' ? MarketingData
    : name === 'content-agent'   ? ContentData
    : null

  return (
    <div style={{
      background: '#0f0f0f',
      border: `1px solid ${status === 'done' ? color + '33' : 'rgba(201,168,76,0.1)'}`,
      minWidth: expanded ? '100%' : 200,
      maxWidth: expanded ? '100%' : 260,
      flexShrink: 0,
      transition: 'border-color 0.3s, min-width 0.3s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 12px',
        borderBottom: expanded ? `1px solid ${color}22` : 'none',
        cursor: hasData ? 'pointer' : 'default',
      }}
        onClick={() => hasData && setExpanded(e => !e)}
      >
        <Icon size={12} color={color} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.62rem',
          letterSpacing: '0.12em', textTransform: 'uppercase', color, flex: 1,
        }}>{label}</span>
        <span>
          {status === 'running'
            ? <Loader2      size={10} color={color} style={{ animation: 'spin 1s linear infinite' }} />
            : status === 'done'
            ? <CheckCircle2 size={10} color={color} />
            : <AlertCircle  size={10} color="#ef4444" />}
        </span>
        {hasData && (
          expanded
            ? <ChevronUp   size={11} color={`${color}88`} />
            : <ChevronDown size={11} color={`${color}88`} />
        )}
      </div>

      {/* Collapsed: summary line */}
      {!expanded && (
        <div style={{ padding: '8px 12px' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
            color: status === 'done' ? color : 'rgba(242,237,228,0.3)',
            letterSpacing: '0.08em', marginBottom: summary ? 5 : 0,
          }}>
            {status === 'running' ? 'Running…' : status === 'done' ? 'Complete' : 'Error'}
          </div>
          {summary && (
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.65rem',
              color: 'rgba(242,237,228,0.55)', lineHeight: 1.5, margin: 0,
            }}>
              {summary.length > 110 ? summary.slice(0, 107) + '…' : summary}
            </p>
          )}
          {hasData && (
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.55rem',
              letterSpacing: '0.1em', color: `${color}88`, marginTop: 6,
              textTransform: 'uppercase',
            }}>
              Click to expand ↓
            </div>
          )}
        </div>
      )}

      {/* Expanded: full structured data */}
      {expanded && DataView && (
        <div style={{ padding: '12px' }}>
          {/* Summary text at top */}
          {summary && (
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.68rem',
              color: 'rgba(242,237,228,0.6)', lineHeight: 1.6,
              margin: '0 0 10px',
              padding: '8px 10px',
              background: `${color}0d`,
              border: `1px solid ${color}22`,
            }}>{summary}</p>
          )}
          <DataView data={data} />
        </div>
      )}
    </div>
  )
}