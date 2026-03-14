import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import {
  Download, FileText, Clock, CheckCircle, AlertTriangle,
  TrendingUp, Activity, BarChart3, ArrowRight,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_PIPELINE = [
  { status: "draft", count: 12, total_value: 8500000 },
  { status: "published", count: 8, total_value: 22000000 },
  { status: "open", count: 15, total_value: 45000000 },
  { status: "under_evaluation", count: 6, total_value: 18000000 },
  { status: "pending_tech_eval", count: 4, total_value: 12000000 },
  { status: "pending_commercial_eval", count: 3, total_value: 9500000 },
  { status: "pending_approval", count: 2, total_value: 7000000 },
  { status: "awarded", count: 22, total_value: 65000000 },
  { status: "closed", count: 18, total_value: 42000000 },
  { status: "cancelled", count: 5, total_value: 3200000 },
];

const MOCK_MONTHLY_TREND = [
  { month: "Oct 2025", created: 8, awarded: 3, cancelled: 1 },
  { month: "Nov 2025", created: 12, awarded: 5, cancelled: 0 },
  { month: "Dec 2025", created: 6, awarded: 4, cancelled: 2 },
  { month: "Jan 2026", created: 15, awarded: 7, cancelled: 1 },
  { month: "Feb 2026", created: 11, awarded: 6, cancelled: 1 },
  { month: "Mar 2026", created: 9, awarded: 4, cancelled: 0 },
];

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft", published: "Published", open: "Open",
  under_evaluation: "Under Evaluation", pending_prequal: "Prequal",
  pending_tech_eval: "Tech Eval", pending_commercial_eval: "Comm Eval",
  pending_audit: "Audit", pending_approval: "Approval",
  awarded: "Awarded", closed: "Closed", cancelled: "Cancelled", withheld: "Withheld",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8", published: "#3b82f6", open: "#22c55e",
  under_evaluation: "#f59e0b", pending_prequal: "#f97316", pending_tech_eval: "#a855f7",
  pending_commercial_eval: "#ec4899", pending_audit: "#6366f1", pending_approval: "#14b8a6",
  awarded: "#10b981", closed: "#6b7280", cancelled: "#ef4444", withheld: "#78716c",
};

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#ec4899", "#6366f1", "#f97316", "#6b7280"];

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `৳${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `৳${(val / 1_000).toFixed(0)}K`;
  return `৳${val}`;
}

export function TenderPipelineAnalytics() {
  const [period, setPeriod] = useState("6m");

  const { data: pipelineData } = useApiOrMock(
    () => analyticsApi.getTenderPipeline(),
    MOCK_PIPELINE,
    [],
  );

  // Aggregate active vs completed
  const activeStatuses = ["published", "open", "under_evaluation", "pending_prequal", "pending_tech_eval", "pending_commercial_eval", "pending_audit", "pending_approval"];
  const totalTenders = pipelineData.reduce((s, d) => s + d.count, 0);
  const activeTenders = pipelineData.filter(d => activeStatuses.includes(d.status)).reduce((s, d) => s + d.count, 0);
  const totalValue = pipelineData.reduce((s, d) => s + d.total_value, 0);
  const awardedValue = pipelineData.filter(d => d.status === "awarded").reduce((s, d) => s + d.total_value, 0);
  const awardRate = totalTenders > 0 ? Math.round((pipelineData.find(d => d.status === "awarded")?.count ?? 0) / totalTenders * 100) : 0;

  // Prepare bar chart data — only non-zero
  const barData = pipelineData
    .filter(d => d.count > 0)
    .map(d => ({
      name: STATUS_LABELS[d.status] ?? d.status,
      count: d.count,
      value: d.total_value,
      fill: STATUS_COLORS[d.status] ?? "#6b7280",
    }));

  // Pie data — group small categories
  const pieData = pipelineData.filter(d => d.count > 0).map(d => ({
    name: STATUS_LABELS[d.status] ?? d.status,
    value: d.count,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tender Pipeline Analytics"
        description="Visualise tender flow through each procurement stage"
        backTo="/analytics"
      />

      {/* Period + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="size-4 mr-1" /> Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Tenders</p>
                <p className="text-foreground text-xl">{totalTenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Activity className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active</p>
                <p className="text-foreground text-xl">{activeTenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pipeline Value</p>
                <p className="text-foreground text-xl">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Award Rate</p>
                <p className="text-foreground text-xl">{awardRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Bar: Count by Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Tenders by Stage
            </CardTitle>
            <CardDescription>Distribution across procurement stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "count") return [value, "Tenders"];
                      return [formatCurrency(value), "Value"];
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie: Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Split</CardTitle>
            <CardDescription>Tender count share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_e, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Tender Activity</CardTitle>
          <CardDescription>Created, awarded, and cancelled tenders per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MONTHLY_TREND} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="created" stackId="1" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="awarded" stackId="2" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} />
                <Area type="monotone" dataKey="cancelled" stackId="3" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Tenders</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead className="text-right">% of Pipeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.filter(d => d.count > 0).map((d) => (
                  <TableRow key={d.status}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[d.status] ?? "#6b7280" }} />
                        <span className="text-foreground">{STATUS_LABELS[d.status] ?? d.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{d.count}</TableCell>
                    <TableCell className="text-right text-foreground">{formatCurrency(d.total_value)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {totalValue > 0 ? Math.round(d.total_value / totalValue * 100) : 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TenderPipelineAnalytics;
