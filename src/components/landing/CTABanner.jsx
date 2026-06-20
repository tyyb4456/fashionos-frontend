import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'

const CHECK_ITEMS = [
  'No agents to configure — ready out of the box',
  'Shopify + Meta integrations via MCP servers',
  'WhatsApp alerts and daily digests included',
]

export default function CTABanner() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <section style={{
      padding: '20px 24px 120px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', position: 'relative', zIndex: 1,
    }}>
      <div style={{
        padding: '56px 40px', borderRadius: 24,
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        maxWidth: 640, width: '100%',
        boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Zap icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'linear-gradient(135deg, #003152, #ADDFF1)',
          boxShadow: '0 8px 24px rgba(173,223,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Zap size={24} color="white" />
        </div>

        <h2 style={{
          fontFamily: "'Fascinate Inline', cursive",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: 'var(--text-primary)', margin: '0 0 14px', lineHeight: 1.2,
        }}>
          Ready to automate your brand?
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 32px', lineHeight: 1.7 }}>
          Sign in to access your dashboard and let FashionOS take the operational load off your plate.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {isSignedIn ? (
            <button
              className="cta-btn"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="cta-btn" style={{ width: '100%', justifyContent: 'center' }}>
                Sign In to Dashboard <ArrowRight size={16} />
              </button>
            </SignInButton>
          )}

          {CHECK_ITEMS.map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              <CheckCircle size={13} color="#ADDFF1" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}