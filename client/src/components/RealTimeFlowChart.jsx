import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine 
} from 'recharts';
import { Activity, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RealTimeFlowChart({ flowHistory }) {
  const [timeframe, setTimeframe] = useState('Live');

  const timeframes = ['Live', '1 Hour', '6 Hours', '24 Hours', '7 Days'];

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#0a1120]/95 border border-cyan-500/40 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
          <div className="text-slate-400 font-bold mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Time: {label}</span>
          </div>
          <div className="space-y-1">
            <div className="text-cyan-300 font-bold flex justify-between gap-4">
              <span>Total Flow Rate:</span>
              <span>{data.totalFlow} L/min</span>
            </div>
            <div className="text-slate-400 flex justify-between gap-4">
              <span>Baseline Target:</span>
              <span>{data.normalBaseline} L/min</span>
            </div>
            {data.leakageLoss > 0 && (
              <div className="text-rose-400 font-bold flex justify-between gap-4 pt-1 border-t border-rose-950">
                <span>Estimated Loss:</span>
                <span>+{data.leakageLoss} L/min</span>
              </div>
            )}
            <div className="text-emerald-400 flex justify-between gap-4">
              <span>Pressure:</span>
              <span>{data.pressure} bar</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0b1528] to-[#070d18] border border-cyan-900/60 p-5 backdrop-blur-xl shadow-xl shadow-black/50 mb-6">
      
      {/* Header & Timeframe Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Real-Time Flow Rate &amp; Telemetry Curve</h3>
            <p className="text-xs text-slate-400">Continuous discharge volume (L/min) vs Time</p>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={flowHistory || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
              </linearGradient>
              
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />

            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              domain={[60, 180]}
              tickLine={false}
              fontFamily="monospace"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Line */}
            <ReferenceLine y={145} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'MAX SAFE THRESHOLD (145 L/min)', fill: '#f87171', fontSize: 10 }} />
            <ReferenceLine y={118} stroke="#10b981" strokeDasharray="2 2" label={{ value: 'BASELINE NOMINAL (118 L/min)', fill: '#34d399', fontSize: 10 }} />

            {/* Total Flow Curve */}
            <Area 
              type="monotone" 
              dataKey="totalFlow" 
              stroke="#06b6d4" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#flowGradient)" 
              dot={{ r: 2, fill: '#38bdf8' }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Leak Loss Overlay Curve */}
            <Area 
              type="monotone" 
              dataKey="leakageLoss" 
              stroke="#ef4444" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#lossGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400"></span> Live Discharge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400"></span> Nominal Baseline (118 L/min)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500"></span> Unaccounted Water Loss
          </span>
        </div>
        <span className="font-mono text-[11px] text-cyan-300">
          Sampling Rate: 2.0 sec / SCADA IoT Stream
        </span>
      </div>

    </div>
  );
}
