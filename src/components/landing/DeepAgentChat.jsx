import { useState, useEffect } from 'react'
import { Brain, Database, RefreshCw, Package, TrendingUp, DollarSign, Megaphone } from 'lucide-react'

// Simulated conversation that showcases the deep agent's real capabilities
const DEMO_MESSAGES = [
  {
    role: 'user',
    text: "What's the inventory situation on our co-ord sets right now?",
  },
  {
    role: 'assistant',
    tool: 'get_inventory_status()',
    text: "Checking your live Shopify inventory...\n\n📦 **Co-ord Set — Beige Linen (S/M):** 3 units left · 1.8 units/day · **1.7 days of stock — CRITICAL**\n\n📦 **Co-ord Set — Olive (M/L):** 12 units · 0.9/day · 13 days — HIGH\n\n📦 **Co-ord Set — White (S):** 47 units · 0.4/day · 117 days — healthy\n\nThe Beige Linen S/M is going to stock out tonight. I've already raised a restock alert and it's in your Approvals queue. Want me to run the trend agent to see if the demand spike is from a TikTok trend?",
  },
  {
    role: 'user',
    text: 'Yes, and also check if our Meta ads are still running for it.',
  },
  {
    role: 'assistant',
    tool: 'trend-agent + marketing-agent',
    text: "Running live subagents...\n\n📈 **Trend:** #CoordSet is peaking on TikTok PK — 340k views across 15 posts this week. Strong signal. This explains the velocity spike.\n\n📢 **Marketing:** Your \"Linen Co-ord Summer\" campaign is active at ₨800/day. With only 3 units left, I'd recommend pausing it immediately to avoid wasting budget on a stockout. I've added a **pause recommendation to your Approvals queue** — one tap to confirm.\n\nAlso noting this in your brand memory for future reference.",
  },
]

const SUBAGENT_LABELS = [
  { icon: Database,    label: 'DB tools',        color: '#ADDFF1' },
  { icon: Package,     label: 'inventory-agent', color: '#96BF48' },
  { icon: TrendingUp,  label: 'trend-agent',     color: '#00C4B4' },
  { icon: DollarSign,  label: 'pricing-agent',   color: '#ADDFF1' },
  { icon: Megaphone,   label: 'marketing-agent', color: '#0082FB' },
  { icon: RefreshCw,   label: 'restock-agent',   color: '#9dd6ed' },
]

export default function DeepAgentChat() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Cycle through messages every few seconds
  useEffect(() => {
    if (visibleMessages >= DEMO_MESSAGES.length) return
    const delay = visibleMessages === 0 ? 800 : 1800
    const timer = setTimeout(() => {
      const msg = DEMO_MESSAGES[visibleMessages]
      if (msg.role === 'assistant') {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages(v => v + 1)
        }, 1200)
      } else {
        setVisibleMessages(v => v + 1)
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [visibleMessages])

  return (
    <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div className="section-label" style={{ margin: '0 auto 14px' }}>
          <Brain size={11} />
          Deep Agent Chat
        </div>
        <h2 style={{
          fontFamily: "'Alfa Slab One', serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: 'var(--text-primary)',
          margin: 0, lineHeight: 1.2,
        }}>
          Ask anything. Get answers.
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 540, margin: '12px auto 0', lineHeight: 1.7 }}>
          The FashionOS deep agent supervisor has long-term brand memory, access to all
          pipeline data, and can spawn live Shopify and Meta subagents on demand — all in a chat interface.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Chat window */}
        <div style={{
          borderRadius: 20,
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
        }}>
          {/* Window chrome */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--subtle-bg)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <Brain size={13} color="#ADDFF1" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                FashionOS Supervisor — brand memory loaded
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="live-dot" />
              <span style={{ fontSize: '0.7rem', color: '#ADDFF1' }}>live</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 380 }}>
            {DEMO_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 10, alignItems: 'flex-start',
                  animation: 'slide-up 0.4s ease both',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user'
                    ? 'var(--subtle-bg)'
                    : 'linear-gradient(135deg, #003152, #ADDFF1)',
                  border: '1px solid var(--subtle-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: msg.role === 'user' ? 'var(--text-secondary)' : '#fff',
                }}>
                  {msg.role === 'user' ? '👤' : <Brain size={13} />}
                </div>

                <div style={{ maxWidth: '80%' }}>
                  {/* Tool call badge */}
                  {msg.tool && (
                    <div style={{
                      fontSize: '0.62rem', padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(173,223,241,0.08)', border: '1px solid rgba(173,223,241,0.2)',
                      color: '#ADDFF1', fontFamily: 'monospace', marginBottom: 5,
                      display: 'inline-block',
                    }}>
                      ↳ {msg.tool}
                    </div>
                  )}
                  {/* Bubble */}
                  <div style={{
                    padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? 'var(--subtle-bg)' : 'var(--inner-bg)',
                    border: `1px solid ${msg.role === 'user' ? 'var(--subtle-border)' : 'var(--item-border)'}`,
                    fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'slide-up 0.3s ease both' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #003152, #ADDFF1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Brain size={13} color="#fff" />
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                  background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#ADDFF1',
                      animation: `pulse-dot 1.2s ease ${j * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side — capabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Memory card */}
          <div style={{
            padding: '18px 20px', borderRadius: 14,
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Brain size={14} color="#ADDFF1" />
              <span style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Long-term Memory
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Brand identity, owner preferences, pricing rules, supplier notes, and past decisions persist across all conversations in Redis — per brand, fully isolated.
            </p>
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              <code style={{ fontSize: '0.65rem', color: '#ADDFF1' }}>/memories/AGENTS.md</code>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Agent reads + edits this file when it learns something new about you.
              </p>
            </div>
          </div>

          {/* Subagents card */}
          <div style={{
            padding: '18px 20px', borderRadius: 14,
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <RefreshCw size={14} color="#ADDFF1" />
              <span style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Live Subagents
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.6 }}>
              Spawns specialized subagents on demand for fresh live analysis:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUBAGENT_LABELS.map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 7,
                    background: `${color}14`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={11} color={color} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-tenant note */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(173,223,241,0.06)', border: '1px solid rgba(173,223,241,0.15)',
          }}>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: '#ADDFF1' }}>Multi-tenant isolated</strong> — thread_id = brand_id:session_id. No brand can access another brand's memory or data.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div style={{
        marginTop: 24, padding: '16px 22px', borderRadius: 12,
        background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)',
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      }}>
        <Brain size={14} color="#ADDFF1" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Tool strategy</strong> — existing pipeline data answered instantly via DB tools · fresh live analysis delegates to subagents · learned preferences written to /memories/AGENTS.md automatically.
        </span>
      </div>
    </section>
  )
}
