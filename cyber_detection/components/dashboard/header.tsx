"use client";

import { Bell, Shield, Activity, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/lib/socket-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { isConnected, alerts, stats } = useSocket();
  const recentCriticalAlerts = alerts.filter((a) => a.severity === "Critical").slice(-5);

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Defense Cyber Threat Detection
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              CLASSIFIED // DEFENSE NETWORK MONITORING
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">Active</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs font-mono text-muted-foreground">
            {stats.totalPackets.toLocaleString()} packets
          </span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-cyber-green" />
              <span className="text-sm text-cyber-green">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-cyber-red" />
              <span className="text-sm text-cyber-red">Offline</span>
            </>
          )}
        </div>

        {/* Threat Counter */}
        <Badge
          variant="destructive"
          className="flex items-center gap-1 bg-cyber-red/20 text-cyber-red border border-cyber-red/50"
        >
          <span className="text-xs font-mono">{stats.criticalThreats}</span>
          <span className="text-xs">Critical</span>
        </Badge>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary"
            >
              <Bell className="h-5 w-5" />
              {recentCriticalAlerts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyber-red text-[10px] font-bold text-foreground animate-pulse">
                  {recentCriticalAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-semibold">Recent Alerts</p>
            </div>
            {recentCriticalAlerts.length === 0 ? (
              <DropdownMenuItem className="text-muted-foreground">
                No critical alerts
              </DropdownMenuItem>
            ) : (
              recentCriticalAlerts.map((alert) => (
                <DropdownMenuItem
                  key={alert.id}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyber-red animate-pulse" />
                    <span className="text-sm font-medium">{alert.threat}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {alert.source_ip} - {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
