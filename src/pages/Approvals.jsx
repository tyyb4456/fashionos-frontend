import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'

const approveStyle = {
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white', border: 'none',
}

function Tab({ label, active, count, onClick }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
      style={active ? {
        background: 'var(--active-nav)',
        color: '#4CA1AF', border: '1px solid var(--card-border)',
      } : { color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
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
        style={{ background: 'var(--reject-bg)', color: 'var(--reject-text)', border: '1px solid var(--reject-border)' }}>
        Reject
      </button>
    </div>
  )
}

function PricingCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const act = async fn => { setLoading(true); try { await fn() } finally { setLoading(false) } }
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rec.sku}</span>
            <Badge level="pending" />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div style={{ color: 'var(--text-secondary)' }}>PKR {rec.current_price?.toFixed(0)}</div>
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>→ PKR {rec.recommended_price?.toFixed(0)}</div>
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
  const inputS = {
    width: '100%', background: 'var(--input-bg)',
    border: '1px solid var(--input-border)', borderRadius: '10px',
    padding: '6px 12px', fontSize: '0.7rem', color: 'var(--text-body)', outline: 'none',
  }
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px' }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rec.sku}</span>
            <Badge level={rec.urgency} />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{rec.recommended_quantity} units</div>
          <div style={{ color: 'var(--text-secondary)' }}>{rec.days_of_stock_remaining?.toFixed(1)} days left</div>
          <div style={{ color: 'var(--text-secondary)' }}>{rec.units_per_day?.toFixed(1)}/day</div>
        </div>
      </div>
      {rec.supplier_message && (
        <div className="rounded-xl p-2 mb-3 text-xs line-clamp-3"
          style={{ background: 'var(--inner-bg)', color: 'var(--text-secondary)' }}>
          {rec.supplier_message}
        </div>
      )}
      <input value={supplierNum} onChange={e => setSupplierNum(e.target.value)}
        placeholder="Supplier WhatsApp (923001234567) — optional"
        style={inputS} className="mb-2"
        onFocus={e => e.target.style.borderColor = '#4CA1AF'}
        onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
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
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rec.campaign_name}</span>
            <Badge level="pending" />
          </div>
          {rec.sku && <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>SKU: {rec.sku}</span>}
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="capitalize" style={{ color: 'var(--text-secondary)' }}>{rec.action?.replace('_', ' ')}</div>
          {rec.new_budget_pkr && (
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>PKR {rec.new_budget_pkr?.toFixed(0)}/day</div>
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
  return <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>{text}</div>
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
      <h1 className="text-2xl" style={{ fontFamily: "'Fascinate Inline', cursive", color: 'var(--text-primary)' }}>Approvals</h1>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
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