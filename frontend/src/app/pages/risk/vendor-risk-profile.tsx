import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Activity, AlertTriangle, Shield, DollarSign, Globe, Lock, Leaf,
  TrendingUp, Download, RefreshCw, Calendar, FileText, Eye
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { riskApi } from "../../lib/api/risk.api";

const VENDOR = {
  id: "VND-004",
  name: "Global Tech Solutions",
  overallScore: 82,
  tier: "Red",
  lastCalculated: "2026-03-10",
  nextReview: "2026-04-10",
};

const DIMENSIONS = [
  { name: "Financial", score: 75, weight: 25, weighted: 18.75, icon: DollarSign, color: "text-green-600 dark:text-green-400", factors: ["Credit rating: BB-", "Debt-to-equity: 2.8", "Late payment frequency: 12%", "Revenue trend: Declining"] },
  { name: "Operational", score: 85, weight: 25, weighted: 21.25, icon: Activity, color: "text-blue-600 dark:text-blue-400", factors: ["On-time delivery: 72%", "Quality rejection rate: 8%", "Capacity utilization: 95%", "Incident response: 48hrs avg"] },
  { name: "Compliance", score: 90, weight: 20, weighted: 18.0, icon: Shield, color: "text-purple-600 dark:text-purple-400", factors: ["KYC status: Flagged (PEP)", "AML alert: Active investigation", "Trade license: Valid", "Tax compliance: Current"] },
  { name: "Geopolitical", score: 70, weight: 15, weighted: 10.5, icon: Globe, color: "text-amber-600 dark:text-amber-400", factors: ["Country risk: Medium (Bangladesh)", "Sanctions exposure: None", "Political stability: Moderate", "Currency risk: BDT fluctuation"] },
  { name: "Cyber", score: 65, weight: 10, weighted: 6.5, icon: Lock, color: "text-red-600 dark:text-red-400", factors: ["SSL certificate: Valid", "Vulnerability scan: 3 medium issues", "Data breach history: None", "Security audit: Overdue"] },
  { name: "ESG", score: 50, weight: 5, weighted: 2.5, icon: Leaf, color: "text-teal-600 dark:text-teal-400", factors: ["Environmental: No cert", "Social: Fair labor practices", "Governance: Board diversity low", "Carbon reporting: Not available"] },
];

const RISK_HISTORY = [
  { date: "2026-03-10", score: 82, event: "PEP screening alert raised overall score" },
  { date: "2026-03-06", score: 76, event: "Unusual payment pattern detected" },
  { date: "2026-02-15", score: 68, event: "Monthly recalculation" },
  { date: "2026-01-15", score: 55, event: "Monthly recalculation" },
  { date: "2025-12-15", score: 48, event: "Monthly recalculation" },
  { date: "2025-11-15", score: 42, event: "Delivery delays increased score" },
];

const MITIGATIONS = [
  { id: "MIT-001", title: "Enhanced Financial Monitoring", status: "active", created: "2026-03-06", owner: "Finance Team", dueDate: "2026-04-06" },
  { id: "MIT-002", title: "PEP Investigation & Resolution", status: "active", created: "2026-03-10", owner: "Compliance Officer", dueDate: "2026-03-25" },
];

export function VendorRiskProfile() {
  const { id } = useParams();

  const { data: apiProfile } = useApiOrMock(
    () => riskApi.getVendorRiskProfile(id!),
    VENDOR,
    [id],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Risk Profile — ${apiProfile.name}`}
        description={`${id || apiProfile.id} • Overall Risk Score: ${apiProfile.overallScore}/100 • Tier: ${apiProfile.tier}`}
        backTo="/risk/dashboard"
        backLabel="Back to Risk Command Center"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button>
            <Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Recalculate</Button>
            <Button size="sm"><FileText className="size-4 mr-1.5" />Create Mitigation Plan</Button>
          </div>
        }
      />

      {/* Overall Score */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="size-24 rounded-full border-8 border-red-200 dark:border-red-900/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">{apiProfile.overallScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Tier</p>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">RED — Suspend New Awards</span>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" />Last calculated: {apiProfile.lastCalculated}</span>
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" />Next review: {apiProfile.nextReview}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">+6 pts in 30 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DIMENSIONS.map(d => (
          <Card key={d.name}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <d.icon className={`size-5 ${d.color}`} />
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="text-xs text-muted-foreground">({d.weight}% weight)</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Progress value={d.score} className="h-2.5 flex-1" />
                <span className={`text-lg font-bold ${d.score > 80 ? "text-red-600 dark:text-red-400" : d.score > 60 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}`}>{d.score}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Weighted contribution: {d.weighted.toFixed(1)} pts</p>
              <div className="space-y-1">
                {d.factors.map((f, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {f}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score History */}
        <Card>
          <CardHeader><CardTitle>Score History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RISK_HISTORY.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                  <span className={`text-lg font-bold w-10 ${h.score > 80 ? "text-red-600 dark:text-red-400" : h.score > 60 ? "text-amber-600 dark:text-amber-400" : h.score > 30 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>{h.score}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{h.event}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Mitigations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Mitigation Plans</CardTitle>
              <Button size="sm" variant="outline"><FileText className="size-4 mr-1.5" />New Plan</Button>
            </div>
          </CardHeader>
          <CardContent>
            {MITIGATIONS.map(m => (
              <div key={m.id} className="p-4 rounded-lg border border-border mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{m.status}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
                  </div>
                  <Button variant="ghost" size="sm"><Eye className="size-4" /></Button>
                </div>
                <p className="font-medium text-sm text-foreground">{m.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Owner: {m.owner}</span>
                  <span>Due: {m.dueDate}</span>
                  <span>Created: {m.created}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}