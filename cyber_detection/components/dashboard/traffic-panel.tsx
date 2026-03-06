"use client";

import { useSocket } from "@/lib/socket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowRight } from "lucide-react";

function getSeverityColor(severity: string | null) {
  switch (severity) {
    case "Critical":
      return "bg-cyber-red text-foreground";
    case "High":
      return "bg-cyber-orange text-foreground";
    case "Medium":
      return "bg-cyber-yellow text-background";
    case "Low":
      return "bg-cyber-green text-background";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "Blocked":
      return "text-cyber-red";
    case "Quarantined":
      return "text-cyber-yellow";
    case "Flagged":
      return "text-cyber-orange";
    default:
      return "text-cyber-green";
  }
}

export function TrafficPanel() {
  const { traffic, isConnected } = useSocket();

  return (
    <Card className="flex flex-col h-full border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Real-time Network Traffic
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-cyber-green animate-pulse" : "bg-cyber-red"
            }`}
          />
          <span className="text-xs font-mono text-muted-foreground">
            {traffic.length} packets
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4">
            {traffic.slice().reverse().map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-md border border-border p-3 transition-all duration-300 hover:bg-secondary/50 ${
                  index === 0 ? "animate-in slide-in-from-top-2" : ""
                } ${item.threat ? "border-l-2 border-l-cyber-red" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-cyber-blue">{item.source_ip}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-primary">{item.destination_ip}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs border-border"
                  >
                    {item.protocol}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {(item.packet_size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {item.threat ? (
                    <>
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                      <span className="text-xs font-medium text-cyber-red">
                        {item.threat}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-cyber-green">Normal</span>
                  )}
                  <span className={`text-xs font-medium ${getActionColor(item.action)}`}>
                    {item.action}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {traffic.length === 0 && (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                Waiting for traffic data...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
