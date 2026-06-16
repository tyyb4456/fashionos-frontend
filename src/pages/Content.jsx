import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'
import { Video } from 'lucide-react'
import { SiInstagram } from '@icons-pack/react-simple-icons'

export default function Content() {
  const api = useApi()
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/api/v1/content/queue?status=pending').then(setPosts).catch(console.error).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/api/v1/content/${id}/status`, { new_status: status })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(76,161,175,0.25)', borderTopColor: '#4CA1AF' }} />
    </div>
  )

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl text-white" style={{ fontFamily: "'Grape Nuts', cursive" }}>Content Queue</h1>
      <p className="text-xs" style={{ color: '#7a9ab5' }}>
        {posts.filter(p => p.is_urgent).length} urgent · {posts.length} total pending
      </p>
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="rounded-2xl overflow-hidden transition-all"
            style={{
              border: post.is_urgent ? '1px solid rgba(251,146,60,0.3)' : '1px solid rgba(76,161,175,0.15)',
              background: post.is_urgent ? 'rgba(251,146,60,0.05)' : 'rgba(44,62,80,0.35)',
            }}>
            <div className="p-4 cursor-pointer"
              onClick={() => setExpanded(expanded === post.id ? null : post.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{post.product_title}</span>
                    {post.is_urgent && <Badge level="warning" />}
                    <span className="text-xs" style={{ color: '#7a9ab5' }}>{post.sku}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#7a9ab5' }}>
                    <span className="flex items-center gap-1"><SiInstagram size={10} /> {post.instagram_post_time}</span>
                    <span className="flex items-center gap-1"><Video size={10} /> {post.tiktok_post_time}</span>
                  </div>
                  {post.sale_mention && (
                    <span className="text-xs mt-1 block" style={{ color: '#4ade80' }}>{post.sale_mention}</span>
                  )}
                </div>
                <span className="text-xs" style={{ color: '#7a9ab5' }}>{expanded === post.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === post.id && (
              <div className="p-4 space-y-4" style={{ borderTop: '1px solid rgba(76,161,175,0.1)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <SiInstagram size={12} style={{ color: '#f472b6' }} />
                    <span className="text-xs font-medium" style={{ color: '#f472b6' }}>Instagram Caption</span>
                  </div>
                  <p className="text-xs whitespace-pre-wrap rounded-xl p-3"
                    style={{ background: 'rgba(0,0,0,0.25)', color: '#b0ccd4' }}>
                    {post.instagram_caption}
                  </p>
                  {post.instagram_hashtags && (
                    <p className="text-xs mt-2" style={{ color: '#4CA1AF' }}>
                      #{post.instagram_hashtags.slice(0, 10).join(' #')}
                    </p>
                  )}
                </div>

                {post.tiktok_script && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video size={12} style={{ color: '#22d3ee' }} />
                      <span className="text-xs font-medium" style={{ color: '#22d3ee' }}>TikTok Script</span>
                    </div>
                    <div className="rounded-xl p-3 text-xs space-y-2"
                      style={{ background: 'rgba(0,0,0,0.25)', color: '#b0ccd4' }}>
                      <p><span style={{ color: '#7a9ab5' }}>Hook:</span> {post.tiktok_script.hook}</p>
                      <p><span style={{ color: '#7a9ab5' }}>Context:</span> {post.tiktok_script.context}</p>
                      <p><span style={{ color: '#7a9ab5' }}>Reveal:</span> {post.tiktok_script.reveal}</p>
                      <p><span style={{ color: '#7a9ab5' }}>CTA:</span> {post.tiktok_script.cta}</p>
                    </div>
                  </div>
                )}

                {post.creator_notes && (
                  <div>
                    <span className="text-xs" style={{ color: '#7a9ab5' }}>📋 Creator Notes</span>
                    <p className="text-xs mt-1" style={{ color: '#8ba5b8' }}>{post.creator_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button onClick={() => updateStatus(post.id, 'posted')}
                    className="flex-1 text-white text-xs py-1.5 rounded-xl transition-all hover:opacity-85"
                    style={{ background: 'linear-gradient(135deg, #166534, #22c55e)' }}>
                    Mark as Posted
                  </button>
                  <button onClick={() => updateStatus(post.id, 'skipped')}
                    className="flex-1 text-xs py-1.5 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: '#4a6070' }}>No content pending</div>
        )}
      </div>
    </div>
  )
}