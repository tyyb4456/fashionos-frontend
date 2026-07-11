import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'

const CHECK_ITEMS = [
  'Shopify + Meta connected via OAuth — no manual exports',
  'LangGraph pipeline auto-runs daily, hourly & on webhooks',
  'Long-term brand memory that learns your preferences',
  'WhatsApp alerts and daily digests included',
  'Human-in-the-loop approval queue for high-stakes decisions',
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
        maxWidth: 680, width: '100%',
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
          fontFamily: "'Alfa Slab One', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: 'var(--text-primary)', margin: '0 0 14px', lineHeight: 1.2,
        }}>
          Ready to automate your brand?
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 32px', lineHeight: 1.7 }}>
          Connect your Shopify store and let FashionOS handle the operational work —
          inventory, pricing, ads, content, returns, and DMs. Built for Pakistani fashion brands.
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8, width: '100%', alignItems: 'flex-start' }}>
            {CHECK_ITEMS.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={13} color="#ADDFF1" style={{ flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}