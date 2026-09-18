import React from 'react';
import {
  LayoutDashboard,
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'water-flow', label: 'Water Flow', icon: Waves },
    { id: 'leak-detection', label: 'Leak Detection', icon: ShieldAlert, badge: '2 Leaks', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { id: 'pipeline-network', label: 'Pipeline Network', icon: GitMerge },
    { id: 'sensors', label: 'Sensors', icon: Cpu, badge: '24/25', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'valve-control', label: 'Valve Control', icon: SlidersHorizontal },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'admin-management', label: 'Admin Management', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative flex flex-col bg-[#0a1120]/95 border-r border-cyan-950/60 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md hover:bg-cyan-900 transition-colors cursor-pointer"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Navigation Menu
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/80 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'text-slate-400'
              }`} />

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom IoT Hardware Node Status */}
      {!collapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300">SCADA Gateway</span>
            <span className="text-[10px] font-mono text-emerald-400">99.98% Up</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[99.98%] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
            <span>Latency: 14ms</span>
            <span>Packet Loss: 0%</span>
          </div>
        </div>
      )}
    </aside>
  );
}
