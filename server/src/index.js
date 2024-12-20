const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:19006'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for signals
let signals = [];

// REST API endpoints
app.get('/api/signals', (req, res) => {
  res.json({ signals });
});

app.post('/api/signals', (req, res) => {
  const signal = {
    id: uuidv4(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  };
  signals.unshift(signal);
  io.emit('newSignal', signal);
  res.status(201).json({ signal });
});

app.put('/api/signals/:id', (req, res) => {
  const { id } = req.params;
  const index = signals.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Signal not found' });
  }
  const updatedSignal = { ...signals[index], ...req.body };
  signals[index] = updatedSignal;
  io.emit('signalUpdate', updatedSignal);
  res.json({ signal: updatedSignal });
});

app.delete('/api/signals/:id', (req, res) => {
  const { id } = req.params;
  signals = signals.filter(s => s.id !== id);
  io.emit('signalDelete', id);
  res.status(204).send();
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
