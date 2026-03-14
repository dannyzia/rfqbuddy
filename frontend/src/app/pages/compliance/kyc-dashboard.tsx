import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import {
  Fingerprint, Shield, AlertTriangle, CheckCircle, Clock, Search,
  UserCheck, XCircle, RefreshCw, Eye, FileText, Building2, Filter, Download
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { complianceApi } from "../../lib/api/compliance.api";

const KYC_STATS = [
  { label: "Total Vendors", value: "423", icon: Building2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "KYC Verified", value: "312", icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  { label: "Pending Review", value: "67", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { label: "Sanctions Alerts", value: "8", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
];

const VENDORS = [
  { id: "VND-001", name: "ABC Construction Ltd", tin: "123456789012", kycLevel: "Enhanced", status: "verified", verifiedAt: "2026-01-15", expiresAt: "2027-01-15", pepStatus: "Clear", sanctions: "Clear", riskScore: 12 },
  { id: "VND-002", name: "XYZ Engineering Corp", tin: "987654321098", kycLevel: "Basic", status: "pending", verifiedAt: null, expiresAt: null, pepStatus: "Pending", sanctions: "Pending", riskScore: null },
  { id: "VND-003", name: "Delta Supplies LLC", tin: "456789012345", kycLevel: "Ongoing", status: "verified", verifiedAt: "2025-11-20", expiresAt: "2026-11-20", pepStatus: "Clear", sanctions: "Clear", riskScore: 8 },
  { id: "VND-004", name: "Global Tech Solutions", tin: "321654987012", kycLevel: "Enhanced", status: "flagged", verifiedAt: "2025-08-10", expiresAt: "2026-08-10", pepStatus: "Flagged", sanctions: "Clear", riskScore: 72 },
  { id: "VND-005", name: "BuildRight Associates", tin: "654321098765", kycLevel: "Basic", status: "expired", verifiedAt: "2025-01-10", expiresAt: "2026-01-10", pepStatus: "Clear", sanctions: "Clear", riskScore: 35 },
  { id: "VND-006", name: "Precision Parts Intl", tin: "111222333444", kycLevel: "Enhanced", status: "verified", verifiedAt: "2026-02-28", expiresAt: "2027-02-28", pepStatus: "Clear", sanctions: "Alert", riskScore: 55 },
  { id: "VND-007", name: "Rupayan Housing Ltd", tin: "555666777888", kycLevel: "Basic", status: "pending", verifiedAt: null, expiresAt: null, pepStatus: "Pending", sanctions: "Pending", riskScore: null },
  { id: "VND-008", name: "SSL Wireless Ltd", tin: "999888777666", kycLevel: "Ongoing", status: "verified", verifiedAt: "2026-03-01", expiresAt: "2027-03-01", pepStatus: "Clear", sanctions: "Clear", riskScore: 5 },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  verified: { label: "Verified", variant: "default" },
  pending: { label: "Pending Review", variant: "secondary" },
  flagged: { label: "Flagged", variant: "destructive" },
  expired: { label: "Expired", variant: "outline" },
};

const kycLevelColors: Record<string, string> = {
  Basic: "bg-muted text-muted-foreground",
  Enhanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Ongoing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function KYCDashboard() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const { data: apiVendors } = useApiOrMock(
    () => complianceApi.listKycChecks(),
    { data: VENDORS, total: VENDORS.length, page: 1, pageSize: 20 },
  );

  const vendors = apiVendors?.data ?? VENDORS;

  const filtered = vendors.filter((v: any) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "all" || v.kycLevel === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="KYC/AML Compliance Dashboard"
        description="Monitor vendor KYC verification status, sanctions screening, and AML compliance (Bangladesh Bank Guidelines 2022)"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button>
            <Button size="sm"><RefreshCw className="size-4 mr-1.5" />Run Batch Screening</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {KYC_STATS.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${s.bg}`}>
                  <s.icon className={`size-6 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KYC Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { level: "Basic", desc: "Trade License + TIN + Bank", count: 180, total: 423, color: "bg-muted-foreground" },
          { level: "Enhanced", desc: "Beneficial Ownership + Source of Funds", count: 156, total: 423, color: "bg-purple-500" },
          { level: "Ongoing", desc: "Active Contract Monitoring", count: 87, total: 423, color: "bg-blue-500" },
        ].map(l => (
          <Card key={l.level}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{l.level} KYC</span>
                <span className="text-sm text-muted-foreground">{l.count}/{l.total}</span>
              </div>
              <Progress value={(l.count / l.total) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Fingerprint className="size-5" />Vendor KYC Registry</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search vendors..." className="pl-9 w-64" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select
                className="border rounded-md px-3 py-2 text-sm bg-card"
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="Basic">Basic</option>
                <option value="Enhanced">Enhanced</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>TIN</TableHead>
                <TableHead>KYC Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PEP Check</TableHead>
                <TableHead>Sanctions</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(v => {
                const sc = statusConfig[v.status];
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      <Link to={`/vendors/${v.id}/kyc`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                        {v.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{v.id}</p>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{v.tin}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${kycLevelColors[v.kycLevel]}`}>{v.kycLevel}</span></TableCell>
                    <TableCell><Badge variant={sc.variant}>{sc.label}</Badge></TableCell>
                    <TableCell>
                      {v.pepStatus === "Clear" && <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm"><CheckCircle className="size-3.5" />Clear</span>}
                      {v.pepStatus === "Flagged" && <span className="text-red-600 dark:text-red-400 flex items-center gap-1 text-sm"><AlertTriangle className="size-3.5" />Flagged</span>}
                      {v.pepStatus === "Pending" && <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-sm"><Clock className="size-3.5" />Pending</span>}
                    </TableCell>
                    <TableCell>
                      {v.sanctions === "Clear" && <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm"><Shield className="size-3.5" />Clear</span>}
                      {v.sanctions === "Alert" && <span className="text-red-600 dark:text-red-400 flex items-center gap-1 text-sm"><AlertTriangle className="size-3.5" />Alert</span>}
                      {v.sanctions === "Pending" && <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-sm"><Clock className="size-3.5" />Pending</span>}
                    </TableCell>
                    <TableCell>
                      {v.riskScore !== null ? (
                        <span className={`font-medium ${v.riskScore <= 30 ? "text-green-600 dark:text-green-400" : v.riskScore <= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {v.riskScore}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">{v.expiresAt || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/vendors/${v.id}/kyc`}>
                        <Button variant="ghost" size="sm"><Eye className="size-4" /></Button>
                      </Link>
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