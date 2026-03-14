import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  AlertTriangle, Shield, CheckCircle, Clock, XCircle, Eye, Search,
  Bell, Flag, UserX, Globe, FileText, RefreshCw
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { complianceApi } from "../../lib/api/compliance.api";

const ALERTS = [
  { id: "ALT-001", vendor: "Global Tech Solutions", vendorId: "VND-004", type: "PEP Match", source: "Dow Jones", severity: "high", matchScore: 92, detail: "UBO Ahmed Hossain matches PEP record — former government official", createdAt: "2026-03-10 08:30", status: "open", assignedTo: "Nadia Khan" },
  { id: "ALT-002", vendor: "Precision Parts Intl", vendorId: "VND-006", type: "Sanctions Hit", source: "LSEG World-Check", severity: "critical", matchScore: 87, detail: "Entity name partial match on OFAC SDN List — requires manual review", createdAt: "2026-03-09 14:20", status: "investigating", assignedTo: "Rafiq Ahmed" },
  { id: "ALT-003", vendor: "StarBuild Corp", vendorId: "VND-012", type: "Adverse Media", source: "Google News NLP", severity: "medium", matchScore: 65, detail: "News article mentions fraud investigation in unrelated subsidiary", createdAt: "2026-03-08 11:00", status: "open", assignedTo: null },
  { id: "ALT-004", vendor: "Delta Supplies LLC", vendorId: "VND-003", type: "PEP Match", source: "Dow Jones", severity: "low", matchScore: 34, detail: "Name similarity with known PEP — likely false positive", createdAt: "2026-03-07 09:15", status: "dismissed", assignedTo: "Nadia Khan" },
  { id: "ALT-005", vendor: "Meridian Trading", vendorId: "VND-015", type: "Sanctions Hit", source: "UN Consolidated", severity: "critical", matchScore: 95, detail: "Entity matches UN Security Council consolidated list entry", createdAt: "2026-03-06 16:45", status: "escalated", assignedTo: "Legal Department" },
  { id: "ALT-006", vendor: "QuickSupply BD", vendorId: "VND-018", type: "Adverse Media", source: "Google News NLP", severity: "medium", matchScore: 58, detail: "Environmental violation report in local news", createdAt: "2026-03-05 10:30", status: "resolved", assignedTo: "Compliance Team" },
  { id: "ALT-007", vendor: "Global Tech Solutions", vendorId: "VND-004", type: "Transaction Monitoring", source: "Internal AML", severity: "high", matchScore: 78, detail: "Unusual payment pattern — 3 invoices within 48 hours exceeding BDT 5 Lac each", createdAt: "2026-03-04 13:00", status: "investigating", assignedTo: "Rafiq Ahmed" },
  { id: "ALT-008", vendor: "NovaBuild Intl", vendorId: "VND-022", type: "Country Risk", source: "FATF", severity: "medium", matchScore: 70, detail: "Vendor has UBO with citizenship in FATF grey-listed jurisdiction", createdAt: "2026-03-03 08:00", status: "open", assignedTo: null },
];

const severityConfig: Record<string, { color: string; label: string }> = {
  critical: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Critical" },
  high: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", label: "High" },
  medium: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Medium" },
  low: { color: "bg-muted text-muted-foreground", label: "Low" },
};

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  open: { variant: "secondary", label: "Open" },
  investigating: { variant: "default", label: "Investigating" },
  escalated: { variant: "destructive", label: "Escalated" },
  resolved: { variant: "outline", label: "Resolved" },
  dismissed: { variant: "outline", label: "Dismissed" },
};

export function SanctionsAlerts() {
  const { data: apiAlerts } = useApiOrMock(
    () => complianceApi.getSanctionsAlerts(),
    ALERTS,
  );

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = apiAlerts.filter(a => {
    const matchSearch = a.vendor.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = apiAlerts.filter(a => a.status === "open").length;
  const criticalCount = apiAlerts.filter(a => a.severity === "critical" && a.status !== "resolved" && a.status !== "dismissed").length;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Sanctions & AML Alert Management"
        description="Monitor and resolve sanctions hits, PEP matches, and adverse media findings"
        backTo="/compliance/kyc"
        backLabel="Back to KYC Dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Re-screen All</Button>
            <Button size="sm" variant="destructive"><Bell className="size-4 mr-1.5" />{criticalCount} Critical</Button>
          </div>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Alerts", value: apiAlerts.length.toString(), icon: Bell, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Open", value: openCount.toString(), icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Critical / Escalated", value: criticalCount.toString(), icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Resolved", value: apiAlerts.filter(a => a.status === "resolved" || a.status === "dismissed").length.toString(), icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${s.bg}`}><s.icon className={`size-6 ${s.color}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Shield className="size-5" />Alert Queue</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search alerts..." className="pl-9 w-64" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="border rounded-md px-3 py-2 text-sm bg-card" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Match %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => {
                const sev = severityConfig[a.severity];
                const stat = statusConfig[a.status];
                return (
                  <TableRow key={a.id} className={a.severity === "critical" && a.status !== "resolved" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                    <TableCell className="font-mono text-sm">{a.id}</TableCell>
                    <TableCell>
                      <Link to={`/vendors/${a.vendorId}/kyc`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">{a.vendor}</Link>
                    </TableCell>
                    <TableCell className="text-sm">{a.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.source}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${sev.color}`}>{sev.label}</span></TableCell>
                    <TableCell>
                      <span className={`font-medium ${a.matchScore >= 80 ? "text-red-600 dark:text-red-400" : a.matchScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                        {a.matchScore}%
                      </span>
                    </TableCell>
                    <TableCell><Badge variant={stat.variant}>{stat.label}</Badge></TableCell>
                    <TableCell className="text-sm">{a.assignedTo || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.createdAt.split(" ")[0]}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Eye className="size-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}