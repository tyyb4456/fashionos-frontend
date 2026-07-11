import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import {
  AlertTriangle, DollarSign, Package, Megaphone, FileText,
  RotateCcw, Play, Activity, CalendarDays, ChevronRight,
  TrendingUp, Zap, Clock, BarChart3,
} from 'lucide-react'


/* ── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes ping {
    75%, 100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(18px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slide-right {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(224,94,56,0); }
    50%       { box-shadow: 0 0 0 6px rgba(224,94,56,0.1); }
  }
  @keyframes shimmer-text {
    to { background-position: 200% center; }
  }

  /* ── Bento Grid ── */
  .dash-bento {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(0, auto);
    gap: 16px;
    align-items: start;
  }

  /* Column spans */
  .bento-span-4  { grid-column: span 4; }
  .bento-span-5  { grid-column: span 5; }
  .bento-span-6  { grid-column: span 6; }
  .bento-span-7  { grid-column: span 7; }
  .bento-span-8  { grid-column: span 8; }
  .bento-span-12 { grid-column: span 12; }

  /* Stagger animation */
  .dash-card { animation: card-in 0.42s cubic-bezier(0.16,1,0.3,1) both; }
  .dash-card:nth-child(1)  { animation-delay: 0.04s; }
  .dash-card:nth-child(2)  { animation-delay: 0.09s; }
  .dash-card:nth-child(3)  { animation-delay: 0.14s; }
  .dash-card:nth-child(4)  { animation-delay: 0.19s; }
  .dash-card:nth-child(5)  { animation-delay: 0.24s; }
  .dash-card:nth-child(6)  { animation-delay: 0.29s; }
  .dash-card:nth-child(7)  { animation-delay: 0.34s; }
  .dash-card:nth-child(8)  { animation-delay: 0.39s; }

  /* Stat scroll */
  .stat-scroll { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
  .stat-scroll::-webkit-scrollbar { display: none; }

  /* Stat grid */
  .stat-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  /* Run rows scroll */
  .runs-scroll {
    display: flex; flex-direction: column; gap: 7px;
    overflow-y: auto; max-height: 440px;
    padding-bottom: 12px; scroll-behavior: smooth; scrollbar-width: none;
  }
  .runs-scroll::-webkit-scrollbar { display: none; }

  /* Hover glow card */
  .dash-inner-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .dash-inner-card:hover {
    border-color: rgba(224,94,56,0.35);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(224,94,56,0.08);
  }

  /* ── Tablet (≤ 1024px): 2 main cols ── */
  @media (max-width: 1024px) {
    .dash-bento { grid-template-columns: repeat(6, 1fr); gap: 14px; }
    .bento-span-4, .bento-span-5  { grid-column: span 3; }
    .bento-span-6, .bento-span-7  { grid-column: span 6; }
    .bento-span-8, .bento-span-12 { grid-column: span 6; }
  }

  /* ── Mobile (≤ 640px): single column ── */
  @media (max-width: 640px) {
    .dash-bento { grid-template-columns: 1fr; gap: 12px; }
    .bento-span-4, .bento-span-5, .bento-span-6,
    .bento-span-7, .bento-span-8, .bento-span-12 { grid-column: span 1; }
    .stat-grid-2 { grid-template-columns: repeat(2, 1fr); }
  }
`

/* ── Helpers ─────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 rounded-full border-2 animate-spin"
      style={{ borderColor: 'rgba(224,94,56,0.18)', borderTopColor: '#e05e38' }} />
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
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 99,
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
    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', color: '#4ade80', textTransform: 'uppercase' }}>
      Live
    </span>
  </div>
)

const SectionLabel = ({ title, accent = '#e05e38', icon: Icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    <div style={{
      width: 3, height: 16, borderRadius: 2, flexShrink: 0,
      background: `linear-gradient(180deg, ${accent}, transparent)`,
    }} />
    {Icon && <Icon size={12} style={{ color: accent }} />}
    <span style={{
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.11em',
      textTransform: 'uppercase', color: 'var(--text-secondary)',
    }}>
      {title}
    </span>
  </div>
)

const AgentChip = ({ name }) => (
  <span style={{
    fontSize: '0.58rem', fontWeight: 600, textTransform: 'capitalize',
    padding: '2px 7px', borderRadius: 99,
    background: 'rgba(224,94,56,0.1)',
    border: '1px solid rgba(224,94,56,0.18)',
    color: 'var(--gold)',
    whiteSpace: 'nowrap',
  }}>
    {name}
  </span>
)

/* ── Main ─────────────────────────────────────────────────────────── */
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

  const seasonal = data.seasonal_context
  const isSeasonActive = seasonal?.demand_multiplier > 1.05

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 24,
          animation: 'fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <div>
            {/* Eyebrow pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 11px', borderRadius: 99, marginBottom: 10,
              background: 'rgba(224,94,56,0.08)',
              border: '1px solid rgba(224,94,56,0.2)',
            }}>
              <Zap size={10} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                FashionOS Command Center
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: 'clamp(1.55rem, 3vw, 2.1rem)',
                margin: 0, lineHeight: 1,
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--gold) 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Dashboard
              </h1>
              <LivePill />
            </div>

            {data.last_run_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Last pipeline run{' '}
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{relTime(data.last_run_at)}</span>
                  <span style={{ opacity: 0.4, marginLeft: 5 }}>
                    · {new Date(data.last_run_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </p>
              </div>
            )}
          </div>

          <button
            id="run-now-btn"
            onClick={triggerRun}
            disabled={running}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--navy, #191919), var(--gold))',
              boxShadow: btnHov && !running
                ? '0 8px 28px rgba(224,94,56,0.35)'
                : '0 4px 16px rgba(224,94,56,0.2)',
              color: '#F2EDE4', border: 'none',
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em',
              cursor: running ? 'not-allowed' : 'pointer',
              opacity: running ? 0.6 : 1,
              transform: btnHov && !running ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}>
            <Play size={13} />
            {running ? 'Triggering…' : 'Run Pipeline'}
          </button>
        </div>

        {/* ── Last run banner ─────────────────────────────────────── */}
        {data.last_run_summary && (
          <div style={{
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            background: 'var(--subtle-bg)',
            border: '1px solid var(--subtle-border)',
            borderLeft: '3px solid rgba(224,94,56,0.5)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            animation: 'slide-right 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both',
          }}>
            <Activity size={14} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.55 }}>
              {data.last_run_summary}
            </p>
          </div>
        )}

        {/* ── Bento Grid ──────────────────────────────────────────── */}
        <div className="dash-bento">

          {/* ── Card 1: Key Metrics (spans 7 cols) ──────────────── */}
          <div className="dash-card bento-span-7 dash-inner-card" style={{ padding: '20px' }}>
            <SectionLabel title="System Overview" icon={BarChart3} />
            <div className="stat-grid-2">
              <StatCard label="Critical Alerts"  value={data.critical_alerts_open}      color="red"    icon={AlertTriangle} />
              <StatCard label="Pending Pricing"  value={data.pending_pricing_decisions}  color="yellow" icon={DollarSign} />
              <StatCard label="Pending Restock"  value={data.pending_restock_orders}     color="blue"   icon={Package} />
              <StatCard label="Marketing"        value={data.pending_marketing_actions}  color="teal"   icon={Megaphone} />
              <StatCard label="Content to Post"  value={data.pending_content_posts}      color="green"  icon={FileText} />
              <StatCard label="Return Insights"  value={data.open_return_insights}       color="yellow" icon={RotateCcw} />
            </div>

            {/* Runs today inline badge */}
            <div style={{
              marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px', borderRadius: 10,
              background: 'rgba(224,94,56,0.06)',
              border: '1px solid rgba(224,94,56,0.15)',
            }}>
              <Play size={12} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Runs today</span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '1.15rem', fontWeight: 700, fontFamily: "'Alfa Slab One', serif",
                color: 'var(--gold)',
              }}>{data.total_runs_today ?? 0}</span>
            </div>
          </div>

          {/* ── Card 2: Seasonal Demand (spans 5 cols) ──────────── */}
          <div className="dash-card bento-span-5 dash-inner-card" style={{ padding: '20px' }}>
            <SectionLabel title="Seasonal Intelligence" icon={CalendarDays} accent="#a78bfa" />

            {seasonal ? (
              <>
                {/* Demand multiplier big display */}
                <div style={{
                  borderRadius: 12, padding: '16px 18px', marginBottom: 14,
                  background: isSeasonActive ? 'rgba(224,94,56,0.08)' : 'var(--inner-bg)',
                  border: `1px solid ${isSeasonActive ? 'rgba(224,94,56,0.25)' : 'var(--item-border)'}`,
                  borderLeft: `3px solid ${isSeasonActive ? 'var(--gold)' : 'rgba(224,94,56,0.3)'}`,
                }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Active Season
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Alfa Slab One', serif", color: 'var(--text-primary)', lineHeight: 1 }}>
                      {seasonal.season_label.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    {isSeasonActive && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        padding: '2px 8px', borderRadius: 99,
                        background: 'rgba(224,94,56,0.15)',
                        color: 'var(--gold)',
                        fontSize: '0.68rem', fontWeight: 700,
                      }}>
                        <TrendingUp size={10} />
                        ×{seasonal.demand_multiplier}
                      </span>
                    )}
                  </div>
                </div>

                {seasonal.next_peak_label && (
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 10,
                    background: 'var(--inner-bg)',
                    border: '1px solid var(--item-border)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>
                        Next Peak
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {seasonal.next_peak_label.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.4rem', fontWeight: 700,
                        fontFamily: "'Alfa Slab One', serif",
                        color: 'var(--gold)', lineHeight: 1,
                      }}>{seasonal.days_until_next_peak}<span style={{ fontSize: '0.7rem', fontFamily: 'inherit' }}>d</span></div>
                      {!seasonal.next_peak_confirmed && (
                        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 2 }}>estimated</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px 0', textAlign: 'center' }}>
                No seasonal data
              </div>
            )}

            {/* Charts section inside seasonal card */}
            <div style={{ marginTop: 18 }}>
              <StatsPieCharts data={data} />
            </div>
          </div>

          {/* ── Card 3: Critical Alerts (spans 5 cols) ──────────── */}
          {data.critical_alerts?.length > 0 && (
            <div className="dash-card bento-span-5 dash-inner-card" style={{ padding: '20px' }}>
              <SectionLabel title={`Critical Alerts · ${data.critical_alerts.length}`} icon={AlertTriangle} accent="#f87171" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto', scrollbarWidth: 'none' }}>
                {data.critical_alerts.map(alert => (
                  <div key={alert.id} style={{
                    borderRadius: 10, padding: '10px 13px',
                    background: 'rgba(239,68,68,0.04)',
                    border: '1px solid rgba(239,68,68,0.12)',
                    borderLeft: '3px solid rgba(239,68,68,0.45)',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#f87171', flexShrink: 0, marginTop: 4,
                      display: 'inline-block',
                      animation: 'pulse-dot 1.8s ease-in-out infinite',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', margin: '0 0 6px', lineHeight: 1.5 }}>
                        {alert.message}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {alert.sku && (
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700, fontFamily: 'monospace',
                            color: '#f87171', background: 'rgba(239,68,68,0.1)',
                            padding: '2px 7px', borderRadius: 5, letterSpacing: '0.04em',
                          }}>
                            {alert.sku}
                          </span>
                        )}
                        <span style={{
                          fontSize: '0.58rem', color: 'var(--text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                          {alert.agent}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Card 4: Recent Runs (spans 7 cols) ──────────────── */}
          <div className={`dash-card ${data.critical_alerts?.length > 0 ? 'bento-span-7' : 'bento-span-12'} dash-inner-card`} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <SectionLabel title="Recent Runs" icon={Activity} />
              <button
                onClick={() => nav('/runs')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--gold)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                  opacity: 0.75, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.75}
              >
                View all <ChevronRight size={11} />
              </button>
            </div>
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

        </div>{/* end bento */}
      </div>
    </>
  )
}

/* ── BarGroup: glowing horizontal bar chart ──────────────────────── */
function BarGroup({ title, items, total, emptyLabel = 'None', emptyColor = '#4ade80' }) {
  const displayItems = items.length > 0
    ? items
    : [{ name: emptyLabel, value: 1, color: emptyColor }]
  const displayTotal = items.length > 0 ? total : null
  const maxVal = Math.max(...displayItems.map(d => d.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10,
      }}>
        <span style={{
          fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--text-muted)',
        }}>{title}</span>
        {displayTotal !== null && (
          <span style={{
            fontSize: '1.15rem', fontWeight: 800, lineHeight: 1,
            fontFamily: "'Alfa Slab One', serif",
            color: displayItems[0]?.color ?? 'var(--gold)',
            filter: `drop-shadow(0 0 6px ${displayItems[0]?.color ?? 'transparent'}55)`,
          }}>{displayTotal}</span>
        )}
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {displayItems.map((d, i) => {
          const pct = Math.max((d.value / maxVal) * 100, items.length > 0 ? 4 : 100)
          return (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{d.name}</span>
                {items.length > 0 && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: d.color, fontVariantNumeric: 'tabular-nums' }}>{d.value}</span>
                )}
              </div>
              {/* Track */}
              <div style={{
                width: '100%', height: 6, borderRadius: 99,
                background: 'var(--inner-bg)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Fill */}
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${d.color}99, ${d.color})`,
                  boxShadow: `0 0 8px ${d.color}66`,
                  transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
                  animation: `bar-grow-${i} 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08 + 0.2}s both`,
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatsPieCharts({ data }) {
  const pending = [
    { name: 'Pricing',   value: data.pending_pricing_decisions  || 0, color: '#facc15' },
    { name: 'Restock',   value: data.pending_restock_orders     || 0, color: '#60a5fa' },
    { name: 'Marketing', value: data.pending_marketing_actions  || 0, color: '#a78bfa' },
    { name: 'Content',   value: data.pending_content_posts      || 0, color: '#4ade80' },
    { name: 'Returns',   value: data.open_return_insights       || 0, color: '#f97316' },
  ].filter(d => d.value > 0)
  const totalPending = pending.reduce((s, d) => s + d.value, 0)

  const agentColorMap = {
    inventory: '#f87171', pricing: '#facc15', restock: '#60a5fa',
    marketing: '#a78bfa', content: '#4ade80', returns: '#f97316',
  }
  const alertsByAgentMap = {}
  data.critical_alerts?.forEach(alert => {
    const agent = alert.agent || 'unknown'
    alertsByAgentMap[agent] = (alertsByAgentMap[agent] || 0) + 1
  })
  const alerts = Object.entries(alertsByAgentMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: agentColorMap[name.toLowerCase()] || '#e05e38',
  }))
  const totalAlerts = alerts.reduce((s, d) => s + d.value, 0)

  let autoCount = 0, pendingCount = 0
  data.recent_runs?.forEach(run => {
    autoCount    += (run.pricing_auto_executed || 0) + (run.marketing_auto_executed || 0)
    pendingCount += (run.pricing_pending_approval || 0) + (run.marketing_pending_approval || 0)
  })
  const autoRate = autoCount + pendingCount > 0
    ? Math.round((autoCount / (autoCount + pendingCount)) * 100)
    : null
  const automation = [
    { name: 'Auto-executed', value: autoCount,    color: '#e05e38' },
    { name: 'Needs review',  value: pendingCount, color: '#f87171' },
  ].filter(d => d.value > 0)
  const totalAutomation = autoCount + pendingCount

  return (
    <div style={{ paddingTop: 14, borderTop: '1px solid var(--item-border)' }}>
      <SectionLabel title="Analysis" icon={BarChart3} accent="#a78bfa" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Pending Actions */}
        <BarGroup
          title="Pending Actions"
          items={pending}
          total={totalPending}
          emptyLabel="No Actions"
          emptyColor="#4ade80"
        />

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--item-border)' }} />

        {/* Alerts by Agent */}
        <BarGroup
          title="Alerts by Agent"
          items={alerts}
          total={totalAlerts}
          emptyLabel="System Healthy"
          emptyColor="#4ade80"
        />

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--item-border)' }} />

        {/* Automation Rate */}
        <div>
          <BarGroup
            title="Automation Rate"
            items={automation}
            total={totalAutomation}
            emptyLabel="No Runs Yet"
            emptyColor="var(--gold)"
          />
          {autoRate !== null && (
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(224,94,56,0.07)',
              border: '1px solid rgba(224,94,56,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Auto Rate</span>
              <span style={{
                fontSize: '1.1rem', fontWeight: 800,
                fontFamily: "'Alfa Slab One', serif",
                color: autoRate >= 70 ? '#4ade80' : autoRate >= 40 ? '#facc15' : '#f87171',
                filter: `drop-shadow(0 0 5px currentColor)`,
              }}>{autoRate}%</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

/* ── RunRow ──────────────────────────────────────────────────────── */
function RunRow({ run, crit, onClick }) {
  const [hov, setHov] = useState(false)
  const accentColor = crit ? '#f87171' : 'var(--gold)'

  return (
    <div
      id={`run-row-${run.run_id}`}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 11,
        background: hov ? 'var(--hover-bg)' : 'var(--inner-bg)',
        border: `1px solid ${hov
          ? (crit ? 'rgba(239,68,68,0.28)' : 'rgba(224,94,56,0.28)')
          : 'var(--item-border)'}`,
        borderLeft: `3px solid ${crit ? 'rgba(239,68,68,0.5)' : 'rgba(224,94,56,0.4)'}`,
        cursor: 'pointer',
        transform: hov ? 'translateX(4px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, background 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        {/* Left: trigger + chips */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <span style={{
              fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize',
              color: hov ? accentColor : 'var(--text-primary)',
              transition: 'color 0.2s ease',
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

        {/* Right: meta */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
            {relTime(run.started_at)}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            <span style={{ color: run.alert_count_critical > 0 ? '#f87171' : 'var(--text-muted)' }}>
              {run.alert_count_total} alerts
            </span>
            <span style={{ opacity: 0.5, margin: '0 4px' }}>·</span>
            <span>{run.inventory_skus_analysed} SKUs</span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={13}
          style={{
            color: 'var(--text-muted)', flexShrink: 0,
            opacity: hov ? 1 : 0,
            transform: hov ? 'translateX(0)' : 'translateX(-4px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        />
      </div>
    </div>
  )
}