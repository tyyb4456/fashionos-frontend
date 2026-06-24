import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  Send, Plus, Bot, User, Package, TrendingUp,
  Tag, Megaphone, FileText, Loader2, CheckCircle2,
  AlertCircle, RotateCcw,
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const GOLD     = '#C9A84C'
const GOLD_DIM = 'rgba(201,168,76,0.18)'

// ── Subagent display metadata ──────────────────────────────────────────────────
const SUBAGENT_META = {
  'inventory-agent': { label: 'Inventory',  Icon: Package,    color: '#22c55e' },
  'trend-agent':     { label: 'Trends',     Icon: TrendingUp, color: '#a78bfa' },
  'pricing-agent':   { label: 'Pricing',    Icon: Tag,        color: GOLD      },
  'marketing-agent': { label: 'Marketing',  Icon: Megaphone,  color: '#f97316' },
  'content-agent':   { label: 'Content',    Icon: FileText,   color: '#60a5fa' },
}

const AGENT_LABEL = {
  'inventory-agent': 'Inventory Agent',
  'trend-agent':     'Trend Agent',
  'pricing-agent':   'Pricing Agent',
  'marketing-agent': 'Marketing Agent',
  'content-agent':   'Content Agent',
}

// ── Subagent card ──────────────────────────────────────────────────────────────
function SubagentCard({ name, status, summary }) {
  const meta   = SUBAGENT_META[name] || { label: name, Icon: Bot, color: GOLD }
  const { Icon, label, color } = meta

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${status === 'done' ? color + '55' : 'rgba(201,168,76,0.15)'}`,
      padding: '10px 14px',
      minWidth: 180,
      maxWidth: 260,
      flexShrink: 0,
      position: 'relative',
      transition: 'border-color 0.3s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <Icon size={13} color={color} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color,
        }}>
          {label}
        </span>
        <span style={{ marginLeft: 'auto' }}>
          {status === 'running' ? (
            <Loader2 size={11} color={color} style={{ animation: 'spin 1s linear infinite' }} />
          ) : status === 'done' ? (
            <CheckCircle2 size={11} color={color} />
          ) : (
            <AlertCircle size={11} color="#ef4444" />
          )}
        </span>
      </div>

      {/* Status label */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.6rem',
        color: status === 'done' ? color : 'rgba(242,237,228,0.35)',
        letterSpacing: '0.08em',
        marginBottom: summary ? 8 : 0,
      }}>
        {status === 'running' ? 'Running…' : status === 'done' ? 'Complete' : 'Error'}
      </div>

      {/* Summary */}
      {summary && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'rgba(242,237,228,0.65)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          {summary.length > 160 ? summary.slice(0, 157) + '…' : summary}
        </p>
      )}
    </div>
  )
}

// ── Single message bubble ──────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: 10,
    }}>
      {/* Role indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}>
        <div style={{
          width: 24, height: 24,
          background: isUser ? GOLD_DIM : 'rgba(242,237,228,0.08)',
          border: `1px solid ${isUser ? 'rgba(201,168,76,0.4)' : 'rgba(242,237,228,0.12)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isUser
            ? <User  size={12} color={GOLD} />
            : <Bot   size={12} color="rgba(242,237,228,0.5)" />}
        </div>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isUser ? GOLD : 'rgba(242,237,228,0.3)',
        }}>
          {isUser ? 'You' : 'FashionOS'}
        </span>
      </div>

      {/* Content bubble */}
      <div style={{
        maxWidth: '78%',
        background: isUser ? GOLD_DIM : '#141414',
        border: `1px solid ${isUser ? 'rgba(201,168,76,0.28)' : 'rgba(242,237,228,0.08)'}`,
        padding: '12px 16px',
        position: 'relative',
      }}>
        {/* Streaming cursor */}
        {msg.streaming && (
          <span style={{
            display: 'inline-block',
            width: 2, height: '1em',
            background: GOLD,
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 0.9s step-end infinite',
          }} />
        )}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.82rem',
          lineHeight: 1.7,
          color: isUser ? 'rgba(242,237,228,0.9)' : 'rgba(242,237,228,0.8)',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content || (msg.streaming ? '' : '…')}
          {msg.streaming && msg.content && (
            <span style={{
              display: 'inline-block',
              width: 2, height: '0.9em',
              background: GOLD,
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'blink 0.9s step-end infinite',
            }} />
          )}
        </p>
      </div>

      {/* Subagent cards row */}
      {msg.subagents && msg.subagents.length > 0 && (
        <div style={{ maxWidth: '100%' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.25)',
            marginBottom: 8,
          }}>
            Specialist agents · {msg.subagents.filter(s => s.status === 'done').length}/{msg.subagents.length} completed
          </div>
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            {msg.subagents.map(sa => (
              <SubagentCard
                key={sa.name}
                name={sa.name}
                status={sa.status}
                summary={sa.summary}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Suggested prompts ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What\'s the current inventory status?',
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
  const [threadId,    setThreadId]    = useState(() =>
    localStorage.getItem('fashionos-thread-id') || 'default'
  )

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const abortRef       = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Streaming send ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    // Append user message
    const userMsg = { id: Date.now(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    // Placeholder assistant message
    const assistantId = Date.now() + 1
    setMessages(prev => [...prev, {
      id:       assistantId,
      role:     'assistant',
      content:  '',
      subagents: [],
      streaming: true,
    }])

    try {
      const token = await getToken()

      // Abort any previous stream
      if (abortRef.current) abortRef.current.abort()
      const controller   = new AbortController()
      abortRef.current   = controller

      const res = await fetch(`${API_BASE}/api/v1/chat/stream`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:   JSON.stringify({ message: trimmed, thread_id: threadId }),
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`)
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE lines
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete last chunk

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          let event
          try { event = JSON.parse(raw) } catch { continue }

          switch (event.type) {

            case 'token':
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + event.content }
                  : m
              ))
              break

            case 'subagent_start':
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      subagents: [
                        ...m.subagents.filter(s => s.name !== event.name),
                        { name: event.name, status: 'running', summary: '' },
                      ],
                    }
                  : m
              ))
              break

            case 'subagent_token':
              // Optionally accumulate for future use — not shown per-token in UI
              break

            case 'subagent_done':
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? {
                      ...m,
                      subagents: m.subagents.map(s =>
                        s.name === event.name
                          ? { ...s, status: 'done', summary: event.summary || '' }
                          : s
                      ),
                    }
                  : m
              ))
              break

            case 'error':
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + `\n\n⚠ ${event.content}`, streaming: false }
                  : m
              ))
              break

            case 'done':
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, streaming: false } : m
              ))
              break
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: m.content || `Connection error: ${err.message}`, streaming: false }
          : m
      ))
    } finally {
      setIsStreaming(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      ))
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isStreaming, threadId, getToken])

  // ── New thread ───────────────────────────────────────────────────────────────
  const newThread = () => {
    if (abortRef.current) abortRef.current.abort()
    const id = `thread_${Date.now()}`
    setThreadId(id)
    localStorage.setItem('fashionos-thread-id', id)
    setMessages([])
    setIsStreaming(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Key handler ──────────────────────────────────────────────────────────────
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      background:    '#0D0D0D',
      position:      'relative',
    }}>

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: -120, right: -80,
          width: 440, height: 440, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Header ── */}
      <div style={{
        padding:      '18px 24px 14px',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        position:     'relative', zIndex: 1,
        flexShrink:   0,
      }}>
        <div>
          <div className="section-pill">✦ AI Intelligence</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize:   '1.7rem',
            fontWeight:  300,
            color:       '#F2EDE4',
            margin:      0,
            lineHeight:  1.1,
          }}>
            FashionOS Chat
          </h1>
          <div style={{
            width: 36, height: 1,
            background: `linear-gradient(90deg, ${GOLD}, transparent)`,
            marginTop: 6,
          }} />
        </div>

        <button
          onClick={newThread}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:          6,
            padding:     '7px 14px',
            background:  'transparent',
            border:      `1px solid rgba(201,168,76,0.28)`,
            color:       'rgba(242,237,228,0.5)',
            cursor:      'pointer',
            fontFamily:  "'Inter', sans-serif",
            fontSize:    '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition:  'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(242,237,228,0.5)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)' }}
        >
          <RotateCcw size={11} />
          New Thread
        </button>
      </div>

      {/* ── Messages area ── */}
      <div style={{
        flex:      1,
        overflowY: 'auto',
        padding:   '24px',
        display:   'flex',
        flexDirection: 'column',
        gap:       28,
        position:  'relative', zIndex: 1,
      }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{
            flex:           1,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:             24,
            paddingTop:      40,
          }}>
            <div style={{
              width: 52, height: 52,
              border: `1px solid rgba(201,168,76,0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={22} color={GOLD} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize:   '1.3rem',
                fontWeight:  300,
                color:      'rgba(242,237,228,0.5)',
                margin:      '0 0 6px',
              }}>
                Ask me anything about your brand
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   '0.72rem',
                color:      'rgba(242,237,228,0.25)',
                letterSpacing: '0.06em',
                margin:     0,
              }}>
                Inventory · Trends · Pricing · Marketing · Content
              </p>
            </div>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 500 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding:    '7px 14px',
                    background: 'rgba(201,168,76,0.06)',
                    border:     '1px solid rgba(201,168,76,0.2)',
                    color:      'rgba(242,237,228,0.55)',
                    cursor:     'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize:   '0.72rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.color = GOLD }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = 'rgba(242,237,228,0.55)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding:    '14px 24px 20px',
        borderTop:  '1px solid rgba(201,168,76,0.12)',
        position:   'relative', zIndex: 1,
        flexShrink: 0,
        background: 'rgba(13,13,13,0.95)',
      }}>
        <div style={{
          display:       'flex',
          gap:            10,
          alignItems:    'flex-end',
          background:    '#111',
          border:        `1px solid rgba(201,168,76,${isStreaming ? '0.35' : '0.2'})`,
          padding:       '10px 12px',
          transition:    'border-color 0.2s',
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
              flex:       1,
              background: 'transparent',
              border:     'none',
              outline:    'none',
              resize:     'none',
              fontFamily: "'Inter', sans-serif",
              fontSize:   '0.82rem',
              color:      '#F2EDE4',
              lineHeight:  1.5,
              minHeight:   22,
              maxHeight:   120,
              overflowY:  'auto',
              padding:     0,
              opacity:     isStreaming ? 0.5 : 1,
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
              width:      34, height: 34,
              background: (!input.trim() || isStreaming) ? 'rgba(201,168,76,0.15)' : GOLD,
              border:     'none',
              cursor:     (!input.trim() || isStreaming) ? 'not-allowed' : 'pointer',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            {isStreaming
              ? <Loader2 size={14} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send    size={14} color={(!input.trim()) ? 'rgba(201,168,76,0.4)' : '#0D0D0D'} />
            }
          </button>
        </div>

        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontSize:      '0.58rem',
          color:         'rgba(242,237,228,0.2)',
          letterSpacing: '0.07em',
          marginTop:      7,
          marginBottom:   0,
          textAlign:     'center',
        }}>
          Enter to send · Shift+Enter for new line · Responses stream in real time
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  )
}
