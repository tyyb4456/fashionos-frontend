import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'
import { CheckCircle2 } from 'lucide-react'

const priorityBadge = { high: 'critical', normal: 'warning' }

const categoryLabels = {
  bulk_inquiry: '📦 Bulk Inquiry',
  complaint:    '⚠️ Complaint',
  influencer:   '✨ Influencer / Collab',
}

export default function Dm() {
  const api = useApi()
  const [dms, setDms]         = useState([])
  const [tab, setTab]         = useState('flagged_open')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/api/v1/dm/flagged?status=${tab}`).then(setDms).catch(console.error).finally(() => setLoading(false))
  }, [tab])

  const resolve = async (id) => {
    await api.patch(`/api/v1/dm/${id}/resolve`)
    setDms(prev => prev.filter(d => d.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(47,158,110,0.22)', borderTopColor: '#2F9E6E' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4" style={{ position: 'relative', zIndex: 1 }}>
      <div>
        <div className="section-pill">✉ Customer Conversations</div>
        <h1 className="page-title-shimmer" style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '2rem', fontWeight: 300 }}>Flagged DMs</h1>
        <div className="gradient-accent-line" />
      </div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {dms.filter(d => d.flag_priority === 'high').length} high priority · {dms.length} total
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
        {[['flagged_open', 'Needs Reply'], ['flagged_resolved', 'Resolved']].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className="px-3 py-1.5 text-xs transition-all"
            style={tab === val ? {
              background: 'rgba(47,158,110,0.12)',
              color: '#2F9E6E', border: '1px solid rgba(47,158,110,0.35)',
              fontFamily: "'Knewave', cursive", letterSpacing: '0.08em',
            } : { color: 'var(--text-secondary)', background: 'none', border: '1px solid transparent', cursor: 'pointer', fontFamily: "'Knewave', cursive" }}>
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {dms.map(dm => (
          <div key={dm.id} className="rounded-2xl p-4"
            style={{
              background: 'var(--card-bg)',
              border: dm.flag_priority === 'high' ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--card-border)',
            }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>@{dm.username}</span>
                  <Badge level={priorityBadge[dm.flag_priority] || 'info'} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {categoryLabels[dm.category] || dm.category}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(dm.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'var(--inner-bg)', color: 'var(--text-body)' }}>
              {dm.original_message}
            </div>
            {dm.flag_reason && (
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {dm.flag_reason}
              </p>
            )}
            {tab === 'flagged_open' && (
              <button onClick={() => resolve(dm.id)}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all hover:opacity-85"
                style={{ background: 'linear-gradient(135deg, #166534, #22c55e)', color: 'white', border: 'none' }}>
                <CheckCircle2 size={12} /> Mark Resolved
              </button>
            )}
          </div>
        ))}
        {dms.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            {tab === 'flagged_open' ? 'No DMs need a reply right now 🎉' : 'No resolved DMs yet'}
          </div>
        )}
      </div>
    </div>
  )
}