import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Shield, ShieldCheck, Lock, AlertTriangle, CheckCircle, Eye,
  Key, Activity, Server, Globe, FileText, RefreshCw, XCircle, Clock
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

const NIST_FUNCTIONS = [
  { name: "Identify", score: 82, status: "good", items: 24, compliant: 20, icon: Eye, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { name: "Protect", score: 91, status: "excellent", items: 30, compliant: 27, icon: Shield, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  { name: "Detect", score: 76, status: "good", items: 18, compliant: 14, icon: Activity, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { name: "Respond", score: 68, status: "needs_improvement", items: 15, compliant: 10, icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { name: "Recover", score: 55, status: "needs_improvement", items: 12, compliant: 7, icon: RefreshCw, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
];

const SECURITY_CONTROLS = [
  { id: "SC-001", control: "AES-256 Encryption at Rest", category: "Protect", status: "implemented", lastAudit: "2026-02-15", risk: "low" },
  { id: "SC-002", control: "TLS 1.3 In Transit", category: "Protect", status: "implemented", lastAudit: "2026-02-15", risk: "low" },
  { id: "SC-003", control: "RBAC with Least Privilege", category: "Protect", status: "implemented", lastAudit: "2026-03-01", risk: "low" },
  { id: "SC-004", control: "90-Day Account Review", category: "Identify", status: "implemented", lastAudit: "2026-01-15", risk: "low" },
  { id: "SC-005", control: "SIEM Integration", category: "Detect", status: "in_progress", lastAudit: null, risk: "medium" },
  { id: "SC-006", control: "Failed Login Monitoring", category: "Detect", status: "implemented", lastAudit: "2026-03-10", risk: "low" },
  { id: "SC-007", control: "Incident Response Playbook", category: "Respond", status: "in_progress", lastAudit: null, risk: "high" },
  { id: "SC-008", control: "Annual Penetration Testing", category: "Detect", status: "scheduled", lastAudit: "2025-06-20", risk: "medium" },
  { id: "SC-009", control: "Disaster Recovery Plan", category: "Recover", status: "in_progress", lastAudit: null, risk: "high" },
  { id: "SC-010", control: "Certificate Pinning", category: "Protect", status: "implemented", lastAudit: "2026-02-20", risk: "low" },
  { id: "SC-011", control: "Data Classification Policy", category: "Identify", status: "implemented", lastAudit: "2026-01-30", risk: "low" },
  { id: "SC-012", control: "Quarterly Vulnerability Scans", category: "Detect", status: "implemented", lastAudit: "2026-03-05", risk: "low" },
];

const DATA_CLASSIFICATION = [
  { level: "Public", description: "Marketing materials, public tender notices", controls: "No restrictions", examples: "Published RFQ titles, website content", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { level: "Internal", description: "Standard business data", controls: "Login required, role-based access", examples: "Vendor list, bid summaries, reports", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { level: "Confidential", description: "Sensitive procurement data", controls: "Encrypted, audit logged, need-to-know", examples: "Bid prices, evaluation scores, contracts", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  { level: "Restricted", description: "Highest sensitivity data", controls: "Tokenized, 2-person rule, HSM keys", examples: "API secrets, beneficial ownership, PEP data", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
];

const CERT_PATH = [
  { year: "Year 1 (2026)", cert: "ISO 27001", status: "in_progress", progress: 65 },
  { year: "Year 2 (2027)", cert: "SOC 2 Type II", status: "planned", progress: 0 },
  { year: "Year 3 (2028)", cert: "NIST 800-171", status: "planned", progress: 0 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  implemented: { label: "Implemented", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  scheduled: { label: "Scheduled", variant: "outline" },
  planned: { label: "Planned", variant: "outline" },
};

export function SecurityDashboard() {
  const { data: apiSecurityStats } = useApiOrMock(
    () => adminApi.getStats(),
    { total_users: 0, total_organizations: 0, total_tenders: 0, total_bids: 0, total_contracts: 0, open_tickets: 0, pending_approvals: 0 },
  );
  const overallScore = Math.round(NIST_FUNCTIONS.reduce((s, f) => s + f.score, 0) / NIST_FUNCTIONS.length);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="NIST Cybersecurity Dashboard"
        description="Platform security posture aligned with NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover)"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="size-4 mr-1.5" />Export Report</Button>
            <Button size="sm"><ShieldCheck className="size-4 mr-1.5" />Run Security Scan</Button>
          </div>
        }
      />

      {/* Overall Score */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${overallScore >= 80 ? "bg-green-100 dark:bg-green-900/20" : overallScore >= 60 ? "bg-amber-100 dark:bg-amber-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                <ShieldCheck className={`size-8 ${overallScore >= 80 ? "text-green-600 dark:text-green-400" : overallScore >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Security Posture</p>
                <p className="text-3xl font-bold text-foreground">{overallScore}/100</p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Last Full Audit: 2026-02-15</p>
              <p>Next Pen Test: 2026-06-15</p>
              <p>ISO 27001 Cert Target: 2026-Q4</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NIST Functions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {NIST_FUNCTIONS.map(f => (
          <Card key={f.name}>
            <CardContent className="pt-6">
              <div className={`p-2 rounded-lg ${f.bg} w-fit mb-3`}><f.icon className={`size-5 ${f.color}`} /></div>
              <p className="font-medium text-foreground">{f.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={f.score} className="h-2 flex-1" />
                <span className="text-sm font-medium">{f.score}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{f.compliant}/{f.items} controls compliant</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="controls" className="space-y-4">
        <TabsList>
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="classification">Data Classification</TabsTrigger>
          <TabsTrigger value="certifications">Certification Path</TabsTrigger>
        </TabsList>

        <TabsContent value="controls">
          <Card>
            <CardHeader><CardTitle>Security Controls Registry</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>NIST Function</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Audit</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SECURITY_CONTROLS.map(c => {
                    const sc = statusConfig[c.status];
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-sm">{c.id}</TableCell>
                        <TableCell className="font-medium">{c.control}</TableCell>
                        <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                        <TableCell><Badge variant={sc.variant}>{sc.label}</Badge></TableCell>
                        <TableCell className="text-sm">{c.lastAudit || <span className="text-muted-foreground">—</span>}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.risk === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            c.risk === "medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>{c.risk.charAt(0).toUpperCase() + c.risk.slice(1)}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification">
          <Card>
            <CardHeader><CardTitle>Data Classification Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DATA_CLASSIFICATION.map(d => (
                  <div key={d.level} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${d.color}`}>{d.level}</span>
                      <p className="text-sm">{d.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div><span className="text-muted-foreground">Controls:</span> <span>{d.controls}</span></div>
                      <div><span className="text-muted-foreground">Examples:</span> <span>{d.examples}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader><CardTitle>Certification Roadmap</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {CERT_PATH.map(c => {
                  const sc = statusConfig[c.status];
                  return (
                    <div key={c.year} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{c.cert}</p>
                          <p className="text-sm text-muted-foreground">{c.year}</p>
                        </div>
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </div>
                      <Progress value={c.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{c.progress}% complete</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}