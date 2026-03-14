import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, AlertTriangle, Shield, TrendingUp, Building2 } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDOR_DATA = [
    { name: "ABC Builders Ltd", value: 52000000, percent: 26, contracts: 8, category: "Civil Works", risk: "high" },
    { name: "TechWorld BD", value: 38000000, percent: 19, contracts: 12, category: "IT Equipment", risk: "medium" },
    { name: "Supply House Ltd", value: 28000000, percent: 14, contracts: 18, category: "Office Supplies", risk: "low" },
    { name: "ProConsult Ltd", value: 24000000, percent: 12, contracts: 5, category: "Consulting", risk: "low" },
    { name: "MediCare BD", value: 20000000, percent: 10, contracts: 7, category: "Medical", risk: "low" },
    { name: "AutoMart BD", value: 16000000, percent: 8, contracts: 3, category: "Vehicles", risk: "low" },
    { name: "SecureGuard Ltd", value: 12000000, percent: 6, contracts: 4, category: "Security", risk: "low" },
    { name: "GreenBuild Corp", value: 5000000, percent: 2.5, contracts: 2, category: "Civil Works", risk: "low" },
    { name: "DataSys Inc", value: 3000000, percent: 1.5, contracts: 3, category: "IT Equipment", risk: "low" },
    { name: "QuickServe BD", value: 2000000, percent: 1, contracts: 2, category: "Services", risk: "low" },
  ];

export function SupplierConcentrationDashboard() {
  const { data: vendorData } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getVendorConcentration();
      return result.map((r: any) => ({
        name: r.vendor_name ?? "—",
        value: Number(r.total_value ?? 0),
        percent: Number(r.percentage ?? 0),
        contracts: Number(r.contract_count ?? 0),
        category: r.category ?? "—",
        risk: Number(r.percentage ?? 0) > 20 ? "high" : Number(r.percentage ?? 0) > 15 ? "medium" : "low",
      }));
    },
    MOCK_VENDOR_DATA,
  );

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#06b6d4", "#ec4899", "#6b7280", "#84cc16", "#14b8a6"];
  const totalValue = vendorData.reduce((sum, d) => sum + d.value, 0);
  const topVendorPercent = vendorData[0].percent;
  const top3Percent = vendorData.slice(0, 3).reduce((s, d) => s + d.percent, 0);
  const highRiskCount = vendorData.filter((v) => v.risk === "high").length;
  const mediumRiskCount = vendorData.filter((v) => v.risk === "medium").length;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lac`;
    return new Intl.NumberFormat("en-BD").format(amount);
  };

  const riskColors: Record<string, string> = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen">
      <PageHeader
        title="Supplier Concentration Dashboard"
        description="Monitor vendor dependency risk across procurement spend"
        backTo="/analytics"
        backLabel="Back to Analytics"
        actions={
          <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> Export Report</Button>
        }
      />

      {/* Risk Alerts */}
      {topVendorPercent > 25 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">High Concentration Risk Detected</p>
            <p className="text-sm text-red-700 dark:text-red-400">
              {vendorData[0].name} accounts for {topVendorPercent}% of total procurement spend. 
              Top 3 vendors represent {top3Percent}% of spend. Consider diversifying supplier base.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Total Vendors</p>
            <p className="text-2xl font-bold text-foreground">{vendorData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Top Vendor Share</p>
            <p className={`text-2xl font-bold ${topVendorPercent > 25 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{topVendorPercent}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">High Risk Vendors</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highRiskCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Medium Risk</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{mediumRiskCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Top 10 Vendors by Spend</CardTitle>
          <CardDescription>Vendors exceeding 40% share trigger dependency warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={vendorData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} domain={[0, 30]} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
              <Bar dataKey="percent" radius={[0, 4, 4, 0]}>
                {vendorData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.risk === "high" ? "#ef4444" : entry.risk === "medium" ? "#f59e0b" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vendor Concentration Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="md:hidden flex flex-col gap-3 p-4">
            {vendorData.map((v, i) => (
              <Card key={v.name} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm font-mono w-4">{i + 1}.</span>
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground line-clamp-1">{v.name}</span>
                    </div>
                    <Badge className={riskColors[v.risk]}>
                      {v.risk === "high" && <AlertTriangle className="size-3 mr-1" />}
                      {v.risk.charAt(0).toUpperCase() + v.risk.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs">Spend</span>
                      <div className="font-medium">{formatCurrency(v.value)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Category</span>
                      <div className="font-medium text-foreground">{v.category}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t mt-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-muted-foreground">Share ({v.percent}%)</span>
                      <span className="text-xs text-muted-foreground">{v.contracts} Contracts</span>
                    </div>
                    <Progress value={v.percent} className="h-1.5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Spend (BDT)</TableHead>
                <TableHead>Share</TableHead>
                <TableHead className="text-right">Contracts</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorData.map((v, i) => (
                <TableRow key={v.name}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{v.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{v.category}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(v.value)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={v.percent} className="w-16 h-2" />
                      <span className="text-sm">{v.percent}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{v.contracts}</TableCell>
                  <TableCell>
                    <Badge className={riskColors[v.risk]}>
                      {v.risk === "high" && <AlertTriangle className="size-3 mr-1" />}
                      {v.risk.charAt(0).toUpperCase() + v.risk.slice(1)}
                    </Badge>
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