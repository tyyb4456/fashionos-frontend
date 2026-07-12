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

  // Agent carousel state
  const [agentIndex, setAgentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const dragState = useRef({ startX: 0, isDragging: false })

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

  // Responsive cardsPerView: 1 on mobile, 2 on tablet, 3 on desktop
  useEffect(() => {
    const updateCardsPerView = () => {
      const w = window.innerWidth
      if (w <= 640) setCardsPerView(1)
      else if (w <= 900) setCardsPerView(2)
      else setCardsPerView(3)
    }
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const maxAgentIndex = Math.max(0, agents.length - cardsPerView)

  useEffect(() => {
    setAgentIndex(i => Math.min(i, maxAgentIndex))
  }, [maxAgentIndex])

  const goToAgent = (i) => setAgentIndex(Math.min(Math.max(i, 0), maxAgentIndex))
  const nextAgent = () => goToAgent(agentIndex + 1)
  const prevAgent = () => goToAgent(agentIndex - 1)

  // Dynamic slides styling for coverflow fanned look using Tailwind
  const getSlideStyles = (index) => {
    let slideClass = "box-sizing-border-box px-1.5 relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    let innerClass = "h-full flex flex-col rounded-2xl transition-all duration-500 ease border border-[#8c7864]/16 bg-white shadow-[0_8px_32px_rgba(140,120,100,0.08)] p-[28px_24px] md:p-9 max-[640px]:p-[32px_28px_28px] max-[640px]:bg-[#252525] max-[640px]:border-white/8 max-[640px]:shadow-[0_8px_32px_rgba(0,0,0,0.28)]"

    if (cardsPerView !== 3) {
      if (cardsPerView === 1) {
        slideClass += " !transform-none z-1"
        innerClass += " !opacity-100"
      } else {
        slideClass += " hover:z-5 hover:scale-[1.02]"
        innerClass += " hover:border-[#d4d4d8]/55 hover:shadow-[0_24px_48px_rgba(140,120,100,0.12),0_0_24px_rgba(212,212,216,0.06)]"
      }
    } else {
      const centerIndex = agentIndex + 1
      if (index === centerIndex) {
        slideClass += " z-[4] scale-[1.06] -translate-y-2.5 origin-bottom"
        innerClass += " border-[#d4d4d8]/45 shadow-[0_30px_60px_rgba(140,120,100,0.15),0_0_30px_rgba(212,212,216,0.1)]"
      } else if (index === centerIndex - 1) {
        slideClass += " z-[2] scale-90 translate-y-2.5 -rotate-3 origin-bottom-right hover:z-[3] hover:scale-[0.94] hover:translate-y-1 hover:rotate-0"
        innerClass += " opacity-55 hover:opacity-90"
      } else if (index === centerIndex + 1) {
        slideClass += " z-[2] scale-90 translate-y-2.5 rotate-3 origin-bottom-left hover:z-[3] hover:scale-[0.94] hover:translate-y-1 hover:rotate-0"
        innerClass += " opacity-55 hover:opacity-90"
      } else {
        slideClass += " opacity-0 pointer-events-none"
      }
    }
    return { slideClass, innerClass }
  }

  const handleDragStart = (clientX) => { dragState.current = { startX: clientX, isDragging: true } }
  const handleDragEnd = (clientX) => {
    if (!dragState.current.isDragging) return
    const delta = clientX - dragState.current.startX
    if (delta > 60) prevAgent()
    else if (delta < -60) nextAgent()
    dragState.current.isDragging = false
  }

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
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 -top-[100px] -left-[100px] animate-[float-slow_25s_infinite_alternate_ease-in-out]" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 top-[35%] -right-[200px] animate-[float-slow_30s_infinite_alternate-reverse_ease-in-out]" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,212,216,0.06)_0%,rgba(212,212,216,0)_70%)] blur-[100px] pointer-events-none z-0 bottom-[10%] -left-[200px] animate-[float-slow_28s_infinite_alternate_ease-in-out]" />

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between border-b transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isScrolled
          ? 'py-4 px-10 lg:px-16 bg-[#1e1e1e]/88 border-[#d4d4d8]/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
          : 'py-6 px-10 lg:px-16 bg-[#1e1e1e]/72 border-[#d4d4d8]/10'
        }`}
      >
        <div className="font-cormorant text-[1.6rem] font-bold tracking-[0.16em] uppercase text-[#d4d4d8] flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          FASHION<span className="text-[#f0eeeb]">OS</span>{' '}
          {/* <Zap size={14} fill={GOLD} stroke="none" style={{ marginLeft: -2 }} /> */}
        </div>

        <div className="hidden min-[901px]:flex gap-12 text-[0.72rem] uppercase tracking-[0.2em] text-[#f0eeeb]/55">
          <a href="#agents" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Atelier</a>
          <a href="#integrations" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Connectivity</a>
          <a href="#process" className="no-underline text-inherit transition-colors duration-300 cursor-pointer font-medium hover:text-[#d4d4d8]">Method</a>
        </div>

        {isSignedIn ? (
          <button
            className="py-2.5 px-7 rounded-[6px] text-[0.7rem] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 border border-[#d4d4d8]/60 text-[#d4d4d8] bg-transparent hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8]"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="py-2.5 px-7 rounded-[6px] text-[0.7rem] font-semibold tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 border border-[#d4d4d8]/60 text-[#d4d4d8] bg-transparent hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8]">Sign In</button>
          </SignInButton>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="flex flex-col-reverse min-[901px]:flex-row min-h-screen pt-[88px] border-b border-[#d4d4d8]/10 relative overflow-hidden" ref={heroRef}>
        {/* Left: Text */}
        <div className="flex-1 flex flex-col justify-center z-[2] p-[56px_32px] min-[901px]:p-[48px_40px_64px_48px] lg:p-[64px_64px_80px_80px] reveal-on-scroll">
          {/* <div className="text-[0.68rem] uppercase tracking-[0.3em] text-[#d4d4d8] mb-6 flex items-center gap-2 font-semibold">
            <Sparkles size={13} fill={GOLD} stroke="none" />
            LangGraph · 8 Agents · Gemini Autopilot
          </div> */}

          <h1 className="font-cormorant text-[clamp(3.4rem,5.5vw,5.8rem)] leading-[0.95] font-light text-[#f0eeeb] m-[0_0_28px]">
            Run Your<br />
            <em className="italic font-normal bg-[linear-gradient(90deg,#F2EDE4_0%,#d4d4d8_50%,#F2EDE4_100%)] bg-[length:200%_auto] text-transparent bg-clip-text animate-[text-shimmer_6s_linear_infinite] drop-shadow-[0_0_20px_rgba(212,212,216,0.25)]">Fashion Brand</em><br />
            on Autopilot
          </h1>

          <p className="text-[1.05rem] font-light leading-[1.8] text-[#f2ede4]/65 max-w-[480px] mb-12">
            Eight elite AI agents work in symphony to automate inventory, markdown pricing, content generation, meta campaigns, and customer DMs. Supervised by LangGraph, approved by you.
          </p>

          <div className="flex items-center gap-4 sm:gap-7 flex-wrap">
            {isSignedIn ? (
              <button
                className="py-[15px] px-10 border border-[#d4d4d8]/55 rounded-[6px] text-[#d4d4d8] bg-transparent text-[0.72rem] font-semibold tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8] hover:text-white"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight size={15} />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="py-[15px] px-10 border border-[#d4d4d8]/55 rounded-[6px] text-[#d4d4d8] bg-transparent text-[0.72rem] font-semibold tracking-[0.22em] uppercase cursor-pointer transition-all duration-200 flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start hover:bg-[#d4d4d8]/10 hover:border-[#d4d4d8] hover:text-white">
                  Get Started
                  <ArrowRight size={15} />
                </button>
              </SignInButton>
            )}
            {/* <button
              className="font-cormorant text-[1.3rem] italic text-[#d4d4d8] cursor-pointer border-none border-b border-[#d4d4d8]/40 pb-0.5 transition-all duration-250 bg-none flex items-center gap-1.5 hover:text-[#ffffff] hover:border-b-[#ffffff] hover:pl-1"
              onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View the pipeline
              <ArrowDown size={14} />
            </button> */}
          </div>
        </div>

        {/* Right: Editorial Image */}
        <div
          className="flex-1 relative overflow-hidden min-h-[480px] h-[60vh] min-[901px]:min-h-screen"
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
          <div className="absolute bottom-12 left-12 z-[5] flex items-stretch bg-[#1e1e1e]/52 backdrop-blur-[20px] backdrop-saturate-[140%] border border-[#d4d4d8]/20 rounded-[14px] overflow-hidden divide-x divide-[#d4d4d8]/15 reveal-on-scroll reveal-delay-2">
            {[
              { label: 'Agents', val: '8' },
              { label: 'Uptime', val: '24/7' },
              { label: 'Auto', val: '<15%' },
            ].map(s => (
              <div key={s.label} className="py-4 px-[26px] flex flex-col gap-1.25">
                <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[#f0eeeb]/45">{s.label}</span>
                <span className="font-cormorant text-[1.2rem] text-[#d4d4d8] font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <div className="overflow-hidden relative py-7 bg-[#171717]/55 backdrop-blur-[5px] border-b border-[#d4d4d8]/10">
        <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-r from-[#1e1e1e] to-transparent z-[2]" />
        <div className="absolute right-0 top-0 bottom-0 w-[120px] bg-gradient-to-l from-[#1e1e1e] to-transparent z-[2]" />
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

      {/* ── Agents ("The Atelier") ────────────────────── */}
      <div id="agents" className="border-b border-[#d4d4d8]/8 bg-[#F7F4EE] border-t border-[#8c7864]/12">
        <div className="py-16 px-5 sm:py-[88px] sm:px-10 lg:py-[120px] lg:px-20 max-w-[1360px] mx-auto relative z-[2]">
          <div className="mb-16 reveal-on-scroll">
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#1C1917]">The <em className="text-[#d4d4d8] italic font-normal">Atelier</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#1c1917]/65 max-w-[580px] m-0">
              Eight specialized agents operating in a sequenced pipeline managed by LangGraph. High-risk actions route to approvals, safe operations run autonomously.
            </p>
          </div>

          <div className="relative reveal-on-scroll sm:mx-[-8px] max-[640px]:mx-0">
            {/* Arrows — hidden on mobile via CSS */}
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-250 absolute top-1/2 -translate-y-1/2 left-[-23px] max-[640px]:hidden bg-white border border-black/10 text-[#1C1917] hover:border-[#d4d4d8] hover:text-[#d4d4d8] hover:bg-[#FAF8F5] disabled:opacity-20 disabled:cursor-not-allowed"
              onClick={prevAgent}
              disabled={agentIndex === 0}
              aria-label="Previous agents"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="relative overflow-hidden py-5 my-[-20px] max-[640px]:py-3 max-[640px]:my-[-12px]">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-grab active:cursor-grabbing select-none"
                style={{ transform: `translateX(-${agentIndex * (100 / cardsPerView)}%)`, touchAction: 'pan-y' }}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseUp={(e) => handleDragEnd(e.clientX)}
                onMouseLeave={() => { dragState.current.isDragging = false }}
              >
                {agents.map((agent, index) => {
                  const Icon = agent.icon
                  const { slideClass, innerClass } = getSlideStyles(index)
                  return (
                    <div
                      key={agent.step}
                      className={slideClass}
                      style={{ flex: `0 0 ${100 / cardsPerView}%`, position: 'relative' }}
                    >
                      <div className={`group/card ${innerClass}`}>
                        <div className="flex justify-between items-center mb-6 max-[640px]:mb-5 max-[640px]:items-start">
                          <div className="w-12 h-12 rounded-lg bg-[#d4d4d8]/8 border border-[#d4d4d8]/20 flex items-center justify-center text-[#d4d4d8] transition-all duration-300 group-hover/card:bg-[#d4d4d8] group-hover/card:text-white max-[640px]:w-[52px] max-[640px]:h-[52px] max-[640px]:rounded-[14px] max-[640px]:bg-[#d4d4d8]/14 max-[640px]:border-[#d4d4d8]/35">
                            {Icon && <Icon size={22} />}
                          </div>
                          <span className="font-cormorant text-[2.4rem] italic text-[#d4d4d8]/30 leading-none font-light max-[640px]:text-[4rem] max-[640px]:text-[#d4d4d8]/18 max-[640px]:absolute max-[640px]:top-6 max-[640px]:right-6">{agent.step}</span>
                        </div>
                        <div className="font-cormorant text-[1.8rem] text-[#1C1917] mb-3 font-medium transition-colors duration-300 group-hover/card:text-[#d4d4d8] max-[640px]:text-2xl max-[640px]:text-[#F2EDE4] max-[640px]:mt-5 max-[640px]:mb-3 max-[640px]:leading-[1.1]">{agent.title}</div>
                        <p className="flex-1 text-[0.88rem] font-light leading-[1.75] text-[#1c1917]/62 max-[640px]:text-[0.9rem] max-[640px]:leading-[1.7] max-[640px]:text-[#f2ede4]/55 max-[640px]:mb-0">{agent.desc}</p>

                        <div className="mt-6 flex justify-start">
                          <span className={`text-[0.58rem] uppercase tracking-[0.16em] py-1.25 px-3 rounded-full font-semibold border max-[640px]:text-[0.6rem] max-[640px]:py-1.5 max-[640px]:px-3.5 max-[640px]:tracking-[0.14em] max-[640px]:whitespace-nowrap ${agent.autoExec ? 'border-[#d4d4d8]/50 text-[#d4d4d8] bg-[#d4d4d8]/4 max-[640px]:border-[#d4d4d8]/35 max-[640px]:bg-[#d4d4d8]/5' : 'border-black/12 text-black/45 bg-black/2 max-[640px]:border-white/15 max-[640px]:text-white/45 max-[640px]:bg-white/2'}`}>
                            {agent.autoExec ? 'Autonomous Mode' : 'Requires Approval'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-250 absolute top-1/2 -translate-y-1/2 right-[-23px] max-[640px]:hidden bg-white border border-black/10 text-[#1C1917] hover:border-[#d4d4d8] hover:text-[#d4d4d8] hover:bg-[#FAF8F5] disabled:opacity-20 disabled:cursor-not-allowed"
              onClick={nextAgent}
              disabled={agentIndex === maxAgentIndex}
              aria-label="Next agents"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxAgentIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className="relative h-2 rounded-full p-0 border-none cursor-pointer transition-all duration-300 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[34px] before:h-[34px] before:-translate-x-1/2 before:-translate-y-1/2 max-[640px]:w-[7px] max-[640px]:h-[7px] bg-black/10 active:bg-[#d4d4d8]"
                style={{ width: i === agentIndex ? '24px' : '8px', backgroundColor: i === agentIndex ? '#d4d4d8' : undefined, borderRadius: i === agentIndex ? '4px' : '50%' }}
                onClick={() => goToAgent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile only: swipe hint text */}
          <p className="hidden max-[640px]:block text-center text-[0.7rem] uppercase tracking-[0.18em] text-[#1c1917]/35 mt-3 font-medium">
            Swipe to explore all 8 agents &rarr;
          </p>
        </div>
      </div>

      {/* ── Integrations ("Seamless Connectivity") ──────── */}
      <div id="integrations" className="border-b border-[#d4d4d8]/8 bg-[#141414]/88">
        <div className="py-16 px-5 sm:py-[88px] sm:px-10 lg:py-[120px] lg:px-20 max-w-[1360px] mx-auto relative z-[2]">
          <div className="mb-16 reveal-on-scroll">
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#f0eeeb]">Seamless <em className="text-[#d4d4d8] italic font-normal">Connectivity</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#f0eeeb]/55 max-w-[580px] m-0">
              Your existing operations linked with read & write capabilities. Integrated directly via secure platform MCP clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {integrations.map((p, index) => {
              const IconComponent = p.Icon
              return (
                <div
                  key={p.name}
                  className={`group/card relative overflow-hidden rounded-2xl p-9 bg-[#242424]/85 border border-white/7 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-[#282828]/90 hover:border-[var(--platform-accent)] hover:shadow-[0_0_0_1px_var(--platform-accent),0_16px_40px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.12)] max-[640px]:shadow-[0_2px_16px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.06)] reveal-on-scroll reveal-delay-${(index % 3) + 1}`}
                  style={{
                    '--platform-accent': p.color || GOLD,
                    '--platform-accent-alpha': `${p.color || GOLD}4D`
                  }}
                >
                  <div
                    className="text-[2.2rem] mb-6 inline-flex p-3 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105 group-hover/card:bg-[var(--platform-accent-alpha)]"
                    style={{ color: p.color || GOLD, backgroundColor: `${p.color || GOLD}1A`, borderColor: `${p.color || GOLD}33`, borderWidth: '1px' }}
                  >
                    {IconComponent && <IconComponent size={24} />}
                  </div>
                  <div className="font-cormorant text-[1.55rem] text-[#f0eeeb] mb-2 font-medium group-hover/card:text-[var(--platform-accent)] max-[640px]:text-[1.3rem]">{p.name}</div>
                  <p className="text-[0.84rem] font-light leading-[1.7] text-[#f0eeeb]/52 mb-5 max-[640px]:text-[0.82rem]">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.pills.map(pill => (
                      <span key={pill} className="text-[0.62rem] uppercase tracking-[0.12em] py-1 px-2.5 rounded border border-white/10 text-[#f0eeeb]/45 bg-white/3 transition-colors duration-300 group-hover/card:border-[var(--platform-accent)]/40 group-hover/card:text-[var(--platform-accent)] group-hover/card:bg-[var(--platform-accent)]/8">{pill}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── How it Works ("The Method") ────────────────── */}
      <div id="process" className="bg-[#141414]/50 border-b border-[#d4d4d8]/8">
        <div className="py-16 px-5 sm:py-[88px] sm:px-10 lg:py-[120px] lg:px-20 max-w-[1360px] mx-auto relative z-[2]">
          <div className="mb-16 reveal-on-scroll" style={{ textAlign: 'center' }}>
            <div className="font-cormorant text-[clamp(2.8rem,4.8vw,4.8rem)] font-light leading-[1.05] m-[0_0_20px] text-[#f0eeeb]">The <em className="text-[#d4d4d8] italic font-normal">Method</em></div>
            <p className="text-[1.02rem] font-light leading-[1.8] text-[#f0eeeb]/52 max-w-[580px] mx-auto">
              How FashionOS integrates, schedules, coordinates, and runs your business 24/7.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto reveal-on-scroll">
            <div className="relative pl-16 border-l border-[#d4d4d8]/12 after:content-[''] after:absolute after:-left-[1px] after:bottom-0 after:h-[120px] after:w-[1px] after:bg-gradient-to-b after:from-[#d4d4d8]/12 after:to-transparent">
              {howItWorksSteps.map((step, i) => (
                <div key={step.step} className="group/item relative pb-14 last:pb-0">
                  <div className="absolute -left-[86px] top-0 w-11 h-11 rounded-full bg-[#1e1e1e] border border-[#d4d4d8]/30 flex items-center justify-center font-cormorant text-[1.25rem] italic text-[#d4d4d8] font-medium shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:bg-[#d4d4d8] group-hover/item:text-[#1e1e1e] group-hover/item:border-[#d4d4d8] group-hover/item:shadow-[0_0_20px_rgba(212,212,216,0.5)] group-hover/item:scale-110">
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
      <div className="py-[140px] px-16 text-center relative overflow-hidden border-t border-[#d4d4d8]/12 bg-[#F7F4EE] border-b border-[#8c7864]/12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(212,212,216,0.1)_0%,rgba(212,212,216,0)_70%)]" />
        <div className="font-cormorant text-[clamp(2.8rem,5vw,4.8rem)] font-light text-[#1C1917] mb-6 leading-[1.1] relative z-[1] reveal-on-scroll">
          Automate Your Brand<br />
          <em className="text-[#d4d4d8] italic font-normal">Without Losing Control</em>
        </div>
        <p className="text-[1.05rem] font-light text-[#1c1917]/62 mb-14 relative z-[1] reveal-on-scroll reveal-delay-1">
          Zero coding required. Safe threshold validation safeguards your profit margins while automating day-to-day operations.
        </p>

        <div className="flex gap-8 flex-wrap justify-center mb-14 relative z-[1] max-[640px]:flex-col max-[640px]:items-center max-[640px]:gap-3 reveal-on-scroll reveal-delay-2">
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
            <button className="py-4 px-14 border border-[#3f3f46]/55 rounded-[6px] text-[#3f3f46] bg-transparent text-[0.72rem] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 inline-flex items-center gap-3 hover:bg-[#3f3f46]/10 hover:border-[#1c1917] hover:text-[#1c1917] max-[640px]:w-full max-[640px]:justify-center" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="py-4 px-14 border border-[#3f3f46]/55 rounded-[6px] text-[#3f3f46] bg-transparent text-[0.72rem] font-semibold tracking-[0.24em] uppercase cursor-pointer transition-all duration-200 inline-flex items-center gap-3 hover:bg-[#3f3f46]/10 hover:border-[#1c1917] hover:text-[#1c1917] max-[640px]:w-full max-[640px]:justify-center">
                Begin Setup
                <ArrowRight size={16} />
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="py-11 px-20 max-w-full flex items-center justify-between border-t border-[#d4d4d8]/12 flex-wrap gap-6 bg-[#171717] relative z-[2] max-[1024px]:py-9 max-[1024px]:px-10 max-[640px]:flex-col max-[640px]:text-center max-[640px]:gap-4">
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