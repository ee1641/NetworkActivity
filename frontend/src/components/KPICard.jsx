export default function KPICard({ title, value, icon }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-slate-400 text-sm mb-2">{title}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
