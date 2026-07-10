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
      borderTop: '1px solid var(--card-border)',
      position: 'relative', zIndex: 1, flexShrink: 0,
      background: 'var(--card-bg)',
    }}>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        background: 'var(--input-bg)',
        border: `1px solid var(--input-border)`,
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
            color: 'var(--text-primary)', lineHeight: 1.5,
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
            background: (!input.trim() || isStreaming) ? 'var(--subtle-bg)' : GOLD,
            border: 'none', cursor: (!input.trim() || isStreaming) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          {isStreaming
            ? <Loader2 size={13} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send    size={13} color={!input.trim() ? 'var(--text-muted)' : 'var(--bg)'} />}
        </button>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.57rem',
        color: 'var(--text-muted)', opacity: 0.8, letterSpacing: '0.07em',
        marginTop: 6, marginBottom: 0, textAlign: 'center',
      }}>
        Enter to send · Shift+Enter for new line · Agents run live
      </p>
    </div>
  )
})

export default ChatComposer