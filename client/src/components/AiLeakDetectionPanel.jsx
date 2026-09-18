import React from 'react';
import { 
  BrainCircuit, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  Clock, 
  Zap,
  TrendingUp,
  Sliders
} from 'lucide-react';

export default function AiLeakDetectionPanel({ systemState, alerts, onSimulateLeak, onResolveAlert }) {
  const probability = systemState?.aiLeakProbability || 94;
  const anomalyScore = systemState?.aiAnomalyScore || 'HIGH';
  const aiStatus = systemState?.aiStatus || 'Monitoring';

  const activeAlert = alerts ? alerts.find(a => a.status === 'ACTIVE') : null;

  // SVG Radial Progress math
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d172a] via-[#091120] to-[#070d18] border border-cyan-500/30 p-5 backdrop-blur-xl shadow-xl shadow-black/50 h-full flex flex-col justify-between">
      
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-900/80 to-blue-950/90 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-950/50">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Leak Detection</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  NEURAL HYDRO-ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">Acoustic &amp; pressure telemetry neural classifier</p>
            </div>
          </div>

          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            probability > 60 
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 animate-pulse' 
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${probability > 60 ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
            {probability > 60 ? 'Leakage Warning' : 'Pipeline Intact'}
          </span>
        </div>

        {/* Circular Progress & Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 my-2">
          
          {/* Radial Progress Gauge */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Animated Radial Progress Ring */}
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={probability > 70 ? '#ef4444' : (probability > 40 ? '#f59e0b' : '#10b981')}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-black font-mono tracking-tight ${
                  probability > 70 ? 'text-rose-400' : (probability > 40 ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {probability}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Leak Prob.</span>
              </div>
            </div>
          </div>

          {/* AI Metrics Column */}
          <div className="sm:col-span-7 space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Anomaly Score:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                anomalyScore === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {anomalyScore}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Pattern Classification:</span>
              <span className="font-semibold text-cyan-300">
                {probability > 60 ? 'Transient Fracture Surge' : 'Laminar Peak Flow'}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Acoustic Confidence:</span>
              <span className="font-mono text-slate-200">99.4% (Hydro-Sensor Array)</span>
            </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40 mt-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Real-Time Insights</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeAlert 
              ? `AI Hydro-Predictor identified active flow disparity between SEN-002 and SEN-004. ${activeAlert.details}` 
              : "Flow models indicate normal laminar distribution across all 3 major branch trunks. No pressure anomalies detected."}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 text-[11px] flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-cyan-400" />
          Last AI scan: {new Date().toLocaleTimeString()}
        </span>

        {activeAlert ? (
          <button
            onClick={() => onResolveAlert(activeAlert.id)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolve AI Alert</span>
          </button>
        ) : (
          <button
            onClick={onSimulateLeak}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test AI Detection</span>
          </button>
        )}
      </div>

    </div>
  );
}
