import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'
import { TrendingUp, Sparkles } from 'lucide-react'

const directionBadge = { rising: 'healthy', peaking: 'warning', declining: 'skipped' }
const platformIcons  = { tiktok: '🎵', instagram: '📸', google_trends: '🔍' }

export default function Trends() {
  const api = useApi()
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/trends/recent').then(setSignals).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(212,212,216,0.18)', borderTopColor: '#d4d4d8' }} />
    </div>
  )

  const opportunities = signals.filter(s => s.is_new_product_opportunity)
  const matched       = signals.filter(s => !s.is_new_product_opportunity)

  return (
    <div className="p-6 space-y-4" style={{ position: 'relative', zIndex: 1 }}>
      <div>
        <div className="section-pill">📈 Trend Intelligence</div>
        <h1 className="page-title-shimmer text-2xl" style={{ fontFamily: "'Alfa Slab One', serif" }}>Trending Now</h1>
        <div className="gradient-accent-line" />
      </div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {matched.length} matched to catalog · {opportunities.length} new product opportunities
      </p>

      <div className="space-y-3">
        {signals.map(s => (
          <div key={s.id} className="rounded-2xl p-4"
            style={{
              background: 'var(--card-bg)',
              border: s.is_new_product_opportunity ? '1px solid rgba(167,139,250,0.3)' : '1px solid var(--card-border)',
            }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {platformIcons[s.platform] || '📊'} {s.keyword}
                  </span>
                  <Badge level={directionBadge[s.direction] || 'info'} />
                  {s.is_new_product_opportunity && (
                    <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                      <Sparkles size={10} /> New opportunity
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {s.matched_sku ? `Matched: ${s.matched_sku}` : 'No catalog match'}
                </span>
              </div>
              <div className="text-right text-xs">
                <div className="flex items-center gap-1 justify-end" style={{ color: 'var(--text-primary)' }}>
                  <TrendingUp size={12} /> {s.score.toFixed(2)}
                  {s.score_delta != null && (
                    <span style={{ color: s.score_delta > 0 ? '#4ade80' : s.score_delta < 0 ? '#f87171' : 'var(--text-muted)' }}>
                      ({s.score_delta > 0 ? '+' : ''}{s.score_delta.toFixed(2)})
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            {s.evidence && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {s.evidence}
              </p>
            )}
          </div>
        ))}
        {signals.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No trend signals yet — the agent will pick some up on its next scheduled run.
          </div>
        )}
      </div>
    </div>
  )
}