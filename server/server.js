import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import medicineRoutes from './routes/medicines.js';
import pharmacyRoutes from './routes/pharmacies.js';
import alertRoutes from './routes/alerts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Simple file-based data storage for demo
const dataFile = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  const initialData = {
    users: [],
    pharmacies: [],
    medicines: [],
    inventory: []
  };
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// Helper functions for data management
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (error) {
    console.error('Error reading data file:', error);
    return { users: [], pharmacies: [], medicines: [], inventory: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Make data helpers available to routes
app.set('readData', readData);
app.set('writeData', writeData);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join pharmacy room for pharmacy admins
  socket.on('joinPharmacy', (pharmacyId) => {
    socket.join(`pharmacy_${pharmacyId}`);
    console.log(`📱 Client ${socket.id} joined pharmacy room: pharmacy_${pharmacyId}`);
  });

  // Handle inventory updates from pharmacy dashboard
  socket.on('updateInventory', async (data) => {
    try {
      // Verify token
      const token = socket.handshake.auth.token;
      if (!token) return;

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Emit update to all connected clients
      io.emit('inventoryUpdate', {
        medicineId: data.medicineId,
        pharmacyId: data.pharmacyId,
        newQuantity: data.quantity,
        updatedBy: decoded.id
      });

      console.log('📦 Inventory updated:', data);
    } catch (error) {
      console.error('❌ Inventory update error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`💾 Using file-based storage: ${dataFile}`);
});