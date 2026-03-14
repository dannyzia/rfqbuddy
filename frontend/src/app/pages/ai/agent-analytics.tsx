import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  BarChart3, Bot, TrendingUp, DollarSign, Clock, CheckCircle,
  AlertTriangle, Activity, ShoppingCart, FileText, Shield, Zap, Download
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { aiApi } from "../../lib/api/ai.api";

const AGENT_METRICS = [
  { name: "Sourcing Agent", tasks: 156, accuracy: 94.2, avgTime: "4.2 min", savings: 2300000, errors: 9, humanOverrides: 12, icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400" },
  { name: "Contract Agent", tasks: 89, accuracy: 97.1, avgTime: "8.5 min", savings: 850000, errors: 3, humanOverrides: 5, icon: FileText, color: "text-green-600 dark:text-green-400" },
  { name: "Risk Agent", tasks: 45, accuracy: 91.8, avgTime: "2.1 min", savings: 1100000, errors: 4, humanOverrides: 8, icon: Shield, color: "text-red-600 dark:text-red-400" },
  { name: "Savings Agent", tasks: 67, accuracy: 88.9, avgTime: "6.7 min", savings: 4700000, errors: 7, humanOverrides: 15, icon: DollarSign, color: "text-amber-600 dark:text-amber-400" },
];

const WEEKLY_PERFORMANCE = [
  { week: "W10 (Mar 3-9)", sourcing: 22, contract: 12, risk: 8, savings: 9, totalSavings: "BDT 1.2M" },
  { week: "W9 (Feb 24-Mar 2)", sourcing: 19, contract: 10, risk: 6, savings: 11, totalSavings: "BDT 980K" },
  { week: "W8 (Feb 17-23)", sourcing: 25, contract: 14, risk: 10, savings: 8, totalSavings: "BDT 1.5M" },
  { week: "W7 (Feb 10-16)", sourcing: 18, contract: 9, risk: 5, savings: 12, totalSavings: "BDT 1.1M" },
  { week: "W6 (Feb 3-9)", sourcing: 21, contract: 11, risk: 7, savings: 10, totalSavings: "BDT 1.3M" },
];

const HUMAN_OVERRIDES = [
  { date: "2026-03-10", agent: "Savings", action: "Rejected volume discount recommendation", reason: "Vendor quality concerns not captured in model", overriddenBy: "Sarah Ahmed (Category Manager)" },
  { date: "2026-03-09", agent: "Sourcing", action: "Modified vendor shortlist", reason: "Added local BD vendor not in pre-approved list", overriddenBy: "Md. Rafiqul Islam (Proc Head)" },
  { date: "2026-03-08", agent: "Contract", action: "Revised contract amendment draft", reason: "Legal clause needed manual review for BD law compliance", overriddenBy: "Legal Team" },
  { date: "2026-03-07", agent: "Savings", action: "Declined consolidation suggestion", reason: "Items from different budget lines — cannot consolidate", overriddenBy: "Finance Controller" },
  { date: "2026-03-06", agent: "Sourcing", action: "Changed evaluation criteria weights", reason: "Technical weight increased per project requirement", overriddenBy: "Project Manager" },
];

export function AgentAnalytics() {
  const { data: apiAnalytics } = useApiOrMock(
    () => aiApi.getAnalytics(),
    { total_actions_processed: 0, agents_active: 0, agents_total: 0, savings_identified: 0, risks_flagged: 0 },
  );

  const totalTasks = AGENT_METRICS.reduce((s, a) => s + a.tasks, 0);
  const avgAccuracy = (AGENT_METRICS.reduce((s, a) => s + a.accuracy, 0) / AGENT_METRICS.length).toFixed(1);
  const totalSavings = AGENT_METRICS.reduce((s, a) => s + a.savings, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="AI Agent Performance Analytics"
        description="Comprehensive metrics for all procurement AI agents — accuracy, savings, and human override analysis"
        backTo="/ai/agents"
        backLabel="Back to Control Center"
        actions={
          <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Tasks", value: totalTasks.toString(), icon: Zap, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Total Savings", value: `BDT ${(totalSavings / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Human Overrides", value: AGENT_METRICS.reduce((s, a) => s + a.humanOverrides, 0).toString(), icon: AlertTriangle, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
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

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Agent Performance</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="overrides">Human Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader><CardTitle>Agent-Level Metrics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {AGENT_METRICS.map(a => (
                  <div key={a.name} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <a.icon className={`size-5 ${a.color}`} />
                      <span className="font-medium text-foreground">{a.name}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Tasks</p>
                        <p className="text-lg font-bold text-foreground">{a.tasks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <div className="flex items-center gap-2">
                          <Progress value={a.accuracy} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{a.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Time</p>
                        <p className="text-lg font-bold text-foreground">{a.avgTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Savings</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">BDT {(a.savings / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Errors</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">{a.errors}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Human Overrides</p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{a.humanOverrides}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader><CardTitle>Weekly Task Completion</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead className="text-center">Sourcing</TableHead>
                    <TableHead className="text-center">Contract</TableHead>
                    <TableHead className="text-center">Risk</TableHead>
                    <TableHead className="text-center">Savings</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-right">Savings Generated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {WEEKLY_PERFORMANCE.map(w => (
                    <TableRow key={w.week}>
                      <TableCell className="font-medium">{w.week}</TableCell>
                      <TableCell className="text-center">{w.sourcing}</TableCell>
                      <TableCell className="text-center">{w.contract}</TableCell>
                      <TableCell className="text-center">{w.risk}</TableCell>
                      <TableCell className="text-center">{w.savings}</TableCell>
                      <TableCell className="text-center font-medium">{w.sourcing + w.contract + w.risk + w.savings}</TableCell>
                      <TableCell className="text-right font-medium text-green-600 dark:text-green-400">{w.totalSavings}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides">
          <Card>
            <CardHeader><CardTitle>Human Override Log</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {HUMAN_OVERRIDES.map((o, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{o.agent}</Badge>
                      <span className="text-xs text-muted-foreground">{o.date}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{o.action}</p>
                    <p className="text-sm text-muted-foreground mt-1">Reason: {o.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">Overridden by: {o.overriddenBy}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}