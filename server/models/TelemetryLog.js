import mongoose from 'mongoose';

const telemetryLogSchema = new mongoose.Schema({
  timeLabel: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  totalFlowRate: { type: Number, required: true },
  leakLossRate: { type: Number, default: 0 },
  reservoirLevel: { type: Number, default: 88.4 },
  activeLeaks: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const TelemetryLog = mongoose.model('TelemetryLog', telemetryLogSchema);
