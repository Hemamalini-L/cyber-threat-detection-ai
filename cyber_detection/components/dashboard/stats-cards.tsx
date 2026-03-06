"use client";

import { useSocket } from "@/lib/socket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";

export function StatsCards() {
  const { stats } = useSocket();

  const cards = [
    {
      title: "Total Packets",
      value: stats.totalPackets.toLocaleString(),
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Threats",
      value: stats.totalThreats.toLocaleString(),
      icon: AlertTriangle,
      color: "text-cyber-yellow",
      bgColor: "bg-cyber-yellow/10",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalThreats.toLocaleString(),
      icon: ShieldX,
      color: "text-cyber-red",
      bgColor: "bg-cyber-red/10",
    },
    {
      title: "Blocked Attacks",
      value: stats.blockedAttacks.toLocaleString(),
      icon: ShieldCheck,
      color: "text-cyber-green",
      bgColor: "bg-cyber-green/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-md p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
