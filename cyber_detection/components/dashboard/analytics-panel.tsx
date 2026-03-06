"use client";

import { useSocket } from "@/lib/socket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  orange: "#f97316",
  blue: "#3b82f6",
};

export function AnalyticsPanel() {
  const { stats } = useSocket();

  const pieColors = [COLORS.green, COLORS.red];
  const barColors = [COLORS.red, COLORS.orange, COLORS.yellow, COLORS.blue, COLORS.green];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Traffic Over Time */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trafficOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#888", fontSize: 10 }}
                  stroke="#444"
                />
                <YAxis tick={{ fill: "#888", fontSize: 10 }} stroke="#444" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="packets"
                  stroke={COLORS.green}
                  strokeWidth={2}
                  dot={false}
                  name="Packets"
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke={COLORS.red}
                  strokeWidth={2}
                  dot={false}
                  name="Threats"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Attack Types Distribution */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <BarChart3 className="h-5 w-5 text-cyber-red" />
          <CardTitle className="text-sm font-medium">Attack Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.attackTypes.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" tick={{ fill: "#888", fontSize: 10 }} stroke="#444" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#888", fontSize: 9 }}
                  stroke="#444"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" name="Count">
                  {stats.attackTypes.slice(0, 5).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Normal vs Malicious */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <PieChartIcon className="h-5 w-5 text-cyber-yellow" />
          <CardTitle className="text-sm font-medium">Traffic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.normalVsMalicious}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.normalVsMalicious.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: "#888" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
