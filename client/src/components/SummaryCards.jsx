import React from 'react';
import { 
  Activity, 
  Droplet, 
  AlertTriangle, 
  Cpu, 
  SlidersHorizontal,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function SummaryCards({ systemState }) {
  const cards = [
    {
      id: 'total-flow',
      title: 'Total Water Flow',
      value: `${systemState?.totalFlowRate || '128.6'} L/min`,
      subtitle: 'Main Pipeline Discharge',
      liveTag: true,
      icon: Activity,
      accentColor: 'from-cyan-500/20 to-sky-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400',
      statTrend: '+4.2% vs avg'
    },
    {
      id: 'water-distributed',
      title: 'Water Distributed',
      value: `${(systemState?.totalWaterDistributedToday || 18420).toLocaleString()} L`,
      subtitle: 'Daily Total Consumption',
      icon: Droplet,
      accentColor: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300',
      iconBg: 'bg-blue-950/80 border-blue-500/40 text-blue-400',
      statTrend: 'Optimal distribution'
    },
    {
      id: 'leakage-detected',
      title: 'Leakage Detected',
      value: `${systemState?.activeLeaksCount || 2} Active Leaks`,
      subtitle: systemState?.activeLeaksCount > 0 ? 'Urgent Isolation Advised' : 'Pipeline Fully Intact',
      warningTag: systemState?.activeLeaksCount > 0,
      icon: AlertTriangle,
      accentColor: systemState?.activeLeaksCount > 0 ? 'from-rose-500/20 to-red-600/10' : 'from-emerald-500/20 to-teal-600/10',
      borderColor: systemState?.activeLeaksCount > 0 ? 'border-rose-500/40' : 'border-emerald-500/30',
      textColor: systemState?.activeLeaksCount > 0 ? 'text-rose-400' : 'text-emerald-400',
      iconBg: systemState?.activeLeaksCount > 0 ? 'bg-rose-950/80 border-rose-500/40 text-rose-400 animate-pulse' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
      statTrend: systemState?.activeLeaksCount > 0 ? 'Est. Loss ~52 L/min' : 'Zero Loss'
    },
    {
      id: 'active-sensors',
      title: 'Active Sensors',
      value: `${systemState?.activeSensorsCount || 24} / ${systemState?.totalSensorsCount || 25}`,
      subtitle: 'IoT Telemetry Nodes',
      onlineTag: true,
      icon: Cpu,
      accentColor: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
      statTrend: '1 Offline (SEN-012)'
    },
    {
      id: 'valves-status',
      title: 'Valves',
      value: `${systemState?.openValvesCount || 22} Open / ${systemState?.closedValvesCount || 3} Closed`,
      subtitle: 'SCADA Flow Regulators',
      icon: SlidersHorizontal,
      accentColor: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      iconBg: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      statTrend: 'Auto Isolation Ready'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.accentColor} border ${card.borderColor} p-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-black/40 group`}
          >
            {/* Top header row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline justify-between">
              <div className={`text-xl xl:text-2xl font-black font-mono tracking-tight ${card.textColor}`}>
                {card.value}
              </div>
              
              {card.liveTag && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  Live
                </span>
              )}

              {card.warningTag && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/50 animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  Alert
                </span>
              )}
            </div>

            {/* Bottom details */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{card.subtitle}</span>
              <span className="font-mono text-[10px] font-medium text-slate-300 shrink-0 ml-1">
                {card.statTrend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
