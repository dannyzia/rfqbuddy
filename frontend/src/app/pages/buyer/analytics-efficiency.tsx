import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import {
  Clock, Zap, TrendingUp, TrendingDown, Users, CheckCircle, Target, Timer,
  ArrowRight, BarChart3, Activity,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";
import type { EfficiencyMetrics } from "../../lib/api-types";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_EFFICIENCY: EfficiencyMetrics = {
  cycle_time: {
    avg_cycle_days: 28.4,
    avg_submission_window_days: 14.2,
    awarded_count: 22,
    cancelled_count: 5,
    total_tenders: 95,
  },
  bid_efficiency: {
    avg_bids_per_tender: 4.7,
    participation_rate: 82.5,
  },
  eval_turnaround: [
    { stage: "prequalification", avg_days: 3.2 },
    { stage: "technical", avg_days: 5.8 },
    { stage: "commercial", avg_days: 4.1 },
  ],
  monthly_throughput: [
    { month: "2025-10-01T00:00:00Z", completed: 6, cancelled: 1 },
    { month: "2025-11-01T00:00:00Z", completed: 9, cancelled: 0 },
    { month: "2025-12-01T00:00:00Z", completed: 5, cancelled: 2 },
    { month: "2026-01-01T00:00:00Z", completed: 11, cancelled: 1 },
    { month: "2026-02-01T00:00:00Z", completed: 8, cancelled: 1 },
    { month: "2026-03-01T00:00:00Z", completed: 4, cancelled: 0 },
  ],
};

function formatMonth(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

const STAGE_LABELS: Record<string, string> = {
  prequalification: "Prequalification",
  technical: "Technical Eval",
  commercial: "Commercial Eval",
};

const STAGE_COLORS: Record<string, string> = {
  prequalification: "#f59e0b",
  technical: "#a855f7",
  commercial: "#3b82f6",
};

function MetricCard({
  icon: Icon, label, value, suffix, color, subtext,
}: {
  icon: typeof Clock; label: string; value: string | number; suffix?: string; color: string; subtext?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-sm truncate">{label}</p>
            <p className="text-foreground text-xl">
              {value}{suffix && <span className="text-muted-foreground text-sm ml-1">{suffix}</span>}
            </p>
            {subtext && <p className="text-muted-foreground text-xs">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessEfficiencyAnalytics() {
  const { data } = useApiOrMock(
    () => analyticsApi.getEfficiencyMetrics(),
    MOCK_EFFICIENCY,
    [],
  );

  const ct = data.cycle_time;
  const be = data.bid_efficiency;
  const successRate = ct && ct.total_tenders > 0
    ? Math.round((ct.awarded_count / ct.total_tenders) * 100)
    : 0;
  const cancelRate = ct && ct.total_tenders > 0
    ? Math.round((ct.cancelled_count / ct.total_tenders) * 100)
    : 0;

  const throughputData = data.monthly_throughput.map(d => ({
    month: formatMonth(d.month),
    completed: d.completed,
    cancelled: d.cancelled,
  }));

  const evalData = data.eval_turnaround.map(d => ({
    stage: STAGE_LABELS[d.stage] ?? d.stage,
    days: d.avg_days ?? 0,
    fill: STAGE_COLORS[d.stage] ?? "#6b7280",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Process Efficiency"
        description="Cycle times, throughput, and procurement process performance"
        backTo="/analytics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Timer}
          label="Avg Cycle Time"
          value={ct?.avg_cycle_days ?? "—"}
          suffix="days"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          subtext="Draft to Award"
        />
        <MetricCard
          icon={Clock}
          label="Submission Window"
          value={ct?.avg_submission_window_days ?? "—"}
          suffix="days"
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          subtext="Avg per tender"
        />
        <MetricCard
          icon={Users}
          label="Avg Bids/Tender"
          value={be?.avg_bids_per_tender ?? "—"}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          subtext={`${be?.participation_rate ?? 0}% participation`}
        />
        <MetricCard
          icon={Target}
          label="Success Rate"
          value={`${successRate}%`}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          subtext={`${ct?.awarded_count ?? 0} of ${ct?.total_tenders ?? 0} tenders`}
        />
      </div>

      {/* Funnel / Rates */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Procurement Funnel
            </CardTitle>
            <CardDescription>Outcome distribution of all tenders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Awarded</span>
                <span className="text-emerald-600 dark:text-emerald-400">{successRate}%</span>
              </div>
              <Progress value={successRate} className="h-3 [&>div]:bg-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">In Progress</span>
                <span className="text-blue-600 dark:text-blue-400">{ct ? Math.round(((ct.total_tenders - ct.awarded_count - ct.cancelled_count) / ct.total_tenders) * 100) : 0}%</span>
              </div>
              <Progress value={ct ? ((ct.total_tenders - ct.awarded_count - ct.cancelled_count) / ct.total_tenders) * 100 : 0} className="h-3 [&>div]:bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Cancelled</span>
                <span className="text-red-600 dark:text-red-400">{cancelRate}%</span>
              </div>
              <Progress value={cancelRate} className="h-3 [&>div]:bg-red-500" />
            </div>

            <div className="pt-3 border-t border-border text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Total tenders processed</span>
                <span className="text-foreground">{ct?.total_tenders ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Awarded</span>
                <span className="text-emerald-600 dark:text-emerald-400">{ct?.awarded_count ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled</span>
                <span className="text-red-600 dark:text-red-400">{ct?.cancelled_count ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Turnaround */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5" />
              Evaluation Turnaround
            </CardTitle>
            <CardDescription>Average days per evaluation stage</CardDescription>
          </CardHeader>
          <CardContent>
            {evalData.length > 0 ? (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evalData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: "Days", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
                    <Tooltip formatter={(value: number) => [`${value} days`, "Avg Turnaround"]} />
                    <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                      {evalData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                No evaluation data available
              </div>
            )}

            {evalData.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.eval_turnaround.map((d) => (
                  <div key={d.stage} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[d.stage] ?? "#6b7280" }} />
                      <span className="text-foreground">{STAGE_LABELS[d.stage] ?? d.stage}</span>
                    </div>
                    <Badge variant="outline">{d.avg_days ?? "—"} days</Badge>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                  <span className="text-foreground">Total eval time</span>
                  <Badge>{data.eval_turnaround.reduce((s, d) => s + (d.avg_days ?? 0), 0).toFixed(1)} days</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Throughput */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Monthly Throughput
          </CardTitle>
          <CardDescription>Tenders completed and cancelled per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} name="Completed" />
                <Area type="monotone" dataKey="cancelled" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} name="Cancelled" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Throughput Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Cancelled</TableHead>
                  <TableHead className="text-right">Success %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {throughputData.map((d) => {
                  const total = d.completed + d.cancelled;
                  const pct = total > 0 ? Math.round((d.completed / total) * 100) : 0;
                  return (
                    <TableRow key={d.month}>
                      <TableCell className="text-foreground">{d.month}</TableCell>
                      <TableCell className="text-right text-emerald-600 dark:text-emerald-400">{d.completed}</TableCell>
                      <TableCell className="text-right text-red-600 dark:text-red-400">{d.cancelled}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={pct >= 80 ? "text-emerald-600 dark:text-emerald-400" : pct >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}>
                          {pct}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProcessEfficiencyAnalytics;
