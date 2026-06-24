import STYLES from '../components/landing/landingStyles'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import IntegrationMarquee from '../components/landing/IntegrationMarquee'
import AgentPipeline from '../components/landing/AgentPipeline'
import MetaIntegrations from '../components/landing/MetaIntegrations'
// import TrendIntelligence from '../components/landing/TrendIntelligence'
import DeepAgentChat from '../components/landing/DeepAgentChat'
import HowItWorks from '../components/landing/HowItWorks'
import CTABanner from '../components/landing/CTABanner'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <>
      {/* Global CSS injected once at the page level */}
      <style>{STYLES}</style>

      <div className="landing-page">
        {/* Ambient background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <Navbar />

        {/* 1. Hero — who it's for, what it does */}
        <HeroSection />

        {/* 2. Integration marquee — quick trust signal */}
        <IntegrationMarquee />

        {/* 3. Agent pipeline — the core 8-agent LangGraph architecture */}
        <AgentPipeline />

        {/* 4. Platform integrations — Shopify + Meta stack via MCP */}
        <MetaIntegrations />

        {/* 5. Trend intelligence — Apify + Google Trends deep dive */}
        {/* <TrendIntelligence /> */}

        {/* 6. Deep agent chat — conversational AI supervisor with memory */}
        <DeepAgentChat />

        {/* 7. How it works — end-to-end workflow */}
        <HowItWorks />

        {/* 8. CTA */}
        <CTABanner />

        <Footer />
      </div>
    </>
  )
}