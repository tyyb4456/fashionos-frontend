import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { AlertTriangle, DollarSign, Package, Megaphone, FileText, RotateCcw, Play } from 'lucide-react'

const Spinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 rounded-full border-2 animate-spin"
      style={{ borderColor: 'rgba(76,161,175,0.25)', borderTopColor: '#4CA1AF' }} />
  </div>
)

const gradBtn = {
  background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
  boxShadow: '0 4px 16px rgba(76,161,175,0.28)',
  color: 'white', border: 'none',
}

export default function Dashboard() {
  const api  = useApi()
  const nav  = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    api.get('/api/v1/dashboard').then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  const triggerRun = async () => {
    setRunning(true)
    try { await api.post('/api/v1/webhooks/manual-run'); alert('Pipeline triggered! Check Runs page in ~2 minutes.') }
    catch (e) { alert(e.message) }
    finally { setRunning(false) }
  }

  if (loading) return <Spinner />
  if (!data)   return <div className="p-8" style={{ color: '#f87171' }}>Failed to load dashboard.</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white" style={{ fontFamily: "'Grape Nuts', cursive" }}>Dashboard</h1>
          {data.last_run_at && (
            <p className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>
              Last run: {new Date(data.last_run_at).toLocaleString()}
            </p>
          )}
        </div>
        <button onClick={triggerRun} disabled={running}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 hover:opacity-90"
          style={gradBtn}>
          <Play size={14} />
          {running ? 'Triggering...' : 'Run Now'}
        </button>
      </div>

      {/* Summary */}
      {data.last_run_summary && (
        <div className="rounded-2xl p-4"
          style={{ background: 'rgba(76,161,175,0.06)', border: '1px solid rgba(76,161,175,0.18)' }}>
          <p className="text-sm" style={{ color: '#b0ccd4' }}>{data.last_run_summary}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Critical Alerts"  value={data.critical_alerts_open}      color="red"    icon={AlertTriangle} />
        <StatCard label="Pending Pricing"  value={data.pending_pricing_decisions}  color="yellow" icon={DollarSign} />
        <StatCard label="Pending Restock"  value={data.pending_restock_orders}     color="blue"   icon={Package} />
        <StatCard label="Marketing"        value={data.pending_marketing_actions}  color="teal"   icon={Megaphone} />
        <StatCard label="Content to Post"  value={data.pending_content_posts}      color="green"  icon={FileText} />
        <StatCard label="Return Insights"  value={data.open_return_insights}       color="yellow" icon={RotateCcw} />
        <StatCard label="Runs Today"       value={data.total_runs_today}           color="teal"   icon={Play} />
      </div>

      {/* Critical alerts */}
      {data.critical_alerts?.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Critical Alerts</h2>
          <div className="space-y-2">
            {data.critical_alerts.map(alert => (
              <div key={alert.id} className="rounded-xl p-3"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm" style={{ color: '#cbd5e1' }}>{alert.message}</p>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {alert.sku && <span className="text-xs" style={{ color: '#7a9ab5' }}>{alert.sku}</span>}
                    <span className="text-xs" style={{ color: '#4a6070' }}>{alert.agent}</span>
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
            <div key={run.run_id} onClick={() => nav(`/runs/${run.run_id}`)}
              className="rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between"
              style={{ background: 'rgba(44,62,80,0.35)', border: '1px solid rgba(76,161,175,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(76,161,175,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(76,161,175,0.12)'}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium capitalize">{run.trigger}</span>
                  {run.alert_count_critical > 0 && <Badge level="critical" />}
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>
                  {new Date(run.started_at).toLocaleString()} · {run.agents_run?.join(', ')}
                </p>
              </div>
              <div className="text-right text-xs" style={{ color: '#7a9ab5' }}>
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