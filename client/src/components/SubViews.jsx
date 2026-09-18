import React, { useState } from 'react';
import { 
  Activity, 
  Waves, 
  ShieldAlert, 
  GitMerge, 
  Cpu, 
  SlidersHorizontal, 
  Bell, 
  BarChart3, 
  FileSpreadsheet, 
  UserCheck, 
  Settings, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  Plus,
  Lock,
  Save,
  Database,
  Radio,
  Server
} from 'lucide-react';
import LiveSensorTable from './LiveSensorTable';
import ValveControlPanel from './ValveControlPanel';
import RealTimeFlowChart from './RealTimeFlowChart';
import PipelineVisualizer from './PipelineVisualizer';
import AiLeakDetectionPanel from './AiLeakDetectionPanel';

export function LiveMonitoringView({ sensors, flowHistory }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-cyan-900/40">
        <div>
          <h2 className="text-lg font-bold text-white">Live Monitoring Console</h2>
          <p className="text-xs text-slate-400">High-frequency telemetry data streams and flow waveforms</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs border border-emerald-500/40 animate-pulse">
          🟢 25 Channels Online
        </span>
      </div>
      <RealTimeFlowChart flowHistory={flowHistory} />
      <LiveSensorTable sensors={sensors} />
    </div>
  );
}

export function WaterFlowView({ systemState, flowHistory }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Water Flow &amp; Hydro-Dynamics</h2>
          <p className="text-xs text-slate-400">Volumetric flow rates, intake/outflow balance &amp; pressure drops</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export Hydro Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Reservoir Head Pressure</span>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">4.85 bar</div>
          <span className="text-[10px] text-emerald-400">Optimal intake pressure</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Average Velocity</span>
          <div className="text-2xl font-bold text-sky-300 font-mono mt-1">2.4 m/s</div>
          <span className="text-[10px] text-cyan-400">Main Distribution Trunk 1</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">Non-Revenue Water Loss Rate</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">7.6%</div>
          <span className="text-[10px] text-rose-400">Target: &lt; 5.0%</span>
        </div>
      </div>

      <RealTimeFlowChart flowHistory={flowHistory} />
    </div>
  );
}

export function LeakDetectionView({ systemState, alerts, onSimulateLeak, onResolveAlert }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-900/40 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">AI Leak Detection &amp; Acoustic Analytics</h2>
          <p className="text-xs text-slate-400">Deep learning transient flow classifier &amp; acoustic hydro-sensors</p>
        </div>
        <button 
          onClick={onSimulateLeak}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950"
        >
          Inject Leak Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiLeakDetectionPanel 
          systemState={systemState} 
          alerts={alerts} 
          onSimulateLeak={onSimulateLeak} 
          onResolveAlert={onResolveAlert} 
        />

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" /> Acoustic Sensor Signals
          </h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">Sensor SEN-004 (Branch B)</div>
                <div className="text-[10px] text-rose-400">High acoustic noise detected (42 kHz peak)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                Breach Signal
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">Sensor SEN-003 (Branch A)</div>
                <div className="text-[10px] text-emerald-400">Ambient background murmur (2 kHz baseline)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                Clear
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PipelineNetworkView({ sensors, valves, alerts, onToggleValve, onResolveAlert }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40">
        <h2 className="text-lg font-bold text-white">Pipeline Network GIS Mapping</h2>
        <p className="text-xs text-slate-400">Full topology layout of distribution mains, valves, and smart buildings</p>
      </div>
      <PipelineVisualizer 
        sensors={sensors} 
        valves={valves} 
        alerts={alerts} 
        onToggleValve={onToggleValve} 
        onResolveAlert={onResolveAlert} 
      />
    </div>
  );
}

export function SensorsView({ sensors }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40">
        <h2 className="text-lg font-bold text-white">IoT Sensor Hardware Inventory</h2>
        <p className="text-xs text-slate-400">25 Inline telemetry units, ultrasonic flowmeters &amp; piezoresistive pressure sensors</p>
      </div>
      <LiveSensorTable sensors={sensors} />
    </div>
  );
}

export function ValveControlView({ valves, onToggleValve, onToggleValveMode }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-900/40">
        <h2 className="text-lg font-bold text-white">Valve Isolation &amp; SCADA Actuators</h2>
        <p className="text-xs text-slate-400">Remote control motor-driven valves with automated isolation algorithms</p>
      </div>
      <ValveControlPanel 
        valves={valves} 
        onToggleValve={onToggleValve} 
        onToggleValveMode={onToggleValveMode} 
      />
    </div>
  );
}

export function AlertsView({ alerts, onResolveAlert }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-900/40">
        <h2 className="text-lg font-bold text-white">System Alert History &amp; Incident Records</h2>
        <p className="text-xs text-slate-400">Complete audit log of leakage alarms, valve automations, and resolution actions</p>
      </div>

      <div className="space-y-3">
        {alerts && alerts.map(alert => (
          <div key={alert.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  alert.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {alert.status}
                </span>
                <span className="text-xs font-bold text-slate-200">{alert.title}</span>
              </div>
              <p className="text-xs text-slate-400">{alert.location}</p>
              <div className="text-[11px] text-slate-500 font-mono">
                {alert.details} • Est Loss: {alert.estFlowLoss}
              </div>
            </div>

            {alert.status === 'ACTIVE' ? (
              <button 
                onClick={() => onResolveAlert(alert.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40">
        <h2 className="text-lg font-bold text-white">Water Consumption Analytics</h2>
        <p className="text-xs text-slate-400">Weekly trends, district breakdown, and non-revenue water calculations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">District: Residential (Branch A)</span>
          <div className="text-xl font-bold text-cyan-300 font-mono mt-1">9,200 L (50%)</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">District: Commercial (Branch B)</span>
          <div className="text-xl font-bold text-sky-300 font-mono mt-1">5,400 L (29%)</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400">District: Industrial (Branch C)</span>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-1">3,820 L (21%)</div>
        </div>
      </div>
    </div>
  );
}

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Utility Compliance Reports</h2>
          <p className="text-xs text-slate-400">Generate PDF/CSV audit reports for municipal water authorities</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Generate Monthly PDF Report
        </button>
      </div>

      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-4">
        <div className="font-bold text-white text-sm">Standard Report Templates</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span>Daily Water Loss &amp; NRW Audit</span>
            <button className="text-cyan-400 hover:underline">Download CSV</button>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span>SCADA Valve Operation Logs</span>
            <button className="text-cyan-400 hover:underline">Download CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminManagementView() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Admin Management &amp; RBAC Permissions</h2>
          <p className="text-xs text-slate-400">System administrators, operators, and field maintenance technician accounts</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add New Operator
        </button>
      </div>

      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 text-xs space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div>
            <div className="font-bold text-white">Vishwa T. (Chief SCADA Admin)</div>
            <div className="text-[10px] text-cyan-400">Full Control • Master Key Holder</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div>
            <div className="font-bold text-white">Field Engineer Unit 04</div>
            <div className="text-[10px] text-slate-400">Valve Actuation Only</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-900/40">
        <h2 className="text-lg font-bold text-white">System Settings &amp; Thresholds</h2>
        <p className="text-xs text-slate-400">Configure AI anomaly sensitivity, Socket.io telemetry interval, and SMS alerts</p>
      </div>

      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label className="text-slate-300 font-bold">AI Anomaly Sensitivity Threshold</label>
          <input type="range" min="50" max="99" defaultValue="85" className="w-full" />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Conservative (95%)</span>
            <span>Balanced (85%)</span>
            <span>Aggressive (60%)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
