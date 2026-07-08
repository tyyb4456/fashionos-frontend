import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { agents, howItWorksSteps, integrations, marqueeItems } from './LandingData.jsx'

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#D4A87A'
const BG = '#0D0D0D'
const CARD_BG = '#1A1A1A'
const CREAM = '#F2EDE4'

const styles = `
  @keyframes marquee-noir {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    50%       { box-shadow: 0 0 0 8px rgba(201,168,76,0.18); }
  }

  .noir-page { background: ${BG}; color: ${CREAM}; font-family: 'Inter', sans-serif; min-height: 100vh; overflow-x: hidden; }
  .noir-page * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
  .noir-display { font-family: 'Cormorant Garamond', serif !important; }

  .noir-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(13,13,13,0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(201,168,76,0.18);
    transition: background 0.2s;
  }

  .noir-logo {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.5rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: ${GOLD};
  }

  .noir-nav-links {
    display: flex; gap: 40px;
    font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: rgba(242,237,228,0.6);
  }
  .noir-nav-links a { text-decoration: none; color: inherit; transition: color 0.2s; cursor: pointer; }
  .noir-nav-links a:hover { color: ${GOLD}; }

  .noir-sign-btn {
    padding: 9px 26px;
    border: 1px solid ${GOLD};
    color: ${GOLD};
    background: transparent;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.22s;
    font-family: 'Inter', sans-serif !important;
  }
  .noir-sign-btn:hover { background: ${GOLD}; color: ${BG}; }

  .noir-dashboard-btn {
    padding: 9px 26px;
    border: none;
    color: ${BG};
    background: ${GOLD};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.22s;
    font-family: 'Inter', sans-serif !important;
  }
  .noir-dashboard-btn:hover { background: ${GOLD_LIGHT}; }

  /* Hero */
  .noir-hero { display: flex; min-height: 100vh; padding-top: 84px; border-bottom: 1px solid rgba(201,168,76,0.15); }
  .noir-hero-left { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 64px 48px 64px 64px; animation: fade-up 0.8s ease both; }
  .noir-hero-right { flex: 1; position: relative; overflow: hidden; min-height: 500px; }

  .noir-eyebrow {
    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.28em;
    color: ${GOLD}; margin-bottom: 28px;
  }

  .noir-h1 {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: clamp(3.2rem, 6vw, 5.8rem);
    line-height: 0.92; font-weight: 300;
    color: ${CREAM}; margin: 0 0 32px;
  }
  .noir-h1 em { color: ${GOLD}; font-style: italic; }

  .noir-hero-sub {
    font-size: 1.05rem; font-weight: 300; line-height: 1.75;
    color: rgba(242,237,228,0.62); max-width: 440px; margin-bottom: 44px;
  }

  .noir-cta-row { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }

  .noir-cta-primary {
    padding: 16px 44px; background: ${GOLD}; color: ${BG};
    border: none; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer;
    transition: all 0.22s; font-family: 'Inter', sans-serif !important;
    animation: pulse-gold 3s ease-in-out infinite;
  }
  .noir-cta-primary:hover { background: ${GOLD_LIGHT}; transform: translateY(-2px); }

  .noir-cta-secondary {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.25rem; font-style: italic; color: ${GOLD};
    cursor: pointer; border-bottom: 1px solid rgba(201,168,76,0.4);
    padding-bottom: 2px; transition: color 0.2s; background: none; border-top: none; border-left: none; border-right: none;
  }
  .noir-cta-secondary:hover { color: ${GOLD_LIGHT}; }

  /* Hero image chips */
  .noir-chips { position: absolute; bottom: 44px; left: 28px; display: flex; gap: 10px; flex-wrap: wrap; }
  .noir-chip {
    background: rgba(13,13,13,0.84); backdrop-filter: blur(10px);
    border: 1px solid rgba(201,168,76,0.45); padding: 10px 18px;
  }
  .noir-chip-label {
    display: block; font-size: 0.58rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: ${GOLD}; margin-bottom: 3px;
  }
  .noir-chip-val {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.25rem; color: ${CREAM};
  }

  /* Marquee */
  .noir-marquee-wrap { overflow: hidden; position: relative; padding: 24px 0; background: rgba(26,26,26,0.55); border-bottom: 1px solid rgba(201,168,76,0.1); }
  .noir-marquee-fade-l { position: absolute; left: 0; top: 0; bottom: 0; width: 80px; background: linear-gradient(to right, ${BG}, transparent); z-index: 2; }
  .noir-marquee-fade-r { position: absolute; right: 0; top: 0; bottom: 0; width: 80px; background: linear-gradient(to left, ${BG}, transparent); z-index: 2; }
  .noir-marquee-track { display: flex; width: max-content; animation: marquee-noir 28s linear infinite; }
  .noir-marquee-track:hover { animation-play-state: paused; }
  .noir-marquee-item {
    flex-shrink: 0; padding: 0 44px; display: flex; align-items: center;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.4rem; text-transform: uppercase; letter-spacing: 0.14em;
    color: rgba(201,168,76,0.32); white-space: nowrap;
  }

  /* Sections */
  .noir-section { padding: 112px 64px; max-width: 1280px; margin: 0 auto; }
  .noir-section-border { border-bottom: 1px solid rgba(201,168,76,0.1); }

  .noir-section-title {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: clamp(2.8rem, 5vw, 5rem); font-weight: 300;
    line-height: 1; margin-bottom: 16px; color: ${CREAM};
  }
  .noir-section-title em { color: ${GOLD}; font-style: italic; }

  .noir-section-sub { font-size: 0.95rem; font-weight: 300; line-height: 1.75; color: rgba(242,237,228,0.52); max-width: 500px; margin-bottom: 64px; }

  /* Agent cards */
  .noir-agent-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .noir-agent-card {
    background: ${CARD_BG}; border: 1px solid rgba(201,168,76,0.28);
    padding: 32px; position: relative; overflow: hidden;
    transition: border-color 0.22s, background 0.22s;
  }
  .noir-agent-card:hover { border-color: rgba(201,168,76,0.65); background: #1f1f1f; }
  .noir-agent-card::before {
    content: ''; position: absolute; top: 0; right: 0;
    width: 110px; height: 110px;
    background: radial-gradient(circle, rgba(201,168,76,0.07), transparent);
    border-radius: 50%; transform: translate(40%, -40%);
    pointer-events: none;
  }
  .noir-agent-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .noir-agent-step {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 2.5rem; font-style: italic; color: ${GOLD}; line-height: 1;
  }
  .noir-agent-badge {
    font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.18em;
    padding: 4px 10px; border: 1px solid;
  }
  .noir-badge-auto { border-color: rgba(201,168,76,0.75); color: ${GOLD}; }
  .noir-badge-approval { border-color: rgba(242,237,228,0.2); color: rgba(242,237,228,0.38); }

  .noir-agent-name {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.65rem; color: ${CREAM}; margin-bottom: 10px; font-weight: 400;
  }
  .noir-agent-desc { font-size: 0.875rem; font-weight: 300; line-height: 1.7; color: rgba(242,237,228,0.52); }

  /* Platform cards */
  .noir-platform-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .noir-platform-card {
    padding: 28px; border: 1px solid rgba(201,168,76,0.18);
    background: rgba(26,26,26,0.7); transition: background 0.2s, border-color 0.2s;
  }
  .noir-platform-card:hover { background: ${CARD_BG}; border-color: rgba(201,168,76,0.4); }
  .noir-platform-icon { font-size: 2rem; margin-bottom: 16px; opacity: 0.85; }
  .noir-platform-name { font-family: 'Cormorant Garamond', serif !important; font-size: 1.4rem; color: ${GOLD}; margin-bottom: 6px; }
  .noir-platform-desc { font-size: 0.82rem; font-weight: 300; line-height: 1.7; color: rgba(242,237,228,0.5); margin-bottom: 14px; }
  .noir-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .noir-pill {
    font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em;
    padding: 3px 9px; border: 1px solid rgba(201,168,76,0.25); color: rgba(201,168,76,0.7);
  }

  /* How it works */
  .noir-hiw-inner { max-width: 680px; margin: 0 auto; }
  .noir-hiw-title-wrap { text-align: center; margin-bottom: 72px; }
  .noir-step-row {
    display: flex; gap: 28px; align-items: flex-start;
    padding: 28px 0; border-bottom: 1px solid rgba(201,168,76,0.1);
  }
  .noir-step-row:last-child { border-bottom: none; }
  .noir-step-num {
    flex-shrink: 0; width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid ${GOLD};
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 1.3rem; font-style: italic; color: ${GOLD};
    box-shadow: 0 0 14px rgba(201,168,76,0.14);
  }
  .noir-step-title { font-family: 'Cormorant Garamond', serif !important; font-size: 1.4rem; color: ${CREAM}; margin-bottom: 8px; }
  .noir-step-desc { font-size: 0.88rem; font-weight: 300; line-height: 1.75; color: rgba(242,237,228,0.54); }

  /* CTA */
  .noir-cta-section {
    padding: 120px 48px; text-align: center; position: relative; overflow: hidden;
    border-top: 1px solid rgba(201,168,76,0.1);
  }
  .noir-cta-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 560px; height: 560px; border-radius: 50%;
    background: rgba(201,168,76,0.07); filter: blur(90px); pointer-events: none;
  }
  .noir-cta-title {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: clamp(2.6rem, 5vw, 4.5rem); font-weight: 300;
    color: ${CREAM}; margin-bottom: 20px; line-height: 1.1;
    position: relative; z-index: 1;
  }
  .noir-cta-title em { color: ${GOLD}; font-style: italic; }
  .noir-cta-sub { font-size: 0.95rem; font-weight: 300; color: rgba(242,237,228,0.5); margin-bottom: 48px; position: relative; z-index: 1; }

  .noir-cta-checklist { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-bottom: 48px; position: relative; z-index: 1; }
  .noir-check-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: rgba(242,237,228,0.65); }
  .noir-check-dot { width: 6px; height: 6px; border-radius: 50%; background: ${GOLD}; flex-shrink: 0; }

  .noir-cta-btn {
    padding: 18px 60px; background: ${GOLD}; color: ${BG};
    border: none; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase; cursor: pointer;
    transition: all 0.22s; position: relative; z-index: 1;
    box-shadow: 0 0 40px rgba(201,168,76,0.22);
    font-family: 'Inter', sans-serif !important;
  }
  .noir-cta-btn:hover { background: ${GOLD_LIGHT}; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,0.3); }

  /* Footer */
  .noir-footer {
    padding: 36px 64px; display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(201,168,76,0.16); flex-wrap: wrap; gap: 16px;
  }
  .noir-footer-logo { font-family: 'Cormorant Garamond', serif !important; font-size: 1.3rem; text-transform: uppercase; letter-spacing: 0.18em; color: ${GOLD}; }
  .noir-live { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(242,237,228,0.4); }
  .noir-live-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GOLD}; box-shadow: 0 0 8px rgba(201,168,76,0.8); }
  .noir-copy { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(242,237,228,0.28); }

  @media (max-width: 900px) {
    .noir-nav { padding: 16px 24px; }
    .noir-nav-links { display: none; }
    .noir-hero { flex-direction: column; }
    .noir-hero-left { padding: 40px 24px 32px; }
    .noir-hero-right { min-height: 55vw; }
    .noir-section { padding: 72px 24px; }
    .noir-agent-grid { grid-template-columns: 1fr; }
    .noir-platform-grid { grid-template-columns: repeat(2, 1fr); }
    .noir-footer { padding: 28px 24px; }
  }
  @media (max-width: 600px) {
    .noir-platform-grid { grid-template-columns: 1fr; }
  }
`

const PLATFORM_ICONS = {
  Shopify: '🛍️',
  'Meta Ads': '♾️',
  Instagram: '📸',
  Facebook: '👥',
  WhatsApp: '💬',
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

export default function LandingNoir() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  const allMarquee = [...marqueeItems, ...marqueeItems]

  return (
    <div className="noir-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className="noir-nav">
        <div className="noir-logo">
          FASHION<span style={{ color: CREAM }}>OS</span>{' '}
          <span style={{ fontSize: '0.75rem', verticalAlign: 'super' }}>⚡</span>
        </div>

        <div className="noir-nav-links">
          <a href="#agents">Agents</a>
          <a href="#integrations">Integrations</a>
          <a href="#process">Process</a>
        </div>

        {isSignedIn ? (
          <button className="noir-dashboard-btn" onClick={() => navigate('/dashboard')}>
            Dashboard →
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="noir-sign-btn">Sign In</button>
          </SignInButton>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="noir-hero">
        {/* Left: Text */}
        <div className="noir-hero-left">
          <div className="noir-eyebrow">LangGraph · 8 Agents · Gemini 2.5 Flash</div>

          <h1 className="noir-h1">
            Run Your<br />
            <em>Fashion Brand</em><br />
            on Autopilot
          </h1>

          <p className="noir-hero-sub">
            A suite of 8 elite AI agents tailored for Pakistani Shopify brands —
            managing inventory, pricing, content, ads, and DMs while you approve the big calls.
          </p>

          <div className="noir-cta-row">
            {isSignedIn ? (
              <button className="noir-cta-primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="noir-cta-primary">Get Started</button>
              </SignInButton>
            )}
            <button
              className="noir-cta-secondary"
              onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View the Pipeline →
            </button>
          </div>
        </div>

        {/* Right: Fashion photo */}
        <div className="noir-hero-right">
          <img
            src="\pexels-ahcapture-29817596.jpg"
            alt="Fashion editorial"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D0D 0%, transparent 45%, rgba(13,13,13,0.2) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0D0D0D 0%, transparent 20%)' }} />

          {/* Floating stat chips */}
          <div className="noir-chips">
            {[
              { label: 'Fleet', val: '8 Agents' },
              { label: 'Uptime', val: '24 / 7' },
              { label: 'Auto Threshold', val: '< 15%' },
            ].map(c => (
              <div key={c.label} className="noir-chip">
                <span className="noir-chip-label">{c.label}</span>
                <span className="noir-chip-val">{c.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <div className="noir-marquee-wrap">
        <div className="noir-marquee-fade-l" />
        <div className="noir-marquee-fade-r" />
        <div className="noir-marquee-track">
          {allMarquee.map((item, i) => (
            <div key={i} className="noir-marquee-item">
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Agents ────────────────────────────────────── */}
      <div id="agents" className="noir-section-border">
        <div className="noir-section">
          <div className="noir-section-title">The <em>Atelier</em></div>
          <p className="noir-section-sub">
            Eight specialized agents working in symphony — from trend intelligence to DM concierge.
            Each one scoped, sequenced, and supervised by LangGraph.
          </p>
          <div className="noir-agent-grid">
            {agents.map(agent => (
              <div key={agent.step} className="noir-agent-card">
                <div className="noir-agent-header">
                  <span className="noir-agent-step">{agent.step}</span>
                  <span className={`noir-agent-badge ${agent.autoExec ? 'noir-badge-auto' : 'noir-badge-approval'}`}>
                    {agent.autoExec ? 'Auto-exec' : 'Approval Queue'}
                  </span>
                </div>
                <div className="noir-agent-name">{agent.title}</div>
                <div className="noir-agent-desc">{agent.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Integrations ──────────────────────────────── */}
      <div id="integrations" className="noir-section-border" style={{ background: 'rgba(26,26,26,0.35)' }}>
        <div className="noir-section">
          <div className="noir-section-title">Seamless <em>Connectivity</em></div>
          <p className="noir-section-sub">
            Your entire brand ecosystem unified under one intelligent command center via MCP.
          </p>
          <div className="noir-platform-grid">
            {integrations.map(p => (
              <div key={p.name} className="noir-platform-card">
                <div className="noir-platform-icon">{PLATFORM_ICONS[p.name] ?? '🔗'}</div>
                <div className="noir-platform-name">{p.name}</div>
                <div className="noir-platform-desc">{p.desc}</div>
                <div className="noir-pills">
                  {p.pills.map(pill => (
                    <span key={pill} className="noir-pill">{pill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it Works ──────────────────────────────── */}
      <div id="process" style={{ background: 'rgba(26,26,26,0.42)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="noir-section">
          <div className="noir-hiw-inner">
            <div className="noir-hiw-title-wrap">
              <div className="noir-section-title" style={{ textAlign: 'center' }}>The <em>Method</em></div>
            </div>
            {howItWorksSteps.map((step, i) => (
              <div key={step.step} className="noir-step-row">
                <div className="noir-step-num">{ROMAN[i]}</div>
                <div>
                  <div className="noir-step-title">{step.title}</div>
                  <div className="noir-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────── */}
      <div className="noir-cta-section">
        <div className="noir-cta-glow" />
        <div className="noir-cta-title">
          Start Automating Your<br />
          <em>Brand Today</em>
        </div>
        <p className="noir-cta-sub">
          Connect Shopify + Meta in minutes. Human-in-the-loop for every big decision.
        </p>
        <div className="noir-cta-checklist">
          {['Shopify + Meta OAuth', 'WhatsApp alerts', 'Human-in-the-loop approvals', '8 specialized agents', 'LangGraph supervisor'].map(item => (
            <div key={item} className="noir-check-item">
              <div className="noir-check-dot" />
              {item}
            </div>
          ))}
        </div>
        {isSignedIn ? (
          <button className="noir-cta-btn" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="noir-cta-btn">Begin Your Journey</button>
          </SignInButton>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="noir-footer">
        <div className="noir-footer-logo">
          FASHION<span style={{ color: CREAM }}>OS</span>{' '}
          <span style={{ fontSize: '0.7rem', verticalAlign: 'super' }}>⚡</span>
        </div>
        <div className="noir-live">
          <div className="noir-live-dot" />
          Systems Operational
        </div>
        <div className="noir-copy">
          &copy; {new Date().getFullYear()} FashionOS. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
