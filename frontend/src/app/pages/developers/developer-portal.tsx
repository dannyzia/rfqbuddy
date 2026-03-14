import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Globe, Key, Code, Webhook, Book, Zap, Copy, Eye, EyeOff,
  RefreshCw, Plus, CheckCircle, Clock, AlertTriangle, Shield
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { developersApi } from "../../lib/api/developers.api";

const API_KEYS = [
  { id: "ak_live_abc123def456", name: "Production Key", env: "live", created: "2026-01-15", lastUsed: "2026-03-12 09:45", requests24h: 1234, status: "active" },
  { id: "ak_test_xyz789ghi012", name: "Sandbox Key", env: "test", created: "2026-02-01", lastUsed: "2026-03-11 16:30", requests24h: 567, status: "active" },
  { id: "ak_live_old456jkl789", name: "Legacy Integration", env: "live", created: "2025-06-10", lastUsed: "2026-02-28", requests24h: 0, status: "inactive" },
];

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/tenders", description: "List all tenders", auth: "API Key", rateLimit: "1000/hr" },
  { method: "POST", path: "/api/v1/tenders", description: "Create new tender", auth: "API Key + HMAC", rateLimit: "100/hr" },
  { method: "GET", path: "/api/v1/tenders/:id", description: "Get tender details", auth: "API Key", rateLimit: "1000/hr" },
  { method: "GET", path: "/api/v1/vendors", description: "List vendors", auth: "API Key", rateLimit: "1000/hr" },
  { method: "GET", path: "/api/v1/contracts", description: "List contracts", auth: "API Key", rateLimit: "1000/hr" },
  { method: "POST", path: "/api/v1/bids", description: "Submit bid", auth: "API Key + HMAC", rateLimit: "100/hr" },
  { method: "GET", path: "/api/v1/audit/verify/:event_id", description: "Verify blockchain anchor", auth: "API Key", rateLimit: "500/hr" },
  { method: "POST", path: "/graphql", description: "GraphQL endpoint", auth: "API Key", rateLimit: "500/hr" },
];

const WEBHOOKS = [
  { event: "tender.published", description: "Fired when a tender is published", example: '{ "event": "tender.published", "tender_id": "TND-2026-0089", "timestamp": "..." }' },
  { event: "bid.received", description: "Fired when a bid is submitted", example: '{ "event": "bid.received", "tender_id": "...", "vendor_id": "...", "timestamp": "..." }' },
  { event: "award.issued", description: "Fired when award decision is made", example: '{ "event": "award.issued", "tender_id": "...", "vendor_id": "...", "contract_id": "..." }' },
  { event: "milestone.completed", description: "Contract milestone completed", example: '{ "event": "milestone.completed", "contract_id": "...", "milestone_no": 3 }' },
  { event: "payment.disbursed", description: "Payment certificate approved", example: '{ "event": "payment.disbursed", "contract_id": "...", "amount": 1234567, "currency": "BDT" }' },
];

const ERP_INTEGRATIONS = [
  { name: "SAP S/4HANA", protocol: "OData + RFC", status: "available", docs: true },
  { name: "Oracle ERP Cloud", protocol: "REST API", status: "available", docs: true },
  { name: "Microsoft Dynamics 365", protocol: "Power Automate", status: "available", docs: true },
  { name: "QuickBooks Online", protocol: "REST API", status: "beta", docs: true },
  { name: "Tally Prime", protocol: "XML Gateway", status: "planned", docs: false },
];

const RATE_LIMITS = [
  { tier: "Free / Trial", requests: "100/hr", burst: "10/sec", webhooks: 2, sandbox: true },
  { tier: "Silver", requests: "1,000/hr", burst: "50/sec", webhooks: 10, sandbox: true },
  { tier: "Gold", requests: "5,000/hr", burst: "100/sec", webhooks: 50, sandbox: true },
  { tier: "Platinum", requests: "10,000/hr", burst: "200/sec", webhooks: "Unlimited", sandbox: true },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PUT: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function DeveloperPortal() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const { data: apiKeys } = useApiOrMock(
    () => developersApi.listApiKeys(),
    API_KEYS,
  );

  const { data: apiWebhooks } = useApiOrMock(
    () => developersApi.listWebhooks(),
    [],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Developer Portal"
        description="REST API, GraphQL, Webhooks, and ERP integration documentation — OpenAPI 3.0 compliant"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Book className="size-4 mr-1.5" />API Docs</Button>
            <Button size="sm"><Plus className="size-4 mr-1.5" />Generate API Key</Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active API Keys", value: apiKeys.filter(k => k.status === "active").length.toString(), icon: Key, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Requests (24h)", value: apiKeys.reduce((s, k) => s + k.requests24h, 0).toLocaleString(), icon: Zap, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "API Endpoints", value: ENDPOINTS.length.toString(), icon: Code, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Webhook Events", value: apiWebhooks.length.toString(), icon: Webhook, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
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

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">ERP Integrations</TabsTrigger>
          <TabsTrigger value="limits">Rate Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Keys</CardTitle>
                <Button size="sm"><Plus className="size-4 mr-1.5" />Create Key</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys.map(k => (
                  <div key={k.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="size-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{k.name}</span>
                        <Badge variant={k.env === "live" ? "default" : "secondary"}>{k.env}</Badge>
                        <Badge variant={k.status === "active" ? "outline" : "secondary"}>{k.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowKeys(prev => ({ ...prev, [k.id]: !prev[k.id] }))}>
                          {showKeys[k.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                        <Button variant="ghost" size="sm"><Copy className="size-4" /></Button>
                        <Button variant="ghost" size="sm"><RefreshCw className="size-4" /></Button>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
                      {showKeys[k.id] ? k.id : k.id.substring(0, 12) + "••••••••••••"}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {k.created}</span>
                      <span>Last used: {k.lastUsed}</span>
                      <span>Requests (24h): {k.requests24h.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader><CardTitle>API Endpoints (REST)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead>Rate Limit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ENDPOINTS.map(e => (
                    <TableRow key={e.path + e.method}>
                      <TableCell><span className={`px-2 py-1 rounded text-xs font-mono font-medium ${methodColors[e.method]}`}>{e.method}</span></TableCell>
                      <TableCell className="font-mono text-sm">{e.path}</TableCell>
                      <TableCell className="text-sm">{e.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.auth}</TableCell>
                      <TableCell className="text-sm">{e.rateLimit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Webhook className="size-5" />Webhook Events</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiWebhooks.map(w => (
                  <div key={w.event} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">{w.event}</Badge>
                      <span className="text-sm text-muted-foreground">{w.description}</span>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      <code className="text-foreground">{w.example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader><CardTitle>ERP & System Integrations</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documentation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ERP_INTEGRATIONS.map(e => (
                    <TableRow key={e.name}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.protocol}</TableCell>
                      <TableCell>
                        <Badge variant={e.status === "available" ? "default" : e.status === "beta" ? "secondary" : "outline"}>
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {e.docs ? <CheckCircle className="size-4 text-green-500" /> : <Clock className="size-4 text-muted-foreground" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader><CardTitle>Rate Limits by Subscription Tier</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Requests/Hour</TableHead>
                    <TableHead>Burst Rate</TableHead>
                    <TableHead>Webhooks</TableHead>
                    <TableHead>Sandbox</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RATE_LIMITS.map(r => (
                    <TableRow key={r.tier}>
                      <TableCell className="font-medium">{r.tier}</TableCell>
                      <TableCell>{r.requests}</TableCell>
                      <TableCell>{r.burst}</TableCell>
                      <TableCell>{r.webhooks}</TableCell>
                      <TableCell>{r.sandbox ? <CheckCircle className="size-4 text-green-500" /> : <span className="text-muted-foreground">—</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}