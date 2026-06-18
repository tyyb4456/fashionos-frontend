import STYLES from '../components/landing/landingStyles'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import IntegrationMarquee from '../components/landing/IntegrationMarquee'
import MetaIntegrations from '../components/landing/MetaIntegrations'
import TrendIntelligence from '../components/landing/TrendIntelligence'
import FeaturesGrid from '../components/landing/FeaturesGrid'
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
        <HeroSection />
        <IntegrationMarquee />
        <MetaIntegrations />
        <TrendIntelligence />
        <FeaturesGrid />
        <HowItWorks />
        <CTABanner />
        <Footer />
      </div>
    </>
  )
}