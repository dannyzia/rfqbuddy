import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, Building2, FileText, Settings, TrendingUp, AlertCircle, ScrollText, FileStack, Activity } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_ADMIN_STATS = {
  total_buyers: 156,
  total_vendors: 423,
  active_rfqs: 48,
  pending_approvals: 23,
};

const MOCK_RECENT_ACTIVITIES = [
  { type: "purchaser", action: "New purchaser registration", detail: "Tech Solutions Inc.", time: "2 hours ago" },
  { type: "vendor", action: "Vendor approval pending", detail: "ABC Construction Ltd.", time: "4 hours ago" },
  { type: "rfq", action: "New RFQ published", detail: "IT Equipment Procurement", time: "6 hours ago" },
  { type: "purchaser", action: "Purchaser profile updated", detail: "Finance Corp", time: "2 days ago" },
];

export function AdminDashboard() {
  const { data: apiStats } = useApiOrMock(
    () => analyticsApi.getAdminStats(),
    MOCK_ADMIN_STATS,
  );

  const stats = [
    { label: "Total Buyers", value: String(apiStats.total_buyers ?? 156), icon: Building2, change: "+12%", trend: "up" },
    { label: "Total Vendors", value: String(apiStats.total_vendors ?? 423), icon: Users, change: "+8%", trend: "up" },
    { label: "Active RFQs", value: String(apiStats.active_rfqs ?? 48), icon: FileText, change: "-3%", trend: "down" },
    { label: "Pending Approvals", value: String(apiStats.pending_approvals ?? 23), icon: AlertCircle, change: "+5", trend: "neutral" },
  ];

  const recentActivities = MOCK_RECENT_ACTIVITIES;

  const quickLinks = [
    { title: "Purchaser Approvals", path: "/admin/buyers", icon: Building2, count: 8 },
    { title: "Vendor Approvals", path: "/admin/vendors", icon: Users, count: 15 },
    { title: "Email Templates", path: "/admin/email-templates", icon: FileText, count: null },
    { title: "Platform Settings", path: "/admin/settings", icon: Settings, count: null },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Super Admin Dashboard"
        description="Platform-wide administration and management"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-3xl font-bold mt-1">{stat.value}</div>
                  <div className={`text-xs mt-1 ${
                    stat.trend === "up" ? "text-green-600" : 
                    stat.trend === "down" ? "text-red-600" : "text-muted-foreground"
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <stat.icon className="size-10 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <link.icon className="size-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{link.title}</h3>
                      {link.count !== null && (
                        <p className="text-sm text-orange-600">{link.count} pending</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Audit & Activity Logs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Audit & Activity Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/audit-logs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <ScrollText className="size-8 text-purple-600 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">System Audit Logs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete audit trail of all platform activities
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">All users & actions</span>
                      <Button variant="ghost" size="sm">View →</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/purchaser-logs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Building2 className="size-8 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Purchaser Activity Logs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      All purchaser organization activities
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">6 organizations</span>
                      <Button variant="ghost" size="sm">View →</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/vendor-logs">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Users className="size-8 text-green-600 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Vendor Activity Logs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      All vendor activities across the platform
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">10+ vendors</span>
                      <Button variant="ghost" size="sm">View →</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className={`size-2 rounded-full mt-2 ${
                    activity.type === "purchaser" ? "bg-blue-500" :
                    activity.type === "vendor" ? "bg-green-500" : "bg-purple-500"
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">{activity.detail}</div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Platform Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users (24h)</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="font-semibold text-green-600">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="font-semibold">64%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Performance</span>
                <span className="font-semibold text-green-600">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}