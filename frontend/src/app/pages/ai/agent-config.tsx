import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Settings, Bot, ShoppingCart, FileText, Shield, DollarSign,
  Save, AlertTriangle, CheckCircle, Sliders, Key, Clock, Cpu
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { aiApi } from "../../lib/api/ai.api";

interface AgentConfig {
  name: string;
  icon: typeof Bot;
  enabled: boolean;
  spendLimit: string;
  dailyLimit: number;
  autoApproveBelow: string;
  model: string;
  temperature: number;
  humanCheckpoints: string[];
}

const INITIAL_CONFIGS: AgentConfig[] = [
  {
    name: "Sourcing Agent",
    icon: ShoppingCart,
    enabled: true,
    spendLimit: "500000",
    dailyLimit: 20,
    autoApproveBelow: "100000",
    model: "gpt-4-turbo",
    temperature: 0.2,
    humanCheckpoints: ["Final award decision", "New vendor onboarding", "Sole source justification"],
  },
  {
    name: "Contract Agent",
    icon: FileText,
    enabled: true,
    spendLimit: "0",
    dailyLimit: 15,
    autoApproveBelow: "0",
    model: "claude-3-sonnet",
    temperature: 0.1,
    humanCheckpoints: ["Changes >10% of contract value", "Contract termination", "Force majeure claims"],
  },
  {
    name: "Risk Agent",
    icon: Shield,
    enabled: false,
    spendLimit: "0",
    dailyLimit: 50,
    autoApproveBelow: "0",
    model: "gpt-4-turbo",
    temperature: 0.3,
    humanCheckpoints: ["Red-tier vendor suspension", "Contingency activation", "Vendor debarment"],
  },
  {
    name: "Savings Agent",
    icon: DollarSign,
    enabled: true,
    spendLimit: "500000",
    dailyLimit: 10,
    autoApproveBelow: "50000",
    model: "gpt-4-turbo",
    temperature: 0.2,
    humanCheckpoints: ["Category manager approval", "Long-term contract negotiation", "Price renegotiation >15%"],
  },
];

export function AgentConfiguration() {
  const [configs, setConfigs] = useState(INITIAL_CONFIGS);
  const [saved, setSaved] = useState(false);

  const { data: apiAgents } = useApiOrMock(
    () => aiApi.listAgents(),
    [],
  );

  const updateConfig = (idx: number, field: string, value: any) => {
    setConfigs(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    setSaved(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="AI Agent Configuration"
        description="Configure agent parameters, spend limits, models, and human checkpoints"
        backTo="/ai/agents"
        backLabel="Back to Control Center"
        actions={
          <Button size="sm" onClick={() => setSaved(true)}>
            <Save className="size-4 mr-1.5" />{saved ? "Saved!" : "Save Configuration"}
          </Button>
        }
      />

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agent Settings</TabsTrigger>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <div className="space-y-4">
            {configs.map((config, idx) => (
              <Card key={config.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <config.icon className="size-5" />{config.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{config.enabled ? "Enabled" : "Disabled"}</span>
                      <Switch checked={config.enabled} onCheckedChange={v => updateConfig(idx, "enabled", v)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Spend Limit (BDT per transaction)</Label>
                      <Input type="number" className="mt-1" value={config.spendLimit} onChange={e => updateConfig(idx, "spendLimit", e.target.value)} />
                    </div>
                    <div>
                      <Label>Daily Transaction Limit</Label>
                      <Input type="number" className="mt-1" value={config.dailyLimit} onChange={e => updateConfig(idx, "dailyLimit", parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <Label>Auto-Approve Below (BDT)</Label>
                      <Input type="number" className="mt-1" value={config.autoApproveBelow} onChange={e => updateConfig(idx, "autoApproveBelow", e.target.value)} />
                    </div>
                    <div>
                      <Label>AI Model</Label>
                      <select
                        className="w-full mt-1 border rounded-md px-3 py-2 text-sm bg-card"
                        value={config.model}
                        onChange={e => updateConfig(idx, "model", e.target.value)}
                      >
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                      </select>
                    </div>
                    <div>
                      <Label>Temperature ({config.temperature})</Label>
                      <input
                        type="range" min="0" max="1" step="0.1"
                        className="w-full mt-2"
                        value={config.temperature}
                        onChange={e => updateConfig(idx, "temperature", parseFloat(e.target.value))}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Precise</span><span>Creative</span>
                      </div>
                    </div>
                    <div>
                      <Label>Human Checkpoints</Label>
                      <div className="mt-1 space-y-1">
                        {config.humanCheckpoints.map((cp, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <AlertTriangle className="size-3 text-amber-500" />{cp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader><CardTitle>Global Safety Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: "Enable AI Audit Logging", desc: "Log all agent decisions with reasoning chain", enabled: true },
                  { label: "Require Human Approval for New Vendors", desc: "AI cannot onboard vendors autonomously", enabled: true },
                  { label: "Allow Autonomous Contract Termination", desc: "Let agents terminate contracts without human approval", enabled: false },
                  { label: "Enable Real-Time Kill Switch", desc: "Allow instant shutdown of all agents", enabled: true },
                  { label: "Weekly Review Requirement", desc: "Force weekly human review of all agent actions", enabled: true },
                  { label: "Sandbox Mode", desc: "Run agents in simulation mode (no real transactions)", enabled: false },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.desc}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Cpu className="size-5" />AI Model Registry</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { model: "GPT-4 Turbo", provider: "OpenAI", status: "active", latency: "1.2s", costPer1k: "$0.01", best: "Sourcing, Savings" },
                  { model: "GPT-4o", provider: "OpenAI", status: "active", latency: "0.8s", costPer1k: "$0.005", best: "General tasks" },
                  { model: "Claude 3 Sonnet", provider: "Anthropic", status: "active", latency: "1.0s", costPer1k: "$0.003", best: "Contract drafting" },
                  { model: "Claude 3 Opus", provider: "Anthropic", status: "available", latency: "2.5s", costPer1k: "$0.015", best: "Complex analysis" },
                ].map(m => (
                  <div key={m.model} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <Cpu className="size-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{m.model}</p>
                        <Badge variant={m.status === "active" ? "default" : "outline"}>{m.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{m.provider} • Latency: {m.latency} • Cost: {m.costPer1k}/1K tokens • Best for: {m.best}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Key className="size-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">API Key configured</span>
                    </div>
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