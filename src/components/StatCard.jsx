import { useState } from 'react'

const palette = {
  teal:   { bar: '#4CA1AF', text: '#4CA1AF', rgb: '76,161,175'  },
  purple: { bar: '#a78bfa', text: '#a78bfa', rgb: '167,139,250' },
  red:    { bar: '#f87171', text: '#f87171', rgb: '239,68,68'   },
  yellow: { bar: '#facc15', text: '#facc15', rgb: '250,204,21'  },
  green:  { bar: '#4ade80', text: '#4ade80', rgb: '74,222,128'  },
  blue:   { bar: '#60a5fa', text: '#60a5fa', rgb: '96,165,250'  },
}

export default function StatCard({ label, value, sub, color = 'teal', icon: Icon }) {
  const c = palette[color] || palette.teal
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 72,
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--item-bg)',
        border: `1px solid ${hov ? `rgba(${c.rgb},0.3)` : 'var(--item-border)'}`,
        boxShadow: hov
          ? '0 4px 18px rgba(0,0,0,0.13)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        width: 3,
        flexShrink: 0,
        background: c.bar,
        opacity: hov ? 0.85 : 0.38,
        transition: 'opacity 0.2s ease',
      }} />

      {/* Icon block */}
      {Icon && (
        <>
          <div style={{
            width: 58,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 33,
              height: 33,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `rgba(${c.rgb},${hov ? 0.1 : 0.06})`,
              border: `1px solid rgba(${c.rgb},${hov ? 0.2 : 0.1})`,
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}>
              <Icon size={13} style={{
                color: c.text,
                opacity: hov ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
              }} />
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{
            width: 1,
            flexShrink: 0,
            alignSelf: 'stretch',
            background: 'var(--item-border)',
            opacity: 0.5,
          }} />
        </>
      )}

      {/* Label + Value */}
      <div style={{
        flex: 1,
        padding: '13px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 5,
        minWidth: 0,
      }}>
        <span style={{
          fontSize: '0.57rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-secondary)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </span>

        <div style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value ?? '—'}
        </div>

        {sub && (
          <div style={{
            fontSize: '0.63rem',
            fontWeight: 500,
            color: c.text,
            lineHeight: 1,
          }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}