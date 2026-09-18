import express from 'express';
import { iotSimulator } from '../services/iotSimulator.js';

const router = express.Router();

// GET /api/summary - Overview KPIs
router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: iotSimulator.systemState
  });
});

// GET /api/sensors - All sensors
router.get('/sensors', (req, res) => {
  res.json({
    success: true,
    count: iotSimulator.sensors.length,
    data: iotSimulator.sensors
  });
});

// GET /api/valves - All valves
router.get('/valves', (req, res) => {
  res.json({
    success: true,
    count: iotSimulator.valves.length,
    data: iotSimulator.valves
  });
});

// POST /api/valves/:id/toggle - Toggle valve state (OPEN/CLOSED)
router.post('/valves/:id/toggle', (req, res) => {
  const valve = iotSimulator.toggleValve(req.params.id);
  if (!valve) {
    return res.status(404).json({ success: false, message: 'Valve not found' });
  }
  res.json({ success: true, data: valve });
});

// POST /api/valves/:id/mode - Toggle valve mode (Automatic/Manual)
router.post('/valves/:id/mode', (req, res) => {
  const valve = iotSimulator.toggleValveMode(req.params.id);
  if (!valve) {
    return res.status(404).json({ success: false, message: 'Valve not found' });
  }
  res.json({ success: true, data: valve });
});

// GET /api/alerts - Leak alerts
router.get('/alerts', (req, res) => {
  res.json({
    success: true,
    count: iotSimulator.alerts.length,
    data: iotSimulator.alerts
  });
});

// POST /api/alerts/:id/resolve - Resolve alert
router.post('/alerts/:id/resolve', (req, res) => {
  const alert = iotSimulator.resolveAlert(req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  res.json({ success: true, data: alert });
});

// POST /api/simulate-leak - Trigger a simulated leak
router.post('/simulate-leak', (req, res) => {
  const newAlert = iotSimulator.simulateLeak();
  res.json({
    success: true,
    message: 'Leak simulation triggered successfully',
    data: newAlert
  });
});

// GET /api/telemetry/history - Flow graph data points
router.get('/telemetry/history', (req, res) => {
  res.json({
    success: true,
    data: iotSimulator.flowHistory
  });
});

// GET /api/analytics - High-level analytics
router.get('/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      waterEfficiency: 92.4, // %
      estimatedLossLitersToday: 1420,
      carbonOffsetKg: 184.2,
      activeAlerts: iotSimulator.alerts.filter(a => a.status === 'ACTIVE').length,
      historicalLossTrend: [
        { day: 'Mon', loss: 820 },
        { day: 'Tue', loss: 650 },
        { day: 'Wed', loss: 1200 },
        { day: 'Thu', loss: 950 },
        { day: 'Fri', loss: 1420 },
        { day: 'Sat', loss: 1100 },
        { day: 'Sun', loss: 780 }
      ],
      consumptionByDistrict: [
        { district: 'Branch A (Residential)', volume: 9200, percentage: 50 },
        { district: 'Branch B (Commercial)', volume: 5400, percentage: 29 },
        { district: 'Branch C (Industrial)', volume: 3820, percentage: 21 }
      ]
    }
  });
});

export default router;
