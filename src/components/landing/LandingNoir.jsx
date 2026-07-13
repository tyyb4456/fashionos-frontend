import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Sparkles, ArrowRight, ArrowDown, ChevronRight, ChevronLeft, CheckCircle2, Zap } from 'lucide-react'
import { agents, howItWorksSteps, integrations, marqueeItems } from './LandingData.jsx'

const GOLD = '#d4d4d8'
const BG = '#1e1e1e'
const CREAM = '#f0eeeb'

export default function LandingNoir() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)
  const heroImgLayerRef = useRef(null)

  // ── Agent stack-deck state ──────────────────────────────────────
  const total = agents.length
  const STACK_SIZE = Math.min(3, total)
  const [agentIndex, setAgentIndex] = useState(0)
  const [exitDir, setExitDir] = useState(null) // 'left' | 'right' | null while a card is flying out
  const frontCardRef = useRef(null)
  const dragRef = useRef({ startX: 0, startY: 0, dragging: false, dx: 0 })

  const stackIndices = Array.from({ length: STACK_SIZE }, (_, i) => ({
    agent: agents[(agentIndex + i) % total],
    offset: i,
  }))

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

  // ── Deck drag handlers (direct DOM transform for 1:1 smoothness) ──
  const flyOut = (dir) => {
    const el = frontCardRef.current
    setExitDir(dir)
    if (el) {
      el.style.transition = 'transform 380ms cubic-bezier(0.4,0,0.2,1), opacity 380ms ease'
      el.style.transform = `translate(${dir === 'left' ? '-140%' : '140%'}, -8px) rotate(${dir === 'left' ? -24 : 24}deg)`
      el.style.opacity = '0'
    }
    setTimeout(() => {
      setAgentIndex(i => (dir === 'left' ? (i + 1) % total : (i - 1 + total) % total))
      setExitDir(null)
    }, 380)
  }

  const settleFront = () => {
    const el = frontCardRef.current
    if (el) {
      el.style.transition = 'transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease'
      el.style.transform = ''
      el.style.opacity = ''
    }
  }

  const handlePointerDown = (e) => {
    if (exitDir) return
    const el = frontCardRef.current
    if (!el) return
    el.setPointerCapture?.(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, dragging: true, dx: 0 }
    el.style.transition = 'none'
  }

  const handlePointerMove = (e) => {
    const d = dragRef.current
    if (!d.dragging) return
    const el = frontCardRef.current
    if (!el) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    d.dx = dx
    el.style.transform = `translate(${dx}px, ${dy * 0.12}px) rotate(${dx / 18}deg)`
    el.style.opacity = String(Math.max(0.35, 1 - Math.abs(dx) / 450))
  }

  const handlePointerUp = () => {
    const d = dragRef.current
    if (!d.dragging) return
    d.dragging = false
    const threshold = 90
    if (Math.abs(d.dx) > threshold) {
      flyOut(d.dx < 0 ? 'left' : 'right')
    } else {
      settleFront()
    }
  }

  const nextAgent = () => { if (!exitDir) flyOut('left') }
  const prevAgent = () => { if (!exitDir) flyOut('right') }

  // Hero photo parallax
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    if (heroImgLayerRef.current) {
      heroImgLayerRef.current.style.transform = `translate(${x * -16}px, ${y * -12}px)`
    }
  }
  const handleHeroMouseLeave = () => {
    if (heroImgLayerRef.current) heroImgLayerRef.current.style.transform = 'translate(0,0)'
  }

  const allMarquee = [...marqueeItems, ...marqueeItems, ...marqueeItems]

  return (
    <div className="bg-[#1e1e1e] text-[#f0eeeb] font-montserrat min-h-screen overflow-x-hidden relative">

      {/* Background Ambience */}
      <div className="absolute w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 -top-25 -left-25 animate-[float-slow_25s_infinite_alternate_ease-in-out]" />
      <div className="absolute w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 top-[35%] -right-50 animate-[float-slow_30s_infinite_alternate-reverse_ease-in-out]" />
      <div className="absolute w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 bottom-[10%] -left-50 animate-[float-slow_28s_infinite_alternate_ease-in-out]" />

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between border-b transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isScrolled
          ? 'py-4 px-10 lg:px-16 bg-[#1e1e1e]/88 border-[#d4d4d8]/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
          : 'py-6 px-10 lg:px-16 bg-[#1e1e1e]/72 border-[#d4d4d8]/10'
        }`}
      >
        <div className="font-cormorant text-[1.6rem] font-bold tracking-[0.16em] uppercase text-[#d4d4d8] flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          FASHION<span className="text-[#f0eeeb]">OS</span>{' '}
        </div>

        <div className="hidden min-[901px]:flex gap-12 text-[0.72rem] uppercase tracking-[0.2em] text-[#f0eeeb]/55">
          <a href="#agents" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Atelier</a>
          <a href="#integrations" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Connectivity</a>
          <a href="#process" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Method</a>
        </div>

        {isSignedIn ? (
          <button
            className="py-2.5 px-7 rounded-md text-[0.7rem] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 border border-[#d4d4d8]/60 text-[#d4d4d8] bg-transparent hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8]"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="py-2.5 px-7 rounded-md text-[0.7rem] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 border border-[#d4d4d8]/60 text-[#d4d4d8] bg-transparent hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8]">Sign In</button>
          </SignInButton>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="flex flex-col-reverse min-[901px]:flex-row min-h-screen pt-22 border-b border-[#d4d4d8]/10 relative overflow-hidden" ref={heroRef}>
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center z-2 p-[56px_32px] min-[901px]:p-[48px_40px_64px_48px] lg:p-[64px_64px_80px_80px] reveal-on-scroll">
          <h1 className="font-cormorant text-[clamp(3.4rem,5.5vw,5.8rem)] leading-[0.95] font-light text-[#f0eeeb] m-[0_0_28px]">
            Run Your<br />
            <em className="italic font-normal bg-[linear-gradient(90deg,#F2EDE4_0%,#d4d4d8_50%,#F2EDE4_100%)] bg-size-[200%_auto] text-transparent bg-clip-text animate-[text-shimmer_6s_linear_infinite] drop-shadow-[0_0_20px_rgba(212,212,216,0.25)]">Fashion Brand</em><br />
            on Autopilot
          </h1>

          <p className="text-[1.05rem] font-light leading-[1.8] text-[#f2ede4]/65 max-w-120 mb-12">
            Eight elite AI agents work in symphony to automate inventory, markdown pricing, content generation, meta campaigns, and customer DMs. Supervised by LangGraph, approved by you.
          </p>

          <div className="flex items-center gap-4 sm:gap-7 flex-wrap">
            {isSignedIn ? (
              <button
                className="py-3.75 px-10 border border-[#d4d4d8]/55 rounded-md text-[#d4d4d8] bg-transparent text-[0.72rem] font-semibold tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8] hover:text-white"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="py-3.75 px-10 border border-[#d4d4d8]/55 rounded-md text-[#d4d4d8] bg-transparent text-[0.72rem] font-semibold tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8] hover:text-white">
                  Get Started
                  <ArrowRight size={15} />
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Right: Editorial Image */}
        <div
          className="flex-1 relative overflow-hidden min-h-120 h-[60vh] min-[901px]:min-h-screen"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          <div
            ref={heroImgLayerRef}
            style={{ position: 'absolute', inset: '-20px', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
          >
            <img
              src="pexels-ba-tik-3754246.jpg"
              alt="Fashion editorial background"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%] animate-[hero-ken-burns_24s_ease-in-out_infinite_alternate] saturate-[1.05] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(212,212,216,0.26)_0%,rgba(30,30,30,0.06)_45%,rgba(30,30,30,0.48)_100%)] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 opacity-6 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22180%22%20height=%22180%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
          </div>

          {/* Gradients to blend image cleanly with dark noir borders */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #161616 0%, transparent 45%, rgba(22,22,22,0.4) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #161616 0%, transparent 25%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #161616 0%, transparent 12%)' }} />

          {/* Stat bar */}
          <div className="absolute bottom-12 left-12 z-5 flex items-stretch bg-[#1e1e1e]/52 backdrop-blur-[20px] backdrop-saturate-140 border border-[#d4d4d8]/20 rounded-[14px] overflow-hidden divide-x divide-[#d4d4d8]/15 reveal-on-scroll reveal-delay-2">
            {[
              { label: 'Agents', val: '8' },
              { label: 'Uptime', val: '24/7' },
              { label: 'Auto', val: '<15%' },
            ].map(s => (
              <div key={s.label} className="py-4 px-6.5 flex flex-col gap-1.25">
                <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[#f0eeeb]/45">{s.label}</span>
                <span className="font-cormorant text-[1.2rem] text-[#d4d4d8] font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <div className="overflow-hidden relative py-7 bg-[#171717]/55 backdrop-blur-[5px] border-b border-[#d4d4d8]/10">
        <div className="absolute left-0 top-0 bottom-0 w-30 bg-linear-to-r from-[#1e1e1e] to-transparent z-2" />
        <div className="absolute right-0 top-0 bottom-0 w-30 bg-linear-to-l from-[#1e1e1e] to-transparent z-2" />
        <div className="flex w-max animate-marquee-noir hover:[animation-play-state:paused]">
          {allMarquee.map((item, i) => {
            const IconComponent = item.Icon
            return (
              <div key={i} className="shrink-0 px-12 flex items-center gap-3 font-cormorant text-[1.45rem] uppercase tracking-[0.15em] text-[#f0eeeb]/40 whitespace-nowrap transition-colors duration-300 hover:text-[#d4d4d8]">
                {IconComponent && <IconComponent size={20} color={item.color || GOLD} />}
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Agents ("The Atelier") — swipeable stacked deck ──────── */}
      <div id="agents" className="border-b border-[#d4d4d8]/8 border-t  bg-[#1e1e1e]">
        <div className="py-16 px-5 sm:py-22 sm:px-10 lg:py-30 lg:px-20 max-w-340 mx-auto relative z-2">
          <div className="mb-16 reveal-on-scroll">
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#f0eeeb]">The <em className="text-[#d4d4d8] italic font-normal">Atelier</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#f0eeeb]/60 max-w-145 m-0">
              Eight specialized agents operating in a sequenced pipeline managed by LangGraph. High-risk actions route to approvals, safe operations run autonomously.
            </p>
          </div>

          <div className="reveal-on-scroll flex flex-col items-center">
            <div className="relative flex items-center justify-center gap-4 sm:gap-6 w-full">
              {/* Prev arrow — desktop only */}
              <button
                className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center cursor-pointer shrink-0 transition-all duration-300 bg-transparent border border-[#d4d4d8]/25 text-[#f0eeeb]/70 hover:border-[#d4d4d8] hover:bg-[#d4d4d8] hover:text-[#1e1e1e] hover:shadow-[0_0_20px_rgba(212,212,216,0.4)]"
                onClick={prevAgent}
                aria-label="Previous agent"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Stack */}
              <div
                className="relative w-full max-w-95 sm:max-w-110 lg:max-w-120 min-h-110 sm:min-h-100 lg:min-h-95"
                style={{ touchAction: 'pan-y' }}
              >
                {stackIndices.map(({ agent, offset }) => {
                  const Icon = agent.icon
                  const isFront = offset === 0
                  const stackTransform =
                    offset === 0
                      ? 'translate(0,0) rotate(0deg) scale(1)'
                      : offset === 1
                      ? 'translate(-10px, 16px) rotate(-5deg) scale(0.94)'
                      : 'translate(12px, 30px) rotate(5deg) scale(0.88)'

                  return (
                    <div
                      key={agent.step}
                      ref={isFront ? frontCardRef : null}
                      onPointerDown={isFront ? handlePointerDown : undefined}
                      onPointerMove={isFront ? handlePointerMove : undefined}
                      onPointerUp={isFront ? handlePointerUp : undefined}
                      onPointerCancel={isFront ? handlePointerUp : undefined}
                      className={`absolute inset-0 rounded-2xl bg-[#1c1c1c] border border-[#d4d4d8]/14 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-7 sm:p-8 flex flex-col overflow-hidden ${isFront ? 'cursor-grab active:cursor-grabbing select-none' : 'pointer-events-none'}`}
                      style={{
                        zIndex: 30 - offset * 10,
                        opacity: offset === 0 ? 1 : offset === 1 ? 0.85 : 0.6,
                        transform: stackTransform,
                        transition: 'transform 480ms cubic-bezier(0.16,1,0.3,1), opacity 380ms ease',
                        willChange: 'transform',
                        touchAction: 'pan-y',
                      }}
                    >
                      {/* Numeral watermark */}
                      <span className="font-cormorant absolute -top-3 right-2 text-[6rem] leading-none text-[#d4d4d8]/7 select-none pointer-events-none">
                        {agent.step}
                      </span>

                      <div className="relative z-1 flex items-center gap-3 mb-6">
                        {Icon && <Icon size={18} className="text-[#d4d4d8]/70" />}
                        <span className="font-montserrat text-[0.62rem] tracking-[0.22em] uppercase text-[#f0eeeb]/35">Agent {agent.step}</span>
                      </div>

                      <div className="relative z-1 font-cormorant text-[1.55rem] text-[#f0eeeb] mb-3 font-bold leading-[1.1]">
                        {agent.title}
                      </div>

                      <p className="relative z-1 flex-1 text-[0.85rem] font-light leading-[1.7] text-[#f0eeeb]/55">
                        {agent.desc}
                      </p>

                      <div className="relative z-1 mt-6 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${agent.autoExec ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[0.6rem] uppercase tracking-[0.14em] text-[#f0eeeb]/40 font-medium">
                          {agent.autoExec ? 'Autonomous' : 'Requires Approval'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Next arrow — desktop only */}
              <button
                className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center cursor-pointer shrink-0 transition-all duration-300 bg-transparent border border-[#d4d4d8]/25 text-[#f0eeeb]/70 hover:border-[#d4d4d8] hover:bg-[#d4d4d8] hover:text-[#1e1e1e] hover:shadow-[0_0_20px_rgba(212,212,216,0.4)]"
                onClick={nextAgent}
                aria-label="Next agent"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Mobile controls — arrows hidden above, shown below deck instead */}
            <div className="flex sm:hidden items-center gap-6 mt-6">
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#d4d4d8]/25 text-[#f0eeeb]/70 active:bg-[#d4d4d8] active:text-[#1e1e1e]"
                onClick={prevAgent}
                aria-label="Previous agent"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="font-cormorant text-[1.1rem] text-[#d4d4d8]">
                {String(agentIndex + 1).padStart(2, '0')} <span className="text-[#f0eeeb]/30 text-[0.9rem]">/ {String(total).padStart(2, '0')}</span>
              </span>
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#d4d4d8]/25 text-[#f0eeeb]/70 active:bg-[#d4d4d8] active:text-[#1e1e1e]"
                onClick={nextAgent}
                aria-label="Next agent"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Desktop index readout */}
            <div className="hidden sm:block mt-8 font-cormorant text-[1rem] text-[#d4d4d8]">
              {String(agentIndex + 1).padStart(2, '0')} <span className="text-[#f0eeeb]/30">/ {String(total).padStart(2, '0')}</span>
            </div>

            <p className="sm:hidden text-center text-[0.68rem] uppercase tracking-[0.18em] text-[#f0eeeb]/35 mt-4 font-medium">
              Swipe to explore all {total} agents
            </p>
          </div>
        </div>
      </div>

      {/* ── Integrations ("Seamless Connectivity") ──────── */}
      <div id="integrations" className="border-b border-[#d4d4d8]/8 bg-[#1e1e1e]">
        <div className="py-16 px-5 sm:py-22 sm:px-10 lg:py-30 lg:px-20 max-w-340 mx-auto relative z-2">
          <div className="mb-16 reveal-on-scroll">
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#f0eeeb]">Seamless <em className="text-[#d4d4d8] italic font-normal">Connectivity</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#f0eeeb]/55 max-w-145 m-0">
              Your existing operations linked with read & write capabilities. Integrated directly via secure platform MCP clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {integrations.map((p, index) => {
              const IconComponent = p.Icon
              return (
                <div
                  key={p.name}
                  className={`group/card relative overflow-hidden rounded-xl p-8 bg-[#181818] border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-(--platform-accent)/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] reveal-on-scroll reveal-delay-${(index % 3) + 1}`}
                  style={{
                    '--platform-accent': p.color || GOLD,
                  }}
                >
                  {/* Subtle back ambient glow */}
                  <div className="absolute top-0 right-0 w-30 h-30 rounded-full blur-2xl pointer-events-none opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" style={{ background: `radial-gradient(circle, ${p.color}15 0%, transparent 70%)` }} />

                  <div className="flex justify-between items-start mb-6">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 bg-white/3 border border-white/10 group-hover/card:border-(--platform-accent)/30 group-hover/card:bg-(--platform-accent)/5"
                      style={{ color: p.color || GOLD }}
                    >
                      {IconComponent && <IconComponent size={18} />}
                    </div>
                  </div>
                  <div className="font-cormorant text-[1.4rem] text-[#f0eeeb] mb-2 font-bold transition-colors duration-300 group-hover/card:text-(--platform-accent) max-[640px]:text-[1.25rem]">{p.name}</div>
                  <p className="text-[0.8rem] font-light leading-[1.65] text-[#f0eeeb]/55 mb-6 max-[640px]:text-[0.78rem]">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.pills.map(pill => (
                      <span key={pill} className="text-[0.58rem] font-mono tracking-[0.08em] uppercase py-1 px-2 rounded border border-white/5 text-[#f0eeeb]/40 bg-white/1 transition-colors duration-300 group-hover/card:border-(--platform-accent)/20 group-hover/card:text-(--platform-accent)/80 group-hover/card:bg-(--platform-accent)/3">{pill}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── How it Works ("The Method") ────────────────── */}
      <div id="process" className="bg-[#1e1e1e] border-b border-[#d4d4d8]/8">
        <div className="py-16 px-5 sm:py-22 sm:px-10 lg:py-30 lg:px-20 max-w-340 mx-auto relative z-2">
          <div className="mb-16 reveal-on-scroll" style={{ textAlign: 'center' }}>
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#f0eeeb]">The <em className="text-[#d4d4d8] italic font-normal">Method</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#f0eeeb]/52 max-w-145 mx-auto">
              How FashionOS integrates, schedules, coordinates, and runs your business 24/7.
            </p>
          </div>

          <div className="max-w-200 mx-auto reveal-on-scroll">
            <div className="relative pl-16 border-l border-[#d4d4d8]/12 after:content-[''] after:absolute after:-left-px after:bottom-0 after:h-30 after:w-px after:bg-linear-to-b after:from-[#d4d4d8]/12 after:to-transparent">
              {howItWorksSteps.map((step, i) => (
                <div key={step.step} className="group/item relative pb-14 last:pb-0">
                  <div className="absolute -left-21.5 top-0 w-11 h-11 rounded-full bg-[#1e1e1e] border border-[#d4d4d8]/30 flex items-center justify-center font-cormorant text-[1.25rem] italic text-[#d4d4d8] font-medium shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:bg-[#d4d4d8] group-hover/item:text-[#1e1e1e] group-hover/item:border-[#d4d4d8] group-hover/item:shadow-[0_0_20px_rgba(212,212,216,0.5)] group-hover/item:scale-110">
                    {step.step}
                  </div>
                  <div className="timeline-content">
                    <div className="font-cormorant text-[1.6rem] text-[#f0eeeb] mb-2.5 font-medium transition-colors duration-300 group-hover/item:text-[#d4d4d8]">{step.title}</div>
                    <p className="text-[0.92rem] font-light leading-[1.8] text-[#f2ede4]/55">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Section ───────────────────────────────── */}
      <div className="py-35 px-16 text-center relative overflow-hidden border-t  bg-[#F7F4EE] border-b border-[#8c7864]/12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(212,212,216,0.1)_0%,rgba(212,212,216,0)_70%)]" />
        <div className="font-cormorant text-[clamp(2.8rem,5vw,4.8rem)] font-light text-[#1C1917] mb-6 leading-[1.1] relative z-1 reveal-on-scroll">
          Automate Your Brand<br />
          <em className="text-[#d4d4d8] italic font-normal">Without Losing Control</em>
        </div>
        <p className="text-[1.05rem] font-light text-[#1c1917]/62 mb-14 relative z-1 reveal-on-scroll reveal-delay-1">
          Zero coding required. Safe threshold validation safeguards your profit margins while automating day-to-day operations.
        </p>

        <div className="flex gap-8 flex-wrap justify-center mb-14 relative z-1 max-[640px]:flex-col max-[640px]:items-center max-[640px]:gap-3 reveal-on-scroll reveal-delay-2">
          {[
            'Shopify & Meta Ads Native Integration',
            'WhatsApp Real-time Notifications',
            'Multi-agent Coordination Layer',
            'Symmetrical Safety Approval Queue',
          ].map(item => (
            <div key={item} className="flex items-center gap-2.5 text-[0.85rem] text-[#1c1917]/65">
              <CheckCircle2 size={16} className="text-[#d4d4d8] shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="reveal-on-scroll reveal-delay-3">
          {isSignedIn ? (
            <button className="py-4 px-14 border border-[#3f3f46]/55 rounded-md text-[#3f3f46] bg-transparent text-[0.72rem] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 inline-flex items-center gap-3 hover:bg-[#3f3f46]/10 hover:border-[#1c1917] hover:text-[#1c1917] max-[640px]:w-full max-[640px]:justify-center" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="py-4 px-14 border border-[#3f3f46]/55 rounded-md text-[#3f3f46] bg-transparent text-[0.72rem] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 inline-flex items-center gap-3 hover:bg-[#3f3f46]/10 hover:border-[#1c1917] hover:text-[#1c1917] max-[640px]:w-full max-[640px]:justify-center">
                Begin Setup
                <ArrowRight size={16} />
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="py-11 px-20 max-w-full flex items-center justify-between border-t border-[#d4d4d8]/12 flex-wrap gap-6 bg-[#171717] relative z-2 max-[1024px]:py-9 max-[1024px]:px-10 max-[640px]:flex-col max-[640px]:text-center max-[640px]:gap-4">
        <div className="font-cormorant text-[1.4rem] uppercase tracking-[0.16em] text-[#d4d4d8]">
          FASHION<span className="text-[#f0eeeb]">OS</span>{' '}
          <Zap size={12} fill={GOLD} stroke="none" style={{ verticalAlign: 'middle', marginTop: -2 }} />
        </div>
        <div className="flex items-center gap-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-[#f0eeeb]/45 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse-green" />
          Fleet Operational
        </div>
        <div className="text-[0.7rem] uppercase tracking-[0.12em] text-[#f2ede4]/30">
          &copy; {new Date().getFullYear()} FashionOS. Crafted with precision.
        </div>
      </footer>
    </div>
  )
}