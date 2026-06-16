import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'

const cardS = {
  background: 'rgba(44,62,80,0.4)',
  border: '1px solid rgba(76,161,175,0.15)',
  borderRadius: '16px',
  padding: '16px',
}

const approveStyle = {
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white', border: 'none',
}
const rejectStyle = {
  background: 'rgba(255,255,255,0.07)',
  color: '#94a3b8',
  border: '1px solid rgba(255,255,255,0.1)',
}
const inputS = {
  width: '100%', background: 'rgba(0,0,0,0.25)',
  border: '1px solid rgba(76,161,175,0.18)', borderRadius: '10px',
  padding: '6px 12px', fontSize: '0.7rem', color: '#b0ccd4', outline: 'none',
}

function Tab({ label, active, count, onClick }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
      style={active ? {
        background: 'linear-gradient(120deg, rgba(44,62,80,0.7), rgba(76,161,175,0.22))',
        color: '#4CA1AF', border: '1px solid rgba(76,161,175,0.3)',
      } : { color: '#7a9ab5', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {label} {count > 0 && <span className="ml-1 opacity-70 text-xs">({count})</span>}
    </button>
  )
}

function ActionBtns({ onApprove, onReject, approveLabel, loading }) {
  return (
    <div className="flex gap-2">
      <button onClick={onApprove} disabled={loading}
        className="flex-1 text-xs py-1.5 rounded-xl transition-all disabled:opacity-50 hover:opacity-85"
        style={approveStyle}>{approveLabel}</button>
      <button onClick={onReject} disabled={loading}
        className="flex-1 text-xs py-1.5 rounded-xl transition-all disabled:opacity-50"
        style={rejectStyle}>Reject</button>
    </div>
  )
}

function PricingCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const act = async fn => { setLoading(true); try { await fn() } finally { setLoading(false) } }
  return (
    <div style={cardS}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.sku}</span>
            <Badge level="pending" />
          </div>
          <p className="text-xs mt-1" style={{ color: '#7a9ab5' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div style={{ color: '#7a9ab5' }}>PKR {rec.current_price?.toFixed(0)}</div>
          <div className="text-white font-medium">→ PKR {rec.recommended_price?.toFixed(0)}</div>
          <div style={{ color: '#facc15' }}>{rec.discount_pct?.toFixed(0)}% off</div>
        </div>
      </div>
      <ActionBtns onApprove={() => act(onApprove)} onReject={() => act(onReject)}
        approveLabel="Approve → Apply on Shopify" loading={loading} />
    </div>
  )
}

function RestockCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const [supplierNum, setSupplierNum] = useState('')
  const act = async fn => { setLoading(true); try { await fn() } finally { setLoading(false) } }
  return (
    <div style={cardS}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.sku}</span>
            <Badge level={rec.urgency} />
          </div>
          <p className="text-xs mt-1" style={{ color: '#7a9ab5' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="text-white font-medium">{rec.recommended_quantity} units</div>
          <div style={{ color: '#7a9ab5' }}>{rec.days_of_stock_remaining?.toFixed(1)} days left</div>
          <div style={{ color: '#7a9ab5' }}>{rec.units_per_day?.toFixed(1)}/day</div>
        </div>
      </div>
      {rec.supplier_message && (
        <div className="rounded-xl p-2 mb-3 text-xs line-clamp-3"
          style={{ background: 'rgba(0,0,0,0.2)', color: '#7a9ab5' }}>
          {rec.supplier_message}
        </div>
      )}
      <input value={supplierNum} onChange={e => setSupplierNum(e.target.value)}
        placeholder="Supplier WhatsApp (923001234567) — optional"
        style={inputS} className="mb-2"
        onFocus={e => e.target.style.borderColor = '#4CA1AF'}
        onBlur={e => e.target.style.borderColor = 'rgba(76,161,175,0.18)'}
      />
      <ActionBtns
        onApprove={() => act(() => onApprove(supplierNum || null))}
        onReject={() => act(onReject)}
        approveLabel={`Approve${supplierNum ? ' + Send WhatsApp' : ''}`}
        loading={loading}
      />
    </div>
  )
}

function MarketingCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const act = async fn => { setLoading(true); try { await fn() } finally { setLoading(false) } }
  return (
    <div style={cardS}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.campaign_name}</span>
            <Badge level="pending" />
          </div>
          {rec.sku && <span className="text-xs" style={{ color: '#7a9ab5' }}>SKU: {rec.sku}</span>}
          <p className="text-xs mt-1" style={{ color: '#7a9ab5' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="capitalize" style={{ color: '#7a9ab5' }}>{rec.action?.replace('_', ' ')}</div>
          {rec.new_budget_pkr && (
            <div className="text-white font-medium">PKR {rec.new_budget_pkr?.toFixed(0)}/day</div>
          )}
          {rec.change_pct !== 0 && (
            <div style={{ color: rec.change_pct > 0 ? '#4ade80' : '#f87171' }}>
              {rec.change_pct > 0 ? '+' : ''}{rec.change_pct?.toFixed(0)}%
            </div>
          )}
        </div>
      </div>
      <ActionBtns onApprove={() => act(onApprove)} onReject={() => act(onReject)}
        approveLabel="Approve → Apply on Meta" loading={loading} />
    </div>
  )
}

function Empty({ text }) {
  return <div className="text-center py-12 text-sm" style={{ color: '#4a6070' }}>{text}</div>
}

export default function Approvals() {
  const api = useApi()
  const [tab, setTab]             = useState('pricing')
  const [pricing, setPricing]     = useState([])
  const [restock, setRestock]     = useState([])
  const [marketing, setMarketing] = useState([])
  const [loading, setLoading]     = useState(true)

  const load = async () => {
    setLoading(true)
    const [p, r, m] = await Promise.all([
      api.get('/api/v1/pricing/pending'),
      api.get('/api/v1/restock/pending'),
      api.get('/api/v1/marketing/pending'),
    ])
    setPricing(p); setRestock(r); setMarketing(m); setLoading(false)
  }
  useEffect(() => { load() }, [])
  const remove = (setter, id) => setter(prev => prev.filter(r => r.id !== id))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(76,161,175,0.25)', borderTopColor: '#4CA1AF' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl text-white" style={{ fontFamily: "'Grape Nuts', cursive" }}>Approvals</h1>
      <div className="flex gap-2">
        <Tab label="Pricing"   active={tab === 'pricing'}   count={pricing.length}   onClick={() => setTab('pricing')} />
        <Tab label="Restock"   active={tab === 'restock'}   count={restock.length}   onClick={() => setTab('restock')} />
        <Tab label="Marketing" active={tab === 'marketing'} count={marketing.length} onClick={() => setTab('marketing')} />
      </div>
      <div className="space-y-3">
        {tab === 'pricing'   && pricing.map(rec => (
          <PricingCard key={rec.id} rec={rec}
            onApprove={async () => { await api.patch(`/api/v1/pricing/${rec.id}/approve`);  remove(setPricing,  rec.id) }}
            onReject={async  () => { await api.patch(`/api/v1/pricing/${rec.id}/reject`);   remove(setPricing,  rec.id) }} />
        ))}
        {tab === 'restock'   && restock.map(rec => (
          <RestockCard key={rec.id} rec={rec}
            onApprove={async n  => { await api.patch(`/api/v1/restock/${rec.id}/approve`, n ? { supplier_whatsapp: n } : {}); remove(setRestock, rec.id) }}
            onReject={async    () => { await api.patch(`/api/v1/restock/${rec.id}/reject`);   remove(setRestock,  rec.id) }} />
        ))}
        {tab === 'marketing' && marketing.map(rec => (
          <MarketingCard key={rec.id} rec={rec}
            onApprove={async () => { await api.patch(`/api/v1/marketing/${rec.id}/approve`); remove(setMarketing, rec.id) }}
            onReject={async  () => { await api.patch(`/api/v1/marketing/${rec.id}/reject`);  remove(setMarketing, rec.id) }} />
        ))}
        {tab === 'pricing'   && pricing.length   === 0 && <Empty text="No pending pricing decisions" />}
        {tab === 'restock'   && restock.length   === 0 && <Empty text="No pending restock orders" />}
        {tab === 'marketing' && marketing.length === 0 && <Empty text="No pending marketing decisions" />}
      </div>
    </div>
  )
}