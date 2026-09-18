import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Bell, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Zap, 
  ChevronDown,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';

export default function Header({ systemState, alerts, onSimulateLeak, onResolveAlert }) {
  const [time, setTime] = useState(new Date());
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts ? alerts.filter(a => a.status === 'ACTIVE') : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a1120]/90 backdrop-blur-md border-b border-cyan-950/60 px-4 lg:px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-[#0284c7] p-2.5 rounded-xl bg-gradient-to-br from-cyan-900/60 to-blue-950/80 border border-cyan-500/40 shadow-lg shadow-cyan-950/50">
              <Droplets className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  AquaGuard AI
                </h1>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  v3.4 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Smart Water Distribution Management & Intelligent Leak Detection
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Status & Simulation Action */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 tracking-wide">SYSTEM ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono text-[11px]">SCADA TELEMETRY SYNCED</span>
          </div>

          {/* Quick Simulation Trigger */}
          <button
            onClick={onSimulateLeak}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/80 to-rose-700/80 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-red-950/50 border border-red-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Inject a high-pressure pipe breach to test real-time alerts & valve controls"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Pipe Leak</span>
          </button>
        </div>

        {/* Right: Date/Time, Alerts, Admin Profile */}
        <div className="flex items-center gap-3">
          
          {/* Live Date & Time Clock */}
          <div className="hidden md:flex flex-col items-end text-xs font-mono text-slate-300 px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{time.toLocaleTimeString()}</span>
            </div>
            <span className="text-[10px] text-slate-400">{time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                activeAlerts.length > 0 
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/50 animate-pulse' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#0a1120]">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0d1628] border border-cyan-900/80 shadow-2xl shadow-black/80 z-50 overflow-hidden">
                <div className="p-3.5 bg-gradient-to-r from-cyan-950/90 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-semibold text-white">Active Leakage Alerts</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 font-mono font-bold border border-rose-700/50">
                    {activeAlerts.length} Critical
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {alerts && alerts.length > 0 ? (
                    alerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-3.5 text-xs transition-colors ${
                          alert.status === 'ACTIVE' ? 'bg-rose-950/20 hover:bg-rose-950/40' : 'bg-slate-900/40 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                            alert.severity === 'CRITICAL' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {alert.severity} • {alert.probability}% AI Confidence
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-200 mt-1">{alert.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">{alert.location}</p>
                        
                        <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/60">
                          <span className="text-[10px] text-rose-300 font-mono">Est Loss: {alert.estFlowLoss}</span>
                          {alert.status === 'ACTIVE' ? (
                            <button
                              onClick={() => onResolveAlert(alert.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Resolve Alert</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No active alerts. System operating normally.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs border border-cyan-400/40 shadow-md">
              VT
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0a1120]"></span>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-200">Vishwa T.</div>
              <div className="text-[10px] text-cyan-400 font-medium">Chief Water SCADA Admin</div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
