import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  affectedSensor: { type: String, required: true },
  recommendedValve: { type: String },
  severity: { type: String, enum: ['CRITICAL', 'WARNING', 'INFO'], default: 'WARNING' },
  probability: { type: Number, default: 50 },
  anomalyScore: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  estFlowLoss: { type: String, default: '0 L/min' },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
}, {
  timestamps: true
});

export const Alert = mongoose.model('Alert', alertSchema);
