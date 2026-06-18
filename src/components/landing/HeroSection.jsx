import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Activity } from 'lucide-react'
import { stats } from './LandingData.jsx'

export default function HeroSection() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '120px 24px 80px',
      position: 'relative', zIndex: 1,
    }}>
      <div className="hero-badge">
        <Activity size={13} />
        Autonomous Multi-Agent Fashion OS
      </div>

      <h1 className="hero-title">
        Your Brand.<br />
        <span className="accent">Always On.</span>
      </h1>

      <p className="hero-sub" style={{ margin: '24px auto 40px' }}>
        FashionOS runs 8 specialised AI agents 24/7 — managing inventory,
        pricing, content, ads, and customer DMs for your fashion brand.
        You just approve the big calls.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {isSignedIn ? (
          <button className="cta-btn" onClick={() => navigate('/dashboard')}>
            Go to Dashboard <ArrowRight size={16} />
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="cta-btn">
              Get Started <ArrowRight size={16} />
            </button>
          </SignInButton>
        )}
        <button
          className="cta-secondary"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          See how it works
        </button>
      </div>

      {/* Stat chips */}
      <div
        className="stats-row"
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12, marginTop: 72, maxWidth: 720, width: '100%',
          animation: 'slide-up 0.8s ease 0.5s both',
        }}
      >
        {stats.map((s) => (
          <div className="stat-chip" key={s.label}>
            <span style={{ fontFamily: "'Grape Nuts', cursive", fontSize: '2rem', color: '#4CA1AF', lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: '1.2rem' }}>{s.suffix}</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}