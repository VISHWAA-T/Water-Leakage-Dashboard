import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  flowRate: { type: Number, required: true, default: 0 },
  pressure: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, enum: ['Normal', 'Leakage', 'Warning', 'Offline'], default: 'Normal' },
  lastUpdate: { type: String, default: 'Just now' },
  minNormal: { type: Number, default: 0 },
  maxNormal: { type: Number, default: 100 }
}, {
  timestamps: true
});

export const Sensor = mongoose.model('Sensor', sensorSchema);
