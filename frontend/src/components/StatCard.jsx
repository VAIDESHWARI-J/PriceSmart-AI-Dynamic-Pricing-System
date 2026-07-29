export default function StatCard({ icon: Icon, label, value, delta, accent = 'green' }) {
  const accentMap = {
    green: 'from-aiGreen/20 to-emerald-500/10 text-aiGreen',
    purple: 'from-aiPurple/20 to-violet-500/10 text-violet-300',
    blue: 'from-aiBlue/20 to-sky-500/10 text-sky-300',
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentMap[accent]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {delta && (
          <span className={`badge ${delta.startsWith('-') ? 'badge-red' : 'badge-green'}`}>
            {delta}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
