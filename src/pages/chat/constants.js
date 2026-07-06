import { Package, TrendingUp, Tag, Megaphone, FileText } from 'lucide-react'

export const GOLD     = '#C9A84C'
export const GOLD_DIM  = 'rgba(201,168,76,0.14)'

// ── Subagent display metadata ──────────────────────────────────────────────────
export const SUBAGENT_META = {
  'inventory-agent': { label: 'Inventory',  Icon: Package,    color: '#22c55e' },
  'trend-agent':     { label: 'Trends',     Icon: TrendingUp, color: '#a78bfa' },
  'pricing-agent':   { label: 'Pricing',    Icon: Tag,        color: GOLD      },
  'marketing-agent': { label: 'Marketing',  Icon: Megaphone,  color: '#f97316' },
  'content-agent':   { label: 'Content',    Icon: FileText,   color: '#60a5fa' },
}

// ── Urgency / level colour helpers ─────────────────────────────────────────────
export const URGENCY_COLOR = {
  critical: '#ef4444',
  high:     '#f97316',
  normal:   GOLD,
  healthy:  '#22c55e',
  warning:  '#f97316',
  info:     '#60a5fa',
}

// ── Tool call → display label ──────────────────────────────────────────────────
export const TOOL_LABELS = {
  get_pipeline_status:   'Pipeline Status',
  get_inventory_status:  'Inventory Status',
  get_critical_skus:     'Critical SKUs',
  get_open_alerts:       'Open Alerts',
  get_pending_approvals: 'Pending Approvals',
  get_sku_history:       'SKU History',
  get_return_insights:   'Return Insights',
  get_content_queue:     'Content Queue',
  get_run_history:       'Run History',
  read_file:             'Read Memory',
  edit_file:             'Edit Memory',
}

// ── PrettyJSON key label overrides ─────────────────────────────────────────────
export const KEY_LABEL_OVERRIDES = { sku: 'SKU', roas_7d: 'ROAS (7d)', ctr_7d: 'CTR (7d)' }

// ── Empty-state suggested prompts ──────────────────────────────────────────────
export const SUGGESTIONS = [
  "What's the current inventory status?",
  'Run a full daily pipeline',
  'Which SKUs need restocking today?',
  'Show me the latest pricing analysis',
]