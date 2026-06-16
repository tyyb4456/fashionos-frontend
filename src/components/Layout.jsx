import { Outlet, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { LayoutDashboard, History, CheckSquare, FileText, RotateCcw, Settings, Zap } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/runs',      icon: History,          label: 'Runs'      },
  { to: '/approvals', icon: CheckSquare,       label: 'Approvals' },
  { to: '/content',   icon: FileText,          label: 'Content'   },
  { to: '/returns',   icon: RotateCcw,         label: 'Returns'   },
  { to: '/settings',  icon: Settings,          label: 'Settings'  },
]

const activeStyle = {
  background: 'linear-gradient(120deg, rgba(44,62,80,0.7) 0%, rgba(76,161,175,0.22) 100%)',
  borderLeft: '2px solid #4CA1AF',
  paddingLeft: '10px',
  color: 'white',
}

export default function Layout() {
  return (
    <div className="flex h-screen" style={{ background: '#0a1628' }}>
      <aside className="flex flex-col" style={{
        width: '220px', minWidth: '220px',
        background: 'linear-gradient(170deg, #0c1d2f 0%, #0f2336 60%, #0c1d2f 100%)',
        borderRight: '1px solid rgba(76,161,175,0.13)',
      }}>
        {/* Brand */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(76,161,175,0.12)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              boxShadow: '0 4px 14px rgba(76,161,175,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Grape Nuts', cursive", fontSize: '1.3rem', color: 'white' }}>
              FashionOS
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 mt-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="block">
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all cursor-pointer"
                  style={isActive ? activeStyle : { color: '#7a9ab5' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(76,161,175,0.08)'; e.currentTarget.style.color = 'white' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#7a9ab5' } }}
                >
                  <Icon size={15} style={isActive ? { color: '#4CA1AF' } : {}} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Account */}
        <div className="p-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(76,161,175,0.12)' }}>
          <UserButton afterSignOutUrl="/" />
          <span style={{ fontSize: '0.7rem', color: '#7a9ab5' }}>Account</span>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}