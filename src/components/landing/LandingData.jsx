import {
  Package, TrendingUp, DollarSign, FileText, RotateCcw,
  Megaphone, MessageCircle, Shield,
} from 'lucide-react'
import {
  SiMeta, SiInstagram, SiFacebook, SiWhatsapp,
  SiShopify, SiGoogle, SiTiktok,
} from '@icons-pack/react-simple-icons'

export const features = [
  { icon: Package,        title: 'Inventory Intelligence', desc: 'Real-time stock snapshots. AI flags critical stockouts and velocity anomalies before they cost you sales.',     color: '#ADDFF1' },
  { icon: TrendingUp,     title: 'Trend Radar',            desc: 'Google Trends + social signal aggregation across TikTok & Instagram. Know what buyers want next.',              color: '#9dd6ed' },
  { icon: DollarSign,     title: 'Smart Pricing',          desc: 'Automated markdown and surge pricing. Auto-executes under 15% — everything else needs your sign-off.',         color: '#ADDFF1' },
  { icon: FileText,       title: 'Content Engine',         desc: 'Generates Instagram captions and TikTok scripts in Urdu-English mix, timed to PST peak hours.',                color: '#9dd6ed' },
  { icon: RotateCcw,      title: 'Returns Insights',       desc: 'Detects return patterns by SKU and reason. Surfaces quality and sizing issues before they escalate.',          color: '#ADDFF1' },
  { icon: Megaphone,      title: 'Ad Automation',          desc: 'Monitors campaign ROI and auto-adjusts budgets. Pauses underperformers and doubles down on winners.',          color: '#9dd6ed' },
  { icon: MessageCircle,  title: 'DM Autopilot',           desc: 'Classifies and drafts replies to customer DMs. Bulk inquiries, complaints, and compliments — all handled.',    color: '#ADDFF1' },
  { icon: Shield,         title: 'Human-in-the-Loop',      desc: 'High-stakes decisions always surface in the Approvals queue. You stay in control of what matters most.',       color: '#9dd6ed' },
]

export const stats = [
  { value: '8',   label: 'Specialized Agents',  suffix: '' },
  { value: '24',  label: 'Hour Automation',      suffix: '/7' },
  { value: '<15', label: 'Auto-exec Threshold',  suffix: '%' },
  { value: '∞',   label: 'Brands Supported',     suffix: '' },
]

export const metaIntegrations = [
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

export const marqueeItems = [
  { Icon: SiShopify,   label: 'Shopify',       color: '#96BF48' },
  { Icon: SiMeta,      label: 'Meta Ads',      color: '#0082FB' },
  { Icon: SiInstagram, label: 'Instagram',     color: '#E1306C' },
  { Icon: SiFacebook,  label: 'Facebook',      color: '#1877F2' },
  { Icon: SiWhatsapp,  label: 'WhatsApp',      color: '#25D366' },
  { Icon: SiTiktok,    label: 'TikTok',        color: '#010101' },
  { Icon: SiGoogle,    label: 'Google Trends', color: '#4285F4' },
]

// Inline SVG icon for Apify (no npm package)
const ApifyIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const trendSources = [
  {
    id: 'apify',
    label: 'Apify',
    badge: 'social_mcp',
    color: '#00C4B4',
    icon: ApifyIcon,
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
      { stat: '5',  unit: 'keywords', desc: 'compared per run (3 base + 2 from catalog)' },
      { stat: '7d', unit: 'window',   desc: 'rolling week for recency-weighted signals' },
      { stat: '0',  unit: 'cost',     desc: 'free via Pytrends — no API key needed' },
    ],
    desc: 'Pytrends pulls keyword interest-over-time data from Google Trends and cross-references it with catalog SKU names to surface rising demand before competitors react.',
    pills: ['lawn suit', 'co-ord set', 'cargo pants', 'linen kurta', 'modest fashion'],
    pillLabel: 'Base keywords',
  },
]