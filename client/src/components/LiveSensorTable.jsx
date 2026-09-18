import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Activity, 
  Sliders
} from 'lucide-react';

export default function LiveSensorTable({ sensors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredSensors = sensors ? sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sensor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || sensor.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Normal
          </span>
        );
      case 'leakage':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Leakage Alert
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Warning
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0b1528] to-[#070d18] border border-cyan-900/60 p-5 backdrop-blur-xl shadow-xl shadow-black/50 mb-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Sensor Monitoring</h3>
            <p className="text-xs text-slate-400">Real-time pressure &amp; volumetric telemetry grid</p>
          </div>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sensor ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors w-56"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'NORMAL', 'LEAKAGE', 'OFFLINE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-cyan-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-cyan-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-950/40">
              <th className="py-3 px-4">Sensor ID &amp; Name</th>
              <th className="py-3 px-4">Pipeline Location</th>
              <th className="py-3 px-4">Flow Rate</th>
              <th className="py-3 px-4">Line Pressure</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Telemetry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredSensors.length > 0 ? (
              filteredSensors.map((sensor) => (
                <tr 
                  key={sensor.id} 
                  className={`transition-colors hover:bg-cyan-950/20 ${
                    sensor.status === 'Leakage' ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-xs">{sensor.id}</span>
                      <span className="font-sans font-medium text-slate-300">{sensor.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{sensor.location}</td>
                  <td className="py-3 px-4 text-cyan-300 font-bold text-sm">
                    {sensor.flowRate} <span className="text-[10px] text-slate-500 font-normal">L/min</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {sensor.pressure} <span className="text-[10px] text-slate-500">bar</span>
                  </td>
                  <td className="py-3 px-4 font-sans">{getStatusBadge(sensor.status)}</td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-cyan-500 animate-spin" />
                      {sensor.lastUpdate}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500 font-sans text-xs">
                  No sensors found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
