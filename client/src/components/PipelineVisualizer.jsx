import React, { useState } from 'react';
import { 
  Waves, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Power, 
  Layers, 
  Home, 
  Building2, 
  Factory, 
  Info,
  Maximize2,
  RefreshCw,
  Zap,
  Sliders
} from 'lucide-react';

export default function PipelineVisualizer({ sensors, valves, alerts, onToggleValve, onResolveAlert }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Determine if Branch B has an active leak alert
  const activeLeakAlert = alerts ? alerts.find(a => a.status === 'ACTIVE' && a.affectedSensor === 'SEN-004') : null;
  const isBranchBLeaking = !!activeLeakAlert;

  // Sensor mapping helpers
  const getSensor = (id) => sensors?.find(s => s.id === id) || { flowRate: 0, status: 'Normal', pressure: 4.0 };
  const getValve = (id) => valves?.find(v => v.id === id) || { state: 'OPEN', mode: 'Automatic' };

  const sen1 = getSensor('SEN-001');
  const sen2 = getSensor('SEN-002');
  const sen3 = getSensor('SEN-003');
  const sen4 = getSensor('SEN-004');
  const sen5 = getSensor('SEN-005');
  const sen8 = getSensor('SEN-008');

  const val1 = getValve('VALVE-01');
  const val2 = getValve('VALVE-02');
  const val3 = getValve('VALVE-03');
  const val4 = getValve('VALVE-04');
  const val5 = getValve('VALVE-05');

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0b1528] to-[#070d18] border border-cyan-900/60 p-4 lg:p-6 backdrop-blur-xl shadow-2xl shadow-black/60 mb-6 overflow-hidden">
      
      {/* Visualizer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Waves className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Live Pipeline Network Visualization</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                SCADA 2D REAL-TIME MAP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Animated telemetry stream &amp; automated isolation valves
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            <span className="text-[11px]">Normal Flow (Blue/Cyan)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
            <span className="text-[11px]">Leakage Section (Red)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-300"></span>
            <span className="text-[11px]">Valve Open</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-300"></span>
            <span className="text-[11px]">Valve Closed</span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Pipeline Canvas Container */}
      <div className="relative w-full overflow-x-auto min-w-[900px] bg-[#050914] rounded-xl border border-slate-800/80 p-4">
        
        {/* SVG Drawing Layer */}
        <svg viewBox="0 0 1000 480" className="w-full h-auto select-none overflow-visible">
          
          <defs>
            {/* Pipe Glow Filters */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Linear Pipe Gradients */}
            <linearGradient id="pipeNormal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="pipeLeak" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* BACKGROUND PIPELINE CASINGS (Outer Pipe Wall) */}
          <g stroke="#1e293b" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Reservoir to Main Trunk */}
            <path d="M 120,200 L 280,200" />
            {/* Main Trunk to Branch Junction */}
            <path d="M 280,200 L 450,200" />
            
            {/* Branch A (Top: Residential) */}
            <path d="M 450,200 L 450,90 L 780,90" />
            <path d="M 780,90 L 880,60" />
            <path d="M 780,90 L 880,120" />

            {/* Branch B (Center: Commercial) */}
            <path d="M 450,200 L 780,200" />
            <path d="M 780,200 L 880,170" />
            <path d="M 780,200 L 880,230" />

            {/* Branch C (Bottom: Industrial) */}
            <path d="M 450,200 L 450,330 L 780,330" />
            <path d="M 780,330 L 880,300" />
            <path d="M 780,330 L 880,360" />
          </g>

          {/* INNER FLUID PIPES (Water Flow Channel) */}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Reservoir to Main Trunk */}
            <path d="M 120,200 L 280,200" stroke="url(#pipeNormal)" strokeWidth="10" filter="url(#cyanGlow)" />
            
            {/* Main Trunk to Junction */}
            <path d="M 280,200 L 450,200" stroke="url(#pipeNormal)" strokeWidth="10" filter="url(#cyanGlow)" />

            {/* Branch A Path */}
            <path d="M 450,200 L 450,90 L 780,90" stroke="url(#pipeNormal)" strokeWidth="8" filter="url(#cyanGlow)" />
            <path d="M 780,90 L 880,60" stroke="url(#pipeNormal)" strokeWidth="6" />
            <path d="M 780,90 L 880,120" stroke="url(#pipeNormal)" strokeWidth="6" />

            {/* Branch B Path (Highlights RED if leaking) */}
            <path 
              d="M 450,200 L 780,200" 
              stroke={isBranchBLeaking ? "url(#pipeLeak)" : "url(#pipeNormal)"} 
              strokeWidth="9" 
              filter={isBranchBLeaking ? "url(#redGlow)" : "url(#cyanGlow)"} 
            />
            <path d="M 780,200 L 880,170" stroke={isBranchBLeaking ? "#ef4444" : "url(#pipeNormal)"} strokeWidth="6" />
            <path d="M 780,200 L 880,230" stroke={isBranchBLeaking ? "#ef4444" : "url(#pipeNormal)"} strokeWidth="6" />

            {/* Branch C Path */}
            <path d="M 450,200 L 450,330 L 780,330" stroke="url(#pipeNormal)" strokeWidth="8" filter="url(#cyanGlow)" />
            <path d="M 780,330 L 880,300" stroke="url(#pipeNormal)" strokeWidth="6" />
            <path d="M 780,330 L 880,360" stroke="url(#pipeNormal)" strokeWidth="6" />
          </g>

          {/* ANIMATED WATER PARTICLES (Dash Offset Overlay) */}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9">
            {/* Main Flow Particles */}
            <path d="M 120,200 L 280,200" stroke="#a5f3fc" strokeWidth="4" strokeDasharray="10,15" className="animate-flow-fast" />
            <path d="M 280,200 L 450,200" stroke="#a5f3fc" strokeWidth="4" strokeDasharray="10,15" className="animate-flow-fast" />

            {/* Branch A Particles */}
            <path d="M 450,200 L 450,90 L 780,90" stroke="#67e8f9" strokeWidth="3" strokeDasharray="8,12" className="animate-flow-normal" />
            <path d="M 780,90 L 880,60" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6,10" className="animate-flow-normal" />
            <path d="M 780,90 L 880,120" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6,10" className="animate-flow-normal" />

            {/* Branch B Particles (Slow or Red Spray if Leaking / Closed) */}
            <path 
              d="M 450,200 L 780,200" 
              stroke={isBranchBLeaking ? "#fca5a5" : "#67e8f9"} 
              strokeWidth="3" 
              strokeDasharray={val3.state === 'CLOSED' ? '0' : '8,12'} 
              className={val3.state === 'CLOSED' ? '' : (isBranchBLeaking ? 'animate-flow-fast' : 'animate-flow-normal')} 
            />
            <path d="M 780,200 L 880,170" stroke={isBranchBLeaking ? "#fca5a5" : "#67e8f9"} strokeWidth="2" strokeDasharray="6,10" className="animate-flow-normal" />
            <path d="M 780,200 L 880,230" stroke={isBranchBLeaking ? "#fca5a5" : "#67e8f9"} strokeWidth="2" strokeDasharray="6,10" className="animate-flow-normal" />

            {/* Branch C Particles */}
            <path d="M 450,200 L 450,330 L 780,330" stroke="#67e8f9" strokeWidth="3" strokeDasharray="8,12" className="animate-flow-slow" />
            <path d="M 780,330 L 880,300" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6,10" className="animate-flow-slow" />
            <path d="M 780,330 L 880,360" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6,10" className="animate-flow-slow" />
          </g>

          {/* FLOW DIRECTION ARROWS */}
          <g fill="#38bdf8" opacity="0.8">
            <polygon points="200,195 210,200 200,205" />
            <polygon points="360,195 370,200 360,205" />
            <polygon points="560,85 570,90 560,95" />
            <polygon points="560,195 570,200 560,205" />
            <polygon points="560,325 570,330 560,335" />
          </g>

          {/* LEAKAGE BREACH VISUAL OVERLAY (Pulsing Water Spray & Red Warning Badge) */}
          {isBranchBLeaking && (
            <g transform="translate(630, 200)">
              {/* Outer pulsing burst circles */}
              <circle r="32" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" className="animate-ping" />
              <circle r="20" fill="none" stroke="#f87171" strokeWidth="3" opacity="0.9" />
              <circle r="12" fill="#ef4444" className="animate-pulse" />
              
              {/* Spray droplets */}
              <path d="M -8,-14 L -15,-28 M 0,-18 L 0,-34 M 8,-14 L 15,-28" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* RESERVOIR TANK (Left Side) */}
          <g transform="translate(20, 110)">
            {/* Tank Shell */}
            <rect x="0" y="0" width="100" height="180" rx="16" fill="#0f172a" stroke="#0284c7" strokeWidth="3" filter="url(#cyanGlow)" />
            
            {/* Animated Water Level in Tank */}
            <rect x="6" y="24" width="88" height="148" rx="10" fill="#0369a1" opacity="0.4" />
            <rect x="6" y="40" width="88" height="132" rx="8" fill="url(#pipeNormal)" opacity="0.85" />
            
            {/* Wave animation overlay */}
            <path d="M 6,40 Q 28,34 50,40 T 94,40 L 94,172 L 6,172 Z" fill="#38bdf8" opacity="0.6" />

            {/* Tank Label */}
            <text x="50" y="20" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="monospace">RESERVOIR</text>
            <text x="50" y="95" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">88.4%</text>
            <text x="50" y="115" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontFamily="sans-serif">Capacity: 500kL</text>
            <text x="50" y="150" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Outflow: 128.6 L/m</text>
          </g>

          {/* SENSOR NODES (Clickable) */}
          {/* Sensor 01 (Main Outlet) */}
          <g transform="translate(220, 200)" className="cursor-pointer group" onClick={() => setSelectedNode(sen1)}>
            <circle r="16" fill="#091325" stroke="#06b6d4" strokeWidth="2.5" />
            <circle r="8" fill="#06b6d4" className="animate-pulse" />
            <rect x="-35" y="-45" width="70" height="22" rx="4" fill="#0a1120" stroke="#0284c7" strokeWidth="1" />
            <text x="0" y="-30" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="monospace">
              S1: {sen1.flowRate} L/m
            </text>
          </g>

          {/* Sensor 02 (Main Line) */}
          <g transform="translate(380, 200)" className="cursor-pointer group" onClick={() => setSelectedNode(sen2)}>
            <circle r="16" fill="#091325" stroke="#06b6d4" strokeWidth="2.5" />
            <circle r="8" fill="#06b6d4" />
            <rect x="-35" y="-45" width="70" height="22" rx="4" fill="#0a1120" stroke="#0284c7" strokeWidth="1" />
            <text x="0" y="-30" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="monospace">
              S2: {sen2.flowRate} L/m
            </text>
          </g>

          {/* Sensor 03 (Branch A) */}
          <g transform="translate(680, 90)" className="cursor-pointer group" onClick={() => setSelectedNode(sen3)}>
            <circle r="14" fill="#091325" stroke="#10b981" strokeWidth="2.5" />
            <circle r="7" fill="#10b981" />
            <rect x="-35" y="-42" width="70" height="22" rx="4" fill="#0a1120" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="-27" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold" fontFamily="monospace">
              S3: {sen3.flowRate} L/m
            </text>
          </g>

          {/* Sensor 04 (Branch B - Leak Spot) */}
          <g transform="translate(680, 200)" className="cursor-pointer group" onClick={() => setSelectedNode(sen4)}>
            <circle r="16" fill="#091325" stroke={isBranchBLeaking ? "#ef4444" : "#06b6d4"} strokeWidth="3" />
            <circle r="8" fill={isBranchBLeaking ? "#ef4444" : "#06b6d4"} className={isBranchBLeaking ? "animate-ping" : ""} />
            <rect x="-40" y="25" width="80" height="24" rx="4" fill="#0a1120" stroke={isBranchBLeaking ? "#ef4444" : "#0284c7"} strokeWidth="1.5" />
            <text x="0" y="41" textAnchor="middle" fill={isBranchBLeaking ? "#fca5a5" : "#7dd3fc"} fontSize="11" fontWeight="bold" fontFamily="monospace">
              S4: {sen4.flowRate} L/m
            </text>
          </g>

          {/* Sensor 05 (Branch C) */}
          <g transform="translate(680, 330)" className="cursor-pointer group" onClick={() => setSelectedNode(sen5)}>
            <circle r="14" fill="#091325" stroke="#10b981" strokeWidth="2.5" />
            <circle r="7" fill="#10b981" />
            <rect x="-35" y="24" width="70" height="22" rx="4" fill="#0a1120" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="39" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="bold" fontFamily="monospace">
              S5: {sen5.flowRate} L/m
            </text>
          </g>

          {/* CONTROL VALVES (Interactive Click to Toggle OPEN/CLOSED) */}
          {/* Valve 01 (Main Outflow) */}
          <g transform="translate(170, 200)" className="cursor-pointer" onClick={() => onToggleValve(val1.id)}>
            <polygon points="-12,-12 12,12 -12,12 12,-12" fill={val1.state === 'OPEN' ? '#10b981' : '#f59e0b'} stroke="#ffffff" strokeWidth="1.5" />
            <circle r="4" fill="#ffffff" />
            <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">V1: {val1.state}</text>
          </g>

          {/* Valve 02 (Branch A Valve) */}
          <g transform="translate(480, 90)" className="cursor-pointer" onClick={() => onToggleValve(val2.id)}>
            <polygon points="-10,-10 10,10 -10,10 10,-10" fill={val2.state === 'OPEN' ? '#10b981' : '#f59e0b'} stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">V2: {val2.state}</text>
          </g>

          {/* Valve 03 (Branch B Valve - Primary Leak Isolator) */}
          <g transform="translate(480, 200)" className="cursor-pointer" onClick={() => onToggleValve(val3.id)}>
            <polygon 
              points="-14,-14 14,14 -14,14 14,-14" 
              fill={val3.state === 'OPEN' ? (isBranchBLeaking ? '#ef4444' : '#10b981') : '#f59e0b'} 
              stroke="#ffffff" 
              strokeWidth="2" 
              className={isBranchBLeaking && val3.state === 'OPEN' ? "animate-pulse" : ""}
            />
            <circle r="5" fill="#ffffff" />
            <text x="0" y="30" textAnchor="middle" fill={val3.state === 'CLOSED' ? "#f59e0b" : "#e2e8f0"} fontSize="10" fontWeight="bold" fontFamily="monospace">
              V3: {val3.state}
            </text>
          </g>

          {/* Valve 04 (Branch C Valve) */}
          <g transform="translate(480, 330)" className="cursor-pointer" onClick={() => onToggleValve(val4.id)}>
            <polygon points="-10,-10 10,10 -10,10 10,-10" fill={val4.state === 'OPEN' ? '#10b981' : '#f59e0b'} stroke="#ffffff" strokeWidth="1.5" />
            <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">V4: {val4.state}</text>
          </g>

          {/* DESTINATION BUILDINGS / CONSUMER ZONES */}
          {/* Residential Zone A */}
          <g transform="translate(895, 45)">
            <rect x="0" y="0" width="80" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="40" y="25" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">BRANCH A</text>
            <text x="40" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">Residential</text>
            <text x="40" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">Zone A1 &amp; A2</text>
            <text x="40" y="78" textAnchor="middle" fill="#10b981" fontSize="9" fontStyle="italic">Normal Flow</text>
          </g>

          {/* Commercial Zone B */}
          <g transform="translate(895, 155)">
            <rect 
              x="0" y="0" width="80" height="90" rx="8" 
              fill="#0f172a" 
              stroke={isBranchBLeaking ? "#ef4444" : "#38bdf8"} 
              strokeWidth={isBranchBLeaking ? "2.5" : "1.5"} 
            />
            <text x="40" y="25" textAnchor="middle" fill={isBranchBLeaking ? "#fca5a5" : "#7dd3fc"} fontSize="10" fontWeight="bold">BRANCH B</text>
            <text x="40" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">Commercial</text>
            <text x="40" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">Shopping Mall</text>
            <text x="40" y="78" textAnchor="middle" fill={isBranchBLeaking ? "#ef4444" : "#10b981"} fontSize="9" fontWeight="bold">
              {isBranchBLeaking ? "Pressure Low" : "Normal Flow"}
            </text>
          </g>

          {/* Industrial Zone C */}
          <g transform="translate(895, 285)">
            <rect x="0" y="0" width="80" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="40" y="25" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">BRANCH C</text>
            <text x="40" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">Industrial</text>
            <text x="40" y="60" textAnchor="middle" fill="#94a3b8" fontSize="9">Tech Park</text>
            <text x="40" y="78" textAnchor="middle" fill="#10b981" fontSize="9" fontStyle="italic">Normal Flow</text>
          </g>

        </svg>

        {/* Dynamic Floating Leak Warning & 1-Click Auto Isolation Callout */}
        {isBranchBLeaking && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-950/90 via-rose-950/80 to-slate-900 border border-red-500/60 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-pulse-red">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-900/80 text-red-200 border border-red-400">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-black uppercase">
                    CRITICAL LEAK DETECTED
                  </span>
                  <span className="text-xs text-rose-300 font-mono">Location: Branch B (Pipe B-03)</span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Estimated Water Loss: <strong className="text-red-300 font-mono">38.5 L/min</strong> | Affected Sensor: <strong className="font-mono text-cyan-300">SEN-004</strong> | Pressure: <strong className="text-red-300 font-mono">1.8 bar (Low)</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {val3.state === 'OPEN' ? (
                <button
                  onClick={() => onToggleValve('VALVE-03')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 border border-red-300 transition-all cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  <span>EMERGENCY ISOLATE (CLOSE VALVE 03)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>LEAK ISOLATED - VALVE 03 CLOSED</span>
                </div>
              )}

              <button
                onClick={() => onResolveAlert(activeLeakAlert.id)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
