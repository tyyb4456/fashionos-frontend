import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'

export default function Runs() {
  const api  = useApi()
  const nav  = useNavigate()
  const [runs, setRuns]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/runs').then(setRuns).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(201,168,76,0.22)', borderTopColor: '#C9A84C' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4" style={{ position: 'relative', zIndex: 1 }}>
      <div>
        <div className="section-pill">↺ Pipeline History</div>
        <h1 className="page-title-shimmer text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Run History</h1>
        <div className="gradient-accent-line" />
      </div>
      <div className="space-y-2">
        {runs.map(run => (
          <div key={run.run_id} onClick={() => nav(`/runs/${run.run_id}`)}
            className="page-inner-card p-4 cursor-pointer"
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--item-border)'}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{run.trigger}</span>
                  {run.alert_count_critical > 0 && <Badge level="critical" />}
                  {run.alert_count_warning  > 0 && <Badge level="warning"  />}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(run.started_at).toLocaleString()}
                  {run.completed_at && ` · ${Math.round((new Date(run.completed_at) - new Date(run.started_at)) / 1000)}s`}
                </p>
                {run.run_summary && (
                  <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-body)' }}>{run.run_summary}</p>
                )}
              </div>
              <div className="text-right text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <div>{run.inventory_skus_analysed} SKUs</div>
                <div>{run.pricing_decisions_total} pricing</div>
                <div>{run.alert_count_total} alerts</div>
              </div>
            </div>
            {run.agents_run && (
              <div className="mt-2 flex flex-wrap gap-1">
                {run.agents_run.map(a => (
                  <span key={a} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--hover-bg)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}