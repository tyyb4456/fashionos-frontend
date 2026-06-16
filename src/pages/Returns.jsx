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
    api.get(`/api/v1/returns/insights${q}`)
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter])

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white">Returns Fix Queue</h1>

      <div className="flex gap-2">
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all
              ${filter === f ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{insight.sku}</span>
                  <Badge level={insight.severity} />
                </div>
                <p className="text-xs text-gray-400">{insight.product_title}</p>
              </div>
              <div className="text-right text-xs">
                <div className="text-white">{insight.total_units_returned} units returned</div>
                {insight.return_rate_pct && (
                  <div className="text-red-400">{insight.return_rate_pct.toFixed(1)}% rate</div>
                )}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-2 mb-3 text-xs text-gray-400">
              <span className="text-gray-500">Reason: </span>
              <span className="text-yellow-400 capitalize">{insight.primary_reason?.replace('_', ' ')}</span>
            </div>

            <p className="text-xs text-gray-300 mb-2">{insight.recommended_fix}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                {fixTypeLabels[insight.fix_type] || insight.fix_type}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(insight.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">No return issues found ✅</div>
        )}
      </div>
    </div>
  )
}