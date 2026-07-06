import { ArrowUpRight, ArrowDownRight, Minus, Zap, ShoppingBag } from 'lucide-react'
import { GOLD, GOLD_DIM, URGENCY_COLOR } from './constants'
import { badge, Divider } from './utils'

export function InventoryData({ data }) {
  const snaps  = data?.inventory_snapshots || []
  const alerts = data?.alerts || []
  const counts = {
    critical: snaps.filter(s => s.urgency === 'critical').length,
    high:     snaps.filter(s => s.urgency === 'high').length,
    healthy:  snaps.filter(s => s.urgency === 'healthy').length,
  }

  return (
    <div>
      {/* Stat pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          { label: 'SKUs', val: snaps.length,     color: 'rgba(242,237,228,0.5)' },
          { label: 'Critical', val: counts.critical, color: '#ef4444' },
          { label: 'High', val: counts.high,      color: '#f97316' },
          { label: 'Healthy', val: counts.healthy, color: '#22c55e' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)',
            padding: '4px 10px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color, fontWeight: 600 }}>{val}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', color: 'rgba(242,237,228,0.3)', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '5px 0',
              borderBottom: i < alerts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}>{badge(a.level, URGENCY_COLOR[a.level] || GOLD)}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'rgba(242,237,228,0.6)', lineHeight: 1.5 }}>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* SKU table */}
      {snaps.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Inter', sans-serif", fontSize: '0.63rem' }}>
            <thead>
              <tr style={{ color: 'rgba(242,237,228,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {['SKU', 'Product', 'Stock', 'Vel/day', 'Days left', 'Urgency'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 400, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snaps.slice(0, 8).map((s, i) => (
                <tr key={i} style={{ background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '5px 8px', color: GOLD, fontWeight: 500 }}>{s.sku}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(242,237,228,0.7)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.product_title}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(242,237,228,0.7)' }}>{s.current_stock}</td>
                  <td style={{ padding: '5px 8px', color: 'rgba(242,237,228,0.5)' }}>{s.units_per_day?.toFixed(1)}</td>
                  <td style={{ padding: '5px 8px', color: s.days_of_stock_remaining >= 999 ? 'rgba(242,237,228,0.3)' : s.days_of_stock_remaining < 7 ? '#ef4444' : 'rgba(242,237,228,0.7)' }}>
                    {s.days_of_stock_remaining >= 999 ? '∞' : Math.round(s.days_of_stock_remaining)}
                  </td>
                  <td style={{ padding: '5px 8px' }}>{badge(s.urgency, URGENCY_COLOR[s.urgency] || GOLD)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {snaps.length > 8 && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: '6px 8px 0', letterSpacing: '0.08em' }}>
              +{snaps.length - 8} more SKUs
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function TrendData({ data }) {
  const signals = data?.trend_signals || []
  const alerts  = data?.alerts || []

  const dirIcon = (dir) => {
    if (dir === 'rising')   return <ArrowUpRight   size={10} color="#22c55e" />
    if (dir === 'peaking')  return <Zap            size={10} color={GOLD} />
    if (dir === 'declining') return <ArrowDownRight size={10} color="#ef4444" />
    return <Minus size={10} color="rgba(242,237,228,0.3)" />
  }

  return (
    <div>
      {alerts.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '5px 0',
              borderBottom: i < alerts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}>{badge(a.level, URGENCY_COLOR[a.level] || GOLD)}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'rgba(242,237,228,0.6)', lineHeight: 1.5 }}>{a.message}</span>
            </div>
          ))}
          <Divider />
        </div>
      )}

      {signals.length === 0 ? (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'rgba(242,237,228,0.3)', margin: 0 }}>No signals found</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {signals.slice(0, 6).map((s, i) => (
            <div key={i} style={{
              background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)',
              padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {dirIcon(s.direction)}
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', color: '#F2EDE4', fontWeight: 500 }}>{s.keyword}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.58rem', letterSpacing: '0.1em', color: '#a78bfa', textTransform: 'uppercase', marginLeft: 'auto' }}>{s.platform}</span>
                {/* Score bar */}
                <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(s.score || 0) * 100}%`, background: '#a78bfa' }} />
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: '#a78bfa', minWidth: 28 }}>{((s.score || 0) * 100).toFixed(0)}%</span>
              </div>
              {s.matched_sku && (
                <div style={{ marginBottom: 3 }}>{badge('SKU: ' + s.matched_sku, GOLD)}</div>
              )}
              {s.is_new_product_opportunity && (
                <div style={{ marginBottom: 3 }}>{badge('New opportunity', '#22c55e')}</div>
              )}
              {s.evidence && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.45)', margin: 0, lineHeight: 1.5 }}>{s.evidence}</p>
              )}
            </div>
          ))}
          {signals.length > 6 && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: 0, letterSpacing: '0.08em' }}>
              +{signals.length - 6} more signals
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function PricingData({ data }) {
  const decisions = data?.decisions || []
  const ACTION_COLOR = {
    hold:          'rgba(242,237,228,0.4)',
    markdown:      '#f97316',
    increase:      '#22c55e',
    clearance_code:'#ef4444',
    bundle:        '#60a5fa',
  }
  const ACTION_ICON = {
    hold:          <Minus         size={10} />,
    markdown:      <ArrowDownRight size={10} />,
    increase:      <ArrowUpRight   size={10} />,
    clearance_code:<Zap           size={10} />,
    bundle:        <ShoppingBag   size={10} />,
  }

  return (
    <div>
      {/* Summary counts */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          { label: 'Total', val: decisions.length, color: 'rgba(242,237,228,0.5)' },
          { label: 'Executed', val: data?.auto_executed_count ?? 0, color: '#22c55e' },
          { label: 'Pending', val: data?.pending_count ?? 0, color: GOLD },
          { label: 'Failed', val: data?.failed_count ?? 0, color: '#ef4444' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)',
            padding: '4px 10px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color, fontWeight: 600 }}>{val}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', color: 'rgba(242,237,228,0.3)', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Decision list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {decisions.slice(0, 8).map((d, i) => {
          const aColor = ACTION_COLOR[d.action] || GOLD
          return (
            <div key={i} style={{
              background: '#0d0d0d', border: `1px solid ${aColor}22`,
              padding: '7px 10px', display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span style={{ color: aColor }}>{ACTION_ICON[d.action]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: GOLD, fontWeight: 500 }}>{d.sku}</span>
                  {badge(d.action, aColor)}
                  {d.auto_execute && d.executed && badge('done', '#22c55e')}
                  {d.auto_execute && !d.executed && badge('pending', GOLD)}
                  {!d.auto_execute && badge('approval needed', '#a78bfa')}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.5)' }}>
                  PKR {d.current_price?.toLocaleString()}
                  {d.recommended_price !== d.current_price && (
                    <span style={{ color: aColor }}> → PKR {d.recommended_price?.toLocaleString()}</span>
                  )}
                  {d.discount_pct > 0 && <span style={{ color: '#f97316' }}> ({d.discount_pct}% off)</span>}
                </div>
              </div>
            </div>
          )
        })}
        {decisions.length > 8 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: 0, letterSpacing: '0.08em' }}>
            +{decisions.length - 8} more decisions
          </p>
        )}
      </div>
    </div>
  )
}

export function MarketingData({ data }) {
  const decisions = data?.decisions || []
  const ACTION_COLOR = {
    hold:            'rgba(242,237,228,0.4)',
    pause:           '#ef4444',
    activate:        '#22c55e',
    increase_budget: '#22c55e',
    decrease_budget: '#f97316',
  }

  return (
    <div>
      {/* Summary counts */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          { label: 'Campaigns', val: decisions.length,              color: 'rgba(242,237,228,0.5)' },
          { label: 'Executed',  val: data?.auto_executed_count ?? 0, color: '#22c55e' },
          { label: 'Pending',   val: data?.pending_count ?? 0,      color: GOLD },
          { label: 'Paused',    val: data?.paused_count ?? 0,       color: '#ef4444' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)',
            padding: '4px 10px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color, fontWeight: 600 }}>{val}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', color: 'rgba(242,237,228,0.3)', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {decisions.filter(d => d.action !== 'hold').slice(0, 6).map((d, i) => {
          const aColor = ACTION_COLOR[d.action] || GOLD
          return (
            <div key={i} style={{
              background: '#0d0d0d', border: `1px solid ${aColor}22`,
              padding: '7px 10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                {badge(d.action.replace('_', ' '), aColor)}
                {d.matched_sku && badge(d.matched_sku, GOLD)}
                {d.executed && badge('done', '#22c55e')}
                {!d.auto_execute && badge('approval needed', '#a78bfa')}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.55)', marginBottom: 2 }}>
                <span style={{ color: 'rgba(242,237,228,0.3)' }}>Campaign: </span>
                <span>{d.campaign_name?.slice(0, 48)}{d.campaign_name?.length > 48 ? '…' : ''}</span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.45)', display: 'flex', gap: 12 }}>
                {d.roas_7d != null && <span>ROAS <strong style={{ color: d.roas_7d >= 2 ? '#22c55e' : '#ef4444' }}>{d.roas_7d?.toFixed(2)}x</strong></span>}
                {d.spend_7d_pkr > 0 && <span>Spend <strong style={{ color: 'rgba(242,237,228,0.7)' }}>PKR {d.spend_7d_pkr?.toLocaleString()}</strong></span>}
                {d.change_pct !== 0 && (
                  <span>Budget <strong style={{ color: aColor }}>{d.change_pct > 0 ? '+' : ''}{d.change_pct?.toFixed(0)}%</strong></span>
                )}
              </div>
            </div>
          )
        })}
        {decisions.filter(d => d.action !== 'hold').length === 0 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'rgba(242,237,228,0.3)', margin: 0 }}>All campaigns held — no changes needed.</p>
        )}
        {decisions.filter(d => d.action !== 'hold').length > 6 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: 0, letterSpacing: '0.08em' }}>
            +{decisions.filter(d => d.action !== 'hold').length - 6} more actions
          </p>
        )}
        {decisions.filter(d => d.action === 'hold').length > 0 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.25)', margin: '4px 0 0', letterSpacing: '0.06em' }}>
            {decisions.filter(d => d.action === 'hold').length} campaigns held (no change)
          </p>
        )}
      </div>
    </div>
  )
}

export function ContentData({ data }) {
  const posts        = data?.posts || []
  const prioritySkus = data?.priority_today_skus || []
  const fatigue      = data?.fatigue_skips || []

  return (
    <div>
      {/* Priority SKUs */}
      {prioritySkus.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: 5 }}>
            Film today · {prioritySkus.length} SKUs
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {prioritySkus.map((sku, i) => (
              <span key={i} style={{
                fontFamily: "'Inter', sans-serif", fontSize: '0.63rem',
                color: GOLD, background: GOLD_DIM, border: `1px solid ${GOLD}33`,
                padding: '2px 8px',
              }}>{sku}</span>
            ))}
          </div>
          <Divider />
        </div>
      )}

      {/* Content posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {posts.slice(0, 4).map((p, i) => (
          <div key={i} style={{
            background: '#0d0d0d', border: '1px solid rgba(96,165,250,0.15)',
            padding: '8px 10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {p.is_urgent && badge('urgent', '#ef4444')}
              {p.content_angle && badge(p.content_angle, '#60a5fa')}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: '#F2EDE4', fontWeight: 500, marginBottom: 4 }}>
              {p.sku}
            </div>
            {p.instagram?.caption && (
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.55rem', letterSpacing: '0.1em', color: '#E1306C', textTransform: 'uppercase', marginBottom: 2 }}>Instagram</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.55)', margin: 0, lineHeight: 1.5 }}>
                  {p.instagram.caption.length > 120 ? p.instagram.caption.slice(0, 117) + '…' : p.instagram.caption}
                </p>
              </div>
            )}
            {p.tiktok?.hook && (
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.55rem', letterSpacing: '0.1em', color: '#69C9D0', textTransform: 'uppercase', marginBottom: 2 }}>TikTok hook</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.63rem', color: 'rgba(242,237,228,0.55)', margin: 0, lineHeight: 1.5 }}>
                  {p.tiktok.hook.length > 80 ? p.tiktok.hook.slice(0, 77) + '…' : p.tiktok.hook}
                </p>
              </div>
            )}
          </div>
        ))}
        {posts.length > 4 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: 0, letterSpacing: '0.08em' }}>
            +{posts.length - 4} more posts
          </p>
        )}
        {fatigue.length > 0 && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(242,237,228,0.25)', margin: '4px 0 0', letterSpacing: '0.06em' }}>
            {fatigue.length} SKU{fatigue.length > 1 ? 's' : ''} skipped (content fatigue)
          </p>
        )}
      </div>
    </div>
  )
}