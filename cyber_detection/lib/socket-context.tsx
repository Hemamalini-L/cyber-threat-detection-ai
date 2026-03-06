"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";

interface TrafficData {
  id: number;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  packet_size: number;
  threat: string | null;
  severity: string | null;
  timestamp: string;
  action: string;
}

interface Stats {
  totalPackets: number;
  totalThreats: number;
  criticalThreats: number;
  blockedAttacks: number;
  attackTypes: { name: string; value: number }[];
  trafficOverTime: { time: string; packets: number; threats: number }[];
  normalVsMalicious: { name: string; value: number }[];
}

interface SocketContextType {
  socket: null;
  isConnected: boolean;
  traffic: TrafficData[];
  alerts: TrafficData[];
  stats: Stats;
}

const defaultStats: Stats = {
  totalPackets: 0,
  totalThreats: 0,
  criticalThreats: 0,
  blockedAttacks: 0,
  attackTypes: [],
  trafficOverTime: [],
  normalVsMalicious: [
    { name: "Normal", value: 0 },
    { name: "Malicious", value: 0 },
  ],
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  traffic: [],
  alerts: [],
  stats: defaultStats,
});

export function useSocket() {
  return useContext(SocketContext);
}

// Threat types and their weights for simulation
const threatTypes = [
  { type: "DDoS Attack", severity: "Critical", weight: 0.08 },
  { type: "Brute Force", severity: "High", weight: 0.12 },
  { type: "Malware Traffic", severity: "High", weight: 0.1 },
  { type: "SQL Injection", severity: "Critical", weight: 0.06 },
  { type: "Phishing Attempt", severity: "Medium", weight: 0.15 },
  { type: "Port Scan", severity: "Low", weight: 0.2 },
  { type: "Suspicious Activity", severity: "Medium", weight: 0.18 },
  { type: null, severity: null, weight: 0.11 },
];

const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "SSH", "FTP", "DNS", "ICMP"];
const actions = ["Blocked", "Allowed", "Quarantined", "Flagged"];

function generateIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function generateTraffic(): TrafficData {
  const random = Math.random();
  let cumulative = 0;
  let threat: { type: string | null; severity: string | null } = { type: null, severity: null };

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
    action: isThreat ? actions[Math.floor(Math.random() * 3)] : "Allowed",
  };
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [alerts, setAlerts] = useState<TrafficData[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const statsRef = useRef<Stats>(defaultStats);

  const updateStats = useCallback((trafficItem: TrafficData) => {
    const currentStats = statsRef.current;
    const newStats = { ...currentStats };
    
    newStats.totalPackets++;

    if (trafficItem.threat) {
      newStats.totalThreats++;
      newStats.normalVsMalicious = [
        { name: "Normal", value: currentStats.normalVsMalicious[0].value },
        { name: "Malicious", value: currentStats.normalVsMalicious[1].value + 1 },
      ];

      const attackIndex = newStats.attackTypes.findIndex((a) => a.name === trafficItem.threat);
      if (attackIndex >= 0) {
        newStats.attackTypes = [...newStats.attackTypes];
        newStats.attackTypes[attackIndex] = {
          ...newStats.attackTypes[attackIndex],
          value: newStats.attackTypes[attackIndex].value + 1,
        };
      } else {
        newStats.attackTypes = [...newStats.attackTypes, { name: trafficItem.threat!, value: 1 }];
      }

      if (trafficItem.severity === "Critical") {
        newStats.criticalThreats++;
      }
      if (trafficItem.action === "Blocked") {
        newStats.blockedAttacks++;
      }
    } else {
      newStats.normalVsMalicious = [
        { name: "Normal", value: currentStats.normalVsMalicious[0].value + 1 },
        { name: "Malicious", value: currentStats.normalVsMalicious[1].value },
      ];
    }

    const now = new Date();
    const timeKey = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const lastEntry = newStats.trafficOverTime[newStats.trafficOverTime.length - 1];

    if (lastEntry && lastEntry.time === timeKey) {
      newStats.trafficOverTime = [...newStats.trafficOverTime];
      newStats.trafficOverTime[newStats.trafficOverTime.length - 1] = {
        ...lastEntry,
        packets: lastEntry.packets + 1,
        threats: lastEntry.threats + (trafficItem.threat ? 1 : 0),
      };
    } else {
      newStats.trafficOverTime = [
        ...newStats.trafficOverTime,
        { time: timeKey, packets: 1, threats: trafficItem.threat ? 1 : 0 },
      ];
      if (newStats.trafficOverTime.length > 20) {
        newStats.trafficOverTime = newStats.trafficOverTime.slice(1);
      }
    }

    statsRef.current = newStats;
    setStats(newStats);
  }, []);

  useEffect(() => {
    // Generate initial data
    const initialTraffic: TrafficData[] = [];
    const initialAlerts: TrafficData[] = [];
    
    for (let i = 0; i < 20; i++) {
      const item = generateTraffic();
      initialTraffic.push(item);
      if (item.threat) {
        initialAlerts.push(item);
      }
      updateStats(item);
    }

    setTraffic(initialTraffic);
    setAlerts(initialAlerts);
    setIsConnected(true);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newTraffic = generateTraffic();
      
      setTraffic((prev) => [...prev.slice(-49), newTraffic]);
      
      if (newTraffic.threat) {
        setAlerts((prev) => [...prev.slice(-49), newTraffic]);
      }
      
      updateStats(newTraffic);
    }, 2000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, [updateStats]);

  return (
    <SocketContext.Provider value={{ socket: null, isConnected, traffic, alerts, stats }}>
      {children}
    </SocketContext.Provider>
  );
}

export type { TrafficData, Stats };
