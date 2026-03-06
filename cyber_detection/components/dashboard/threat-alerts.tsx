"use client";

import { useSocket } from "@/lib/socket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Skull, Bug, Fish, Database } from "lucide-react";

function getThreatIcon(threat: string) {
  if (threat.includes("DDoS")) return <Skull className="h-4 w-4" />;
  if (threat.includes("Brute")) return <Shield className="h-4 w-4" />;
  if (threat.includes("Malware")) return <Bug className="h-4 w-4" />;
  if (threat.includes("Phishing")) return <Fish className="h-4 w-4" />;
  if (threat.includes("SQL")) return <Database className="h-4 w-4" />;
  return <AlertTriangle className="h-4 w-4" />;
}

function getSeverityStyle(severity: string | null) {
  switch (severity) {
    case "Critical":
      return {
        bg: "bg-cyber-red/10",
        border: "border-cyber-red",
        text: "text-cyber-red",
        badge: "bg-cyber-red text-foreground",
      };
    case "High":
      return {
        bg: "bg-cyber-orange/10",
        border: "border-cyber-orange",
        text: "text-cyber-orange",
        badge: "bg-cyber-orange text-foreground",
      };
    case "Medium":
      return {
        bg: "bg-cyber-yellow/10",
        border: "border-cyber-yellow",
        text: "text-cyber-yellow",
        badge: "bg-cyber-yellow text-background",
      };
    default:
      return {
        bg: "bg-cyber-green/10",
        border: "border-cyber-green",
        text: "text-cyber-green",
        badge: "bg-cyber-green text-background",
      };
  }
}

export function ThreatAlerts() {
  const { alerts } = useSocket();
  const recentAlerts = alerts.slice(-10).reverse();

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-cyber-red" />
          <CardTitle className="text-lg font-semibold">
            Threat Detection Alerts
          </CardTitle>
        </div>
        <Badge variant="destructive" className="bg-cyber-red/20 text-cyber-red border border-cyber-red/50">
          {alerts.length} Total
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 p-4">
            {recentAlerts.map((alert, index) => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`rounded-lg border-l-4 ${style.border} ${style.bg} p-3 transition-all duration-300 ${
                    index === 0 ? "animate-in slide-in-from-top-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className={style.text}>{getThreatIcon(alert.threat || "")}</span>
                      <div>
                        <p className={`font-semibold ${style.text}`}>{alert.threat}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          Source: {alert.source_ip} → {alert.destination_ip}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={style.badge}>{alert.severity}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Protocol: <span className="font-mono text-foreground">{alert.protocol}</span>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-xs text-muted-foreground">
                      Size: <span className="font-mono text-foreground">{(alert.packet_size / 1024).toFixed(2)} KB</span>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className={`text-xs font-medium ${
                      alert.action === "Blocked" ? "text-cyber-red" : 
                      alert.action === "Quarantined" ? "text-cyber-yellow" : "text-cyber-orange"
                    }`}>
                      {alert.action}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentAlerts.length === 0 && (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No threats detected
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
