export default function Badge({ level }) {
  const styles = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning:  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    info:     'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    healthy:  'bg-green-500/20 text-green-400 border border-green-500/30',
    pending:  'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    posted:   'bg-green-500/20 text-green-400 border border-green-500/30',
    skipped:  'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level] || styles.info}`}>
      {level}
    </span>
  )
}