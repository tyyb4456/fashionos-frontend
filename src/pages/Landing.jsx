import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { useTheme } from '../context/ThemeContext'
import {
  Zap, Package, TrendingUp, DollarSign, FileText, RotateCcw,
  Megaphone, MessageCircle, ArrowRight, CheckCircle, Activity,
  Sparkles, Shield, Clock, Sun, Moon, Wifi
} from 'lucide-react'
import {
  SiMeta, SiInstagram, SiFacebook, SiWhatsapp, SiShopify, SiGoogle, SiTiktok
} from '@icons-pack/react-simple-icons'

const STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(76,161,175,0.3); }
    50% { box-shadow: 0 0 40px rgba(76,161,175,0.6), 0 0 80px rgba(76,161,175,0.2); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 10px) scale(0.97); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes ping-slow {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes scroll-x {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .landing-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    overflow-x: hidden;
    position: relative;
    transition: background 0.25s, color 0.25s;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: drift 18s ease-in-out infinite;
    opacity: 0.6;
  }
  [data-theme="light"] .orb { opacity: 0.25; }
  .orb-1 { width: 500px; height: 500px; background: rgba(44,62,80,0.55); top: -120px; left: -100px; animation-delay: 0s; }
  .orb-2 { width: 380px; height: 380px; background: rgba(76,161,175,0.28); top: 100px; right: -80px; animation-delay: -6s; }
  .orb-3 { width: 300px; height: 300px; background: rgba(44,62,80,0.4); bottom: 200px; left: 30%; animation-delay: -12s; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(76,161,175,0.1);
    border: 1px solid rgba(76,161,175,0.25);
    font-size: 0.75rem;
    color: #4CA1AF;
    margin-bottom: 28px;
    animation: slide-up 0.6s ease both;
  }

  .hero-title {
    font-family: 'Grape Nuts', cursive;
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: 1.08;
    color: var(--text-primary);
    animation: slide-up 0.7s ease 0.1s both;
  }

  .hero-title .accent {
    background: linear-gradient(135deg, #4CA1AF, #7dd3db, #4CA1AF);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .hero-sub {
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: var(--text-secondary);
    max-width: 580px;
    line-height: 1.7;
    animation: slide-up 0.7s ease 0.2s both;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2C3E50, #4CA1AF);
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.25s ease;
    animation: pulse-glow 3s ease-in-out infinite, slide-up 0.7s ease 0.3s both;
    font-family: 'Molle', cursive;
    text-decoration: none;
  }
  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 16px 40px rgba(76,161,175,0.4);
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    border-radius: 12px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    color: var(--text-body);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.25s ease;
    animation: slide-up 0.7s ease 0.35s both;
    font-family: 'Molle', cursive;
  }
  .cta-secondary:hover {
    background: var(--hover-bg);
    border-color: rgba(76,161,175,0.4);
    color: var(--text-primary);
    transform: translateY(-2px);
  }

  .feature-card {
    padding: 28px 24px;
    border-radius: 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(76,161,175,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .feature-card:hover {
    transform: translateY(-4px);
    border-color: rgba(76,161,175,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }

  .stat-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 24px 20px;
    border-radius: 14px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    text-align: center;
  }

  .live-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4CA1AF;
    position: relative;
    display: inline-block;
    flex-shrink: 0;
  }
  .live-dot::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4CA1AF;
    animation: ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(76,161,175,0.08);
    border: 1px solid rgba(76,161,175,0.2);
    font-size: 0.72rem;
    color: #4CA1AF;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .gradient-line {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, #2C3E50, #4CA1AF);
    border-radius: 4px;
    margin: 12px 0 0;
  }

  .nav-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 16px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(10,22,40,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(76,161,175,0.1);
    transition: background 0.25s;
  }
  [data-theme="light"] .nav-bar {
    background: rgba(238,243,248,0.9);
    border-bottom-color: rgba(76,161,175,0.2);
  }

  .theme-toggle {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    padding: 7px;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .theme-toggle:hover {
    color: #4CA1AF;
    border-color: #4CA1AF;
  }

  /* Meta integration cards */
  .meta-card {
    padding: 22px 20px;
    border-radius: 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .meta-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 32px rgba(0,0,0,0.15);
  }
  .meta-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(76,161,175,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Marquee strip */
  .marquee-wrap {
    overflow: hidden;
    width: 100%;
    padding: 8px 0;
  }
  .marquee-track {
    display: flex;
    gap: 32px;
    width: max-content;
    animation: scroll-x 22s linear infinite;
  }
  .marquee-wrap:hover .marquee-track { animation-play-state: paused; }

  .step-card {
    display: flex;
    gap: 24px;
    padding: 28px 24px;
    border-radius: 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    align-items: flex-start;
    transition: all 0.25s ease;
  }
  .step-card:hover {
    border-color: rgba(76,161,175,0.25);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .nav-bar { padding: 14px 20px; }
    .orb { display: none; }
    .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .meta-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 480px) {
    .features-grid { grid-template-columns: 1fr !important; }
    .meta-grid { grid-template-columns: 1fr !important; }
  }
`

const features = [
  { icon: Package,       title: 'Inventory Intelligence', desc: 'Real-time stock snapshots. AI flags critical stockouts and velocity anomalies before they cost you sales.',       color: '#4CA1AF' },
  { icon: TrendingUp,    title: 'Trend Radar',            desc: 'Google Trends + social signal aggregation across TikTok & Instagram. Know what buyers want next.',                color: '#5db8c5' },
  { icon: DollarSign,    title: 'Smart Pricing',          desc: 'Automated markdown and surge pricing. Auto-executes under 15% — everything else needs your sign-off.',           color: '#4CA1AF' },
  { icon: FileText,      title: 'Content Engine',         desc: 'Generates Instagram captions and TikTok scripts in Urdu-English mix, timed to PST peak hours.',                  color: '#5db8c5' },
  { icon: RotateCcw,     title: 'Returns Insights',       desc: 'Detects return patterns by SKU and reason. Surfaces quality and sizing issues before they escalate.',            color: '#4CA1AF' },
  { icon: Megaphone,     title: 'Ad Automation',          desc: 'Monitors campaign ROI and auto-adjusts budgets. Pauses underperformers and doubles down on winners.',            color: '#5db8c5' },
  { icon: MessageCircle, title: 'DM Autopilot',           desc: 'Classifies and drafts replies to customer DMs. Bulk inquiries, complaints, and compliments — all handled.',      color: '#4CA1AF' },
  { icon: Shield,        title: 'Human-in-the-Loop',      desc: 'High-stakes decisions always surface in the Approvals queue. You stay in control of what matters most.',         color: '#5db8c5' },
]

const stats = [
  { value: '8',   label: 'Specialized Agents',   suffix: '' },
  { value: '24',  label: 'Hour Automation',       suffix: '/7' },
  { value: '<15', label: 'Auto-exec Threshold',   suffix: '%' },
  { value: '∞',   label: 'Brands Supported',      suffix: '' },
]

const metaIntegrations = [
  {
    Icon: SiMeta,
    name: 'Meta Ads',
    badge: 'ads_mcp',
    color: '#0082FB',
    desc: 'Reads campaign performance, ROAS, and CPM across all Meta ad sets. Agent auto-pauses poor performers and flags budget increases for your approval.',
    pills: ['Campaign ROAS', 'Auto-pause', 'Budget control'],
  },
  {
    Icon: SiInstagram,
    name: 'Instagram',
    badge: 'social_mcp',
    color: '#E1306C',
    desc: 'Posts AI-generated content directly to your feed. Monitors story engagement and hashtag reach to feed back into the Trend agent.',
    pills: ['Content posting', 'Engagement tracking', 'Hashtag signals'],
  },
  {
    Icon: SiFacebook,
    name: 'Facebook',
    badge: 'social_mcp',
    color: '#1877F2',
    desc: 'Reads page DMs and manages customer interactions. Surfaces complaint threads and bulk order inquiries into the DM Autopilot queue.',
    pills: ['Page DMs', 'Complaint detection', 'Order inquiries'],
  },
  {
    Icon: SiWhatsapp,
    name: 'WhatsApp',
    badge: 'notify_mcp',
    color: '#25D366',
    desc: 'Delivers critical alerts and daily operational digests straight to your phone. Stockout warnings, approval reminders, and pipeline summaries.',
    pills: ['Critical alerts', 'Daily digest', 'Approval nudges'],
  },
]

const marqueeItems = [
  { Icon: SiShopify,   label: 'Shopify',        color: '#96BF48' },
  { Icon: SiMeta,      label: 'Meta Ads',        color: '#0082FB' },
  { Icon: SiInstagram, label: 'Instagram',       color: '#E1306C' },
  { Icon: SiFacebook,  label: 'Facebook',        color: '#1877F2' },
  { Icon: SiWhatsapp,  label: 'WhatsApp',        color: '#25D366' },
  { Icon: SiTiktok,    label: 'TikTok',          color: '#010101' },
  { Icon: SiGoogle,    label: 'Google Trends',   color: '#4285F4' },
]

const trendSources = [
  {
    id: 'apify',
    label: 'Apify',
    badge: 'social_mcp',
    color: '#00C4B4',
    icon: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    platforms: [
      { PIcon: SiTiktok,    name: 'TikTok',    posts: '15 posts / hashtag', color: '#010101' },
      { PIcon: SiInstagram, name: 'Instagram', posts: '10 posts / hashtag', color: '#E1306C' },
    ],
    bullets: [
      { stat: '4',   unit: 'hashtags',   desc: 'scraped per run (top 2 TikTok, top 2 IG)' },
      { stat: 'PK',  unit: 'geo-locked', desc: 'Pakistan region targeting only' },
      { stat: '24h', unit: 'cached',     desc: 'results cached to protect quota' },
    ],
    desc: 'Apify cloud actors scrape real post data from TikTok and Instagram hashtags — views, likes, captions, and engagement signals — without hitting platform API rate limits.',
    pills: ['#PakistaniFashion', '#FashionTikTokPK', '#PakistaniOutfits', 'GRWM'],
    pillLabel: 'Monitored hashtags',
  },
  {
    id: 'gtrends',
    label: 'Google Trends',
    badge: 'trends_mcp',
    color: '#4285F4',
    icon: ({ size }) => <SiGoogle size={size} color="#4285F4" />,
    platforms: [
      { PIcon: SiGoogle, name: 'Pytrends', posts: 'free · no quota', color: '#4285F4' },
    ],
    bullets: [
      { stat: '5',   unit: 'keywords',  desc: 'compared per run (3 base + 2 from catalog)' },
      { stat: '7d',  unit: 'window',    desc: 'rolling week for recency-weighted signals' },
      { stat: '0',   unit: 'cost',      desc: 'free via Pytrends — no API key needed' },
    ],
    desc: 'Pytrends pulls keyword interest-over-time data from Google Trends and cross-references it with catalog SKU names to surface rising demand before competitors react.',
    pills: ['lawn suit', 'co-ord set', 'cargo pants', 'linen kurta', 'modest fashion'],
    pillLabel: 'Base keywords',
  },
]

export default function Landing() {
  const { isSignedIn, isLoaded } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredMeta, setHoveredMeta] = useState(null)
  const [hoveredTrend, setHoveredTrend] = useState(null)


  return (
    <>
      <style>{STYLES}</style>

      <div className="landing-page">
        {/* Ambient orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav className="nav-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              boxShadow: '0 4px 14px rgba(76,161,175,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Grape Nuts', cursive", fontSize: '1.35rem', color: 'var(--text-primary)' }}>
              FashionOS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
              <span className="live-dot" />
              <span style={{ fontSize: '0.75rem', color: '#4CA1AF' }}>Live</span>
            </div>

            <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {isSignedIn ? (
              <button className="cta-btn" style={{ padding: '10px 22px', fontSize: '0.875rem', animation: 'none' }} onClick={() => navigate('/dashboard')}>
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

        {/* ── Hero ───────────────────────────────────────────── */}
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

          {/* stat chips */}
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

        {/* ── Integration Marquee ────────────────────────────── */}
        <div style={{ padding: '0 0 60px', position: 'relative', zIndex: 1 }}>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            Integrated with
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 22px', borderRadius: 999,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  whiteSpace: 'nowrap',
                }}>
                  <item.Icon size={16} color={item.color} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Meta & Social Integrations ─────────────────────── */}
        <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ margin: '0 auto 14px' }}>
              <Wifi size={11} />
              Meta Ecosystem
            </div>
            <h2 style={{
              fontFamily: "'Grape Nuts', cursive",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
              margin: 0, lineHeight: 1.2,
            }}>
              Built on Meta's stack.
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 500, margin: '12px auto 0', lineHeight: 1.7 }}>
              FashionOS connects directly to Meta Ads, Instagram, Facebook, and WhatsApp through dedicated MCP servers — no manual exports, no copy-paste.
            </p>
          </div>

          <div
            className="meta-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          >
            {metaIntegrations.map((m, i) => {
              const isHovered = hoveredMeta === i
              return (
                <div
                  key={m.name}
                  className="meta-card"
                  onMouseEnter={() => setHoveredMeta(i)}
                  onMouseLeave={() => setHoveredMeta(null)}
                  style={{
                    animation: `slide-up 0.6s ease ${0.1 + i * 0.08}s both`,
                    borderColor: isHovered ? `${m.color}40` : 'var(--card-border)',
                    boxShadow: isHovered ? `0 20px 40px ${m.color}15` : 'none',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: isHovered ? `${m.color}18` : 'var(--subtle-bg)',
                      border: `1px solid ${isHovered ? m.color + '40' : 'var(--subtle-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.25s',
                    }}>
                      <m.Icon size={20} color={m.color} />
                    </div>
                    <span style={{
                      fontSize: '0.65rem', padding: '3px 8px',
                      borderRadius: 999,
                      background: 'var(--inner-bg)',
                      border: '1px solid var(--item-border)',
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                    }}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily: "'Grape Nuts', cursive",
                      fontSize: '1.1rem', color: 'var(--text-primary)',
                      margin: '0 0 6px',
                    }}>{m.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                      {m.desc}
                    </p>
                  </div>

                  {/* Capability pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {m.pills.map(pill => (
                      <span key={pill} style={{
                        fontSize: '0.68rem', padding: '3px 9px',
                        borderRadius: 999,
                        background: isHovered ? `${m.color}12` : 'var(--subtle-bg)',
                        border: `1px solid ${isHovered ? m.color + '35' : 'var(--subtle-border)'}`,
                        color: isHovered ? m.color : 'var(--text-secondary)',
                        transition: 'all 0.25s',
                      }}>
                        {pill}
                      </span>
                    ))}
                  </div>

                  {/* Bottom accent line */}
                  <div style={{
                    height: 2, borderRadius: 4,
                    background: `linear-gradient(90deg, ${m.color}60, transparent)`,
                    opacity: isHovered ? 1 : 0.3,
                    transition: 'opacity 0.25s',
                  }} />
                </div>
              )
            })}
          </div>

          {/* MCP architecture note */}
          <div style={{
            marginTop: 28,
            padding: '18px 24px',
            borderRadius: 12,
            background: 'var(--subtle-bg)',
            border: '1px solid var(--subtle-border)',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <Zap size={15} color="#4CA1AF" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Model Context Protocol (MCP)</strong> — each integration runs as an isolated MCP server, so agents talk to real APIs without ever holding credentials in the pipeline itself.
            </span>
          </div>
        </section>

        {/* ── Trend Intelligence ────────────────────────────── */}
        <section style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ margin: '0 auto 14px' }}>
              <TrendingUp size={11} />
              Trend Intelligence
            </div>
            <h2 style={{
              fontFamily: "'Grape Nuts', cursive",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
            }}>
              Know what's trending. Act first.
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.7 }}>
              The Trend agent combines real social scraping via Apify with free keyword signals from Google Trends to map rising demand to your live catalog — before your competitors react.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {trendSources.map((src, i) => {
              const isHovered = hoveredTrend === i
              const IconComp = src.icon
              return (
                <div
                  key={src.id}
                  onMouseEnter={() => setHoveredTrend(i)}
                  onMouseLeave={() => setHoveredTrend(null)}
                  style={{
                    borderRadius: 18,
                    background: 'var(--card-bg)',
                    border: `1px solid ${isHovered ? src.color + '45' : 'var(--card-border)'}`,
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered ? `0 24px 48px ${src.color}15` : 'none',
                    animation: `slide-up 0.6s ease ${0.1 + i * 0.12}s both`,
                  }}
                >
                  {/* Header stripe */}
                  <div style={{
                    padding: '22px 24px 18px',
                    borderBottom: '1px solid var(--item-border)',
                    background: isHovered ? `${src.color}08` : 'transparent',
                    transition: 'background 0.25s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 13,
                          background: isHovered ? `${src.color}18` : 'var(--subtle-bg)',
                          border: `1px solid ${isHovered ? src.color + '40' : 'var(--subtle-border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.25s', flexShrink: 0,
                        }}>
                          <IconComp size={22} color={src.color} />
                        </div>
                        <div>
                          <h3 style={{
                            fontFamily: "'Grape Nuts', cursive",
                            fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 3px',
                          }}>{src.label}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {src.platforms.map(p => (
                              <span key={p.name} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                fontSize: '0.7rem', color: 'var(--text-secondary)',
                              }}>
                                <p.PIcon size={11} color={p.color} />
                                {p.name}
                                <span style={{ color: 'var(--text-muted)' }}>·</span>
                                <span style={{ color: 'var(--text-muted)' }}>{p.posts}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.65rem', padding: '3px 8px', borderRadius: 999,
                        background: 'var(--inner-bg)', border: '1px solid var(--item-border)',
                        color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'nowrap',
                      }}>
                        {src.badge}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                      {src.desc}
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      {src.bullets.map(b => (
                        <div key={b.unit} style={{
                          padding: '12px 10px',
                          borderRadius: 10,
                          background: 'var(--inner-bg)',
                          border: '1px solid var(--item-border)',
                          textAlign: 'center',
                        }}>
                          <span style={{
                            fontFamily: "'Grape Nuts', cursive",
                            fontSize: '1.3rem', color: src.color, display: 'block', lineHeight: 1,
                          }}>{b.stat}</span>
                          <span style={{ fontSize: '0.65rem', color: '#4CA1AF', display: 'block', marginTop: 2 }}>{b.unit}</span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4, display: 'block', lineHeight: 1.4 }}>{b.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hashtag / keyword pills */}
                    <div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {src.pillLabel}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {src.pills.map(pill => (
                          <span key={pill} style={{
                            fontSize: '0.7rem', padding: '3px 10px',
                            borderRadius: 999,
                            background: isHovered ? `${src.color}12` : 'var(--subtle-bg)',
                            border: `1px solid ${isHovered ? src.color + '35' : 'var(--subtle-border)'}`,
                            color: isHovered ? src.color : 'var(--text-secondary)',
                            transition: 'all 0.25s', fontFamily: 'monospace',
                          }}>
                            {pill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div style={{
                      height: 2, borderRadius: 4,
                      background: `linear-gradient(90deg, ${src.color}70, transparent)`,
                      opacity: isHovered ? 1 : 0.25,
                      transition: 'opacity 0.25s',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Flow note */}
          <div style={{
            marginTop: 24,
            padding: '16px 22px',
            borderRadius: 12,
            background: 'var(--subtle-bg)',
            border: '1px solid var(--subtle-border)',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <TrendingUp size={14} color="#4CA1AF" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Pipeline order matters —</strong> the Trend agent runs after Inventory and <em>before</em> Pricing, so trend signals are available when the Pricing agent decides hold vs. markdown.
            </span>
          </div>
        </section>

        {/* ── Features Grid ──────────────────────────────────── */}
        <section id="features" style={{ padding: '20px 24px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label" style={{ margin: '0 auto 14px' }}>
              <Sparkles size={11} />
              Agent Pipeline
            </div>
            <h2 style={{
              fontFamily: "'Grape Nuts', cursive",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
              margin: 0, lineHeight: 1.2,
            }}>
              Eight agents. One pipeline.
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem', maxWidth: 480, margin: '12px auto 0' }}>
              Each agent specialises in one domain. They run in sequence, share state, and surface only what needs your eye.
            </p>
          </div>

          <div
            className="features-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          >
            {features.map((f, i) => {
              const Icon = f.icon
              const isHovered = hoveredFeature === i
              return (
                <div
                  key={f.title}
                  className="feature-card"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{ animation: `slide-up 0.6s ease ${0.1 + i * 0.05}s both` }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: isHovered ? 'linear-gradient(135deg, #2C3E50, #4CA1AF)' : 'var(--subtle-bg)',
                    border: '1px solid var(--subtle-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                    transition: 'all 0.25s ease',
                    boxShadow: isHovered ? '0 4px 16px rgba(76,161,175,0.3)' : 'none',
                  }}>
                    <Icon size={18} color={isHovered ? '#fff' : '#4CA1AF'} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Grape Nuts', cursive",
                    fontSize: '1.05rem', color: 'var(--text-primary)',
                    margin: '0 0 8px',
                  }}>{f.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                  <div className="gradient-line" style={{ opacity: isHovered ? 1 : 0.4, transition: 'opacity 0.25s' }} />
                </div>
              )
            })}
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────── */}
        <section style={{ padding: '20px 24px 80px', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ margin: '0 auto 14px' }}>
              <Clock size={11} />
              Workflow
            </div>
            <h2 style={{
              fontFamily: "'Grape Nuts', cursive",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Set it. Supervise it.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '01', title: 'Connect your Shopify store',    desc: 'Link your store via OAuth. Agents start reading your catalog, orders, and ad campaigns immediately.' },
              { step: '02', title: 'Agents run on schedule',        desc: 'Hourly inventory sweeps, daily full pipeline runs, and event-triggered webhooks keep everything current.' },
              { step: '03', title: 'Review the Approvals queue',    desc: 'High-stakes decisions land in your queue with full context. One tap to approve or reject.' },
              { step: '04', title: 'Get WhatsApp alerts',           desc: 'Critical stockouts, approval reminders, and daily pipeline digests land straight on your phone via WhatsApp.' },
            ].map((item, i) => (
              <div key={item.step} className="step-card" style={{ animation: `slide-up 0.6s ease ${0.1 + i * 0.1}s both` }}>
                <div style={{
                  minWidth: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Grape Nuts', cursive", fontSize: '1.1rem', color: '#fff', flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Grape Nuts', cursive", fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <section style={{
          padding: '20px 24px 120px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            padding: '56px 40px',
            borderRadius: 24,
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            maxWidth: 640, width: '100%',
            boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              boxShadow: '0 8px 24px rgba(76,161,175,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Zap size={24} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Grape Nuts', cursive",
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
                <button className="cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>
                  Go to Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="cta-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign In to Dashboard <ArrowRight size={16} />
                  </button>
                </SignInButton>
              )}

              {[
                'No agents to configure — ready out of the box',
                'Shopify + Meta integrations via MCP servers',
                'WhatsApp alerts and daily digests included',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  <CheckCircle size={13} color="#4CA1AF" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer style={{
          padding: '28px 40px',
          borderTop: '1px solid var(--card-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              background: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={11} color="white" />
            </div>
            <span style={{ fontFamily: "'Grape Nuts', cursive", color: 'var(--text-secondary)', fontSize: '1rem' }}>FashionOS</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Autonomous fashion brand management. Built for scale.
          </span>
        </footer>
      </div>
    </>
  )
}
