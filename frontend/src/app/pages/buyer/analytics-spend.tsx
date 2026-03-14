import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_SPEND_DATA = [
  { name: "Civil Works", spend: 52000000, percent: 26, tenders: 14, topVendor: "ABC Builders", yoyChange: 12 },
  { name: "IT Equipment", spend: 38000000, percent: 19, tenders: 22, topVendor: "TechWorld BD", yoyChange: 28 },
  { name: "Office Supplies", spend: 28000000, percent: 14, tenders: 35, topVendor: "Supply House", yoyChange: -5 },
  { name: "Consulting", spend: 24000000, percent: 12, tenders: 8, topVendor: "ProConsult Ltd", yoyChange: 15 },
  { name: "Medical", spend: 20000000, percent: 10, tenders: 12, topVendor: "MediCare BD", yoyChange: 8 },
  { name: "Vehicles", spend: 16000000, percent: 8, tenders: 5, topVendor: "AutoMart BD", yoyChange: -12 },
  { name: "Security", spend: 12000000, percent: 6, tenders: 7, topVendor: "SecureGuard", yoyChange: 3 },
  { name: "Other", spend: 10000000, percent: 5, tenders: 18, topVendor: "Various", yoyChange: 0 },
];

export function SpendByCategoryReport() {
  const [period, setPeriod] = useState("fy2025-26");

  const { data: spendData } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getSpendByCategory();
      return result.map((r: any) => ({
        name: r.category ?? r.name ?? "—",
        spend: Number(r.total_spend ?? r.spend ?? 0),
        percent: Number(r.percentage ?? r.percent ?? 0),
        tenders: Number(r.tender_count ?? r.tenders ?? 0),
        topVendor: r.top_vendor ?? "—",
        yoyChange: Number(r.yoy_change ?? 0),
      }));
    },
    MOCK_SPEND_DATA,
    [period],
  );

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#6b7280"];
  const totalSpend = spendData.reduce((sum, d) => sum + d.spend, 0);
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lac`;
    return new Intl.NumberFormat("en-BD").format(amount);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeader
        title="Spend Analytics - By Category"
        description={`Period: FY 2025-26 | Total Spend: BDT ${formatCurrency(totalSpend)}`}
        backTo="/analytics"
        backLabel="Back to Analytics"
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fy2025-26">FY 2025-26</SelectItem>
                <SelectItem value="fy2024-25">FY 2024-25</SelectItem>
                <SelectItem value="fy2023-24">FY 2023-24</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> CSV</Button>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> PDF</Button>
          </div>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Total Spend</p>
            <p className="text-2xl font-bold text-foreground">BDT {formatCurrency(totalSpend)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-foreground">{spendData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Total Tenders</p>
            <p className="text-2xl font-bold text-foreground">{spendData.reduce((s, d) => s + d.tenders, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Largest Category</p>
            <p className="text-2xl font-bold text-foreground">{spendData[0].name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Spend Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={spendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`BDT ${formatCurrency(value)}`, "Spend"]} />
              <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
                {spendData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="md:hidden flex flex-col gap-3 p-4">
            {spendData.map((row, i) => (
              <Card key={row.name} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-foreground">{row.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(row.spend)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">% Total:</span>
                      <div className="font-medium">{row.percent}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tenders:</span>
                      <div className="font-medium">{row.tenders}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pt-2 border-t mt-1">
                    <div className="truncate text-muted-foreground">
                      Top: {row.topVendor}
                    </div>
                    <span className={`inline-flex items-center gap-1 ${row.yoyChange > 0 ? "text-red-600 dark:text-red-400" : row.yoyChange < 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {row.yoyChange > 0 ? <TrendingUp className="size-3.5" /> : row.yoyChange < 0 ? <TrendingDown className="size-3.5" /> : null}
                      {row.yoyChange > 0 ? "+" : ""}{row.yoyChange}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Spend (BDT)</TableHead>
                <TableHead className="text-right">% Total</TableHead>
                <TableHead>Top Vendor</TableHead>
                <TableHead className="text-right"># Tenders</TableHead>
                <TableHead className="text-right">YoY Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendData.map((row, i) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-foreground">{row.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(row.spend)}</TableCell>
                  <TableCell className="text-right">{row.percent}%</TableCell>
                  <TableCell className="text-muted-foreground">{row.topVendor}</TableCell>
                  <TableCell className="text-right">{row.tenders}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-1 ${row.yoyChange > 0 ? "text-red-600 dark:text-red-400" : row.yoyChange < 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {row.yoyChange > 0 ? <TrendingUp className="size-3.5" /> : row.yoyChange < 0 ? <TrendingDown className="size-3.5" /> : null}
                      {row.yoyChange > 0 ? "+" : ""}{row.yoyChange}%
                    </span>
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