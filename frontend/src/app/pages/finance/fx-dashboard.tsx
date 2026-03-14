import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Coins, TrendingUp, TrendingDown, DollarSign, RefreshCw,
  Lock, Globe, Clock, AlertTriangle, ArrowRight, Download, Shield
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { financeApi } from "../../lib/api/finance.api";

const FX_RATES = [
  { pair: "USD/BDT", rate: 119.85, prevRate: 119.50, change: 0.29, source: "Bangladesh Bank", lastUpdated: "2026-03-12 10:00", status: "normal" },
  { pair: "EUR/BDT", rate: 130.42, prevRate: 131.10, change: -0.52, source: "ECB via BB", lastUpdated: "2026-03-12 10:00", status: "normal" },
  { pair: "GBP/BDT", rate: 152.18, prevRate: 151.85, change: 0.22, source: "BoE via BB", lastUpdated: "2026-03-12 10:00", status: "normal" },
  { pair: "JPY/BDT", rate: 0.80, prevRate: 0.81, change: -1.23, source: "BOJ via BB", lastUpdated: "2026-03-12 10:00", status: "alert" },
];

const LOCKED_RATES = [
  { id: "FXL-001", tender: "TND-2026-0089", vendor: "Global Tech Solutions", currency: "USD", lockedRate: 119.20, currentRate: 119.85, lockedAt: "2026-02-15", expiresAt: "2026-05-15", savings: 32500, status: "active" },
  { id: "FXL-002", tender: "TND-2026-0092", vendor: "Meridian Trading", currency: "EUR", lockedRate: 129.80, currentRate: 130.42, lockedAt: "2026-02-20", expiresAt: "2026-05-20", savings: 18600, status: "active" },
  { id: "FXL-003", tender: "TND-2026-0076", vendor: "NovaBuild Intl", currency: "USD", lockedRate: 118.90, currentRate: 119.85, lockedAt: "2026-01-10", expiresAt: "2026-04-10", savings: 47500, status: "expiring_soon" },
  { id: "FXL-004", tender: "TND-2026-0065", vendor: "Pacific Supplies", currency: "GBP", lockedRate: 151.00, currentRate: 152.18, lockedAt: "2025-12-15", expiresAt: "2026-03-15", savings: 23600, status: "expired" },
];

const HEDGING_POSITIONS = [
  { id: "HDG-001", type: "Forward Contract", currency: "USD", amount: 500000, rate: 120.00, bankPartner: "Standard Chartered BD", maturity: "2026-06-15", status: "active" },
  { id: "HDG-002", type: "Forward Contract", currency: "EUR", amount: 200000, rate: 131.00, bankPartner: "HSBC BD", maturity: "2026-05-30", status: "active" },
  { id: "HDG-003", type: "Natural Hedge", currency: "USD", amount: 150000, rate: null, bankPartner: "N/A (Receivables)", maturity: "2026-04-30", status: "active" },
];

export function FXDashboard() {
  const { data: apiFxRates } = useApiOrMock(
    () => financeApi.getFxRates(),
    { base: "USD", timestamp: new Date().toISOString(), rates: {} },
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Multi-Currency & FX Dashboard"
        description="Foreign exchange rates, rate locking, and hedging management — BDT as base currency"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export</Button>
            <Button size="sm"><RefreshCw className="size-4 mr-1.5" />Refresh Rates</Button>
          </div>
        }
      />

      {/* Live Rates */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {FX_RATES.map(r => (
          <Card key={r.pair} className={r.status === "alert" ? "ring-2 ring-amber-300 dark:ring-amber-600" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{r.pair}</span>
                {r.change > 0 ? <TrendingUp className="size-4 text-green-500" /> : <TrendingDown className="size-4 text-red-500" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{r.rate.toFixed(2)}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-sm font-medium ${r.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {r.change > 0 ? "+" : ""}{r.change.toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground">{r.source}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{r.lastUpdated}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="locked" className="space-y-4">
        <TabsList>
          <TabsTrigger value="locked">Rate Locks</TabsTrigger>
          <TabsTrigger value="hedging">Hedging Positions</TabsTrigger>
          <TabsTrigger value="policy">FX Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="locked">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Lock className="size-5" />Locked Exchange Rates</CardTitle>
                <Button size="sm"><Lock className="size-4 mr-1.5" />New Rate Lock</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lock ID</TableHead>
                    <TableHead>Tender</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Locked Rate</TableHead>
                    <TableHead className="text-right">Current Rate</TableHead>
                    <TableHead className="text-right">Savings (BDT)</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LOCKED_RATES.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono text-sm">{l.id}</TableCell>
                      <TableCell className="font-mono text-sm">{l.tender}</TableCell>
                      <TableCell>{l.vendor}</TableCell>
                      <TableCell><Badge variant="outline">{l.currency}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{l.lockedRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{l.currentRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium text-green-600 dark:text-green-400">+{l.savings.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{l.expiresAt}</TableCell>
                      <TableCell>
                        <Badge variant={l.status === "active" ? "default" : l.status === "expiring_soon" ? "secondary" : "outline"}>
                          {l.status === "active" ? "Active" : l.status === "expiring_soon" ? "Expiring Soon" : "Expired"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hedging">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Hedging Positions</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead>Bank Partner</TableHead>
                    <TableHead>Maturity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HEDGING_POSITIONS.map(h => (
                    <TableRow key={h.id}>
                      <TableCell className="font-mono text-sm">{h.id}</TableCell>
                      <TableCell>{h.type}</TableCell>
                      <TableCell><Badge variant="outline">{h.currency}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{h.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{h.rate ? h.rate.toFixed(2) : "N/A"}</TableCell>
                      <TableCell className="text-sm">{h.bankPartner}</TableCell>
                      <TableCell className="text-sm">{h.maturity}</TableCell>
                      <TableCell><Badge variant="default">{h.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy">
          <Card>
            <CardHeader><CardTitle>FX Policy & Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Base Currency", value: "BDT (Bangladeshi Taka)", note: "All comparisons normalized to BDT" },
                  { label: "Supported Currencies", value: "BDT, USD, EUR, GBP, JPY", note: "Additional currencies available on request" },
                  { label: "Rate Source — BDT", value: "Bangladesh Bank mid-rate (daily)", note: "Updated at 10:00 AM BST" },
                  { label: "Rate Source — USD/EUR/GBP/JPY", value: "BB selling rate +1% / ECB / BoE / BOJ", note: "Cross-rates via BB" },
                  { label: "Rate Lock Period", value: "90 days from bid submission", note: "Reduces vendor contingency pricing" },
                  { label: "Dual Bidding", value: "Enabled — vendors quote in BDT or USD", note: "System auto-calculates BDT equivalent" },
                  { label: "Hedging Authority", value: "Procurement Head for <BDT 50 Lac, CFO for higher", note: "Forward contracts via partner banks" },
                  { label: "Variance Alert", value: ">2% daily movement triggers notification", note: "Sent to Finance Controller & Proc Head" },
                ].map(p => (
                  <div key={p.label} className="p-3 rounded-lg border border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{p.label}</p>
                        <p className="text-sm text-foreground mt-0.5">{p.value}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.note}</p>
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