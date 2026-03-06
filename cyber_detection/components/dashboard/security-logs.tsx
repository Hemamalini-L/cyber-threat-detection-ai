"use client";

import { useState } from "react";
import { useSocket } from "@/lib/socket-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, Filter } from "lucide-react";

function getSeverityBadge(severity: string | null) {
  switch (severity) {
    case "Critical":
      return <Badge className="bg-cyber-red text-foreground">Critical</Badge>;
    case "High":
      return <Badge className="bg-cyber-orange text-foreground">High</Badge>;
    case "Medium":
      return <Badge className="bg-cyber-yellow text-background">Medium</Badge>;
    case "Low":
      return <Badge className="bg-cyber-green text-background">Low</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
}

function getActionBadge(action: string) {
  switch (action) {
    case "Blocked":
      return <Badge className="bg-cyber-red/20 text-cyber-red border border-cyber-red/50">Blocked</Badge>;
    case "Quarantined":
      return <Badge className="bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/50">Quarantined</Badge>;
    case "Flagged":
      return <Badge className="bg-cyber-orange/20 text-cyber-orange border border-cyber-orange/50">Flagged</Badge>;
    default:
      return <Badge className="bg-cyber-green/20 text-cyber-green border border-cyber-green/50">Allowed</Badge>;
  }
}

export function SecurityLogs() {
  const { traffic } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = traffic.filter((log) => {
    const matchesSearch =
      log.source_ip.includes(searchTerm) ||
      log.destination_ip.includes(searchTerm) ||
      (log.threat?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter || (severityFilter === "normal" && !log.severity);

    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Security Logs</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search IP or threat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 bg-secondary border-border"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
              <SelectItem value="Allowed">Allowed</SelectItem>
              <SelectItem value="Quarantined">Quarantined</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSeverityFilter("all");
              setActionFilter("all");
            }}
            className="border-border"
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px]">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
                <TableHead className="text-muted-foreground">Source IP</TableHead>
                <TableHead className="text-muted-foreground">Destination IP</TableHead>
                <TableHead className="text-muted-foreground">Attack Type</TableHead>
                <TableHead className="text-muted-foreground">Severity</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice().reverse().map((log, index) => (
                <TableRow
                  key={log.id}
                  className={`border-border hover:bg-secondary/50 ${
                    index === 0 ? "animate-in fade-in-50" : ""
                  } ${log.severity === "Critical" ? "bg-cyber-red/5" : ""}`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-cyber-blue">
                    {log.source_ip}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary">
                    {log.destination_ip}
                  </TableCell>
                  <TableCell className="text-xs">
                    {log.threat ? (
                      <span className="text-cyber-red">{log.threat}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
