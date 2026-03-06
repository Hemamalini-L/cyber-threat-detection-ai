"use client";

import { Providers } from "./providers";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TrafficPanel } from "@/components/dashboard/traffic-panel";
import { ThreatAlerts } from "@/components/dashboard/threat-alerts";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { SecurityLogs } from "@/components/dashboard/security-logs";
import { SystemStatus } from "@/components/dashboard/system-status";

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-[1800px] space-y-6">
          {/* Stats Overview */}
          <StatsCards />

          {/* Analytics Charts */}
          <AnalyticsPanel />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Traffic Panel - Takes 2 columns */}
            <div className="lg:col-span-2">
              <TrafficPanel />
            </div>

            {/* Threat Alerts & System Status */}
            <div className="space-y-6">
              <ThreatAlerts />
              <SystemStatus />
            </div>
          </div>

          {/* Security Logs Table */}
          <SecurityLogs />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-mono">
            DEFENSE CYBER THREAT DETECTION SYSTEM v1.0.0
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-cyber-green">
              <span className="h-2 w-2 rounded-full bg-cyber-green animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Providers>
      <Dashboard />
    </Providers>
  );
}
