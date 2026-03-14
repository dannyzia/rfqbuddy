import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Star, FileText, Clock, AlertTriangle, DollarSign, CheckCircle,
  Building2, Calendar, TrendingUp, Shield, Upload
} from "lucide-react";

export function VendorSRMDashboard() {
  const performanceHistory = [
    { month: "Oct 25", score: 3.8 },
    { month: "Nov 25", score: 4.0 },
    { month: "Dec 25", score: 3.9 },
    { month: "Jan 26", score: 4.2 },
    { month: "Feb 26", score: 4.3 },
    { month: "Mar 26", score: 4.1 },
  ];

  const activeContracts = [
    { id: "C-2026-0042", title: "Office Equipment & IT Infrastructure", value: 12450000, status: "active", progress: 37.5, nextMilestone: "Phase 1 Installation", nextDue: "2026-06-15" },
    { id: "C-2026-0038", title: "Network Cable Installation", value: 3500000, status: "active", progress: 80, nextMilestone: "Final Inspection", nextDue: "2026-05-20" },
    { id: "C-2025-0091", title: "Server Room Setup", value: 8200000, status: "completed", progress: 100, nextMilestone: "Completed", nextDue: "-" },
  ];

  const paymentHistory = [
    { id: "PAY-012", contract: "C-2026-0042", amount: 2490000, date: "2026-03-20", status: "paid" },
    { id: "PAY-011", contract: "C-2026-0042", amount: 1867500, date: "2026-04-03", status: "paid" },
    { id: "PAY-010", contract: "C-2026-0038", amount: 1050000, date: "2026-03-25", status: "paid" },
    { id: "PAY-009", contract: "C-2026-0042", amount: 1867500, date: "2026-04-29", status: "pending" },
    { id: "PAY-008", contract: "C-2026-0038", amount: 875000, date: "2026-05-10", status: "pending" },
  ];

  const expiringDocs = [
    { name: "Trade License", expiryDate: "2026-04-15", daysLeft: -2, status: "expired" },
    { name: "TIN Certificate", expiryDate: "2026-05-10", daysLeft: 25, status: "expiring" },
    { name: "ISO 9001 Certificate", expiryDate: "2026-07-20", daysLeft: 96, status: "valid" },
    { name: "VAT Registration", expiryDate: "2026-12-31", daysLeft: 260, status: "valid" },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `BDT ${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `BDT ${(amount / 100000).toFixed(1)} Lac`;
    return `BDT ${new Intl.NumberFormat("en-BD").format(amount)}`;
  };

  const totalPaid = paymentHistory.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentHistory.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const overallScore = performanceHistory[performanceHistory.length - 1].score;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Supplier Relationship Dashboard"
        description="Your performance, contracts, payments, and document status"
        backTo="/vendor-dashboard"
        backLabel="Back to Dashboard"
      />

      {/* Alerts */}
      {expiringDocs.some((d) => d.status === "expired") && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Document Expired</p>
            <p className="text-sm text-red-700 dark:text-red-400">
              Your {expiringDocs.find((d) => d.status === "expired")?.name} has expired. Please renew immediately to maintain your active status.
            </p>
            <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700"><Upload className="size-3.5 mr-1" /> Renew Now</Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="size-5 text-yellow-600 dark:text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Rating</p>
                <p className="text-lg font-bold text-foreground">{overallScore} / 5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Contracts</p>
                <p className="text-lg font-bold text-foreground">{activeContracts.filter((c) => c.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Payments</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={performanceHistory}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Expiry */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Document Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className={`size-4 ${
                      doc.status === "expired" ? "text-red-500" :
                      doc.status === "expiring" ? "text-amber-500" : "text-green-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Expires: {doc.expiryDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      doc.status === "expired" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      doc.status === "expiring" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }>
                      {doc.status === "expired" ? "Expired" :
                       doc.status === "expiring" ? `${doc.daysLeft}d left` :
                       "Valid"}
                    </Badge>
                    {(doc.status === "expired" || doc.status === "expiring") && (
                      <Button size="sm" variant="outline"><Upload className="size-3 mr-1" /> Renew</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Contracts */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Active Contracts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Next Milestone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeContracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-blue-600 dark:text-blue-400">{c.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                  <TableCell className="text-right">{formatCurrency(c.value)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={c.progress} className="w-20 h-2" />
                      <span className="text-xs">{c.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-foreground">{c.nextMilestone}</p>
                      {c.nextDue !== "-" && <p className="text-xs text-muted-foreground">Due: {c.nextDue}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={c.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}>
                      {c.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono">{p.id}</TableCell>
                  <TableCell className="text-blue-600 dark:text-blue-400">{p.contract}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                  <TableCell>
                    <Badge className={p.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}>
                      {p.status === "paid" ? <><CheckCircle className="size-3 mr-1" /> Paid</> : <><Clock className="size-3 mr-1" /> Pending</>}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}