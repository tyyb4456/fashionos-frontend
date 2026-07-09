import { forwardRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { GOLD } from './constants'

const ChatComposer = forwardRef(function ChatComposer(
  { input, onChange, onKeyDown, onSend, isStreaming },
  ref
) {
  const isMobileView = window.innerWidth <= 768;
  return (
    <div style={{
      padding: isMobileView ? '10px 12px 14px' : '12px 24px 18px',
      borderTop: '1px solid rgba(47,158,110,0.1)',
      position: 'relative', zIndex: 1, flexShrink: 0,
      background: 'rgba(13,13,13,0.96)',
    }}>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        background: '#111',
        border: `1px solid rgba(47,158,110,${isStreaming ? '0.32' : '0.18'})`,
        padding: '9px 11px', transition: 'border-color 0.2s',
      }}>
        <textarea
          ref={ref}
          rows={1}
          value={input}
          onChange={onChange}
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
          onClick={onSend}
          disabled={!input.trim() || isStreaming}
          style={{
            width: 33, height: 33, flexShrink: 0,
            background: (!input.trim() || isStreaming) ? 'rgba(47,158,110,0.12)' : GOLD,
            border: 'none', cursor: (!input.trim() || isStreaming) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          {isStreaming
            ? <Loader2 size={13} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send    size={13} color={!input.trim() ? 'rgba(47,158,110,0.35)' : '#0D1512'} />}
        </button>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.57rem',
        color: 'rgba(242,237,228,0.18)', letterSpacing: '0.07em',
        marginTop: 6, marginBottom: 0, textAlign: 'center',
      }}>
        Enter to send · Shift+Enter for new line · Agents run live
      </p>
    </div>
  )
})

export default ChatComposer