import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { FileText, Download, Clock } from "lucide-react";

export function ProcurementReports() {
  const recentReports = [
    { name: "Monthly Procurement Summary - Feb 2026", date: "Mar 1, 2026", format: "PDF", size: "2.4 MB" },
    { name: "Vendor Performance Report - Q1 2026", date: "Feb 28, 2026", format: "Excel", size: "1.8 MB" },
    { name: "Spend Analysis by Category", date: "Feb 15, 2026", format: "PDF", size: "3.1 MB" },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Procurement Reports"
        description="Generate and download standard procurement reports"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Select parameters and create a report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                  <SelectItem value="vendor">Vendor Performance</SelectItem>
                  <SelectItem value="spend">Spend Analysis</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                  <SelectItem value="audit">Audit Trail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              <FileText className="size-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report History</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-muted">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="size-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-sm">{report.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{report.date}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{report.format}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}