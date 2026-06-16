import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  LayoutDashboard, History, CheckSquare,
  FileText, RotateCcw, Settings, Zap
} from 'lucide-react'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/runs',      icon: History,          label: 'Runs'      },
  { to: '/approvals', icon: CheckSquare,       label: 'Approvals' },
  { to: '/content',   icon: FileText,          label: 'Content'   },
  { to: '/returns',   icon: RotateCcw,         label: 'Returns'   },
  { to: '/settings',  icon: Settings,          label: 'Settings'  },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#141414] border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="text-purple-400" size={20} />
            <span className="font-bold text-white">FashionOS</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
               ${isActive
                 ? 'bg-purple-500/20 text-purple-400 font-medium'
                 : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-gray-500">Account</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}