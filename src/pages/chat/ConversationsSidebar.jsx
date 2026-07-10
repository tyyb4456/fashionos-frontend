import { useState } from 'react'
import { Plus, Loader2, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { GOLD } from './constants'
import { relativeTime } from './utils'

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
          ? 'var(--active-nav)'
          : hovered ? 'var(--hover-bg)' : 'transparent',
        borderLeft: `2px solid ${isActive ? GOLD : 'transparent'}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 3,
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <MessageSquare size={11} color={isActive ? GOLD : 'var(--text-muted)'}
          style={{ flexShrink: 0, marginTop: 2 }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.73rem',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
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
              color: 'var(--text-muted)', padding: '1px 3px', flexShrink: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
        color: 'var(--text-muted)', opacity: 0.8, letterSpacing: '0.06em',
        paddingLeft: 17,
      }}>
        {relativeTime(convo.updated_at)}
      </span>
    </div>
  )
}

export default function ConversationsSidebar({
  conversations, convosLoading, threadId,
  onSelect, onDelete, onNewThread,
  collapsed, onToggleCollapsed,
  isMobile,
}) {
  return (
    <>
      <div style={{
        width: collapsed ? 0 : 240,
        minWidth: collapsed ? 0 : 240,
        borderRight: collapsed ? 'none' : '1px solid var(--sidebar-border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--sidebar-gradient)',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        position: isMobile ? 'absolute' : 'relative',
        top: isMobile ? 0 : undefined,
        bottom: isMobile ? 0 : undefined,
        left: isMobile ? 0 : undefined,
        height: isMobile ? '100%' : undefined,
        zIndex: isMobile ? 5 : 2,
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '18px 14px 12px',
          borderBottom: '1px solid var(--card-border)',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.58rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 10,
          }}>
            Conversations
          </div>
          <button
            onClick={onNewThread}
            style={{
              width: '100%', padding: '8px 10px',
              background: 'var(--subtle-bg)',
              border: '1px solid var(--subtle-border)',
              color: GOLD, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--subtle-bg)'}
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
              <Loader2 size={16} color="var(--gold)"
                style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{
              padding: '20px 14px',
              fontFamily: "'Inter', sans-serif", fontSize: '0.68rem',
              color: 'var(--text-muted)', opacity: 0.6, textAlign: 'center', lineHeight: 1.6,
            }}>
              No conversations yet.<br />Start a new chat.
            </div>
          ) : (
            conversations.map(c => (
              <ConvoItem
                key={c.thread_id}
                convo={c}
                isActive={c.thread_id === threadId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Toggle collapse button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggleCollapsed}
          style={{
            position: 'absolute',
            left: collapsed ? 0 : 240,
            top: '50%', transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderLeft: collapsed ? '1px solid var(--card-border)' : 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer', padding: '6px 4px',
            transition: 'left 0.25s ease',
          }}
          title={collapsed ? 'Show conversations' : 'Hide conversations'}
        >
          {collapsed
            ? <ChevronRight size={12} />
            : <ChevronLeft  size={12} />}
        </button>
      )}
    </>
  )
}