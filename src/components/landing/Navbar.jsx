import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { useTheme } from '../../context/ThemeContext'
import { Zap, ArrowRight, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <nav className="nav-bar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #003152, #ADDFF1)',
          boxShadow: '0 4px 14px rgba(173,223,241,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={16} color="white" />
        </div>
        <span style={{ fontFamily: "'Fascinate Inline', cursive", fontSize: '1.35rem', color: 'var(--text-primary)' }}>
          FashionOS
        </span>
      </div>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.75rem', color: '#ADDFF1' }}>Live</span>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {isSignedIn ? (
          <button
            className="cta-btn"
            style={{ padding: '10px 22px', fontSize: '0.875rem', animation: 'none' }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard <ArrowRight size={14} />
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="cta-btn" style={{ padding: '10px 22px', fontSize: '0.875rem', animation: 'none' }}>
              Sign In <ArrowRight size={14} />
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  )
}