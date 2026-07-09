import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { AlertTriangle, DollarSign, Package, Megaphone, FileText, RotateCcw, Play, Activity, CalendarDays } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

/* ── Styles ────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes ping {
    75%, 100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  /* ── Scrollable panels ── */
  .stat-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }
  .stat-scroll::-webkit-scrollbar { display: none; }
  .stat-scroll-wrap { position: relative; }
  .stat-scroll-wrap::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 48px;
    background: linear-gradient(to bottom, transparent, var(--item-bg, #0f1117));
    pointer-events: none;
    border-radius: 0 0 12px 12px;
  }

  /* ── Two-column split panel ── */
  .dash-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── Inner stat card grid (2 cols inside left panel) ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    overflow-y: auto;
    max-height: 310px;
    padding-bottom: 40px;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .stat-grid::-webkit-scrollbar { display: none; }

  /* ── Runs list ── */
  .runs-scroll {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    max-height: 480px;
    padding-bottom: 16px;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .runs-scroll::-webkit-scrollbar { display: none; }

  /* ── Tablet (≤ 900px): stack panels, wider cards ── */
  @media (max-width: 900px) {
    .dash-split {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .stat-grid {
      grid-template-columns: repeat(2, 1fr);
      max-height: 260px;
    }
    .runs-scroll {
      max-height: 320px;
    }
  }

  /* ── Mobile (≤ 560px): single column cards ── */
  @media (max-width: 560px) {
    .stat-grid {
      grid-template-columns: 1fr;
      max-height: 300px;
    }
    .runs-scroll {
      max-height: 280px;
    }
  }
`

/* ── Helpers ───────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 rounded-full border-2 animate-spin"
      style={{ borderColor: 'rgba(47,158,110,0.18)', borderTopColor: '#2F9E6E' }} />
  </div>
)

const relTime = (iso) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const LivePill = () => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 9px', borderRadius: 99,
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.2)',
  }}>
    <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: '#4ade80', opacity: 0.7,
        animation: 'ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
      }} />
      <span style={{ borderRadius: '50%', width: 7, height: 7, background: '#4ade80', position: 'relative' }} />
    </span>
    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', color: '#4ade80', textTransform: 'uppercase' }}>
      Live
    </span>
  </div>
)

const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
    <div style={{
      width: 3, height: 15, borderRadius: 2, flexShrink: 0,
      background: 'linear-gradient(180deg, #2F9E6E, rgba(0,49,82,0.8))',
    }} />
    <span style={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.09em',
      textTransform: 'uppercase', color: 'var(--text-primary)',
    }}>
      {title}
    </span>
  </div>
)

const AgentChip = ({ name }) => (
  <span style={{
    fontSize: '0.58rem', fontWeight: 600, textTransform: 'capitalize',
    padding: '2px 7px', borderRadius: 99,
    background: 'rgba(47,158,110,0.1)',
    border: '1px solid rgba(47,158,110,0.18)',
    color: '#2F9E6E',
    whiteSpace: 'nowrap',
  }}>
    {name}
  </span>
)

const gradBtn = {
  background: 'linear-gradient(135deg, #0D1512, #2F9E6E)',
  boxShadow: '0 4px 16px rgba(47,158,110,0.22)',
  color: 'white', border: 'none',
}

const SeasonalPulseCard = ({ seasonal }) => {
  if (!seasonal) return null

  const isActive = seasonal.demand_multiplier > 1.05
  const label = seasonal.season_label
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div style={{
      borderRadius: 12, padding: '13px 16px',
      background: isActive ? 'rgba(47,158,110,0.08)' : 'var(--subtle-bg)',
      border: `1px solid ${isActive ? 'rgba(47,158,110,0.28)' : 'var(--subtle-border)'}`,
      borderLeft: `3px solid ${isActive ? '#2F9E6E' : 'rgba(47,158,110,0.3)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 14, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CalendarDays size={15} style={{ color: '#2F9E6E', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Seasonal Demand
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>
            {label}
            {isActive && (
              <span style={{ marginLeft: 8, fontSize: '0.68rem', fontWeight: 700, color: '#2F9E6E' }}>
                ×{seasonal.demand_multiplier} demand
              </span>
            )}
          </div>
        </div>
      </div>

      {seasonal.next_peak_label && (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Next Peak
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: 2 }}>
            {seasonal.next_peak_label.replace(/_/g, ' ')} · in {seasonal.days_until_next_peak}d
            {!seasonal.next_peak_confirmed && (
              <span style={{ marginLeft: 6, fontSize: '0.62rem', color: 'var(--text-muted)' }}>(estimated)</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function Dashboard() {
  const api  = useApi()
  const nav  = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [btnHov, setBtnHov]   = useState(false)

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
    <>
      <style>{STYLES}</style>
      <div className="p-6 space-y-7">

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="section-pill">⚡ FashionOS Command Center</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <h1 className="page-title-shimmer" style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: '1.75rem',
                margin: 0, lineHeight: 1,
              }}>
                Dashboard
              </h1>
              <LivePill />
            </div>
            {data.last_run_at && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                Last pipeline run{' '}
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {relTime(data.last_run_at)}
                </span>
                <span style={{ opacity: 0.4, marginLeft: 6 }}>
                  · {new Date(data.last_run_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            )}
          </div>

          <button
            onClick={triggerRun}
            disabled={running}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              ...gradBtn,
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 12,
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.02em',
              cursor: running ? 'not-allowed' : 'pointer',
              opacity: running ? 0.55 : 1,
              transform: btnHov && !running ? 'translateY(-1px)' : 'none',
              boxShadow: btnHov && !running
                ? '0 6px 22px rgba(0,0,0,0.22)'
                : '0 4px 16px rgba(47,158,110,0.22)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
            <Play size={13} />
            {running ? 'Triggering…' : 'Run Now'}
          </button>
        </div>

        {/* ── Last run summary ───────────────────────────────── */}
        {data.last_run_summary && (
          <div style={{
            borderRadius: 12, padding: '13px 15px',
            background: 'var(--subtle-bg)',
            border: '1px solid var(--subtle-border)',
            borderLeft: '3px solid rgba(47,158,110,0.45)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Activity size={14} style={{ color: '#2F9E6E', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.55 }}>
              {data.last_run_summary}
            </p>
          </div>
        )}

        {/* ── Seasonal pulse ─────────────────────────────────── */}
        <SeasonalPulseCard seasonal={data.seasonal_context} />

        {/* ── Two-column panel: Stat cards (left) + Recent runs (right) ── */}
        <div className="dash-split">

          {/* LEFT — System Overview */}
          <div className="page-inner-card" style={{ padding: '18px 16px', minHeight: 380 }}>
            <SectionHeader title="System Overview" />
            <div className="stat-scroll-wrap">
              <div className="stat-grid">
                <StatCard label="Critical Alerts"  value={data.critical_alerts_open}      color="red"    icon={AlertTriangle} />
                <StatCard label="Pending Pricing"  value={data.pending_pricing_decisions}  color="yellow" icon={DollarSign} />
                <StatCard label="Pending Restock"  value={data.pending_restock_orders}     color="blue"   icon={Package} />
                <StatCard label="Marketing"        value={data.pending_marketing_actions}  color="teal"   icon={Megaphone} />
                <StatCard label="Content to Post"  value={data.pending_content_posts}      color="green"  icon={FileText} />
                <StatCard label="Return Insights"  value={data.open_return_insights}       color="yellow" icon={RotateCcw} />
                <StatCard label="Runs Today"       value={data.total_runs_today}           color="teal"   icon={Play} />
              </div>
            </div>

            {/* ── Mini Pie Charts ── */}
            <StatsPieCharts data={data} />

            {/* Critical alerts inside the left panel */}
            {data.critical_alerts?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <SectionHeader title={`Critical Alerts · ${data.critical_alerts.length}`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.critical_alerts.map(alert => (
                    <div key={alert.id} style={{
                      borderRadius: 12, padding: '11px 14px',
                      background: 'rgba(239,68,68,0.05)',
                      border: '1px solid rgba(239,68,68,0.14)',
                      borderLeft: '3px solid rgba(239,68,68,0.5)',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#f87171', flexShrink: 0, marginTop: 4,
                        display: 'inline-block',
                        animation: 'pulse-dot 1.8s ease-in-out infinite',
                      }} />
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.5 }}>
                          {alert.message}
                        </p>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          {alert.sku && (
                            <div style={{
                              fontSize: '0.62rem', fontWeight: 700, fontFamily: 'monospace',
                              color: '#f87171', background: 'rgba(239,68,68,0.1)',
                              padding: '2px 7px', borderRadius: 5, marginBottom: 4,
                              letterSpacing: '0.04em',
                            }}>
                              {alert.sku}
                            </div>
                          )}
                          <div style={{
                            fontSize: '0.6rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            {alert.agent}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Recent Runs */}
          <div className="page-inner-card" style={{ padding: '18px 16px', minHeight: 380 }}>
            <SectionHeader title="Recent Runs" />
            <div className="runs-scroll">
              {data.recent_runs?.map(run => {
                const crit = run.alert_count_critical > 0
                return (
                  <RunRow
                    key={run.run_id}
                    run={run}
                    crit={crit}
                    onClick={() => nav(`/runs/${run.run_id}`)}
                  />
                )
              })}
            </div>
          </div>

        </div>{/* end two-column grid */}

      </div>
    </>
  )
}

/* ── StatsPieCharts ─────────────────────────────────────────────── */
const DONUT_ROUNDING = { cornerRadius: 4 }

function MiniDonut({ title, chartData, total }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value, color } = payload[0].payload
    return (
      <div style={{
        background: 'var(--item-bg)',
        border: `1px solid ${color}44`,
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: '0.7rem',
        color: 'var(--text-primary)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        <span style={{ color, fontWeight: 700 }}>{name}</span>
        <span style={{ marginLeft: 6, color: 'var(--text-secondary)' }}>{value}</span>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.09em', color: 'var(--text-secondary)', textAlign: 'center',
      }}>
        {title}
      </span>

      <div style={{ position: 'relative', width: '100%', height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius="52%" outerRadius="75%"
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
              {...DONUT_ROUNDING}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginTop: 2 }}>TOTAL</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 8px' }}>
        {chartData.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.57rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsPieCharts({ data }) {
  // 1. Pending Actions Breakdown (Directly from backend counts)
  const pending = [
    { name: 'Pricing',  value: data.pending_pricing_decisions  || 0, color: '#facc15' },
    { name: 'Restock',  value: data.pending_restock_orders     || 0, color: '#60a5fa' },
    { name: 'Marketing',value: data.pending_marketing_actions  || 0, color: '#a78bfa' },
    { name: 'Content',  value: data.pending_content_posts      || 0, color: '#4ade80' },
    { name: 'Returns',  value: data.open_return_insights       || 0, color: '#f97316' },
  ].filter(d => d.value > 0)

  const totalPending = pending.reduce((s, d) => s + d.value, 0)

  // 2. Alerts by Agent (Dynamically group the critical_alerts array by agent)
  const alertsByAgentMap = {}
  if (data.critical_alerts && data.critical_alerts.length > 0) {
    data.critical_alerts.forEach(alert => {
      const agent = alert.agent || 'unknown'
      alertsByAgentMap[agent] = (alertsByAgentMap[agent] || 0) + 1
    })
  }

  const agentColorMap = {
    inventory: '#f87171',
    pricing:   '#facc15',
    restock:   '#60a5fa',
    marketing: '#a78bfa',
    content:   '#4ade80',
    returns:   '#f97316',
  }

  const alerts = Object.entries(alertsByAgentMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: agentColorMap[name.toLowerCase()] || '#2F9E6E',
  }))

  const totalAlerts = alerts.reduce((s, d) => s + d.value, 0)

  // 3. Automation Rate (Aggregated from recent runs: Auto vs Pending decisions)
  let autoCount = 0
  let pendingCount = 0
  if (data.recent_runs && data.recent_runs.length > 0) {
    data.recent_runs.forEach(run => {
      autoCount += (run.pricing_auto_executed || 0) + (run.marketing_auto_executed || 0)
      pendingCount += (run.pricing_pending_approval || 0) + (run.marketing_pending_approval || 0)
    })
  }

  const automation = [
    { name: 'Auto Run',    value: autoCount,    color: '#2F9E6E' },
    { name: 'Needs Review',value: pendingCount, color: '#f87171' },
  ].filter(d => d.value > 0)

  const totalAutomation = autoCount + pendingCount

  // Fallbacks if data is empty
  const fallbackPending = [{ name: 'No Actions', value: 1, color: 'rgba(255,255,255,0.06)' }]
  const fallbackAlerts = [{ name: 'System Healthy', value: 1, color: '#4ade80' }]
  const fallbackAuto = [{ name: 'No Runs', value: 1, color: 'rgba(255,255,255,0.06)' }]

  return (
    <div style={{
      marginTop: 18,
      paddingTop: 16,
      borderTop: '1px solid var(--item-border)',
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 3, height: 15, borderRadius: 2, flexShrink: 0,
            background: 'linear-gradient(180deg, #a78bfa, rgba(0,49,82,0.8))',
          }} />
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: 'var(--text-primary)',
          }}>
            Analysis
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <MiniDonut
          title="Pending Actions"
          chartData={pending.length ? pending : fallbackPending}
          total={totalPending}
        />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--item-border)', flexShrink: 0 }} />
        <MiniDonut
          title="Alerts by Agent"
          chartData={alerts.length ? alerts : fallbackAlerts}
          total={totalAlerts}
        />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--item-border)', flexShrink: 0 }} />
        <MiniDonut
          title="Automation Rate"
          chartData={automation.length ? automation : fallbackAuto}
          total={totalAutomation}
        />
      </div>
    </div>
  )
}

/* ── RunRow ────────────────────────────────────────────────────── */
function RunRow({ run, crit, onClick }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 12,
        background: hov ? 'var(--item-bg-hover, var(--item-bg))' : 'var(--item-bg)',
        border: `1px solid ${hov
          ? (crit ? 'rgba(239,68,68,0.3)' : 'rgba(47,158,110,0.3)')
          : 'var(--item-border)'}`,
        borderLeft: `3px solid ${crit ? 'rgba(239,68,68,0.5)' : 'rgba(47,158,110,0.45)'}`,
        cursor: 'pointer',
        transform: hov ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <span style={{
              fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize',
              color: 'var(--text-primary)',
            }}>
              {run.trigger}
            </span>
            {crit && <Badge level="critical" />}
          </div>
          {run.agents_run?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {run.agents_run.map(a => <AgentChip key={a} name={a} />)}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
            {relTime(run.started_at)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            {run.alert_count_total} alerts · {run.inventory_skus_analysed} SKUs
          </div>
        </div>
      </div>
    </div>
  )
}