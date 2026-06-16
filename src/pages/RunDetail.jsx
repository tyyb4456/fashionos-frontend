import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import { ArrowLeft } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </div>
  )
}

export default function RunDetail() {
  const { runId } = useParams()
  const api = useApi()
  const nav = useNavigate()
  const [run, setRun]         = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/v1/runs/${runId}`).then(setRun).catch(console.error).finally(() => setLoading(false))
  }, [runId])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(76,161,175,0.25)', borderTopColor: '#4CA1AF' }} />
    </div>
  )
  if (!run) return <div className="p-8" style={{ color: '#f87171' }}>Run not found.</div>

  const cardS = { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => nav('/runs')}
        className="flex items-center gap-2 text-sm transition-all hover:text-white"
        style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={14} /> Back to Runs
      </button>

      <div>
        <h1 className="text-2xl capitalize" style={{ fontFamily: "'Grape Nuts', cursive", color: 'var(--text-primary)' }}>
          {run.trigger} Run
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{new Date(run.started_at).toLocaleString()}</p>
        {run.run_summary && (
          <p className="text-sm mt-3 rounded-xl p-3"
            style={{ color: 'var(--text-body)', background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
            {run.run_summary}
          </p>
        )}
      </div>

      {run.alerts?.length > 0 && (
        <Section title={`Alerts (${run.alerts.length})`}>
          <div className="space-y-2">
            {run.alerts.map(a => (
              <div key={a.id} className="rounded-xl p-3 flex gap-3" style={cardS}>
                <Badge level={a.level} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-body)' }}>{a.message}</p>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.agent}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {run.inventory_snapshots?.length > 0 && (
        <Section title={`Inventory (${run.inventory_snapshots.length} SKUs)`}>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--item-border)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--item-border)' }}>
                  <th className="text-left py-2.5 px-3">SKU</th>
                  <th className="text-left py-2.5">Product</th>
                  <th className="text-right py-2.5">Stock</th>
                  <th className="text-right py-2.5">Days Left</th>
                  <th className="text-right py-2.5 pr-3">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {run.inventory_snapshots
                  .sort((a, b) => a.days_of_stock_remaining - b.days_of_stock_remaining)
                  .map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--item-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-body)' }}>{s.sku}</td>
                      <td className="py-2.5" style={{ color: 'var(--text-secondary)' }}>{s.product_title} / {s.variant_title}</td>
                      <td className="py-2.5 text-right" style={{ color: 'var(--text-primary)' }}>{s.current_stock}</td>
                      <td className="py-2.5 text-right" style={{ color: 'var(--text-primary)' }}>{s.days_of_stock_remaining.toFixed(1)}</td>
                      <td className="py-2.5 text-right pr-3"><Badge level={s.urgency} /></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {run.pricing_actions?.length > 0 && (
        <Section title={`Pricing (${run.pricing_actions.length})`}>
          <div className="space-y-2">
            {run.pricing_actions.filter(p => p.action !== 'hold').map(p => (
              <div key={p.id} className="rounded-xl p-3 flex justify-between items-start" style={cardS}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{p.sku}</span>
                    <Badge level={p.auto_executed ? 'healthy' : 'pending'} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.reason}</p>
                </div>
                <div className="text-right text-xs">
                  <div style={{ color: 'var(--text-secondary)' }}>PKR {p.current_price?.toFixed(0)}</div>
                  <div style={{ color: 'var(--text-primary)' }}>→ PKR {p.recommended_price?.toFixed(0)}</div>
                  <div style={{ color: '#facc15' }}>{p.discount_pct?.toFixed(0)}% off</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}