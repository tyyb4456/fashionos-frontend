import { Bot, User, Loader2 } from 'lucide-react'
import { GOLD, GOLD_DIM } from './constants'
import ReasoningBlock from './ReasoningBlock'
import ToolCallCard from './ToolCallCard'
import MarkdownContent from './MarkdownContent'

export default function MessageBubble({ msg }) {
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
          border: `1px solid ${isUser ? 'rgba(47,158,110,0.35)' : 'rgba(242,237,228,0.1)'}`,
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

      {/* Reasoning — model's internal thinking, hidden by default */}
      {!isUser && msg.reasoning && (
        <ReasoningBlock text={msg.reasoning} streaming={msg.streaming && !msg.content} />
      )}

      {/* Tool calls — DB tool invocations, hidden by default */}
      {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {msg.toolCalls.map(call => <ToolCallCard key={call.id} call={call} />)}
        </div>
      )}

      {/* Final response bubble — only shown when there's content */}
      {(msg.content || msg.streaming) && (
        <div style={{
          maxWidth: window.innerWidth <= 768 ? '92%' : '80%',
          background: isUser ? GOLD_DIM : '#14201B',
          border: `1px solid ${isUser ? 'rgba(47,158,110,0.22)' : 'rgba(242,237,228,0.07)'}`,
          padding: '11px 15px',
        }}>
          {msg.content ? (
            <MarkdownContent
              text={msg.content}
              color={isUser ? '#F2EDE4' : 'rgba(242,237,228,0.8)'}
              fontSize="0.82rem"
            />
          ) : (
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
              lineHeight: 1.7, color: 'rgba(242,237,228,0.8)', margin: 0,
            }}>
              {msg.streaming ? '' : '…'}
            </p>
          )}
          {msg.streaming && (
            <span style={{
              display: 'inline-block', width: 2, height: '0.85em',
              background: GOLD, marginLeft: 3, verticalAlign: 'text-bottom',
              animation: 'blink 0.9s step-end infinite',
            }} />
          )}
        </div>
      )}

      {/* Streaming: agent is thinking but no text yet — show pulse */}
      {!isUser && msg.streaming && !msg.content && !msg.reasoning &&
        (!msg.toolCalls || msg.toolCalls.length === 0) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 14px',
          background: '#14201B',
          border: '1px solid rgba(242,237,228,0.07)',
        }}>
          <Loader2 size={12} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', color: 'rgba(242,237,228,0.35)', letterSpacing: '0.06em' }}>
            Thinking…
          </span>
        </div>
      )}
    </div>
  )
}