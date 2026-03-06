import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Threat types and their weights
const threatTypes = [
  { type: 'DDoS Attack', severity: 'Critical', weight: 0.08 },
  { type: 'Brute Force', severity: 'High', weight: 0.12 },
  { type: 'Malware Traffic', severity: 'High', weight: 0.1 },
  { type: 'SQL Injection', severity: 'Critical', weight: 0.06 },
  { type: 'Phishing Attempt', severity: 'Medium', weight: 0.15 },
  { type: 'Port Scan', severity: 'Low', weight: 0.2 },
  { type: 'Suspicious Activity', severity: 'Medium', weight: 0.18 },
  { type: null, severity: null, weight: 0.11 } // Normal traffic
];

const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS', 'ICMP'];
const actions = ['Blocked', 'Allowed', 'Quarantined', 'Flagged'];

// Generate random IP
function generateIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Generate network traffic data
function generateTraffic() {
  const random = Math.random();
  let cumulative = 0;
  let threat = null;
  
  for (const t of threatTypes) {
    cumulative += t.weight;
    if (random <= cumulative) {
      threat = t;
      break;
    }
  }

  const isThreat = threat && threat.type !== null;
  const packetSize = isThreat 
    ? Math.floor(Math.random() * 50000) + 5000 
    : Math.floor(Math.random() * 2000) + 100;

  return {
    id: Date.now() + Math.random(),
    source_ip: generateIP(),
    destination_ip: generateIP(),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    packet_size: packetSize,
    threat: threat?.type || null,
    severity: threat?.severity || null,
    timestamp: new Date().toISOString(),
    action: isThreat ? actions[Math.floor(Math.random() * 3)] : 'Allowed'
  };
}

// Store recent traffic and alerts
let recentTraffic = [];
let recentAlerts = [];
let stats = {
  totalPackets: 0,
  totalThreats: 0,
  criticalThreats: 0,
  blockedAttacks: 0,
  attackTypes: {},
  trafficOverTime: [],
  normalVsMalicious: { normal: 0, malicious: 0 }
};

// Generate initial data
for (let i = 0; i < 20; i++) {
  const traffic = generateTraffic();
  recentTraffic.push(traffic);
  updateStats(traffic);
  if (traffic.threat) {
    recentAlerts.push(traffic);
  }
}

function updateStats(traffic) {
  stats.totalPackets++;
  
  if (traffic.threat) {
    stats.totalThreats++;
    stats.normalVsMalicious.malicious++;
    stats.attackTypes[traffic.threat] = (stats.attackTypes[traffic.threat] || 0) + 1;
    
    if (traffic.severity === 'Critical') {
      stats.criticalThreats++;
    }
    if (traffic.action === 'Blocked') {
      stats.blockedAttacks++;
    }
  } else {
    stats.normalVsMalicious.normal++;
  }
  
  // Update traffic over time (keep last 20 entries)
  const now = new Date();
  const timeKey = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  const lastEntry = stats.trafficOverTime[stats.trafficOverTime.length - 1];
  
  if (lastEntry && lastEntry.time === timeKey) {
    lastEntry.packets++;
    if (traffic.threat) lastEntry.threats++;
  } else {
    stats.trafficOverTime.push({ time: timeKey, packets: 1, threats: traffic.threat ? 1 : 0 });
    if (stats.trafficOverTime.length > 20) {
      stats.trafficOverTime.shift();
    }
  }
}

// API Routes
app.get('/api/traffic', (req, res) => {
  res.json(recentTraffic.slice(-50));
});

app.get('/api/alerts', (req, res) => {
  res.json(recentAlerts.slice(-50));
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPackets: stats.totalPackets,
    totalThreats: stats.totalThreats,
    criticalThreats: stats.criticalThreats,
    blockedAttacks: stats.blockedAttacks,
    attackTypes: Object.entries(stats.attackTypes).map(([name, value]) => ({ name, value })),
    trafficOverTime: stats.trafficOverTime,
    normalVsMalicious: [
      { name: 'Normal', value: stats.normalVsMalicious.normal },
      { name: 'Malicious', value: stats.normalVsMalicious.malicious }
    ]
  });
});

app.get('/api/system-status', (req, res) => {
  res.json({
    firewall: { status: 'Active', health: 100 },
    ids: { status: 'Active', health: 98 },
    malwareScanner: { status: 'Active', health: 100 },
    networkMonitoring: { status: 'Active', health: 95 }
  });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('initial-data', {
    traffic: recentTraffic.slice(-20),
    alerts: recentAlerts.slice(-10),
    stats: {
      totalPackets: stats.totalPackets,
      totalThreats: stats.totalThreats,
      criticalThreats: stats.criticalThreats,
      blockedAttacks: stats.blockedAttacks,
      attackTypes: Object.entries(stats.attackTypes).map(([name, value]) => ({ name, value })),
      trafficOverTime: stats.trafficOverTime,
      normalVsMalicious: [
        { name: 'Normal', value: stats.normalVsMalicious.normal },
        { name: 'Malicious', value: stats.normalVsMalicious.malicious }
      ]
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Emit new traffic every 2-3 seconds
setInterval(() => {
  const traffic = generateTraffic();
  recentTraffic.push(traffic);
  updateStats(traffic);
  
  // Keep only last 100 entries
  if (recentTraffic.length > 100) {
    recentTraffic.shift();
  }
  
  io.emit('new-traffic', traffic);
  
  if (traffic.threat) {
    recentAlerts.push(traffic);
    if (recentAlerts.length > 100) {
      recentAlerts.shift();
    }
    io.emit('new-alert', traffic);
  }
  
  // Emit updated stats
  io.emit('stats-update', {
    totalPackets: stats.totalPackets,
    totalThreats: stats.totalThreats,
    criticalThreats: stats.criticalThreats,
    blockedAttacks: stats.blockedAttacks,
    attackTypes: Object.entries(stats.attackTypes).map(([name, value]) => ({ name, value })),
    trafficOverTime: stats.trafficOverTime,
    normalVsMalicious: [
      { name: 'Normal', value: stats.normalVsMalicious.normal },
      { name: 'Malicious', value: stats.normalVsMalicious.malicious }
    ]
  });
}, 2000 + Math.random() * 1000);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
