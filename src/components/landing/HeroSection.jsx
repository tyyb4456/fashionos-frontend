import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Cpu } from 'lucide-react'
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
      {/* Top badge */}
      <div className="hero-badge">
        <Cpu size={13} />
        LangGraph · 8 Agents · Gemini 2.5 Flash
      </div>

      <h1 className="hero-title">
        Your Pakistani<br />
        Fashion Brand.<br />
        <span className="accent">On Autopilot.</span>
      </h1>

      <p className="hero-sub" style={{ margin: '24px auto 40px' }}>
        FashionOS runs 8 specialised AI agents 24/7 — managing inventory,
        pricing, content, ads, and DMs for your Shopify fashion brand in Pakistan.
        You approve the big calls. Everything else just happens.
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
          onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
        >
          See the agent pipeline
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
            <span style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '2rem', color: '#ADDFF1', lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: '1.2rem' }}>{s.suffix}</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Powered-by strip */}
      <div style={{
        marginTop: 40, display: 'flex', alignItems: 'center', gap: 10,
        flexWrap: 'wrap', justifyContent: 'center',
        fontSize: '0.72rem', color: 'var(--text-muted)',
      }}>
        <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Powered by</span>
        {['LangGraph', 'Gemini 2.5 Flash Lite', 'FastAPI', 'Celery + Redis', 'Clerk'].map(tech => (
          <span key={tech} style={{
            padding: '3px 10px', borderRadius: 999,
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            color: 'var(--text-secondary)',
          }}>{tech}</span>
        ))}
      </div>
    </section>
  )
}