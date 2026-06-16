export default function StatCard({ label, value, sub, color = 'purple', icon: Icon }) {
  const colors = {
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    red:    'border-red-500/30 bg-red-500/10 text-red-400',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    green:  'border-green-500/30 bg-green-500/10 text-green-400',
    blue:   'border-blue-500/30 bg-blue-500/10 text-blue-400',
  }
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={14} />}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs mt-1 opacity-70">{sub}</div>}
    </div>
  )
}