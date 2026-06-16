import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import { useSearchParams } from 'react-router-dom'
import { Check, ExternalLink, Trash2 } from 'lucide-react'

function ConnectCard({ title, connected, onConnect, onDisconnect, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {connected
          ? <span className="text-xs text-green-400 flex items-center gap-1"><Check size={10} /> Connected</span>
          : <span className="text-xs text-gray-500">Not connected</span>
        }
      </div>

      {children}

      <div className="flex gap-2">
        {!connected
          ? <button onClick={onConnect}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700
                         text-white text-xs px-4 py-2 rounded-lg transition-all">
              <ExternalLink size={12} /> Connect
            </button>
          : <button onClick={onDisconnect}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30
                         text-red-400 text-xs px-4 py-2 rounded-lg transition-all">
              <Trash2 size={12} /> Disconnect
            </button>
        }
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                   text-sm text-gray-300 placeholder-gray-600 outline-none
                   focus:border-purple-500 transition-all"
      />
    </div>
  )
}

export default function Settings() {
  const api                         = useApi()
  const [searchParams]              = useSearchParams()
  const [brand, setBrand]           = useState(null)
  const [shopInput, setShopInput]   = useState('')
  const [form, setForm]             = useState({})
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.get('/api/v1/brands/me')
      .then(b => { setBrand(b); setForm({ brand_name: b.brand_name, brand_owner_whatsapp: b.brand_owner_whatsapp || '', brand_owner_email: b.brand_owner_email || '' }) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Show toast if redirected back from OAuth
  useEffect(() => {
    if (searchParams.get('shopify') === 'connected') {
      setBrand(b => b ? { ...b, shopify_connected: true } : b)
    }
    if (searchParams.get('meta') === 'connected') {
      setBrand(b => b ? { ...b, meta_connected: true, instagram_connected: true } : b)
    }
  }, [searchParams])

  const connectShopify = async () => {
    if (!shopInput.trim()) return alert('Enter your shop name first.')
    const { url } = await api.get(`/api/v1/oauth/shopify/start?shop=${shopInput.trim()}`)
    window.location.href = url
  }

  const connectMeta = async () => {
    const { url } = await api.get('/api/v1/oauth/meta/start')
    window.location.href = url
  }

  const disconnectShopify = async () => {
    if (!confirm('Disconnect Shopify? Agents will stop working until reconnected.')) return
    await api.del('/api/v1/brands/me/shopify')
    setBrand(b => ({ ...b, shopify_connected: false }))
  }

  const disconnectMeta = async () => {
    if (!confirm('Disconnect Meta? Ad management and Instagram DMs will stop.')) return
    await api.del('/api/v1/brands/me/meta')
    setBrand(b => ({ ...b, meta_connected: false, instagram_connected: false }))
  }

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      const updated = await api.put('/api/v1/brands/me', form)
      setBrand(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        {brand && (
          <p className="text-xs text-gray-500 mt-0.5">
            {brand.owner_email} · {brand.plan} plan
          </p>
        )}
      </div>

      {/* OAuth success banners */}
      {searchParams.get('shopify') === 'connected' && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400">
          ✓ Shopify connected successfully. Webhooks registered automatically.
        </div>
      )}
      {searchParams.get('meta') === 'connected' && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400">
          ✓ Meta connected. Ad account and Instagram page detected automatically.
        </div>
      )}

      {/* Brand Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Brand Info</h2>
        <Field label="Brand Name"                   name="brand_name"           value={form.brand_name || ''}           onChange={onChange} />
        <Field label="Owner WhatsApp (for alerts)"  name="brand_owner_whatsapp" value={form.brand_owner_whatsapp || ''} onChange={onChange} placeholder="923001234567" />
        <Field label="Owner Email (for digests)"    name="brand_owner_email"    value={form.brand_owner_email || ''}    onChange={onChange} placeholder="you@example.com" />
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50
                       text-white text-sm px-5 py-2 rounded-lg transition-all">
            {saving ? 'Saving...' : 'Save'}
          </button>
          {saved && <span className="text-xs text-green-400 flex items-center gap-1"><Check size={10} /> Saved</span>}
        </div>
      </div>

      {/* Shopify OAuth */}
      <ConnectCard
        title="Shopify"
        connected={brand?.shopify_connected}
        onConnect={connectShopify}
        onDisconnect={disconnectShopify}
      >
        {!brand?.shopify_connected && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Shop name</label>
            <input
              value={shopInput}
              onChange={e => setShopInput(e.target.value)}
              placeholder="mybrand (without .myshopify.com)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2
                         text-sm text-gray-300 placeholder-gray-600 outline-none
                         focus:border-purple-500 transition-all"
            />
          </div>
        )}
        {brand?.shopify_connected && (
          <p className="text-xs text-gray-400">
            Products, orders, inventory and webhooks are syncing automatically.
          </p>
        )}
      </ConnectCard>

      {/* Meta OAuth */}
      <ConnectCard
        title="Meta (Facebook Ads + Instagram)"
        connected={brand?.meta_connected}
        onConnect={connectMeta}
        onDisconnect={disconnectMeta}
      >
        {brand?.meta_connected ? (
          <div className="space-y-1">
            {brand.meta_ad_account_id && (
              <p className="text-xs text-gray-400">Ad Account: <span className="text-gray-300">{brand.meta_ad_account_id}</span></p>
            )}
            {brand.instagram_page_id && (
              <p className="text-xs text-gray-400">Instagram Page: <span className="text-gray-300">{brand.instagram_page_id}</span></p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Connects Facebook Ads, Instagram DMs, and ad management in one click.
          </p>
        )}
      </ConnectCard>
    </div>
  )
}