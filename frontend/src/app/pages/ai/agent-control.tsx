import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
import {
  Bot, Settings, Activity, Zap, ShoppingCart, FileText, Shield,
  DollarSign, Play, Pause, Eye, BarChart3, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { aiApi } from "../../lib/api/ai.api";

const AGENTS = [
  {
    id: "sourcing",
    name: "Sourcing Agent",
    description: "Auto-generates RFQs for pre-approved vendors, performs initial screening, and recommends shortlists",
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    status: "active",
    enabled: true,
    tasksCompleted: 156,
    tasksToday: 8,
    accuracy: 94.2,
    savings: "BDT 2.3M",
    spendLimit: "BDT 5 Lac/transaction",
    humanCheckpoint: "Final award decision",
    lastAction: "Auto-RFQ sent to 5 vendors for IT Equipment — 12 min ago",
  },
  {
    id: "contract",
    name: "Contract Agent",
    description: "Drafts amendments, routes approvals, updates contract terms, monitors deadlines",
    icon: FileText,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    status: "active",
    enabled: true,
    tasksCompleted: 89,
    tasksToday: 3,
    accuracy: 97.1,
    savings: "BDT 850K",
    spendLimit: "Changes <10% of contract value",
    humanCheckpoint: "Changes >10% of value",
    lastAction: "Drafted variation request for Contract C-2026-0038 — 45 min ago",
  },
  {
    id: "risk",
    name: "Risk Agent",
    description: "Monitors vendor risk in real-time, initiates mitigation plans, suggests alternatives",
    icon: Shield,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    status: "paused",
    enabled: false,
    tasksCompleted: 45,
    tasksToday: 0,
    accuracy: 91.8,
    savings: "BDT 1.1M (avoided losses)",
    spendLimit: "No direct spend authority",
    humanCheckpoint: "Red-tier vendor suspension",
    lastAction: "Paused by admin — pending risk model calibration",
  },
  {
    id: "savings",
    name: "Savings Agent",
    description: "Identifies consolidation opportunities, negotiates volume discounts, tracks savings",
    icon: DollarSign,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    status: "active",
    enabled: true,
    tasksCompleted: 67,
    tasksToday: 5,
    accuracy: 88.9,
    savings: "BDT 4.7M",
    spendLimit: "BDT 5 Lac/transaction",
    humanCheckpoint: "Category manager approval",
    lastAction: "Identified 15% volume discount opportunity for office supplies — 2 hrs ago",
  },
];

const RECENT_ACTIONS = [
  { agent: "Sourcing", action: "Auto-RFQ TND-2026-0156 sent to 5 pre-approved IT vendors", time: "12 min ago", status: "success", requiresHuman: false },
  { agent: "Savings", action: "Volume discount analysis: Office Supplies consolidation — 15% savings potential (BDT 230K)", time: "2 hrs ago", status: "success", requiresHuman: true },
  { agent: "Contract", action: "Drafted variation request for Contract C-2026-0038 — price adjustment clause 8.3", time: "45 min ago", status: "pending_review", requiresHuman: true },
  { agent: "Sourcing", action: "Screened 12 vendor responses for TND-2026-0148 — 4 shortlisted, 8 rejected (criteria mismatch)", time: "3 hrs ago", status: "success", requiresHuman: false },
  { agent: "Savings", action: "Identified duplicate PO for printer cartridges — flagged for consolidation", time: "4 hrs ago", status: "success", requiresHuman: false },
  { agent: "Contract", action: "Reminder: Contract C-2026-0025 milestone 4 due in 3 days", time: "5 hrs ago", status: "info", requiresHuman: false },
];

const GUARDRAILS = [
  "All agent actions are logged with full audit trail",
  "Maximum BDT 5 Lac per autonomous transaction",
  "Daily transaction limit: 20 per agent",
  "Human required: New vendor onboarding, contract termination, price increases >10%",
  "Agent decisions explainable — reasoning chain stored for each action",
  "Kill switch available — any agent can be paused instantly",
];

export function AgentControlCenter() {
  const [agents, setAgents] = useState(AGENTS);

  const { data: apiAgents } = useApiOrMock(
    () => aiApi.listAgents(),
    [],
  );

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled, status: a.enabled ? "paused" : "active" } : a));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="AI Agent Control Center"
        description="Agentic AI for autonomous procurement — GPT-4/Claude + Temporal.io hybrid engine (Platinum Only)"
        actions={
          <div className="flex gap-2">
            <Link to="/ai/config"><Button variant="outline" size="sm"><Settings className="size-4 mr-1.5" />Configure</Button></Link>
            <Link to="/ai/analytics"><Button variant="outline" size="sm"><BarChart3 className="size-4 mr-1.5" />Analytics</Button></Link>
          </div>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Agents", value: agents.filter(a => a.enabled).length.toString() + "/4", icon: Bot, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Tasks Today", value: agents.reduce((s, a) => s + a.tasksToday, 0).toString(), icon: Zap, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Total Savings", value: "BDT 8.95M", icon: DollarSign, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Avg Accuracy", value: "93.0%", icon: Activity, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
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

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {agents.map(a => (
          <Card key={a.id} className={`${!a.enabled ? "opacity-60" : ""}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${a.bg}`}><a.icon className={`size-6 ${a.color}`} /></div>
                  <div>
                    <h3 className="font-medium text-foreground">{a.name}</h3>
                    <Badge variant={a.enabled ? "default" : "secondary"} className="mt-1">{a.enabled ? "Active" : "Paused"}</Badge>
                  </div>
                </div>
                <Switch checked={a.enabled} onCheckedChange={() => toggleAgent(a.id)} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">{a.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-muted-foreground">Tasks Done:</span> <span className="font-medium">{a.tasksCompleted}</span></div>
                <div><span className="text-muted-foreground">Accuracy:</span> <span className="font-medium">{a.accuracy}%</span></div>
                <div><span className="text-muted-foreground">Savings:</span> <span className="font-medium">{a.savings}</span></div>
                <div><span className="text-muted-foreground">Today:</span> <span className="font-medium">{a.tasksToday} tasks</span></div>
              </div>
              <div className="p-2 rounded bg-muted text-xs space-y-1">
                <p><span className="text-muted-foreground">Spend Limit:</span> {a.spendLimit}</p>
                <p><span className="text-muted-foreground">Human Checkpoint:</span> {a.humanCheckpoint}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">{a.lastAction}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Actions & Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="size-5" />Recent Agent Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_ACTIONS.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    {a.status === "success" ? <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" /> :
                     a.status === "pending_review" ? <Clock className="size-4 text-amber-500 mt-0.5 shrink-0" /> :
                     <Activity className="size-4 text-blue-500 mt-0.5 shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{a.agent}</Badge>
                        {a.requiresHuman && <Badge variant="secondary" className="text-xs">Needs Human</Badge>}
                      </div>
                      <p className="text-sm text-foreground mt-1">{a.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Guardrails & Safety</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {GUARDRAILS.map((g, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-foreground">{g}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>Agentic AI is in Beta. All autonomous actions are reviewed weekly. Feature available exclusively for Platinum tier (GA Year 3).</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}