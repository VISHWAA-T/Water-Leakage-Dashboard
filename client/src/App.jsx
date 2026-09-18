import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import PipelineVisualizer from './components/PipelineVisualizer';
import AiLeakDetectionPanel from './components/AiLeakDetectionPanel';
import RealTimeFlowChart from './components/RealTimeFlowChart';
import LiveSensorTable from './components/LiveSensorTable';
import ValveControlPanel from './components/ValveControlPanel';
import {
  LiveMonitoringView,
  WaterFlowView,
  LeakDetectionView,
  PipelineNetworkView,
  SensorsView,
  ValveControlView,
  AlertsView,
  AnalyticsView,
  ReportsView,
  AdminManagementView,
  SettingsView
} from './components/SubViews';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Real-Time State
  const [systemState, setSystemState] = useState({
    online: true,
    totalFlowRate: 128.6,
    totalWaterDistributedToday: 18420,
    activeLeaksCount: 2,
    activeSensorsCount: 24,
    totalSensorsCount: 25,
    openValvesCount: 22,
    closedValvesCount: 3,
    aiLeakProbability: 94,
    aiAnomalyScore: 'HIGH',
    aiStatus: 'Monitoring - Leak Detected in Branch B'
  });

  const [sensors, setSensors] = useState([]);
  const [valves, setValves] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [flowHistory, setFlowHistory] = useState([]);

  // Socket.io initialization & Fallback REST Fetching
  useEffect(() => {
    // 1. Initial REST API Fetch
    const fetchInitialData = async () => {
      try {
        const [sumRes, senRes, valRes, altRes, historyRes] = await Promise.all([
          fetch('/api/summary').then(r => r.json()),
          fetch('/api/sensors').then(r => r.json()),
          fetch('/api/valves').then(r => r.json()),
          fetch('/api/alerts').then(r => r.json()),
          fetch('/api/telemetry/history').then(r => r.json())
        ]);

        if (sumRes.success) setSystemState(sumRes.data);
        if (senRes.success) setSensors(senRes.data);
        if (valRes.success) setValves(valRes.data);
        if (altRes.success) setAlerts(altRes.data);
        if (historyRes.success) setFlowHistory(historyRes.data);
      } catch (err) {
        console.warn('Initial REST fetch fallback warning:', err);
      }
    };

    fetchInitialData();

    // 2. Real-Time Socket.io Connection
    const socket = io('/', {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to AquaGuard AI Socket Server');
    });

    socket.on('telemetry:snapshot', (snapshot) => {
      if (snapshot.systemState) setSystemState(snapshot.systemState);
      if (snapshot.sensors) setSensors(snapshot.sensors);
      if (snapshot.valves) setValves(snapshot.valves);
      if (snapshot.alerts) setAlerts(snapshot.alerts);
      if (snapshot.flowHistory) setFlowHistory(snapshot.flowHistory);
    });

    socket.on('telemetry:update', (data) => {
      if (data.systemState) setSystemState(data.systemState);
      if (data.sensors) setSensors(data.sensors);
      if (data.valves) setValves(data.valves);
      if (data.alerts) setAlerts(data.alerts);
      
      if (data.latestTelemetryPoint) {
        setFlowHistory((prev) => {
          const updated = [...prev, data.latestTelemetryPoint];
          if (updated.length > 40) updated.shift();
          return updated;
        });
      }
    });

    socket.on('valve:changed', (data) => {
      if (data.valves) setValves(data.valves);
      if (data.systemState) setSystemState(data.systemState);
    });

    socket.on('alert:new', (data) => {
      if (data.alerts) setAlerts(data.alerts);
      if (data.systemState) setSystemState(data.systemState);
    });

    socket.on('alert:resolved', (data) => {
      if (data.alerts) setAlerts(data.alerts);
      if (data.systemState) setSystemState(data.systemState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handlers for API actions
  const handleToggleValve = async (valveId) => {
    try {
      const res = await fetch(`/api/valves/${valveId}/toggle`, { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setValves((prev) => prev.map(v => v.id === valveId ? res.data : v));
      }
    } catch (err) {
      console.error('Failed to toggle valve:', err);
    }
  };

  const handleToggleValveMode = async (valveId) => {
    try {
      const res = await fetch(`/api/valves/${valveId}/mode`, { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setValves((prev) => prev.map(v => v.id === valveId ? res.data : v));
      }
    } catch (err) {
      console.error('Failed to toggle valve mode:', err);
    }
  };

  const handleSimulateLeak = async () => {
    try {
      const res = await fetch('/api/simulate-leak', { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setAlerts((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to simulate leak:', err);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setAlerts((prev) => prev.map(a => a.id === alertId ? res.data : a));
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  // Render view based on active navigation tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'live-monitoring':
        return <LiveMonitoringView sensors={sensors} flowHistory={flowHistory} />;
      case 'water-flow':
        return <WaterFlowView systemState={systemState} flowHistory={flowHistory} />;
      case 'leak-detection':
        return (
          <LeakDetectionView 
            systemState={systemState} 
            alerts={alerts} 
            onSimulateLeak={handleSimulateLeak} 
            onResolveAlert={handleResolveAlert} 
          />
        );
      case 'pipeline-network':
        return (
          <PipelineNetworkView 
            sensors={sensors} 
            valves={valves} 
            alerts={alerts} 
            onToggleValve={handleToggleValve} 
            onResolveAlert={handleResolveAlert} 
          />
        );
      case 'sensors':
        return <SensorsView sensors={sensors} />;
      case 'valve-control':
        return (
          <ValveControlView 
            valves={valves} 
            onToggleValve={handleToggleValve} 
            onToggleValveMode={handleToggleValveMode} 
          />
        );
      case 'alerts':
        return <AlertsView alerts={alerts} onResolveAlert={handleResolveAlert} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'admin-management':
        return <AdminManagementView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Top KPI Summary Cards */}
            <SummaryCards systemState={systemState} />

            {/* Main Centerpiece: Live SVG Pipeline Visualizer */}
            <PipelineVisualizer 
              sensors={sensors} 
              valves={valves} 
              alerts={alerts} 
              onToggleValve={handleToggleValve} 
              onResolveAlert={handleResolveAlert} 
            />

            {/* Middle Grid: AI Leak Detection & Real-Time Flow Rate Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              <div className="lg:col-span-5">
                <AiLeakDetectionPanel 
                  systemState={systemState} 
                  alerts={alerts} 
                  onSimulateLeak={handleSimulateLeak} 
                  onResolveAlert={handleResolveAlert} 
                />
              </div>
              <div className="lg:col-span-7">
                <RealTimeFlowChart flowHistory={flowHistory} />
              </div>
            </div>

            {/* Bottom Grid: Live Sensor Data Grid & Valve Controls */}
            <LiveSensorTable sensors={sensors} />
            <ValveControlPanel 
              valves={valves} 
              onToggleValve={handleToggleValve} 
              onToggleValveMode={handleToggleValveMode} 
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header 
        systemState={systemState} 
        alerts={alerts} 
        onSimulateLeak={handleSimulateLeak} 
        onResolveAlert={handleResolveAlert} 
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />

        {/* Main Content Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
