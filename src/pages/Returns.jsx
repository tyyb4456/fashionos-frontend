import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'

const fixTypeLabels = {
  update_size_guide: '📏 Update Size Guide',
  update_photos: '📸 Reshoot Photos',
  update_description: '✏️ Update Description',
  quality_review: '🔍 Quality Review',
  contact_supplier: '📞 Contact Supplier',
  monitor: '👁️ Monitor',
  no_action: '✅ No Action',
}

export default function Returns() {
  const api = useApi()
  const [insights, setInsights] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = filter !== 'all' ? `?severity=${filter}` : ''
    setLoading(true)
    api.get(`/api/v1/returns/insights${q}`).then(setInsights).catch(console.error).finally(() => setLoading(false))
  }, [filter])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(224,94,56,0.22)', borderTopColor: '#e05e38' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4" style={{ position: 'relative', zIndex: 1 }}>
      <div>
        <div className="section-pill">↩ Quality Intelligence</div>
        <h1 className="page-title-shimmer" style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '2rem', fontWeight: 300 }}>Returns Fix Queue</h1>
        <div className="gradient-accent-line" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-xs capitalize transition-all"
            style={filter === f ? {
              background: 'rgba(224,94,56,0.12)',
              color: '#e05e38', border: '1px solid rgba(224,94,56,0.35)',
              fontFamily: "'Knewave', cursive", letterSpacing: '0.08em',
            } : { color: 'var(--text-secondary)', background: 'none', border: '1px solid transparent', cursor: 'pointer', fontFamily: "'Knewave', cursive" }}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className="rounded-2xl p-4"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{insight.sku}</span>
                  <Badge level={insight.severity} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{insight.product_title}</p>
              </div>
              <div className="text-right text-xs">
                <div style={{ color: 'var(--text-primary)' }}>{insight.total_units_returned} units returned</div>
                {insight.return_rate_pct && (
                  <div style={{ color: '#f87171' }}>{insight.return_rate_pct.toFixed(1)}% rate</div>
                )}
              </div>
            </div>
            <div className="rounded-xl p-2 mb-3 text-xs"
              style={{ background: 'var(--inner-bg)', color: 'var(--text-body)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Reason: </span>
              <span className="capitalize" style={{ color: '#facc15' }}>
                {insight.primary_reason?.replace('_', ' ')}
              </span>
              {insight.evidence && (
                <p className="mt-1.5" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{insight.evidence}"
                </p>
              )}
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-body)' }}>{insight.recommended_fix}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                {fixTypeLabels[insight.fix_type] || insight.fix_type}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(insight.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No return issues found</div>
        )}
      </div>
    </div>
  )
}