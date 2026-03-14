import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Star, Building2, Filter, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function VendorPerformanceAnalytics() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const vendors = [
    { name: "ABC Builders Ltd", category: "Civil Works", quality: 4.2, timeliness: 3.8, communication: 4.5, compliance: 4.0, overall: 4.13, winRate: 65, lateDelivery: 12, contracts: 8 },
    { name: "TechWorld BD", category: "IT Equipment", quality: 4.7, timeliness: 4.5, communication: 4.8, compliance: 4.6, overall: 4.65, winRate: 72, lateDelivery: 5, contracts: 12 },
    { name: "Supply House Ltd", category: "Office Supplies", quality: 3.8, timeliness: 4.2, communication: 3.5, compliance: 4.0, overall: 3.88, winRate: 58, lateDelivery: 8, contracts: 18 },
    { name: "ProConsult Ltd", category: "Consulting", quality: 4.5, timeliness: 4.0, communication: 4.3, compliance: 4.8, overall: 4.40, winRate: 45, lateDelivery: 3, contracts: 5 },
    { name: "MediCare BD", category: "Medical", quality: 4.0, timeliness: 3.5, communication: 4.0, compliance: 4.5, overall: 4.00, winRate: 55, lateDelivery: 15, contracts: 7 },
    { name: "AutoMart BD", category: "Vehicles", quality: 3.5, timeliness: 3.2, communication: 3.8, compliance: 3.5, overall: 3.50, winRate: 40, lateDelivery: 22, contracts: 3 },
    { name: "SecureGuard Ltd", category: "Security", quality: 4.3, timeliness: 4.4, communication: 4.6, compliance: 4.7, overall: 4.50, winRate: 68, lateDelivery: 2, contracts: 4 },
    { name: "GreenBuild Corp", category: "Civil Works", quality: 3.9, timeliness: 3.6, communication: 4.0, compliance: 3.8, overall: 3.83, winRate: 35, lateDelivery: 18, contracts: 2 },
  ];

  const chartData = vendors.map((v) => ({
    name: v.name.length > 12 ? v.name.slice(0, 12) + "..." : v.name,
    Quality: v.quality,
    Timeliness: v.timeliness,
    Communication: v.communication,
    Compliance: v.compliance,
  }));

  const filtered = categoryFilter === "all" ? vendors : vendors.filter((v) => v.category === categoryFilter);
  const categories = [...new Set(vendors.map((v) => v.category))];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600 dark:text-green-400";
    if (score >= 3.5) return "text-blue-600 dark:text-blue-400";
    if (score >= 2.5) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 4.5) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 3.5) return "bg-blue-100 dark:bg-blue-900/30";
    if (score >= 2.5) return "bg-orange-100 dark:bg-orange-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const renderScoreCell = (score: number) => (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${getScoreBg(score)}`}>
      <Star className={`size-3 fill-current ${getScoreColor(score)}`} />
      <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Vendor Performance Analytics"
        description="Aggregate performance scores, win rates, and delivery metrics"
        backTo="/analytics"
        backLabel="Back to Analytics"
        actions={
          <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> Export</Button>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Total Vendors Rated</p>
            <p className="text-2xl font-bold text-foreground">{vendors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Avg Overall Score</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {(vendors.reduce((s, v) => s + v.overall, 0) / vendors.length).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Avg Win Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(vendors.reduce((s, v) => s + v.winRate, 0) / vendors.length).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Avg Late Delivery</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(vendors.reduce((s, v) => s + v.lateDelivery, 0) / vendors.length).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Performance Scores by Vendor</CardTitle>
          <CardDescription>Comparison across quality, timeliness, communication, and compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Quality" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Timeliness" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Communication" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Compliance" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filter + Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Vendor Performance Details</CardTitle>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="size-4 mr-1.5" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="md:hidden flex flex-col gap-3 p-4">
            {filtered.sort((a, b) => b.overall - a.overall).map((v) => (
              <Card key={v.name} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground line-clamp-1">{v.name}</span>
                    </div>
                    <Badge variant="outline">{v.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Quality</span>
                      {renderScoreCell(v.quality)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Timely</span>
                      {renderScoreCell(v.timeliness)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Comms</span>
                      {renderScoreCell(v.communication)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Compl.</span>
                      {renderScoreCell(v.compliance)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t mt-1">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase">Overall</span>
                      <span className={`text-sm font-bold ${getScoreColor(v.overall)}`}>{v.overall.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase">Win Rate</span>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        {v.winRate >= 60 ? <TrendingUp className="size-3.5 text-green-500" /> : <TrendingDown className="size-3.5 text-orange-500" />}
                        {v.winRate}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground uppercase">Late</span>
                      <span className={`text-sm ${v.lateDelivery > 15 ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"}`}>
                        {v.lateDelivery > 15 && <AlertCircle className="size-3.5 inline mr-1" />}
                        {v.lateDelivery}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Quality</TableHead>
                <TableHead className="text-center">Timeliness</TableHead>
                <TableHead className="text-center">Comms</TableHead>
                <TableHead className="text-center">Compliance</TableHead>
                <TableHead className="text-center">Overall</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-right">Late %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.sort((a, b) => b.overall - a.overall).map((v) => (
                <TableRow key={v.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{v.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{v.category}</Badge></TableCell>
                  <TableCell className="text-center">{renderScoreCell(v.quality)}</TableCell>
                  <TableCell className="text-center">{renderScoreCell(v.timeliness)}</TableCell>
                  <TableCell className="text-center">{renderScoreCell(v.communication)}</TableCell>
                  <TableCell className="text-center">{renderScoreCell(v.compliance)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-bold ${getScoreColor(v.overall)}`}>{v.overall.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      {v.winRate >= 60 ? <TrendingUp className="size-3.5 text-green-500" /> : <TrendingDown className="size-3.5 text-orange-500" />}
                      {v.winRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={v.lateDelivery > 15 ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"}>
                      {v.lateDelivery > 15 && <AlertCircle className="size-3.5 inline mr-1" />}
                      {v.lateDelivery}%
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