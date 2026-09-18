import React from 'react';
import { 
  SlidersHorizontal, 
  Power, 
  Settings2, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock,
  ShieldAlert
} from 'lucide-react';

export default function ValveControlPanel({ valves, onToggleValve, onToggleValveMode }) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0b1528] to-[#070d18] border border-cyan-900/60 p-5 backdrop-blur-xl shadow-xl shadow-black/50 mb-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Automatic Valve Control Matrix</h3>
            <p className="text-xs text-slate-400">Motorized butterfly &amp; gate valve actuation control</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{valves ? valves.filter(v => v.state === 'OPEN').length : 0} OPEN</span>
          <span className="text-slate-600">|</span>
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{valves ? valves.filter(v => v.state === 'CLOSED').length : 0} CLOSED</span>
        </div>
      </div>

      {/* Grid of Valves */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {valves && valves.map((valve) => (
          <div 
            key={valve.id}
            className={`rounded-xl p-4 border transition-all duration-200 ${
              valve.state === 'OPEN' 
                ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40' 
                : 'bg-amber-950/20 border-amber-500/30'
            }`}
          >
            {/* Valve Top Info */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-cyan-300">{valve.id}</span>
              
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                valve.state === 'OPEN' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {valve.state}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-200 truncate">{valve.name}</h4>
            <p className="text-[11px] text-slate-400 truncate mb-3">{valve.location}</p>

            {/* Metrics */}
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-[11px] mb-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Flow Rate:</span>
                <span className="font-mono font-bold text-cyan-300">{valve.flowRate} L/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Control Mode:</span>
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  valve.mode === 'Automatic' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-amber-300'
                }`}>
                  {valve.mode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              {/* Toggle Open/Closed */}
              <button
                onClick={() => onToggleValve(valve.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  valve.state === 'OPEN'
                    ? 'bg-amber-600/80 hover:bg-amber-500 text-white border border-amber-400/30'
                    : 'bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/30'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{valve.state === 'OPEN' ? 'CLOSE VALVE' : 'OPEN VALVE'}</span>
              </button>

              {/* Toggle Mode */}
              <button
                onClick={() => onToggleValveMode(valve.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title={`Switch to ${valve.mode === 'Automatic' ? 'Manual' : 'Automatic'} mode`}
              >
                <Settings2 className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Last Action Note */}
            <div className="mt-2 text-[9px] text-slate-500 font-mono truncate">
              {valve.lastAction}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
