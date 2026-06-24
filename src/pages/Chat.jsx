import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  Send, Plus, Bot, User, Package, TrendingUp, Tag,
  Megaphone, FileText, Loader2, CheckCircle2, AlertCircle,
  Trash2, MessageSquare, ChevronLeft, ChevronRight,
} from 'lucide-react'

const uuidv4 = () => crypto.randomUUID()

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const GOLD     = '#C9A84C'
const GOLD_DIM = 'rgba(201,168,76,0.14)'

// ── Subagent display metadata ──────────────────────────────────────────────────
const SUBAGENT_META = {
  'inventory-agent': { label: 'Inventory',  Icon: Package,    color: '#22c55e' },
  'trend-agent':     { label: 'Trends',     Icon: TrendingUp, color: '#a78bfa' },
  'pricing-agent':   { label: 'Pricing',    Icon: Tag,        color: GOLD      },
  'marketing-agent': { label: 'Marketing',  Icon: Megaphone,  color: '#f97316' },
  'content-agent':   { label: 'Content',    Icon: FileText,   color: '#60a5fa' },
}

// ── Relative time helper ───────────────────────────────────────────────────────
function relativeTime(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  1) return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  <  7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

// ── Subagent card ──────────────────────────────────────────────────────────────
function SubagentCard({ name, status, summary }) {
  const { Icon, label, color } = SUBAGENT_META[name] || { label: name, Icon: Bot, color: GOLD }

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${status === 'done' ? color + '44' : 'rgba(201,168,76,0.12)'}`,
      padding: '10px 14px',
      minWidth: 170, maxWidth: 250,
      flexShrink: 0,
      transition: 'border-color 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <Icon size={12} color={color} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.62rem',
          letterSpacing: '0.12em', textTransform: 'uppercase', color,
        }}>{label}</span>
        <span style={{ marginLeft: 'auto' }}>
          {status === 'running'
            ? <Loader2      size={10} color={color} style={{ animation: 'spin 1s linear infinite' }} />
            : status === 'done'
            ? <CheckCircle2 size={10} color={color} />
            : <AlertCircle  size={10} color="#ef4444" />}
        </span>
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
        color: status === 'done' ? color : 'rgba(242,237,228,0.3)',
        letterSpacing: '0.08em', marginBottom: summary ? 7 : 0,
      }}>
        {status === 'running' ? 'Running…' : status === 'done' ? 'Complete' : 'Error'}
      </div>
      {summary && (
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.68rem',
          color: 'rgba(242,237,228,0.6)', lineHeight: 1.5, margin: 0,
        }}>
          {summary.length > 140 ? summary.slice(0, 137) + '…' : summary}
        </p>
      )}
    </div>
  )
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: 8,
    }}>
      {/* Role label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}>
        <div style={{
          width: 22, height: 22,
          background: isUser ? GOLD_DIM : 'rgba(242,237,228,0.06)',
          border: `1px solid ${isUser ? 'rgba(201,168,76,0.35)' : 'rgba(242,237,228,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isUser
            ? <User size={11} color={GOLD} />
            : <Bot  size={11} color="rgba(242,237,228,0.45)" />}
        </div>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: isUser ? GOLD : 'rgba(242,237,228,0.28)',
        }}>
          {isUser ? 'You' : 'FashionOS'}
        </span>
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '80%',
        background: isUser ? GOLD_DIM : '#141414',
        border: `1px solid ${isUser ? 'rgba(201,168,76,0.22)' : 'rgba(242,237,228,0.07)'}`,
        padding: '11px 15px',
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
          lineHeight: 1.7, color: isUser ? '#F2EDE4' : 'rgba(242,237,228,0.8)',
          margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {msg.content || (msg.streaming ? '' : '…')}
          {msg.streaming && (
            <span style={{
              display: 'inline-block', width: 2, height: '0.85em',
              background: GOLD, marginLeft: 3, verticalAlign: 'text-bottom',
              animation: 'blink 0.9s step-end infinite',
            }} />
          )}
        </p>
      </div>

      {/* Subagent cards */}
      {msg.subagents && msg.subagents.length > 0 && (
        <div style={{ maxWidth: '100%' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.56rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.22)', marginBottom: 7,
          }}>
            Specialist agents · {msg.subagents.filter(s => s.status === 'done').length}/{msg.subagents.length} completed
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {msg.subagents.map(sa => (
              <SubagentCard key={sa.name} name={sa.name} status={sa.status} summary={sa.summary} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Conversations sidebar item ─────────────────────────────────────────────────
function ConvoItem({ convo, isActive, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onSelect(convo.thread_id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 12px',
        background: isActive
          ? 'rgba(201,168,76,0.1)'
          : hovered ? 'rgba(242,237,228,0.04)' : 'transparent',
        borderLeft: `2px solid ${isActive ? GOLD : 'transparent'}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 3,
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <MessageSquare size={11} color={isActive ? GOLD : 'rgba(242,237,228,0.3)'}
          style={{ flexShrink: 0, marginTop: 2 }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.73rem',
          color: isActive ? '#F2EDE4' : 'rgba(242,237,228,0.65)',
          lineHeight: 1.4, flex: 1,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {convo.title || 'Untitled'}
        </span>
        {hovered && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(convo.thread_id) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(242,237,228,0.3)', padding: '1px 3px', flexShrink: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,237,228,0.3)'}
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
        color: 'rgba(242,237,228,0.25)', letterSpacing: '0.06em',
        paddingLeft: 17,
      }}>
        {relativeTime(convo.updated_at)}
      </span>
    </div>
  )
}

// ── Suggested prompts ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What's the current inventory status?",
  'Run a full daily pipeline',
  'Which SKUs need restocking today?',
  'Show me the latest pricing analysis',
]

// ── Main Chat page ─────────────────────────────────────────────────────────────
export default function Chat() {
  const { getToken } = useAuth()

  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [threadId,    setThreadId]    = useState(() => uuidv4())

  const [conversations,    setConversations]    = useState([])
  const [convosLoading,    setConvosLoading]    = useState(true)
  const [messagesLoading,  setMessagesLoading]  = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const abortRef       = useRef(null)

  // ── Scroll to bottom ─────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Fetch conversations on mount ─────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const token = await getToken()
      const res   = await fetch(`${API_BASE}/api/v1/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch { /* backend not connected in dev — show empty list */ }
    finally { setConvosLoading(false) }
  }, [getToken])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  // ── Load a conversation's messages ───────────────────────────────────────────
  const selectConversation = useCallback(async (tid) => {
    if (tid === threadId && messages.length > 0) return
    if (abortRef.current) abortRef.current.abort()
    setIsStreaming(false)
    setThreadId(tid)
    setMessages([])
    setMessagesLoading(true)

    try {
      const token = await getToken()
      const res   = await fetch(`${API_BASE}/api/v1/conversations/${tid}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const msgs = await res.json()
        setMessages(msgs.map((m, i) => ({ id: i, ...m, subagents: [] })))
      }
    } catch { /* network / dev fallback */ }
    finally { setMessagesLoading(false) }
  }, [getToken, threadId, messages.length])

  // ── Delete conversation ───────────────────────────────────────────────────────
  const deleteConversation = useCallback(async (tid) => {
    try {
      const token = await getToken()
      await fetch(`${API_BASE}/api/v1/conversations/${tid}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch { /* ignore */ }

    setConversations(prev => prev.filter(c => c.thread_id !== tid))
    if (tid === threadId) {
      setThreadId(uuidv4())
      setMessages([])
    }
  }, [getToken, threadId])

  // ── New thread ────────────────────────────────────────────────────────────────
  const newThread = () => {
    if (abortRef.current) abortRef.current.abort()
    setIsStreaming(false)
    setThreadId(uuidv4())
    setMessages([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Send & stream ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const userMsg = { id: Date.now(), role: 'user', content: trimmed }
    const asstId  = Date.now() + 1
    setMessages(prev => [...prev,
      userMsg,
      { id: asstId, role: 'assistant', content: '', subagents: [], streaming: true },
    ])

    try {
      const token = await getToken()
      if (abortRef.current) abortRef.current.abort()
      const ctrl     = new AbortController()
      abortRef.current = ctrl

      const res = await fetch(`${API_BASE}/api/v1/chat/stream`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ message: trimmed, thread_id: threadId }),
        signal:  ctrl.signal,
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          let evt
          try { evt = JSON.parse(raw) } catch { continue }

          switch (evt.type) {
            case 'token':
              setMessages(prev => prev.map(m =>
                m.id === asstId ? { ...m, content: m.content + evt.content } : m
              ))
              break
            case 'subagent_start':
              setMessages(prev => prev.map(m =>
                m.id === asstId
                  ? { ...m, subagents: [...m.subagents.filter(s => s.name !== evt.name),
                      { name: evt.name, status: 'running', summary: '' }] }
                  : m
              ))
              break
            case 'subagent_done':
              setMessages(prev => prev.map(m =>
                m.id === asstId
                  ? { ...m, subagents: m.subagents.map(s =>
                      s.name === evt.name ? { ...s, status: 'done', summary: evt.summary || '' } : s
                    ) }
                  : m
              ))
              break
            case 'error':
              setMessages(prev => prev.map(m =>
                m.id === asstId
                  ? { ...m, content: m.content + `\n\n⚠ ${evt.content}`, streaming: false }
                  : m
              ))
              break
            case 'done':
              setMessages(prev => prev.map(m =>
                m.id === asstId ? { ...m, streaming: false } : m
              ))
              break
          }
        }
      }

      // Refresh conversation list so new title appears
      fetchConversations()

    } catch (err) {
      if (err.name === 'AbortError') return
      setMessages(prev => prev.map(m =>
        m.id === asstId
          ? { ...m, content: m.content || `Connection error: ${err.message}`, streaming: false }
          : m
      ))
    } finally {
      setIsStreaming(false)
      setMessages(prev => prev.map(m =>
        m.id === asstId ? { ...m, streaming: false } : m
      ))
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isStreaming, threadId, getToken, fetchConversations])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', height: '100%',
      background: '#0D0D0D', position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Conversations Sidebar ── */}
      <div style={{
        width: sidebarCollapsed ? 0 : 240,
        minWidth: sidebarCollapsed ? 0 : 240,
        borderRight: sidebarCollapsed ? 'none' : '1px solid rgba(201,168,76,0.12)',
        display: 'flex', flexDirection: 'column',
        background: '#0A0A0A',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        position: 'relative', zIndex: 2,
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '18px 14px 12px',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.3)', marginBottom: 10,
          }}>
            Conversations
          </div>
          <button
            onClick={newThread}
            style={{
              width: '100%', padding: '8px 10px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.22)',
              color: GOLD, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
          >
            <Plus size={12} /> New Chat
          </button>
        </div>

        {/* Conversations list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {convosLoading ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}>
              <Loader2 size={16} color="rgba(201,168,76,0.4)"
                style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{
              padding: '20px 14px',
              fontFamily: "'Inter', sans-serif", fontSize: '0.68rem',
              color: 'rgba(242,237,228,0.2)', textAlign: 'center', lineHeight: 1.6,
            }}>
              No conversations yet.<br />Start a new chat.
            </div>
          ) : (
            conversations.map(c => (
              <ConvoItem
                key={c.thread_id}
                convo={c}
                isActive={c.thread_id === threadId}
                onSelect={selectConversation}
                onDelete={deleteConversation}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Toggle collapse button ── */}
      <button
        onClick={() => setSidebarCollapsed(p => !p)}
        style={{
          position: 'absolute',
          left: sidebarCollapsed ? 0 : 240,
          top: '50%', transform: 'translateY(-50%)',
          zIndex: 10,
          background: '#1A1A1A',
          border: '1px solid rgba(201,168,76,0.2)',
          borderLeft: sidebarCollapsed ? '1px solid rgba(201,168,76,0.2)' : 'none',
          color: 'rgba(242,237,228,0.4)',
          cursor: 'pointer', padding: '6px 4px',
          transition: 'left 0.25s ease',
        }}
        title={sidebarCollapsed ? 'Show conversations' : 'Hide conversations'}
      >
        {sidebarCollapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />}
      </button>

      {/* ── Chat panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

        {/* Ambient orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '18px 24px 14px',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div className="section-pill">✦ AI Intelligence</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.7rem', fontWeight: 300, color: '#F2EDE4',
            margin: 0, lineHeight: 1.1,
          }}>
            FashionOS Chat
          </h1>
          <div style={{
            width: 36, height: 1,
            background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginTop: 6,
          }} />
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: 26,
          position: 'relative', zIndex: 1,
        }}>
          {messagesLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={22} color="rgba(201,168,76,0.4)"
                style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 22, paddingTop: 40,
            }}>
              <div style={{
                width: 50, height: 50,
                border: '1px solid rgba(201,168,76,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={20} color={GOLD} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem',
                  fontWeight: 300, color: 'rgba(242,237,228,0.45)', margin: '0 0 6px',
                }}>
                  Ask me anything about your brand
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
                  color: 'rgba(242,237,228,0.22)', letterSpacing: '0.06em', margin: 0,
                }}>
                  Inventory · Trends · Pricing · Marketing · Content
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 480 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    padding: '7px 13px',
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    color: 'rgba(242,237,228,0.5)', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.color = GOLD }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = 'rgba(242,237,228,0.5)' }}
                  >{s}</button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: '12px 24px 18px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          position: 'relative', zIndex: 1, flexShrink: 0,
          background: 'rgba(13,13,13,0.96)',
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: '#111',
            border: `1px solid rgba(201,168,76,${isStreaming ? '0.32' : '0.18'})`,
            padding: '9px 11px', transition: 'border-color 0.2s',
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask FashionOS anything…"
              disabled={isStreaming}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
                color: '#F2EDE4', lineHeight: 1.5,
                minHeight: 22, maxHeight: 120, overflowY: 'auto',
                padding: 0, opacity: isStreaming ? 0.5 : 1,
              }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              style={{
                width: 33, height: 33, flexShrink: 0,
                background: (!input.trim() || isStreaming) ? 'rgba(201,168,76,0.12)' : GOLD,
                border: 'none', cursor: (!input.trim() || isStreaming) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              {isStreaming
                ? <Loader2 size={13} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
                : <Send    size={13} color={!input.trim() ? 'rgba(201,168,76,0.35)' : '#0D0D0D'} />}
            </button>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.57rem',
            color: 'rgba(242,237,228,0.18)', letterSpacing: '0.07em',
            marginTop: 6, marginBottom: 0, textAlign: 'center',
          }}>
            Enter to send · Shift+Enter for new line · History synced to Redis
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  )
}
