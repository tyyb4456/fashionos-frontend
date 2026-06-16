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
    api.get('/api/v1/runs')
      .then(setRuns)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white">Run History</h1>

      <div className="space-y-2">
        {runs.map(run => (
          <div
            key={run.run_id}
            onClick={() => nav(`/runs/${run.run_id}`)}
            className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer
                       hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white capitalize">{run.trigger}</span>
                  {run.alert_count_critical > 0 && <Badge level="critical" />}
                  {run.alert_count_warning > 0  && <Badge level="warning" />}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(run.started_at).toLocaleString()}
                  {run.completed_at && ` · ${Math.round((new Date(run.completed_at) - new Date(run.started_at)) / 1000)}s`}
                </p>
                {run.run_summary && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{run.run_summary}</p>
                )}
              </div>
              <div className="text-right text-xs text-gray-500 space-y-1">
                <div>{run.inventory_skus_analysed} SKUs</div>
                <div>{run.pricing_decisions_total} pricing</div>
                <div>{run.alert_count_total} alerts</div>
              </div>
            </div>
            {run.agents_run && (
              <div className="mt-2 flex flex-wrap gap-1">
                {run.agents_run.map(a => (
                  <span key={a} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
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