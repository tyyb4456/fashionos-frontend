import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import { ArrowLeft } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function RunDetail() {
  const { runId }             = useParams()
  const api                   = useApi()
  const nav                   = useNavigate()
  const [run, setRun]         = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/v1/runs/${runId}`)
      .then(setRun)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [runId])

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>
  if (!run)    return <div className="p-8 text-red-400">Run not found.</div>

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => nav('/runs')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Back to Runs
      </button>

      <div>
        <h1 className="text-xl font-bold text-white capitalize">{run.trigger} Run</h1>
        <p className="text-xs text-gray-500 mt-0.5">{new Date(run.started_at).toLocaleString()}</p>
        {run.run_summary && (
          <p className="text-sm text-gray-300 mt-3 bg-white/5 border border-white/10 rounded-lg p-3">
            {run.run_summary}
          </p>
        )}
      </div>

      {/* Alerts */}
      {run.alerts?.length > 0 && (
        <Section title={`Alerts (${run.alerts.length})`}>
          <div className="space-y-2">
            {run.alerts.map(a => (
              <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex gap-3">
                <Badge level={a.level} />
                <div>
                  <p className="text-xs text-gray-300">{a.message}</p>
                  <span className="text-xs text-gray-600">{a.agent}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Inventory */}
      {run.inventory_snapshots?.length > 0 && (
        <Section title={`Inventory (${run.inventory_snapshots.length} SKUs)`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Stock</th>
                  <th className="text-right py-2">Days Left</th>
                  <th className="text-right py-2">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {run.inventory_snapshots
                  .sort((a, b) => a.days_of_stock_remaining - b.days_of_stock_remaining)
                  .map(s => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 text-gray-300">{s.sku}</td>
                    <td className="py-2 text-gray-400">{s.product_title} / {s.variant_title}</td>
                    <td className="py-2 text-right text-gray-300">{s.current_stock}</td>
                    <td className="py-2 text-right text-gray-300">{s.days_of_stock_remaining.toFixed(1)}</td>
                    <td className="py-2 text-right"><Badge level={s.urgency} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Pricing */}
      {run.pricing_actions?.length > 0 && (
        <Section title={`Pricing (${run.pricing_actions.length})`}>
          <div className="space-y-2">
            {run.pricing_actions.filter(p => p.action !== 'hold').map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{p.sku}</span>
                    <Badge level={p.auto_executed ? 'healthy' : 'pending'} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{p.reason}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-400">PKR {p.current_price?.toFixed(0)}</div>
                  <div className="text-white">→ PKR {p.recommended_price?.toFixed(0)}</div>
                  <div className="text-yellow-400">{p.discount_pct?.toFixed(0)}% off</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}