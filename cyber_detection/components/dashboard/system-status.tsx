"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Eye, Bug, Wifi, CheckCircle, AlertCircle } from "lucide-react";

interface SystemComponentProps {
  name: string;
  status: "Active" | "Warning" | "Offline";
  health: number;
  icon: React.ReactNode;
}

function SystemComponent({ name, status, health, icon }: SystemComponentProps) {
  const getStatusColor = () => {
    if (status === "Active" && health >= 90) return "text-cyber-green";
    if (status === "Active" && health >= 70) return "text-cyber-yellow";
    if (status === "Warning") return "text-cyber-yellow";
    return "text-cyber-red";
  };

  const getProgressColor = () => {
    if (health >= 90) return "bg-cyber-green";
    if (health >= 70) return "bg-cyber-yellow";
    return "bg-cyber-red";
  };

  const getStatusIcon = () => {
    if (status === "Active" && health >= 70) {
      return <CheckCircle className="h-4 w-4 text-cyber-green" />;
    }
    return <AlertCircle className="h-4 w-4 text-cyber-yellow" />;
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
      <div className="rounded-lg bg-primary/10 p-3">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">{name}</h4>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>{status}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={health} className="h-2 flex-1" />
          <span className="text-xs font-mono text-muted-foreground">{health}%</span>
        </div>
      </div>
    </div>
  );
}

export function SystemStatus() {
  const systems = [
    {
      name: "Firewall",
      status: "Active" as const,
      health: 100,
      icon: <Shield className="h-5 w-5 text-primary" />,
    },
    {
      name: "Intrusion Detection System",
      status: "Active" as const,
      health: 98,
      icon: <Eye className="h-5 w-5 text-primary" />,
    },
    {
      name: "Malware Scanner",
      status: "Active" as const,
      health: 100,
      icon: <Bug className="h-5 w-5 text-primary" />,
    },
    {
      name: "Network Monitoring",
      status: "Active" as const,
      health: 95,
      icon: <Wifi className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
        <Shield className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-semibold">Defense System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {systems.map((system) => (
          <SystemComponent key={system.name} {...system} />
        ))}
      </CardContent>
    </Card>
  );
}
