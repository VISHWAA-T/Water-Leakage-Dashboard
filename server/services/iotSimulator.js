// IoT Telemetry & AI Leak Detection Simulator for AquaGuard AI

import { Sensor } from '../models/Sensor.js';
import { TelemetryLog } from '../models/TelemetryLog.js';
import { Alert } from '../models/Alert.js';

class IoTSimulator {
  constructor() {
    this.io = null;
    this.intervalId = null;
    this.isDbConnected = false;


    // System summary state
    this.systemState = {
      online: true,
      reservoirLevelPercent: 88.4,
      totalFlowRate: 128.6, // L/min
      totalWaterDistributedToday: 18420, // Liters
      activeLeaksCount: 2,
      activeSensorsCount: 24,
      totalSensorsCount: 25,
      openValvesCount: 22,
      closedValvesCount: 3,
      aiLeakProbability: 94, // %
      aiAnomalyScore: "HIGH", // LOW, MEDIUM, HIGH
      aiStatus: "Monitoring - Leak Detected in Branch B",
      aiDetectionTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    };

    // Detailed Sensor Inventory
    this.sensors = [
      { id: "SEN-001", name: "Main Reservoir Outlet", location: "Main Pipeline - Sector 1", flowRate: 128.6, pressure: 4.8, status: "Normal", lastUpdate: "Just now", minNormal: 100, maxNormal: 150 },
      { id: "SEN-002", name: "Flow Meter Alpha", location: "Main Pipeline - Sector 2", flowRate: 124.2, pressure: 4.6, status: "Normal", lastUpdate: "Just now", minNormal: 95, maxNormal: 145 },
      { id: "SEN-003", name: "Branch A Junction Meter", location: "Branch A (Residential Zone 1)", flowRate: 74.2, pressure: 3.9, status: "Normal", lastUpdate: "Just now", minNormal: 50, maxNormal: 90 },
      { id: "SEN-004", name: "Branch B Critical Meter", location: "Branch B (Commercial District)", flowRate: 12.4, pressure: 1.8, status: "Leakage", lastUpdate: "Just now", minNormal: 35, maxNormal: 60 },
      { id: "SEN-005", name: "Branch C Substation", location: "Branch C (Industrial Park)", flowRate: 38.1, pressure: 4.2, status: "Normal", lastUpdate: "Just now", minNormal: 30, maxNormal: 50 },
      { id: "SEN-006", name: "Residential Complex A1", location: "Sub-Branch A1", flowRate: 28.5, pressure: 3.5, status: "Normal", lastUpdate: "Just now", minNormal: 20, maxNormal: 40 },
      { id: "SEN-007", name: "Residential Complex A2", location: "Sub-Branch A2", flowRate: 45.7, pressure: 3.6, status: "Normal", lastUpdate: "Just now", minNormal: 30, maxNormal: 50 },
      { id: "SEN-008", name: "Shopping Mall Complex", location: "Sub-Branch B1", flowRate: 4.1, pressure: 1.2, status: "Leakage", lastUpdate: "Just now", minNormal: 20, maxNormal: 45 },
      { id: "SEN-009", name: "Tech Park Block 1", location: "Sub-Branch C1", flowRate: 22.3, pressure: 4.1, status: "Normal", lastUpdate: "Just now", minNormal: 15, maxNormal: 30 },
      { id: "SEN-010", name: "Tech Park Block 2", location: "Sub-Branch C2", flowRate: 15.8, pressure: 4.0, status: "Normal", lastUpdate: "Just now", minNormal: 10, maxNormal: 25 },
      { id: "SEN-011", name: "Hospital Emergency Line", location: "Branch D (Medical Zone)", flowRate: 55.4, pressure: 5.0, status: "Normal", lastUpdate: "Just now", minNormal: 40, maxNormal: 70 },
      { id: "SEN-012", name: "School Zone Feed", location: "Branch E (Educational)", flowRate: 0.0, pressure: 0.0, status: "Offline", lastUpdate: "12 mins ago", minNormal: 10, maxNormal: 25 },
    ];

    // Detailed Valve Inventory
    this.valves = [
      { id: "VALVE-01", name: "Main Reservoir Outflow Valve", location: "Main Tank Node 0", state: "OPEN", flowRate: 128.6, mode: "Automatic", lastAction: "Opened 14h ago by AI System" },
      { id: "VALVE-02", name: "Branch A Primary Valve", location: "Branch A Input", state: "OPEN", flowRate: 74.2, mode: "Automatic", lastAction: "Adjusted to 100% open" },
      { id: "VALVE-03", name: "Branch B Isolation Valve", location: "Branch B Input (Leak Zone)", state: "OPEN", flowRate: 12.4, mode: "Manual", lastAction: "Alert: Manual Override Requested" },
      { id: "VALVE-04", name: "Branch C Industrial Valve", location: "Branch C Input", state: "OPEN", flowRate: 38.1, mode: "Automatic", lastAction: "Flow throttled - 85%" },
      { id: "VALVE-05", name: "Sub-Branch B1 Emergency Cutoff", location: "B1 Secondary Pipeline", state: "CLOSED", flowRate: 0.0, mode: "Automatic", lastAction: "Isolated by AI at 12:04 PM" },
      { id: "VALVE-06", name: "Drainage Bypass Valve 01", location: "Retention Tank 1", state: "CLOSED", flowRate: 0.0, mode: "Manual", lastAction: "Closed by Admin" },
      { id: "VALVE-07", name: "Auxiliary Feed Valve", location: "Backup Line", state: "CLOSED", flowRate: 0.0, mode: "Automatic", lastAction: "Standby Mode" },
    ];

    // Leakage Alerts
    this.alerts = [
      {
        id: "ALT-2026-904",
        title: "Major Flow Loss & Pressure Drop Detected",
        location: "Branch B - Commercial District (Pipe Segment B-03)",
        affectedSensor: "SEN-004",
        recommendedValve: "VALVE-03",
        severity: "CRITICAL",
        probability: 94,
        anomalyScore: "HIGH",
        estFlowLoss: "38.5 L/min",
        status: "ACTIVE",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        details: "AI acoustic hydrophone telemetry detected pattern anomaly consistent with 45mm pipe fracture. Pressure dropped from 4.2 bar to 1.8 bar."
      },
      {
        id: "ALT-2026-903",
        title: "Micro-Seepage Detected near Mall Complex",
        location: "Sub-Branch B1 (Pipe Segment B1-02)",
        affectedSensor: "SEN-008",
        recommendedValve: "VALVE-05",
        severity: "WARNING",
        probability: 78,
        anomalyScore: "MEDIUM",
        estFlowLoss: "12.2 L/min",
        status: "ACTIVE",
        timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        details: "Continuous non-peak night flow disparity detected between SEN-004 and SEN-008."
      }
    ];

    // Generate initial historical telemetry points for charts
    this.flowHistory = this.generateHistoricalTelemetry();
  }

  generateHistoricalTelemetry() {
    const history = [];
    const now = Date.now();
    // Generate 30 data points representing recent time steps
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now - i * 60 * 1000);
      const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Introduce an anomaly bump in recent data points to show leak baseline deviation
      let anomalyFactor = 0;
      if (i < 8) {
        anomalyFactor = 35 + Math.sin(i) * 5; // spike flow loss
      }

      const totalFlow = parseFloat((120 + Math.random() * 10 + anomalyFactor).toFixed(1));
      const normalFlow = parseFloat((115 + Math.random() * 5).toFixed(1));
      const lossFlow = parseFloat((totalFlow - normalFlow).toFixed(1));

      history.push({
        time: timeLabel,
        rawTimestamp: time.toISOString(),
        totalFlow: totalFlow,
        normalBaseline: 118.0,
        leakageLoss: Math.max(0, lossFlow),
        pressure: parseFloat((4.8 - (i < 8 ? 1.2 : 0) + (Math.random() * 0.2 - 0.1)).toFixed(2)),
        aiAnomalyFlag: i < 8
      });
    }
    return history;
  }

  async init(io, isDbConnected = false) {
    this.io = io;
    this.isDbConnected = isDbConnected;

    if (this.isDbConnected) {
      await this.syncWithDatabase();
    }

    // Start background simulation timer updating every 2 seconds
    this.intervalId = setInterval(() => {
      this.tick();
    }, 2000);

    console.log("🌊 IoT Telemetry & AI Leak Detection Simulator running...");
  }

  async syncWithDatabase() {
    try {
      // Seed sensors if collection is empty
      const sensorCount = await Sensor.countDocuments();
      if (sensorCount === 0) {
        await Sensor.insertMany(this.sensors);
        console.log(`🌱 Seeded ${this.sensors.length} sensors into MongoDB.`);
      } else {
        const dbSensors = await Sensor.find().lean();
        if (dbSensors.length > 0) {
          this.sensors = dbSensors.map(s => ({
            id: s.id,
            name: s.name,
            location: s.location,
            flowRate: s.flowRate,
            pressure: s.pressure,
            status: s.status,
            lastUpdate: s.lastUpdate || 'Just now',
            minNormal: s.minNormal,
            maxNormal: s.maxNormal
          }));
        }
      }

      // Seed alerts if collection is empty
      const alertCount = await Alert.countDocuments();
      if (alertCount === 0) {
        await Alert.insertMany(this.alerts);
        console.log(`🌱 Seeded ${this.alerts.length} initial alerts into MongoDB.`);
      } else {
        const dbAlerts = await Alert.find().sort({ createdAt: -1 }).lean();
        if (dbAlerts.length > 0) {
          this.alerts = dbAlerts.map(a => ({
            id: a.id,
            title: a.title,
            location: a.location,
            affectedSensor: a.affectedSensor,
            recommendedValve: a.recommendedValve,
            severity: a.severity,
            probability: a.probability,
            anomalyScore: a.anomalyScore,
            estFlowLoss: a.estFlowLoss,
            status: a.status,
            timestamp: new Date(a.timestamp).toISOString(),
            details: a.details
          }));
          this.systemState.activeLeaksCount = this.alerts.filter(a => a.status === 'ACTIVE').length;
        }
      }
    } catch (err) {
      console.error('⚠️ DB Sync Error:', err.message);
    }
  }

  async tick() {
    // 1. Slightly fluctuate main flow rate
    const noise = (Math.random() - 0.48) * 1.5;
    this.systemState.totalFlowRate = Math.max(80, parseFloat((this.systemState.totalFlowRate + noise).toFixed(1)));
    
    // Accumulate total water distributed
    this.systemState.totalWaterDistributedToday += Math.round((this.systemState.totalFlowRate / 60) * 2);

    // 2. Mutate sensors slightly
    this.sensors.forEach(sensor => {
      if (sensor.status !== 'Offline') {
        const delta = (Math.random() - 0.49) * 0.8;
        sensor.flowRate = Math.max(0, parseFloat((sensor.flowRate + delta).toFixed(1)));
        sensor.pressure = Math.max(0.5, parseFloat((sensor.pressure + (Math.random() - 0.5) * 0.05).toFixed(2)));
        sensor.lastUpdate = "Just now";
      }
    });

    // 3. Update flow history rolling queue
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const activeLeak = this.alerts.some(a => a.status === 'ACTIVE');
    const loss = activeLeak ? parseFloat((30 + Math.random() * 8).toFixed(1)) : 0;
    
    const newPoint = {
      time: timeLabel,
      rawTimestamp: now.toISOString(),
      totalFlow: parseFloat((this.systemState.totalFlowRate).toFixed(1)),
      normalBaseline: 118.0,
      leakageLoss: loss,
      pressure: parseFloat((4.5 + (Math.random() - 0.5) * 0.3).toFixed(2)),
      aiAnomalyFlag: activeLeak
    };

    this.flowHistory.push(newPoint);
    if (this.flowHistory.length > 40) {
      this.flowHistory.shift();
    }

    // Persist log entry asynchronously to MongoDB if connected
    if (this.isDbConnected) {
      TelemetryLog.create({
        timeLabel,
        timestamp: now,
        totalFlowRate: newPoint.totalFlow,
        leakLossRate: loss,
        reservoirLevel: this.systemState.reservoirLevelPercent,
        activeLeaks: this.systemState.activeLeaksCount
      }).catch(err => console.error('MongoDB TelemetryLog save error:', err.message));
    }

    // Broadcast live telemetry packet over WebSockets
    if (this.io) {
      this.io.emit("telemetry:update", {
        systemState: this.systemState,
        sensors: this.sensors,
        valves: this.valves,
        alerts: this.alerts,
        latestTelemetryPoint: newPoint
      });
    }
  }

  toggleValve(valveId) {
    const valve = this.valves.find(v => v.id === valveId);
    if (valve) {
      valve.state = valve.state === 'OPEN' ? 'CLOSED' : 'OPEN';
      valve.lastAction = `Manually ${valve.state.toLowerCase()} by Admin at ${new Date().toLocaleTimeString()}`;
      valve.flowRate = valve.state === 'OPEN' ? 45.0 : 0.0;

      // Update counters
      this.systemState.openValvesCount = this.valves.filter(v => v.state === 'OPEN').length;
      this.systemState.closedValvesCount = this.valves.filter(v => v.state === 'CLOSED').length;

      // Broadcast immediately
      if (this.io) {
        this.io.emit("valve:changed", { valve, valves: this.valves, systemState: this.systemState });
      }
      return valve;
    }
    return null;
  }

  toggleValveMode(valveId) {
    const valve = this.valves.find(v => v.id === valveId);
    if (valve) {
      valve.mode = valve.mode === 'Automatic' ? 'Manual' : 'Automatic';
      valve.lastAction = `Mode switched to ${valve.mode} at ${new Date().toLocaleTimeString()}`;
      if (this.io) {
        this.io.emit("valve:changed", { valve, valves: this.valves });
      }
      return valve;
    }
    return null;
  }

  simulateLeak() {
    // Inject a severe simulated leak event into Branch B
    const newAlert = {
      id: `ALT-SIM-${Math.floor(100 + Math.random() * 900)}`,
      title: "HIGH PRESSURE PIPE BURST DETECTED",
      location: "Main Trunk B Pipe Breach (Sector 3)",
      affectedSensor: "SEN-004",
      recommendedValve: "VALVE-03",
      severity: "CRITICAL",
      probability: 98,
      anomalyScore: "HIGH",
      estFlowLoss: "52.4 L/min",
      status: "ACTIVE",
      timestamp: new Date().toISOString(),
      details: "Simulated stress breach initiated. Pressure drop below 1.5 bar detected with acoustic surge."
    };

    this.alerts.unshift(newAlert);
    this.systemState.activeLeaksCount = this.alerts.filter(a => a.status === 'ACTIVE').length;
    this.systemState.aiLeakProbability = 98;
    this.systemState.aiAnomalyScore = "HIGH";
    this.systemState.aiStatus = "CRITICAL: Major Pipe Breach Active!";

    // Update target sensor
    const s = this.sensors.find(s => s.id === 'SEN-004');
    if (s) {
      s.status = 'Leakage';
      s.pressure = 1.2;

      if (this.isDbConnected) {
        Sensor.updateOne({ id: 'SEN-004' }, { status: 'Leakage', pressure: 1.2 })
          .catch(err => console.error('MongoDB Sensor update error:', err.message));
      }
    }

    if (this.isDbConnected) {
      Alert.create(newAlert).catch(err => console.error('MongoDB Alert create error:', err.message));
    }

    if (this.io) {
      this.io.emit("alert:new", { alert: newAlert, alerts: this.alerts, systemState: this.systemState });
    }

    return newAlert;
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'RESOLVED';
      alert.resolvedAt = new Date().toISOString();
      this.systemState.activeLeaksCount = this.alerts.filter(a => a.status === 'ACTIVE').length;

      if (this.systemState.activeLeaksCount === 0) {
        this.systemState.aiLeakProbability = 12;
        this.systemState.aiAnomalyScore = "LOW";
        this.systemState.aiStatus = "All Pipeline Sections Normal";
        
        const s = this.sensors.find(s => s.id === 'SEN-004');
        if (s) {
          s.status = 'Normal';
          s.pressure = 4.2;
          if (this.isDbConnected) {
            Sensor.updateOne({ id: 'SEN-004' }, { status: 'Normal', pressure: 4.2 })
              .catch(err => console.error('MongoDB Sensor update error:', err.message));
          }
        }
      }

      if (this.isDbConnected) {
        Alert.updateOne({ id: alertId }, { status: 'RESOLVED' })
          .catch(err => console.error('MongoDB Alert update error:', err.message));
      }

      if (this.io) {
        this.io.emit("alert:resolved", { alert, alerts: this.alerts, systemState: this.systemState });
      }
      return alert;
    }
    return null;
  }
}

export const iotSimulator = new IoTSimulator();

