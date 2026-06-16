import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'

function Tab({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${active ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
    >
      {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  )
}

function PricingCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)

  const act = async (fn) => {
    setLoading(true)
    try { await fn() } finally { setLoading(false) }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.sku}</span>
            <Badge level="pending" />
          </div>
          <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="text-gray-400">PKR {rec.current_price?.toFixed(0)}</div>
          <div className="text-white font-medium">→ PKR {rec.recommended_price?.toFixed(0)}</div>
          <div className="text-yellow-400">{rec.discount_pct?.toFixed(0)}% off</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => act(onApprove)}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50
                     text-white text-xs py-1.5 rounded-lg transition-all"
        >
          Approve → Apply on Shopify
        </button>
        <button
          onClick={() => act(onReject)}
          disabled={loading}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50
                     text-gray-300 text-xs py-1.5 rounded-lg transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function RestockCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const [supplierNum, setSupplierNum] = useState('')

  const act = async (fn) => {
    setLoading(true)
    try { await fn() } finally { setLoading(false) }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.sku}</span>
            <Badge level={rec.urgency} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="text-white font-medium">{rec.recommended_quantity} units</div>
          <div className="text-gray-400">{rec.days_of_stock_remaining?.toFixed(1)} days left</div>
          <div className="text-gray-400">{rec.units_per_day?.toFixed(1)}/day</div>
        </div>
      </div>

      {rec.supplier_message && (
        <div className="bg-black/30 rounded-lg p-2 mb-3 text-xs text-gray-400 line-clamp-3">
          {rec.supplier_message}
        </div>
      )}

      <input
        value={supplierNum}
        onChange={e => setSupplierNum(e.target.value)}
        placeholder="Supplier WhatsApp (923001234567) — optional"
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5
                   text-xs text-gray-300 placeholder-gray-600 mb-2 outline-none
                   focus:border-purple-500"
      />

      <div className="flex gap-2">
        <button
          onClick={() => act(() => onApprove(supplierNum || null))}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50
                     text-white text-xs py-1.5 rounded-lg transition-all"
        >
          Approve {supplierNum ? '+ Send WhatsApp' : ''}
        </button>
        <button
          onClick={() => act(onReject)}
          disabled={loading}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50
                     text-gray-300 text-xs py-1.5 rounded-lg transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function MarketingCard({ rec, onApprove, onReject }) {
  const [loading, setLoading] = useState(false)
  const act = async (fn) => {
    setLoading(true)
    try { await fn() } finally { setLoading(false) }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{rec.campaign_name}</span>
            <Badge level="pending" />
          </div>
          {rec.sku && <span className="text-xs text-gray-500">SKU: {rec.sku}</span>}
          <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
        </div>
        <div className="text-right text-xs">
          <div className="text-gray-400 capitalize">{rec.action?.replace('_', ' ')}</div>
          {rec.new_budget_pkr && (
            <div className="text-white font-medium">PKR {rec.new_budget_pkr?.toFixed(0)}/day</div>
          )}
          {rec.change_pct !== 0 && (
            <div className={rec.change_pct > 0 ? 'text-green-400' : 'text-red-400'}>
              {rec.change_pct > 0 ? '+' : ''}{rec.change_pct?.toFixed(0)}%
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => act(onApprove)}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50
                     text-white text-xs py-1.5 rounded-lg transition-all"
        >
          Approve → Apply on Meta
        </button>
        <button
          onClick={() => act(onReject)}
          disabled={loading}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50
                     text-gray-300 text-xs py-1.5 rounded-lg transition-all"
        >
          Reject
        </button>
      </div>
    </div>
  )
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
    setPricing(p); setRestock(r); setMarketing(m)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const remove = (setter, id) => setter(prev => prev.filter(r => r.id !== id))

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white">Approvals</h1>

      <div className="flex gap-2">
        <Tab label="Pricing"   active={tab === 'pricing'}   count={pricing.length}   onClick={() => setTab('pricing')} />
        <Tab label="Restock"   active={tab === 'restock'}   count={restock.length}   onClick={() => setTab('restock')} />
        <Tab label="Marketing" active={tab === 'marketing'} count={marketing.length} onClick={() => setTab('marketing')} />
      </div>

      <div className="space-y-3">
        {tab === 'pricing' && pricing.map(rec => (
          <PricingCard
            key={rec.id} rec={rec}
            onApprove={async () => {
              await api.patch(`/api/v1/pricing/${rec.id}/approve`)
              remove(setPricing, rec.id)
            }}
            onReject={async () => {
              await api.patch(`/api/v1/pricing/${rec.id}/reject`)
              remove(setPricing, rec.id)
            }}
          />
        ))}

        {tab === 'restock' && restock.map(rec => (
          <RestockCard
            key={rec.id} rec={rec}
            onApprove={async (supplierNum) => {
              await api.patch(`/api/v1/restock/${rec.id}/approve`,
                supplierNum ? { supplier_whatsapp: supplierNum } : {}
              )
              remove(setRestock, rec.id)
            }}
            onReject={async () => {
              await api.patch(`/api/v1/restock/${rec.id}/reject`)
              remove(setRestock, rec.id)
            }}
          />
        ))}

        {tab === 'marketing' && marketing.map(rec => (
          <MarketingCard
            key={rec.id} rec={rec}
            onApprove={async () => {
              await api.patch(`/api/v1/marketing/${rec.id}/approve`)
              remove(setMarketing, rec.id)
            }}
            onReject={async () => {
              await api.patch(`/api/v1/marketing/${rec.id}/reject`)
              remove(setMarketing, rec.id)
            }}
          />
        ))}

        {(tab === 'pricing' && pricing.length === 0) && <Empty text="No pending pricing decisions" />}
        {(tab === 'restock' && restock.length === 0) && <Empty text="No pending restock orders" />}
        {(tab === 'marketing' && marketing.length === 0) && <Empty text="No pending marketing decisions" />}
      </div>
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="text-center py-12 text-gray-600 text-sm">{text}</div>
  )
}

