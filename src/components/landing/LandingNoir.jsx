import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Sparkles, ArrowRight, ArrowDown, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { agents, howItWorksSteps, integrations, marqueeItems } from './LandingData.jsx'

const GOLD = '#2F9E6E'
const GOLD_LIGHT = '#4FBE94'
const BG = '#0B1310'
const CREAM = '#F2EDE4'

const styles = `
  /* Keyframes */
  @keyframes marquee-noir {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(47,158,110,0); }
    50%       { box-shadow: 0 0 0 10px rgba(47,158,110,0.18); }
  }
  @keyframes float-slow {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.05); }
    100% { transform: translate(-20px, 20px) scale(0.95); }
  }
  @keyframes text-shimmer {
    to { background-position: 200% center; }
  }
  @keyframes bounce-down {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
    60% { transform: translateY(-4px); }
  }

  /* Global page adjustments */
  .noir-page {
    background: ${BG};
    color: ${CREAM};
    font-family: 'Montserrat', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }
  .noir-page * {
    font-family: 'Montserrat', sans-serif;
    box-sizing: border-box;
  }
  .noir-display {
    font-family: 'Permanent Marker', cursive !important;
  }

  /* Ambient Blur Orbs */
  .ambient-orb {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(47,158,110,0.06) 0%, rgba(47,158,110,0) 70%);
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 { top: -100px; left: -100px; animation: float-slow 25s infinite alternate ease-in-out; }
  .orb-2 { top: 35%; right: -200px; animation: float-slow 30s infinite alternate-reverse ease-in-out; }
  .orb-3 { bottom: 10%; left: -200px; animation: float-slow 28s infinite alternate ease-in-out; }

  /* Scroll Reveal animation triggers */
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 80ms; }
  .reveal-delay-2 { transition-delay: 160ms; }
  .reveal-delay-3 { transition-delay: 240ms; }
  .reveal-delay-4 { transition-delay: 320ms; }

  /* Navbar */
  .noir-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 64px;
    background: rgba(11, 19, 16, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(47, 158, 110, 0.1);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .noir-nav.scrolled {
    padding: 16px 64px;
    background: rgba(11, 19, 16, 0.9);
    border-bottom: 1px solid rgba(47, 158, 110, 0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .noir-logo {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.6rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: ${GOLD};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .noir-nav-links {
    display: flex; gap: 48px;
    font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: rgba(242,237,228,0.6);
  }
  .noir-nav-links a { text-decoration: none; color: inherit; transition: color 0.3s; cursor: pointer; font-weight: 500; }
  .noir-nav-links a:hover { color: ${GOLD}; }

  .noir-sign-btn {
    padding: 10px 28px;
    border: 1px solid ${GOLD};
    border-radius: 6px;
    color: ${GOLD};
    background: transparent;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .noir-sign-btn:hover { background: ${GOLD}; color: ${BG}; box-shadow: 0 0 15px rgba(47,158,110,0.3); }

  .noir-dashboard-btn {
    padding: 10px 28px;
    border: none;
    border-radius: 6px;
    color: ${BG};
    background: ${GOLD};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .noir-dashboard-btn:hover { background: ${GOLD_LIGHT}; transform: translateY(-1px); box-shadow: 0 0 20px rgba(47,158,110,0.4); }

  /* Hero */
  .noir-hero {
    display: flex;
    min-height: 100vh;
    padding-top: 88px;
    border-bottom: 1px solid rgba(47,158,110,0.1);
    position: relative;
    overflow: hidden;
  }
  .noir-hero-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 64px 80px 80px;
    z-index: 2;
  }
  .noir-hero-right {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
  }

  .noir-eyebrow {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: ${GOLD};
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .noir-h1 {
    font-family: 'Permanent Marker', cursive !important;
    font-size: clamp(3.4rem, 5.5vw, 5.8rem);
    line-height: 0.95; font-weight: 300;
    color: ${CREAM}; margin: 0 0 28px;
  }
  .noir-h1 em {
    font-style: italic;
    font-weight: 400;
    background: linear-gradient(90deg, #F2EDE4 0%, ${GOLD} 50%, #F2EDE4 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: text-shimmer 6s linear infinite;
  }

  .noir-hero-sub {
    font-size: 1.05rem; font-weight: 300; line-height: 1.8;
    color: rgba(242,237,228,0.65); max-width: 480px; margin-bottom: 48px;
  }

  .noir-cta-row { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }

  .noir-cta-primary {
    padding: 18px 44px; background: ${GOLD}; color: ${BG};
    border: none; border-radius: 8px; font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    animation: pulse-gold 3s ease-in-out infinite;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .noir-cta-primary:hover { background: ${GOLD_LIGHT}; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(47,158,110,0.35); }

  .noir-cta-secondary {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.3rem; font-style: italic; color: ${GOLD};
    cursor: pointer; border: none; border-bottom: 1px solid rgba(47,158,110,0.4);
    padding-bottom: 2px; transition: all 0.25s; background: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .noir-cta-secondary:hover { color: ${GOLD_LIGHT}; border-bottom-color: ${GOLD_LIGHT}; padding-left: 4px; }

  /* Scroll Indicator */
  .noir-scroll-indicator {
    position: absolute;
    bottom: 32px;
    left: 80px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(242,237,228,0.4);
    cursor: pointer;
    z-index: 10;
    transition: color 0.3s;
  }
  .noir-scroll-indicator:hover { color: ${GOLD}; }
  .noir-scroll-indicator svg { animation: bounce-down 2s infinite; }

  /* Floating Hero Chips */
  .noir-chips { position: absolute; bottom: 48px; left: 48px; display: flex; gap: 16px; flex-wrap: wrap; z-index: 5; }
  .noir-chip {
    background: rgba(11, 19, 16, 0.65);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(47, 158, 110, 0.25);
    border-radius: 12px;
    padding: 14px 22px;
    transition: all 0.3s;
  }
  .noir-chip:hover {
    border-color: ${GOLD};
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  }
  .noir-chip-label {
    display: block; font-size: 0.6rem; text-transform: uppercase;
    letter-spacing: 0.2em; color: rgba(242,237,228,0.5); margin-bottom: 4px;
  }
  .noir-chip-val {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.4rem; color: ${GOLD}; font-weight: 600;
  }

  /* Marquee */
  .noir-marquee-wrap {
    overflow: hidden; position: relative; padding: 28px 0;
    background: rgba(16, 24, 20, 0.5);
    backdrop-filter: blur(5px);
    border-bottom: 1px solid rgba(47,158,110,0.1);
  }
  .noir-marquee-fade-l { position: absolute; left: 0; top: 0; bottom: 0; width: 120px; background: linear-gradient(to right, ${BG}, transparent); z-index: 2; }
  .noir-marquee-fade-r { position: absolute; right: 0; top: 0; bottom: 0; width: 120px; background: linear-gradient(to left, ${BG}, transparent); z-index: 2; }
  .noir-marquee-track { display: flex; width: max-content; animation: marquee-noir 32s linear infinite; }
  .noir-marquee-track:hover { animation-play-state: paused; }
  .noir-marquee-item {
    flex-shrink: 0; padding: 0 48px; display: flex; align-items: center; gap: 12px;
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.45rem; text-transform: uppercase; letter-spacing: 0.15em;
    color: rgba(242,237,228,0.45); white-space: nowrap;
    transition: color 0.3s;
  }
  .noir-marquee-item:hover { color: ${GOLD}; }

  /* Sections */
  .noir-section { padding: 120px 80px; max-width: 1360px; margin: 0 auto; position: relative; z-index: 2; }
  .noir-section-border { border-bottom: 1px solid rgba(47,158,110,0.08); }

  .noir-section-title-wrap {
    margin-bottom: 64px;
  }

  .noir-section-title {
    font-family: 'Permanent Marker', cursive !important;
    font-size: clamp(2.8rem, 4.8vw, 4.8rem); font-weight: 300;
    line-height: 1.05; margin: 0 0 20px; color: ${CREAM};
  }
  .noir-section-title em { color: ${GOLD}; font-style: italic; font-weight: 400; }

  .noir-section-sub {
    font-size: 1.02rem; font-weight: 300; line-height: 1.8;
    color: rgba(242,237,228,0.55); max-width: 580px; margin: 0;
  }

  /* Glass Cards Grid */
  .glass-card {
    background: rgba(18, 18, 18, 0.45);
    backdrop-filter: blur(24px) saturate(120%);
    -webkit-backdrop-filter: blur(24px) saturate(120%);
    border: 1px solid rgba(47, 158, 110, 0.12);
    border-radius: 16px;
    padding: 36px;
    position: relative;
    overflow: hidden;
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(47,158,110,0.35), transparent);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .glass-card:hover {
    border-color: rgba(47, 158, 110, 0.45);
    background: rgba(24, 24, 24, 0.55);
    transform: translateY(-8px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(47, 158, 110, 0.04);
  }
  .glass-card:hover::before {
    opacity: 1;
  }

  /* Agent cards specific */
  .noir-agent-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .noir-agent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  
  .noir-agent-icon-box {
    width: 48px; height: 48px;
    border-radius: 10px;
    background: rgba(47, 158, 110, 0.08);
    border: 1px solid rgba(47, 158, 110, 0.2);
    display: flex; align-items: center; justify-content: center;
    color: ${GOLD};
    transition: all 0.3s;
  }
  .glass-card:hover .noir-agent-icon-box {
    background: ${GOLD};
    color: ${BG};
    box-shadow: 0 0 15px rgba(47,158,110,0.4);
    transform: scale(1.05);
  }

  .noir-agent-step {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 2.4rem; font-style: italic; color: rgba(47,158,110,0.3); line-height: 1;
    font-weight: 300;
  }
  .noir-agent-badge {
    font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.16em;
    padding: 5px 12px; border-radius: 999px; border: 1px solid;
    font-weight: 600;
  }
  .noir-badge-auto { border-color: rgba(47,158,110,0.5); color: ${GOLD}; background: rgba(47,158,110,0.04); }
  .noir-badge-approval { border-color: rgba(242,237,228,0.15); color: rgba(242,237,228,0.45); background: rgba(255,255,255,0.02); }

  .noir-agent-name {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.8rem; color: ${CREAM}; margin-bottom: 12px; font-weight: 500;
    transition: color 0.3s;
  }
  .glass-card:hover .noir-agent-name { color: ${GOLD}; }
  .noir-agent-desc { font-size: 0.88rem; font-weight: 300; line-height: 1.75; color: rgba(242,237,228,0.55); }

  /* Platform integration cards */
  .noir-platform-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .noir-platform-icon-glow {
    font-size: 2.2rem; margin-bottom: 24px;
    display: inline-flex;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .noir-platform-name { font-family: 'Permanent Marker', cursive !important; font-size: 1.55rem; color: ${CREAM}; margin-bottom: 8px; font-weight: 500; }
  .glass-card:hover .noir-platform-name { color: var(--platform-accent, ${GOLD}); }
  .noir-platform-desc { font-size: 0.84rem; font-weight: 300; line-height: 1.7; color: rgba(242,237,228,0.52); margin-bottom: 20px; }
  
  .noir-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .noir-pill {
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.12em;
    padding: 4px 10px; border-radius: 4px;
    border: 1px solid rgba(47,158,110,0.15); color: rgba(242,237,228,0.5);
    background: rgba(255, 255, 255, 0.01);
    transition: all 0.3s;
  }
  .glass-card:hover .noir-pill {
    border-color: var(--platform-accent-alpha, rgba(47,158,110,0.3));
    color: ${CREAM};
  }

  /* How it works */
  .noir-hiw-section {
    background: rgba(13, 21, 18, 0.4);
    border-bottom: 1px solid rgba(47,158,110,0.08);
  }
  .noir-hiw-inner { max-width: 800px; margin: 0 auto; }
  
  .timeline-container {
    position: relative;
    padding-left: 64px;
    border-left: 1px solid rgba(47, 158, 110, 0.12);
  }
  .timeline-container::after {
    content: '';
    position: absolute;
    left: -1px; bottom: 0;
    height: 120px;
    width: 1px;
    background: linear-gradient(to bottom, rgba(47, 158, 110, 0.12), transparent);
  }
  .timeline-item {
    position: relative;
    padding-bottom: 56px;
  }
  .timeline-item:last-child { padding-bottom: 0; }
  
  .timeline-node {
    position: absolute;
    left: -86px;
    top: 0;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: ${BG};
    border: 1px solid rgba(47, 158, 110, 0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.25rem; font-style: italic; color: ${GOLD};
    font-weight: 500;
    box-shadow: 0 0 15px rgba(0,0,0,0.6);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .timeline-item:hover .timeline-node {
    background: ${GOLD};
    color: ${BG};
    border-color: ${GOLD};
    box-shadow: 0 0 20px rgba(47,158,110,0.5);
    transform: scale(1.1);
  }

  .timeline-title {
    font-family: 'Permanent Marker', cursive !important;
    font-size: 1.6rem; color: ${CREAM}; margin-bottom: 10px; font-weight: 500;
    transition: color 0.3s;
  }
  .timeline-item:hover .timeline-title { color: ${GOLD}; }
  .timeline-desc { font-size: 0.92rem; font-weight: 300; line-height: 1.8; color: rgba(242,237,228,0.55); }

  /* CTA Section */
  .noir-cta-section {
    padding: 140px 64px; text-align: center; position: relative; overflow: hidden;
    border-top: 1px solid rgba(47,158,110,0.08);
  }
  .noir-cta-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 650px; height: 650px; border-radius: 50%;
    background: radial-gradient(circle, rgba(47,158,110,0.06) 0%, rgba(47,158,110,0) 70%);
    filter: blur(100px); pointer-events: none;
  }
  .noir-cta-title {
    font-family: 'Permanent Marker', cursive !important;
    font-size: clamp(2.8rem, 5vw, 4.8rem); font-weight: 300;
    color: ${CREAM}; margin-bottom: 24px; line-height: 1.1;
    position: relative; z-index: 1;
  }
  .noir-cta-title em { color: ${GOLD}; font-style: italic; font-weight: 400; }
  .noir-cta-sub { font-size: 1.05rem; font-weight: 300; color: rgba(242,237,228,0.5); margin-bottom: 56px; position: relative; z-index: 1; }

  .noir-cta-checklist { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; margin-bottom: 56px; position: relative; z-index: 1; }
  .noir-check-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: rgba(242,237,228,0.65); }
  .noir-check-icon { color: ${GOLD}; flex-shrink: 0; }

  .noir-cta-btn {
    padding: 20px 64px; background: ${GOLD}; color: ${BG};
    border: none; border-radius: 8px; font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; z-index: 1;
    box-shadow: 0 0 35px rgba(47,158,110,0.22);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  .noir-cta-btn:hover { background: ${GOLD_LIGHT}; transform: translateY(-2px); box-shadow: 0 12px 35px rgba(47,158,110,0.35); }

  /* Footer */
  .noir-footer {
    padding: 44px 80px; display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(47,158,110,0.12); flex-wrap: wrap; gap: 24px;
    background: #081410;
    position: relative; z-index: 2;
  }
  .noir-footer-logo { font-family: 'Permanent Marker', cursive !important; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 0.16em; color: ${GOLD}; }
  .noir-live { display: flex; align-items: center; gap: 10px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(242,237,228,0.45); font-weight: 500; }
  .noir-live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 10px rgba(16,185,129,0.7);
    animation: pulse-green 2s infinite;
  }
  @keyframes pulse-green {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }
  .noir-copy { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(242,237,228,0.3); }

  /* Responsive breakpoints */
  @media (max-width: 1024px) {
    .noir-nav { padding: 20px 40px; }
    .noir-hero-left { padding: 48px 40px 64px 48px; }
    .noir-section { padding: 88px 40px; }
    .noir-platform-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .noir-footer { padding: 36px 40px; }
  }
  @media (max-width: 900px) {
    .noir-nav-links { display: none; }
    .noir-hero { flex-direction: column-reverse; min-height: auto; }
    .noir-hero-left { padding: 56px 32px; }
    .noir-hero-right { min-height: 480px; height: 60vh; }
    .noir-agent-grid { grid-template-columns: 1fr; gap: 20px; }
    .noir-scroll-indicator { display: none; }
  }
  @media (max-width: 640px) {
    .noir-platform-grid { grid-template-columns: 1fr; }
    .noir-cta-row { gap: 16px; }
    .noir-cta-primary, .noir-cta-btn { width: 100%; justify-content: center; }
    .noir-cta-checklist { flex-direction: column; align-items: center; gap: 12px; }
    .noir-footer { flex-direction: column; text-align: center; gap: 16px; }
  }
`

export default function LandingNoir() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)

  // Track scrolling to collapse header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hook scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const allMarquee = [...marqueeItems, ...marqueeItems, ...marqueeItems]

  return (
    <div className="noir-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Background Ambience */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className={`noir-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="noir-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          FASHION<span style={{ color: CREAM }}>OS</span>{' '}
          <Zap size={14} fill={GOLD} stroke="none" style={{ marginLeft: -2 }} />
        </div>

        <div className="noir-nav-links">
          <a href="#agents">Atelier</a>
          <a href="#integrations">Connectivity</a>
          <a href="#process">Method</a>
        </div>

        {isSignedIn ? (
          <button className="noir-dashboard-btn" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="noir-sign-btn">Sign In</button>
          </SignInButton>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="noir-hero" ref={heroRef}>
        {/* Left: Text */}
        <div className="noir-hero-left reveal-on-scroll">
          <div className="noir-eyebrow">
            <Sparkles size={13} fill={GOLD} stroke="none" />
            LangGraph · 8 Agents · Gemini Autopilot
          </div>

          <h1 className="noir-h1">
            Run Your<br />
            <em>Fashion Brand</em><br />
            on Autopilot
          </h1>

          <p className="noir-hero-sub">
            Eight elite AI agents work in symphony to automate inventory, markdown pricing, content generation, meta campaigns, and customer DMs. Supervised by LangGraph, approved by you.
          </p>

          <div className="noir-cta-row">
            {isSignedIn ? (
              <button className="noir-cta-primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
                <ArrowRight size={15} />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="noir-cta-primary">
                  Get Started
                  <ArrowRight size={15} />
                </button>
              </SignInButton>
            )}
            <button
              className="noir-cta-secondary"
              onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View the pipeline
              <ArrowDown size={14} />
            </button>
          </div>
        </div>

        {/* Right: Editorial Image */}
        <div className="noir-hero-right">
          <img
            src="/pexels-ahcapture-29817596.jpg"
            alt="Fashion editorial background"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          {/* Gradients to blend image cleanly with dark noir borders */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0B1310 0%, transparent 45%, rgba(11,19,16,0.4) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0B1310 0%, transparent 25%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0B1310 0%, transparent 12%)' }} />

          {/* Floating stat chips */}
          <div className="noir-chips reveal-on-scroll reveal-delay-2">
            {[
              { label: 'Autonomous Fleet', val: '8 Agents' },
              { label: 'System Uptime', val: '24 / 7' },
              { label: 'Auto threshold', val: '< 15%' },
            ].map(c => (
              <div key={c.label} className="noir-chip">
                <span className="noir-chip-label">{c.label}</span>
                <span className="noir-chip-val">{c.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="noir-scroll-indicator"
          onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ArrowDown size={14} />
          Scroll down
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <div className="noir-marquee-wrap">
        <div className="noir-marquee-fade-l" />
        <div className="noir-marquee-fade-r" />
        <div className="noir-marquee-track">
          {allMarquee.map((item, i) => {
            const IconComponent = item.Icon
            return (
              <div key={i} className="noir-marquee-item">
                {IconComponent && <IconComponent size={20} color={item.color || GOLD} />}
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Agents ("The Atelier") ────────────────────── */}
      <div id="agents" className="noir-section-border">
        <div className="noir-section">
          <div className="noir-section-title-wrap reveal-on-scroll">
            <div className="noir-section-title">The <em>Atelier</em></div>
            <p className="noir-section-sub">
              Eight specialized agents operating in a sequenced pipeline managed by LangGraph. High-risk actions route to approvals, safe operations run autonomously.
            </p>
          </div>
          
          <div className="noir-agent-grid">
            {agents.map((agent, index) => {
              const Icon = agent.icon
              return (
                <div
                  key={agent.step}
                  className={`glass-card reveal-on-scroll reveal-delay-${(index % 2) + 1}`}
                >
                  <div className="noir-agent-header">
                    <div className="noir-agent-icon-box">
                      {Icon && <Icon size={22} />}
                    </div>
                    <span className="noir-agent-step">{agent.step}</span>
                  </div>
                  <div className="noir-agent-name">{agent.title}</div>
                  <p className="noir-agent-desc">{agent.desc}</p>
                  
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                    <span className={`noir-agent-badge ${agent.autoExec ? 'noir-badge-auto' : 'noir-badge-approval'}`}>
                      {agent.autoExec ? 'Autonomous Mode' : 'Requires Approval'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Integrations ("Seamless Connectivity") ──────── */}
      <div id="integrations" className="noir-section-border" style={{ background: 'rgba(13,21,18,0.3)' }}>
        <div className="noir-section">
          <div className="noir-section-title-wrap reveal-on-scroll">
            <div className="noir-section-title">Seamless <em>Connectivity</em></div>
            <p className="noir-section-sub">
              Your existing operations linked with read & write capabilities. Integrated directly via secure platform MCP clients.
            </p>
          </div>
          
          <div className="noir-platform-grid">
            {integrations.map((p, index) => {
              const IconComponent = p.Icon
              return (
                <div
                  key={p.name}
                  className={`glass-card reveal-on-scroll reveal-delay-${(index % 3) + 1}`}
                  style={{
                    '--platform-accent': p.color || GOLD,
                    '--platform-accent-alpha': `${p.color || GOLD}4D`
                  }}
                >
                  <div
                    className="noir-platform-icon-glow"
                    style={{ color: p.color || GOLD }}
                  >
                    {IconComponent && <IconComponent size={24} />}
                  </div>
                  <div className="noir-platform-name">{p.name}</div>
                  <p className="noir-platform-desc">{p.desc}</p>
                  <div className="noir-pills">
                    {p.pills.map(pill => (
                      <span key={pill} className="noir-pill">{pill}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── How it Works ("The Method") ────────────────── */}
      <div id="process" className="noir-hiw-section">
        <div className="noir-section">
          <div className="noir-section-title-wrap reveal-on-scroll" style={{ textAlign: 'center' }}>
            <div className="noir-section-title">The <em>Method</em></div>
            <p className="noir-section-sub" style={{ margin: '0 auto' }}>
              How FashionOS integrates, schedules, coordinates, and runs your business 24/7.
            </p>
          </div>
          
          <div className="noir-hiw-inner reveal-on-scroll">
            <div className="timeline-container">
              {howItWorksSteps.map((step, i) => (
                <div key={step.step} className="timeline-item">
                  <div className="timeline-node">
                    {step.step}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">{step.title}</div>
                    <p className="timeline-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Section ───────────────────────────────── */}
      <div className="noir-cta-section">
        <div className="noir-cta-glow" />
        <div className="noir-cta-title reveal-on-scroll">
          Automate Your Brand<br />
          <em>Without Losing Control</em>
        </div>
        <p className="noir-cta-sub reveal-on-scroll reveal-delay-1">
          Zero coding required. Safe threshold validation safeguards your profit margins while automating day-to-day operations.
        </p>
        
        <div className="noir-cta-checklist reveal-on-scroll reveal-delay-2">
          {[
            'Shopify & Meta Ads Native Integration',
            'WhatsApp Real-time Notifications',
            'Multi-agent Coordination Layer',
            'Symmetrical Safety Approval Queue',
          ].map(item => (
            <div key={item} className="noir-check-item">
              <CheckCircle2 size={16} className="noir-check-icon" />
              {item}
            </div>
          ))}
        </div>

        <div className="reveal-on-scroll reveal-delay-3">
          {isSignedIn ? (
            <button className="noir-cta-btn" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="noir-cta-btn">
                Begin Setup
                <ArrowRight size={16} />
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="noir-footer">
        <div className="noir-footer-logo">
          FASHION<span style={{ color: CREAM }}>OS</span>{' '}
          <Zap size={12} fill={GOLD} stroke="none" style={{ verticalAlign: 'middle', marginTop: -2 }} />
        </div>
        <div className="noir-live">
          <span className="noir-live-dot" />
          Fleet Operational
        </div>
        <div className="noir-copy">
          &copy; {new Date().getFullYear()} FashionOS. Crafted with precision.
        </div>
      </footer>
    </div>
  )
}