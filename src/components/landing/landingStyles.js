const STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(173,223,241,0.3); }
    50% { box-shadow: 0 0 40px rgba(173,223,241,0.6), 0 0 80px rgba(173,223,241,0.2); }
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
  .orb-1 { width: 500px; height: 500px; background: rgba(0,49,82,0.55); top: -120px; left: -100px; animation-delay: 0s; }
  .orb-2 { width: 380px; height: 380px; background: rgba(173,223,241,0.28); top: 100px; right: -80px; animation-delay: -6s; }
  .orb-3 { width: 300px; height: 300px; background: rgba(0,49,82,0.4); bottom: 200px; left: 30%; animation-delay: -12s; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(173,223,241,0.1);
    border: 1px solid rgba(173,223,241,0.25);
    font-size: 0.75rem;
    color: #ADDFF1;
    margin-bottom: 28px;
    animation: slide-up 0.6s ease both;
  }

  .hero-title {
    font-family: 'Alfa Slab One', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: 1.08;
    color: var(--text-primary);
    animation: slide-up 0.7s ease 0.1s both;
  }

  .hero-title .accent {
    background: linear-gradient(135deg, #ADDFF1, #c5ebf8, #ADDFF1);
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
    background: linear-gradient(135deg, #003152, #ADDFF1);
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.25s ease;
    animation: pulse-glow 3s ease-in-out infinite, slide-up 0.7s ease 0.3s both;
    font-family: 'Story Script', cursive;
    text-decoration: none;
  }
  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 16px 40px rgba(173,223,241,0.4);
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
    font-family: 'Story Script', cursive;
  }
  .cta-secondary:hover {
    background: var(--hover-bg);
    border-color: rgba(173,223,241,0.4);
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
    background: linear-gradient(135deg, rgba(173,223,241,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .feature-card:hover {
    transform: translateY(-4px);
    border-color: rgba(173,223,241,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }

  .agent-card {
    padding: 22px 18px;
    border-radius: 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: default;
  }
  .agent-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(173,223,241,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  .agent-card:hover {
    transform: translateY(-4px);
    border-color: rgba(173,223,241,0.3);
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
    background: #ADDFF1;
    position: relative;
    display: inline-block;
    flex-shrink: 0;
  }
  .live-dot::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #ADDFF1;
    animation: ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite;
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(173,223,241,0.08);
    border: 1px solid rgba(173,223,241,0.2);
    font-size: 0.72rem;
    color: #ADDFF1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .gradient-line {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, #003152, #ADDFF1);
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
    background: rgba(0,14,31,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(173,223,241,0.1);
    transition: background 0.25s;
  }
  [data-theme="light"] .nav-bar {
    background: rgba(228,244,252,0.9);
    border-bottom-color: rgba(173,223,241,0.2);
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
    color: #ADDFF1;
    border-color: #ADDFF1;
  }

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
    background: linear-gradient(135deg, rgba(173,223,241,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

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
    border-color: rgba(173,223,241,0.25);
    transform: translateX(4px);
  }

  @media (max-width: 1024px) {
    .integrations-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .nav-bar { padding: 14px 20px; }
    .orb { display: none; }
    .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .meta-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .integrations-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 480px) {
    .features-grid { grid-template-columns: 1fr !important; }
    .agent-grid { grid-template-columns: 1fr !important; }
    .meta-grid { grid-template-columns: 1fr !important; }
    .integrations-grid { grid-template-columns: 1fr !important; }
  }

  [data-theme="light"] .hero-title .accent {
    background: linear-gradient(135deg, #003152, #005b8a, #003152);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

export default STYLES