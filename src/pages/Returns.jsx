import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'

const fixTypeLabels = {
  update_size_guide:   '📏 Update Size Guide',
  update_photos:       '📸 Reshoot Photos',
  update_description:  '✏️ Update Description',
  quality_review:      '🔍 Quality Review',
  contact_supplier:    '📞 Contact Supplier',
  monitor:             '👁️ Monitor',
  no_action:           '✅ No Action',
}

export default function Returns() {
  const api = useApi()
  const [insights, setInsights] = useState([])
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const q = filter !== 'all' ? `?severity=${filter}` : ''
    setLoading(true)
    api.get(`/api/v1/returns/insights${q}`).then(setInsights).catch(console.error).finally(() => setLoading(false))
  }, [filter])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(76,161,175,0.25)', borderTopColor: '#4CA1AF' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl text-white" style={{ fontFamily: "'Grape Nuts', cursive" }}>Returns Fix Queue</h1>
      <div className="flex gap-2">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-xs rounded-xl capitalize transition-all"
            style={filter === f ? {
              background: 'linear-gradient(120deg, rgba(44,62,80,0.7), rgba(76,161,175,0.22))',
              color: '#4CA1AF', border: '1px solid rgba(76,161,175,0.3)',
            } : { color: '#7a9ab5', background: 'none', border: 'none', cursor: 'pointer' }}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className="rounded-2xl p-4"
            style={{ background: 'rgba(44,62,80,0.4)', border: '1px solid rgba(76,161,175,0.15)' }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{insight.sku}</span>
                  <Badge level={insight.severity} />
                </div>
                <p className="text-xs" style={{ color: '#7a9ab5' }}>{insight.product_title}</p>
              </div>
              <div className="text-right text-xs">
                <div className="text-white">{insight.total_units_returned} units returned</div>
                {insight.return_rate_pct && (
                  <div style={{ color: '#f87171' }}>{insight.return_rate_pct.toFixed(1)}% rate</div>
                )}
              </div>
            </div>
            <div className="rounded-xl p-2 mb-3 text-xs"
              style={{ background: 'rgba(0,0,0,0.2)', color: '#8ba5b8' }}>
              <span style={{ color: '#7a9ab5' }}>Reason: </span>
              <span className="capitalize" style={{ color: '#facc15' }}>
                {insight.primary_reason?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs mb-2" style={{ color: '#b0ccd4' }}>{insight.recommended_fix}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(76,161,175,0.1)', color: '#7a9ab5', border: '1px solid rgba(76,161,175,0.15)' }}>
                {fixTypeLabels[insight.fix_type] || insight.fix_type}
              </span>
              <span className="text-xs" style={{ color: '#4a6070' }}>
                {new Date(insight.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: '#4a6070' }}>No return issues found ✅</div>
        )}
      </div>
    </div>
  )
}