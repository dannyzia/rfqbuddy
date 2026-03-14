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
  Activity, AlertTriangle, Shield, Search, Eye, TrendingUp,
  TrendingDown, Building2, Globe, DollarSign, Lock, Leaf, RefreshCw, Download
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { riskApi } from "../../lib/api/risk.api";

const RISK_TIERS = [
  { tier: "Green", range: "0-30", count: 245, color: "bg-green-500", textColor: "text-green-600 dark:text-green-400", desc: "Preferred — no action" },
  { tier: "Yellow", range: "31-60", count: 112, color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400", desc: "Enhanced monitoring" },
  { tier: "Orange", range: "61-80", count: 48, color: "bg-orange-500", textColor: "text-orange-600 dark:text-orange-400", desc: "Require mitigation plan" },
  { tier: "Red", range: "81-100", count: 18, color: "bg-red-500", textColor: "text-red-600 dark:text-red-400", desc: "Suspend new awards" },
];

const VENDORS_AT_RISK = [
  { id: "VND-004", name: "Global Tech Solutions", overall: 82, financial: 75, operational: 85, compliance: 90, geopolitical: 70, cyber: 65, esg: 50, tier: "Red", trend: "up", lastUpdate: "2026-03-10", mitigations: 2 },
  { id: "VND-015", name: "Meridian Trading Co", overall: 78, financial: 80, operational: 72, compliance: 85, geopolitical: 90, cyber: 60, esg: 40, tier: "Orange", trend: "up", lastUpdate: "2026-03-09", mitigations: 1 },
  { id: "VND-012", name: "StarBuild Corp", overall: 72, financial: 68, operational: 78, compliance: 65, geopolitical: 55, cyber: 80, esg: 60, tier: "Orange", trend: "stable", lastUpdate: "2026-03-08", mitigations: 1 },
  { id: "VND-018", name: "QuickSupply BD", overall: 65, financial: 60, operational: 70, compliance: 55, geopolitical: 30, cyber: 45, esg: 85, tier: "Orange", trend: "down", lastUpdate: "2026-03-07", mitigations: 0 },
  { id: "VND-022", name: "NovaBuild Intl", overall: 58, financial: 50, operational: 45, compliance: 60, geopolitical: 80, cyber: 55, esg: 40, tier: "Yellow", trend: "up", lastUpdate: "2026-03-06", mitigations: 0 },
  { id: "VND-003", name: "Delta Supplies LLC", overall: 42, financial: 35, operational: 50, compliance: 40, geopolitical: 25, cyber: 55, esg: 30, tier: "Yellow", trend: "stable", lastUpdate: "2026-03-05", mitigations: 0 },
];

const RECENT_EVENTS = [
  { vendor: "Global Tech Solutions", dimension: "Compliance", severity: "critical", description: "Sanctions screening alert — PEP match on UBO", date: "2026-03-10" },
  { vendor: "Meridian Trading", dimension: "Geopolitical", severity: "high", description: "UBO citizenship in FATF grey-listed country", date: "2026-03-09" },
  { vendor: "StarBuild Corp", dimension: "Cyber", severity: "medium", description: "Vendor website SSL certificate expired", date: "2026-03-08" },
  { vendor: "QuickSupply BD", dimension: "ESG", severity: "medium", description: "Environmental violation reported in local news", date: "2026-03-07" },
  { vendor: "Global Tech Solutions", dimension: "Financial", severity: "high", description: "Unusual payment pattern detected — 3 large invoices in 48h", date: "2026-03-06" },
];

const DIMENSIONS = [
  { name: "Financial", weight: "25%", icon: DollarSign, color: "text-green-600 dark:text-green-400" },
  { name: "Operational", weight: "25%", icon: Activity, color: "text-blue-600 dark:text-blue-400" },
  { name: "Compliance", weight: "20%", icon: Shield, color: "text-purple-600 dark:text-purple-400" },
  { name: "Geopolitical", weight: "15%", icon: Globe, color: "text-amber-600 dark:text-amber-400" },
  { name: "Cyber", weight: "10%", icon: Lock, color: "text-red-600 dark:text-red-400" },
  { name: "ESG", weight: "5%", icon: Leaf, color: "text-teal-600 dark:text-teal-400" },
];

function getTierColor(tier: string) {
  return tier === "Red" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
    tier === "Orange" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
    tier === "Yellow" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
}

export function RiskDashboard() {
  const [search, setSearch] = useState("");

  const { data: apiDashboard } = useApiOrMock(
    () => riskApi.getDashboard(),
    { total_vendors: 423, distribution: [] },
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Risk Command Center"
        description="Dynamic vendor risk assessment across 6 dimensions — Real-time monitoring with automated alerts"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button>
            <Button size="sm"><RefreshCw className="size-4 mr-1.5" />Recalculate All</Button>
          </div>
        }
      />

      {/* Risk Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {RISK_TIERS.map(t => (
          <Card key={t.tier}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${t.color}`} />
                  <span className="font-medium text-foreground">{t.tier}</span>
                  <span className="text-xs text-muted-foreground">({t.range})</span>
                </div>
                <span className={`text-2xl font-bold ${t.textColor}`}>{t.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
              <Progress value={(t.count / 423) * 100} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dimensions Overview */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Risk Dimensions & Weights</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {DIMENSIONS.map(d => (
              <div key={d.name} className="text-center p-3 rounded-lg bg-muted">
                <d.icon className={`size-6 mx-auto ${d.color}`} />
                <p className="font-medium text-sm text-foreground mt-2">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.weight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">High-Risk Vendors</TabsTrigger>
          <TabsTrigger value="events">Recent Risk Events</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendors Requiring Attention (Score &gt; 40)</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 w-56" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-center">Overall</TableHead>
                    <TableHead className="text-center">Financial</TableHead>
                    <TableHead className="text-center">Operational</TableHead>
                    <TableHead className="text-center">Compliance</TableHead>
                    <TableHead className="text-center">Geopolitical</TableHead>
                    <TableHead className="text-center">Cyber</TableHead>
                    <TableHead className="text-center">ESG</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {VENDORS_AT_RISK.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).map(v => (
                    <TableRow key={v.id} className={v.tier === "Red" ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                      <TableCell>
                        <Link to={`/vendors/${v.id}/risk`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">{v.name}</Link>
                        <p className="text-xs text-muted-foreground">{v.id} • Updated {v.lastUpdate}</p>
                      </TableCell>
                      <TableCell className="text-center font-bold">{v.overall}</TableCell>
                      {[v.financial, v.operational, v.compliance, v.geopolitical, v.cyber, v.esg].map((score, i) => (
                        <TableCell key={i} className="text-center">
                          <span className={score > 80 ? "text-red-600 dark:text-red-400 font-medium" : score > 60 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}>{score}</span>
                        </TableCell>
                      ))}
                      <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(v.tier)}`}>{v.tier}</span></TableCell>
                      <TableCell>
                        {v.trend === "up" ? <TrendingUp className="size-4 text-red-500" /> : v.trend === "down" ? <TrendingDown className="size-4 text-green-500" /> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/vendors/${v.id}/risk`}><Button variant="ghost" size="sm"><Eye className="size-4" /></Button></Link>
                          {v.mitigations > 0 && <Badge variant="outline" className="text-xs">{v.mitigations} mitigations</Badge>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader><CardTitle>Recent Risk Events</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_EVENTS.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <AlertTriangle className={`size-4 mt-0.5 shrink-0 ${
                      e.severity === "critical" ? "text-red-500" : e.severity === "high" ? "text-orange-500" : "text-amber-500"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{e.vendor}</p>
                        <Badge variant="outline" className="text-xs">{e.dimension}</Badge>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          e.severity === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                          e.severity === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>{e.severity}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{e.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
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