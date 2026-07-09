import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Bot, Loader2, Menu } from 'lucide-react'
import { GOLD, SUGGESTIONS } from './chat/constants'
import { uuidv4 } from './chat/utils'
import MessageBubble from './chat/MessageBubble'
import ConversationsSidebar from './chat/ConversationsSidebar'
import ChatComposer from './chat/ChatComposer'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
  const [isMobile,         setIsMobile]         = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const abortRef       = useRef(null)

  // ── Track mobile viewport ───────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setSidebarCollapsed(mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    if (isMobile) setSidebarCollapsed(true)

    setMessagesLoading(true)
    try {
      const token = await getToken()
      const res   = await fetch(`${API_BASE}/api/v1/conversations/${tid}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const msgs = await res.json()
        setMessages(msgs.map((m, i) => ({
          id:        i,
          role:      m.role,
          content:   m.content,
          streaming: false,
          // Subagents don't exist anymore — replay persisted tool results
          // through the same ToolCallCard used for live streaming.
          toolCalls: (m.tool_results || []).map((tr, j) => ({
            id: `${i}-${j}-${tr.name}`, name: tr.name, args: {}, status: 'done', data: tr.data,
          })),
          reasoning: m.reasoning || '',
        })))
      }
    } catch { /* network / dev fallback */ }
    finally { setMessagesLoading(false) }
  }, [getToken, threadId, messages.length, isMobile])

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
    if (isMobile) setSidebarCollapsed(true)
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
      { id: asstId, role: 'assistant', content: '', toolCalls: [], reasoning: '', streaming: true },
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

            case 'reasoning':
              setMessages(prev => prev.map(m =>
                m.id === asstId ? { ...m, reasoning: (m.reasoning || '') + evt.content } : m
              ))
              break

            case 'tool_call':
              setMessages(prev => prev.map(m =>
                m.id === asstId
                  ? { ...m, toolCalls: [...(m.toolCalls || []), { id: evt.id, name: evt.name, args: evt.args, status: 'running', data: null }] }
                  : m
              ))
              break

            case 'tool_result':
              setMessages(prev => prev.map(m =>
                m.id === asstId
                  ? { ...m, toolCalls: (m.toolCalls || []).map(c => c.id === evt.id ? { ...c, status: 'done', data: evt.data } : c) }
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
      background: '#0D1512', position: 'relative', overflow: 'hidden',
    }}>

      <ConversationsSidebar
        conversations={conversations}
        convosLoading={convosLoading}
        threadId={threadId}
        onSelect={selectConversation}
        onDelete={deleteConversation}
        onNewThread={newThread}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(p => !p)}
        isMobile={isMobile}
      />

      {isMobile && !sidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 4,
          }}
        />
      )}

      {/* ── Chat panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

        {/* Ambient orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(47,158,110,0.06) 0%, transparent 70%)',
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: isMobile ? '12px 16px 10px' : '18px 24px 14px',
          borderBottom: '1px solid rgba(47,158,110,0.1)',
          position: 'relative', zIndex: 1, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {isMobile && (
            <button
              onClick={() => setSidebarCollapsed(p => !p)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: GOLD, padding: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginRight: -2,
              }}
            >
              <Menu size={20} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div className="section-pill" style={{ display: 'inline-flex' }}>✦ AI Intelligence</div>
            <h1 style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: isMobile ? '1.35rem' : '1.7rem', fontWeight: 300, color: '#F2EDE4',
              margin: 0, lineHeight: 1.1,
            }}>
              FashionOS Chat
            </h1>
            <div style={{
              width: 36, height: 1,
              background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginTop: 4,
            }} />
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: isMobile ? '16px 12px' : '24px',
          display: 'flex', flexDirection: 'column', gap: 26,
          position: 'relative', zIndex: 1,
        }}>
          {messagesLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={22} color="rgba(47,158,110,0.4)"
                style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 22, paddingTop: 40,
            }}>
              <div style={{
                width: 50, height: 50,
                border: '1px solid rgba(47,158,110,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={20} color={GOLD} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Permanent Marker', cursive", fontSize: '1.25rem',
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
                    background: 'rgba(47,158,110,0.06)',
                    border: '1px solid rgba(47,158,110,0.18)',
                    color: 'rgba(242,237,228,0.5)', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(47,158,110,0.12)'; e.currentTarget.style.color = GOLD }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(47,158,110,0.06)'; e.currentTarget.style.color = 'rgba(242,237,228,0.5)' }}
                  >{s}</button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatComposer
          ref={inputRef}
          input={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onSend={() => sendMessage(input)}
          isStreaming={isStreaming}
        />
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  )
}