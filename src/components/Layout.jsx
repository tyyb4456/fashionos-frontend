import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { LayoutDashboard, History, CheckSquare, FileText, RotateCcw, Settings, Menu, X } from 'lucide-react'

const GOLD = '#C9A84C'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/runs',      icon: History,          label: 'Runs'      },
  { to: '/approvals', icon: CheckSquare,       label: 'Approvals' },
  { to: '/content',   icon: FileText,          label: 'Content'   },
  { to: '/returns',   icon: RotateCcw,         label: 'Returns'   },
  { to: '/settings',  icon: Settings,          label: 'Settings'  },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3"
        style={{
          background: '#111111',
          borderBottom: `1px solid rgba(201,168,76,0.18)`,
          zIndex: 30,
        }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            style={{ color: 'rgba(242,237,228,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Menu size={20} />
          </button>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.2rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD,
          }}>
            FASHION<span style={{ color: '#F2EDE4' }}>OS</span>
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:static flex flex-col w-56 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--sidebar-gradient)',
          borderRight: `1px solid var(--sidebar-border)`,
        }}
      >
        {/* Brand */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid rgba(201,168,76,0.14)` }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.35rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD,
          }}>
            FASHION<span style={{ color: 'var(--text-primary)' }}>OS</span>
            <span style={{ fontSize: '0.65rem', verticalAlign: 'super', marginLeft: 2 }}>⚡</span>
          </span>
          <button onClick={() => setMobileOpen(false)} className="md:hidden"
            style={{ color: 'rgba(242,237,228,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="block" onClick={() => setMobileOpen(false)}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 py-2.5 px-3 text-sm transition-all cursor-pointer"
                  style={isActive ? {
                    background: 'var(--active-nav)',
                    borderLeft: `2px solid ${GOLD}`,
                    paddingLeft: 10,
                    color: GOLD,
                  } : {
                    color: 'rgba(242,237,228,0.45)',
                    borderLeft: '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = 'var(--hover-bg)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(242,237,228,0.45)'; e.currentTarget.style.background = '' } }}
                >
                  <Icon size={14} style={{ color: isActive ? GOLD : 'inherit', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 flex items-center gap-2.5" style={{ borderTop: `1px solid rgba(201,168,76,0.14)` }}>
          <UserButton afterSignOutUrl="/" />
          <span style={{ fontSize: '0.65rem', color: 'rgba(242,237,228,0.35)', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Account
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full w-full" style={{ position: 'relative' }}>
        <div className="page-orb" style={{ width: 500, height: 500, background: 'rgba(201,168,76,0.08)', top: -150, right: -100, animationDelay: '0s' }} />
        <div className="page-orb" style={{ width: 320, height: 320, background: 'rgba(201,168,76,0.05)', top: 300, left: -80, animationDelay: '-8s' }} />
        <div className="page-orb" style={{ width: 280, height: 280, background: 'rgba(201,168,76,0.06)', bottom: 60, right: '25%', animationDelay: '-15s' }} />
        <Outlet />
      </main>
    </div>
  )
}
