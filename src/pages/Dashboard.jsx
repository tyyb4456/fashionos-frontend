import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import {
  AlertTriangle, ShoppingBag, DollarSign,
  Package, Megaphone, FileText, RotateCcw, Play
} from 'lucide-react'

export default function Dashboard() {
  const api  = useApi()
  const nav  = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    api.get('/api/v1/dashboard')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const triggerRun = async () => {
    setRunning(true)
    try {
      await api.post('/api/v1/webhooks/manual-run')
      alert('Pipeline triggered! Check Runs page in ~2 minutes.')
    } catch (e) {
      alert(e.message)
    } finally {
      setRunning(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>
  if (!data)   return <div className="p-8 text-red-400">Failed to load dashboard.</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          {data.last_run_at && (
            <p className="text-xs text-gray-500 mt-0.5">
              Last run: {new Date(data.last_run_at).toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={triggerRun}
          disabled={running}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50
                     text-white text-sm px-4 py-2 rounded-lg transition-all"
        >
          <Play size={14} />
          {running ? 'Triggering...' : 'Run Now'}
        </button>
      </div>

      {/* Run summary */}
      {data.last_run_summary && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-300">{data.last_run_summary}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Critical Alerts"     value={data.critical_alerts_open}      color="red"    icon={AlertTriangle} />
        <StatCard label="Pending Pricing"     value={data.pending_pricing_decisions}  color="yellow" icon={DollarSign} />
        <StatCard label="Pending Restock"     value={data.pending_restock_orders}     color="blue"   icon={Package} />
        <StatCard label="Pending Marketing"   value={data.pending_marketing_actions}  color="purple" icon={Megaphone} />
        <StatCard label="Content to Post"     value={data.pending_content_posts}      color="green"  icon={FileText} />
        <StatCard label="Return Insights"     value={data.open_return_insights}       color="yellow" icon={RotateCcw} />
        <StatCard label="Runs Today"          value={data.total_runs_today}           color="purple" icon={Play} />
      </div>

      {/* Critical alerts */}
      {data.critical_alerts?.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Critical Alerts</h2>
          <div className="space-y-2">
            {data.critical_alerts.map(alert => (
              <div key={alert.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {alert.sku && <span className="text-xs text-gray-500">{alert.sku}</span>}
                    <span className="text-xs text-gray-600">{alert.agent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent runs */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Recent Runs</h2>
        <div className="space-y-2">
          {data.recent_runs?.map(run => (
            <div
              key={run.run_id}
              onClick={() => nav(`/runs/${run.run_id}`)}
              className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer
                         hover:bg-white/10 transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{run.trigger}</span>
                  {run.alert_count_critical > 0 && (
                    <Badge level="critical" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(run.started_at).toLocaleString()} · {run.agents_run?.join(', ')}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>{run.alert_count_total} alerts</div>
                <div>{run.inventory_skus_analysed} SKUs</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}