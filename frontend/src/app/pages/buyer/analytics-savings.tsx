import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Download, TrendingDown, DollarSign, Award, Target } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_MONTHLY_SAVINGS = [
    { month: "Jul 25", estimated: 8500000, awarded: 7200000, savings: 1300000 },
    { month: "Aug 25", estimated: 12000000, awarded: 10500000, savings: 1500000 },
    { month: "Sep 25", estimated: 6500000, awarded: 5800000, savings: 700000 },
    { month: "Oct 25", estimated: 15000000, awarded: 12800000, savings: 2200000 },
    { month: "Nov 25", estimated: 9000000, awarded: 7900000, savings: 1100000 },
    { month: "Dec 25", estimated: 11000000, awarded: 9200000, savings: 1800000 },
    { month: "Jan 26", estimated: 7500000, awarded: 6300000, savings: 1200000 },
    { month: "Feb 26", estimated: 13500000, awarded: 11400000, savings: 2100000 },
    { month: "Mar 26", estimated: 10000000, awarded: 8700000, savings: 1300000 },
  ];

const MOCK_TENDER_SAVINGS = [
  { id: "TND-089", title: "Office Equipment & IT", type: "PG2", estimated: 15000000, awarded: 12450000, savings: 2550000, percent: 17 },
  { id: "TND-087", title: "Road Construction Phase 3", type: "PW3", estimated: 85000000, awarded: 78500000, savings: 6500000, percent: 7.6 },
  { id: "TND-085", title: "Medical Supplies Q1", type: "PG1", estimated: 8000000, awarded: 6800000, savings: 1200000, percent: 15 },
  { id: "TND-083", title: "Security Services FY26", type: "PPS2", estimated: 12000000, awarded: 10200000, savings: 1800000, percent: 15 },
  { id: "TND-081", title: "Building Renovation", type: "PW2", estimated: 25000000, awarded: 22000000, savings: 3000000, percent: 12 },
  { id: "TND-079", title: "Consulting - Audit Review", type: "PPS1", estimated: 5000000, awarded: 4500000, savings: 500000, percent: 10 },
];

export function SavingsTracker() {
  const { data: monthlySavings } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getMonthlySpend(9);
      return result.map((r: any) => ({
        month: r.month ?? "",
        estimated: Number(r.estimated ?? r.spend ?? 0),
        awarded: Number(r.awarded ?? Math.round((r.spend ?? 0) * 0.85)),
        savings: Number(r.savings ?? Math.round((r.spend ?? 0) * 0.15)),
      }));
    },
    MOCK_MONTHLY_SAVINGS,
  );

  const { data: tenderSavings } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getSavingsAnalysis();
      return result.map((r: any) => ({
        id: r.tender_number ?? r.id ?? "—",
        title: r.title ?? "—",
        type: r.tender_type ?? "—",
        estimated: Number(r.estimated ?? 0),
        awarded: Number(r.lowest_bid ?? r.awarded ?? 0),
        savings: Number(r.saving ?? 0),
        percent: Number(r.saving_pct ?? 0),
      }));
    },
    MOCK_TENDER_SAVINGS,
  );

  const totalEstimated = monthlySavings.reduce((s, d) => s + d.estimated, 0);
  const totalAwarded = monthlySavings.reduce((s, d) => s + d.awarded, 0);
  const totalSavings = totalEstimated - totalAwarded;
  const savingsPercent = ((totalSavings / totalEstimated) * 100).toFixed(1);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lac`;
    return new Intl.NumberFormat("en-BD").format(amount);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeader
        title="Savings Tracker"
        description="Estimated vs awarded price analysis across procurement"
        backTo="/analytics"
        backLabel="Back to Analytics"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> CSV</Button>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> PDF</Button>
          </div>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Total</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(totalEstimated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Awarded Total</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(totalAwarded)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingDown className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Savings</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">BDT {formatCurrency(totalSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <DollarSign className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Savings Rate</p>
                <p className="text-lg font-bold text-foreground">{savingsPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative Savings Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Estimated vs Awarded - Monthly Trend</CardTitle>
          <CardDescription>Cumulative savings across the fiscal year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlySavings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`BDT ${formatCurrency(value)}`]} />
              <Legend />
              <Bar dataKey="estimated" name="Estimated" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="awarded" name="Awarded" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Per-Tender Savings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Savings by Tender</CardTitle>
          <CardDescription>Individual tender estimated vs awarded price delta</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="md:hidden flex flex-col gap-3 p-4">
            {tenderSavings.map((t) => (
              <Card key={t.id} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{t.id}</span>
                      <span className="font-medium text-foreground line-clamp-1">{t.title}</span>
                    </div>
                    <Badge variant="outline">{t.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm bg-muted p-3 rounded-lg">
                    <div>
                      <span className="text-muted-foreground block text-xs">Estimated</span>
                      <div className="font-medium">{formatCurrency(t.estimated)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Awarded</span>
                      <div className="font-medium">{formatCurrency(t.awarded)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t mt-1">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Savings</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(t.savings)}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {t.percent}% Saved
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Estimated (BDT)</TableHead>
                <TableHead className="text-right">Awarded (BDT)</TableHead>
                <TableHead className="text-right">Savings (BDT)</TableHead>
                <TableHead className="text-right">% Saved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenderSavings.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-blue-600 dark:text-blue-400">{t.id}</TableCell>
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">{t.title}</TableCell>
                  <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                  <TableCell className="text-right">{formatCurrency(t.estimated)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(t.awarded)}</TableCell>
                  <TableCell className="text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(t.savings)}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t.percent}%</Badge>
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