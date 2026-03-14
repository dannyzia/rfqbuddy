import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import {
  FileText, CheckCircle, AlertTriangle, XCircle, Clock, Search,
  Upload, Eye, DollarSign, Scale, ArrowRight, Filter, Download, Zap
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { financeApi } from "../../lib/api/finance.api";

const MATCH_QUEUE = [
  { id: "INV-2026-0234", vendor: "ABC Builders Ltd", poNumber: "PO-2026-0089", grnNumber: "GRN-2026-0156", invoiceAmount: 4250000, poAmount: 4250000, grnAmount: 4250000, variance: 0, matchStatus: "full_match", autoApproved: true, submittedAt: "2026-03-10", currency: "BDT" },
  { id: "INV-2026-0235", vendor: "XYZ Engineering", poNumber: "PO-2026-0092", grnNumber: "GRN-2026-0158", invoiceAmount: 1875000, poAmount: 1850000, grnAmount: 1850000, variance: 1.35, matchStatus: "partial_match", autoApproved: false, submittedAt: "2026-03-10", currency: "BDT" },
  { id: "INV-2026-0236", vendor: "Delta Supplies", poNumber: "PO-2026-0085", grnNumber: "GRN-2026-0149", invoiceAmount: 320000, poAmount: 280000, grnAmount: 280000, variance: 14.29, matchStatus: "no_match", autoApproved: false, submittedAt: "2026-03-09", currency: "BDT" },
  { id: "INV-2026-0237", vendor: "SSL Wireless", poNumber: "PO-2026-0094", grnNumber: "GRN-2026-0160", invoiceAmount: 565000, poAmount: 565000, grnAmount: 540000, variance: 4.63, matchStatus: "partial_match", autoApproved: false, submittedAt: "2026-03-09", currency: "BDT" },
  { id: "INV-2026-0238", vendor: "BuildRight Associates", poNumber: "PO-2026-0088", grnNumber: "GRN-2026-0155", invoiceAmount: 980000, poAmount: 980000, grnAmount: 980000, variance: 0, matchStatus: "full_match", autoApproved: true, submittedAt: "2026-03-08", currency: "BDT" },
  { id: "INV-2026-0239", vendor: "Precision Parts", poNumber: "PO-2026-0091", grnNumber: null, invoiceAmount: 1450000, poAmount: 1450000, grnAmount: null, variance: null, matchStatus: "pending_grn", autoApproved: false, submittedAt: "2026-03-08", currency: "BDT" },
  { id: "INV-2026-0240", vendor: "Rupayan Housing", poNumber: "PO-2026-0096", grnNumber: "GRN-2026-0162", invoiceAmount: 2100000, poAmount: 2100000, grnAmount: 2100000, variance: 0, matchStatus: "full_match", autoApproved: true, submittedAt: "2026-03-07", currency: "BDT" },
];

const matchConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle }> = {
  full_match: { label: "Full Match", variant: "default", icon: CheckCircle },
  partial_match: { label: "Partial Match", variant: "secondary", icon: AlertTriangle },
  no_match: { label: "No Match", variant: "destructive", icon: XCircle },
  pending_grn: { label: "Pending GRN", variant: "outline", icon: Clock },
};

export function InvoiceMatching() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data: apiOverview } = useApiOrMock(
    () => financeApi.getMatchingOverview(),
    { total_contracts: 0, total_payments: 0 },
  );

  const filtered = MATCH_QUEUE.filter(m => {
    const matchSearch = m.vendor.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchSearch;
    if (tab === "review") return matchSearch && (m.matchStatus === "partial_match" || m.matchStatus === "no_match");
    if (tab === "approved") return matchSearch && m.matchStatus === "full_match";
    if (tab === "pending") return matchSearch && m.matchStatus === "pending_grn";
    return matchSearch;
  });

  const stats = {
    total: MATCH_QUEUE.length,
    fullMatch: MATCH_QUEUE.filter(m => m.matchStatus === "full_match").length,
    review: MATCH_QUEUE.filter(m => m.matchStatus === "partial_match" || m.matchStatus === "no_match").length,
    pending: MATCH_QUEUE.filter(m => m.matchStatus === "pending_grn").length,
    totalValue: MATCH_QUEUE.reduce((s, m) => s + m.invoiceAmount, 0),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Three-Way Invoice Matching"
        description="PO ↔ Invoice ↔ GRN automated matching queue with OCR extraction"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Upload className="size-4 mr-1.5" />Upload Invoice</Button>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button>
            <Button size="sm"><Zap className="size-4 mr-1.5" />Run Auto-Match</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Invoices", value: stats.total.toString(), icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Auto-Approved", value: stats.fullMatch.toString(), icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Needs Review", value: stats.review.toString(), icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Pending GRN", value: stats.pending.toString(), icon: Clock, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Total Value", value: `BDT ${(stats.totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${s.bg}`}><s.icon className={`size-5 ${s.color}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matching Rules */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-foreground">Matching Rules:</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="size-4 text-green-500" />Full Match = 100% → Auto-approve</span>
            <span className="flex items-center gap-1.5"><AlertTriangle className="size-4 text-amber-500" />Partial = ±5% qty / ±2% price → AP Review</span>
            <span className="flex items-center gap-1.5"><XCircle className="size-4 text-red-500" />No Match = &gt;5% variance → Block Payment</span>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Scale className="size-5" />Matching Queue</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 w-56" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="review">Needs Review ({stats.review})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.fullMatch})</TabsTrigger>
              <TabsTrigger value="pending">Pending GRN ({stats.pending})</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>PO #</TableHead>
                <TableHead>GRN #</TableHead>
                <TableHead className="text-right">Invoice Amt</TableHead>
                <TableHead className="text-right">PO Amt</TableHead>
                <TableHead className="text-right">GRN Amt</TableHead>
                <TableHead className="text-center">Variance</TableHead>
                <TableHead>Match Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const mc = matchConfig[m.matchStatus];
                const Icon = mc.icon;
                return (
                  <TableRow key={m.id} className={m.matchStatus === "no_match" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                    <TableCell className="font-mono text-sm font-medium">{m.id}</TableCell>
                    <TableCell>{m.vendor}</TableCell>
                    <TableCell className="font-mono text-sm">{m.poNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{m.grnNumber || <span className="text-muted-foreground italic">Pending</span>}</TableCell>
                    <TableCell className="text-right font-medium">{m.invoiceAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{m.poAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{m.grnAmount?.toLocaleString() || "—"}</TableCell>
                    <TableCell className="text-center">
                      {m.variance !== null ? (
                        <span className={`font-medium ${m.variance === 0 ? "text-green-600 dark:text-green-400" : m.variance <= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {m.variance === 0 ? "0%" : `+${m.variance.toFixed(1)}%`}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell><Badge variant={mc.variant} className="gap-1"><Icon className="size-3" />{mc.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm"><Eye className="size-4" /></Button>
                        {(m.matchStatus === "partial_match" || m.matchStatus === "no_match") && (
                          <Button variant="outline" size="sm" className="text-xs">Review</Button>
                        )}
                      </div>
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