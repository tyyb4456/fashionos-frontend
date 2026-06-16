import { useEffect, useState } from 'react'
import { useApi } from '../api/client'
import Badge from '../components/Badge'
import { Video, Clock } from 'lucide-react'
import { SiInstagram } from '@icons-pack/react-simple-icons'

export default function Content() {
  const api = useApi()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/api/v1/content/queue?status=pending')
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/api/v1/content/${id}/status`, { new_status: status })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white">Content Queue</h1>
      <p className="text-xs text-gray-500">
        {posts.filter(p => p.is_urgent).length} urgent · {posts.length} total pending
      </p>

      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className={`border rounded-xl overflow-hidden transition-all
            ${post.is_urgent ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/10 bg-white/5'}`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpanded(expanded === post.id ? null : post.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{post.product_title}</span>
                    {post.is_urgent && <Badge level="warning" />}
                    <span className="text-xs text-gray-500">{post.sku}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <SiInstagram size={10} /> {post.instagram_post_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video size={10} /> {post.tiktok_post_time}
                    </span>
                  </div>
                  {post.sale_mention && (
                    <span className="text-xs text-green-400 mt-1 block">{post.sale_mention}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{expanded === post.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === post.id && (
              <div className="border-t border-white/10 p-4 space-y-4">
                {/* Instagram */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <SiInstagram size={12} className="text-pink-400" />
                    <span className="text-xs font-medium text-pink-400">Instagram Caption</span>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap bg-black/30 rounded-lg p-3">
                    {post.instagram_caption}
                  </p>
                  {post.instagram_hashtags && (
                    <p className="text-xs text-purple-400 mt-2">
                      #{post.instagram_hashtags.slice(0, 10).join(' #')}
                    </p>
                  )}
                </div>

                {/* TikTok */}
                {post.tiktok_script && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video size={12} className="text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-400">TikTok Script</span>
                    </div>
                    <div className="space-y-2 bg-black/30 rounded-lg p-3 text-xs text-gray-300">
                      <p><span className="text-gray-500">Hook:</span> {post.tiktok_script.hook}</p>
                      <p><span className="text-gray-500">Context:</span> {post.tiktok_script.context}</p>
                      <p><span className="text-gray-500">Reveal:</span> {post.tiktok_script.reveal}</p>
                      <p><span className="text-gray-500">CTA:</span> {post.tiktok_script.cta}</p>
                    </div>
                  </div>
                )}

                {/* Creator notes */}
                {post.creator_notes && (
                  <div>
                    <span className="text-xs text-gray-500">📋 Creator Notes</span>
                    <p className="text-xs text-gray-400 mt-1">{post.creator_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateStatus(post.id, 'posted')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-lg"
                  >
                    Mark as Posted
                  </button>
                  <button
                    onClick={() => updateStatus(post.id, 'skipped')}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-gray-300 text-xs py-1.5 rounded-lg"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">No content pending</div>
        )}
      </div>
    </div>
  )
}