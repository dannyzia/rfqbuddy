import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { Download } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_SPEND_DATA = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 52000 },
  { month: "Mar", amount: 48000 },
  { month: "Apr", amount: 61000 },
  { month: "May", amount: 55000 },
  { month: "Jun", amount: 67000 },
];

const MOCK_CATEGORY_DATA = [
  { name: "Goods", value: 45, fill: "#3b82f6" },
  { name: "Works", value: 30, fill: "#8b5cf6" },
  { name: "Services", value: 25, fill: "#10b981" },
];

const MOCK_STATS = {
  totalSpend: "$328,000",
  spendChange: "↑ 12% vs last year",
  successRate: "94%",
  successChange: "↑ 3% improvement",
  avgProcessingTime: "18 days",
  processingChange: "↓ 2 days slower",
};

export function ProcurementAnalytics() {
  const { data: spendData } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getMonthlySpend(6);
      return result.map((r: any) => ({
        month: r.month ?? "",
        amount: Number(r.spend ?? 0),
      }));
    },
    MOCK_SPEND_DATA,
  );

  const { data: categoryData } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getSpendByCategory();
      const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
      return result.map((r: any, i: number) => ({
        name: r.category ?? r.name ?? "—",
        value: Number(r.percentage ?? r.percent ?? 0),
        fill: COLORS[i % COLORS.length],
      }));
    },
    MOCK_CATEGORY_DATA,
  );

  const { data: stats } = useApiOrMock(
    async () => {
      const result = await analyticsApi.getProcurementStats();
      return {
        totalSpend: `$${Number((result as any).total_spend ?? 0).toLocaleString()}`,
        spendChange: (result as any).spend_change ?? "—",
        successRate: `${(result as any).success_rate ?? 0}%`,
        successChange: (result as any).success_change ?? "—",
        avgProcessingTime: `${(result as any).avg_processing_days ?? 0} days`,
        processingChange: (result as any).processing_change ?? "—",
      };
    },
    MOCK_STATS,
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Procurement Analytics"
        description="Visualize procurement metrics and trends"
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Spend (YTD)</div>
            <div className="text-3xl font-bold mt-1">{stats.totalSpend}</div>
            <div className="text-xs text-green-600 mt-1">{stats.spendChange}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Tender Success Rate</div>
            <div className="text-3xl font-bold mt-1">{stats.successRate}</div>
            <div className="text-xs text-green-600 mt-1">{stats.successChange}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Avg. Processing Time</div>
            <div className="text-3xl font-bold mt-1">{stats.avgProcessingTime}</div>
            <div className="text-xs text-red-600 mt-1">{stats.processingChange}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend Trend</CardTitle>
            <CardDescription>Total procurement spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution across procurement types</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(val: number) => `${val}%`} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry) => (
                    <Cell key={`bar-${entry.name}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}