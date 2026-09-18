import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { iotSimulator } from './services/iotSimulator.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Send initial full snapshot on connect
  socket.emit('telemetry:snapshot', {
    systemState: iotSimulator.systemState,
    sensors: iotSimulator.sensors,
    valves: iotSimulator.valves,
    alerts: iotSimulator.alerts,
    flowHistory: iotSimulator.flowHistory
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Serve static frontend build files if available
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.send('AquaGuard AI Server is Running on port 5000. Start Vite dev server for frontend.');
    }
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database and start Server
const startServer = async () => {
  const isDbConnected = await connectDB();
  await iotSimulator.init(io, isDbConnected);

  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🌊 AquaGuard AI Backend running on http://localhost:${PORT}`);
    console.log(`=================================================`);
  });
};

startServer();

