import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { LayoutDashboard, History, CheckSquare, FileText, RotateCcw, Settings, Zap, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/runs',      icon: History,          label: 'Runs'      },
  { to: '/approvals', icon: CheckSquare,       label: 'Approvals' },
  { to: '/content',   icon: FileText,          label: 'Content'   },
  { to: '/returns',   icon: RotateCcw,         label: 'Returns'   },
  { to: '/settings',  icon: Settings,          label: 'Settings'  },
]

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeStyle = {
    background: 'var(--active-nav)',
    borderLeft: '2px solid #4CA1AF',
    paddingLeft: '10px',
    color: 'var(--text-primary)',
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)', transition: 'background 0.25s' }}>
      
      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b"
        style={{
          background: 'var(--sidebar-gradient)',
          borderColor: 'var(--sidebar-border)',
          zIndex: 30
        }}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-secondary hover:text-primary transition-all"
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={12} color="white" />
            </div>
            <span style={{ fontFamily: "'Fascinate Inline', cursive", fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              FashionOS
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Mobile Sidebar Overlay (Backdrop) */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 md:static flex flex-col w-55 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--sidebar-gradient)',
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'transform 0.3s ease-in-out, background 0.25s, border-color 0.25s',
        }}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--item-border)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              boxShadow: '0 4px 14px rgba(76,161,175,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Fascinate Inline', cursive", fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              FashionOS
            </span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-secondary hover:text-primary transition-all"
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-0.5 mt-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all cursor-pointer"
                  style={isActive ? activeStyle : { color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                >
                  <Icon size={15} style={isActive ? { color: '#4CA1AF' } : {}} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Account + Theme Toggle (Desktop Only / Bottom of Sidebar) */}
        <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--item-border)' }}>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Account</span>
          </div>
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#4CA1AF'; e.currentTarget.style.borderColor = '#4CA1AF' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full w-full">
        <Outlet />
      </main>
    </div>
  )
}