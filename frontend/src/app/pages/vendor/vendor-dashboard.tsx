import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileStack, Clock, Award, TrendingUp, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDOR_STATS = {
  open_rfqs: 12,
  my_bids: 8,
  awards: 3,
  deadlines: 2,
};

export function VendorDashboard() {
  const { data: apiStats } = useApiOrMock(
    () => analyticsApi.getVendorDashboardStats(),
    MOCK_VENDOR_STATS,
  );

  const stats = [
    { label: "Open RFQs", value: String(apiStats.open_rfqs ?? 12), icon: FileStack },
    { label: "My Bids", value: String(apiStats.my_bids ?? 8), icon: TrendingUp },
    { label: "Awards", value: String(apiStats.awards ?? 3), icon: Award },
    { label: "Deadlines", value: String(apiStats.deadlines ?? 2), icon: Clock },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader title="Vendor Dashboard" description="Your procurement portal" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-3xl font-bold mt-1">{stat.value}</div>
                </div>
                <stat.icon className="size-10 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/rfqs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Available RFQs</h3>
              <p className="text-sm text-muted-foreground">Browse and bid on open tenders</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/vendor-bids">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">My Bids</h3>
              <p className="text-sm text-muted-foreground">Track your submitted bids</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/vendor-profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Update Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your company information</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/notifications">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">View important updates</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/vendor-dashboard/calendar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Deadlines Calendar</h3>
                  <p className="text-sm text-muted-foreground">Track bid deadlines and events</p>
                </div>
                <Calendar className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/vendor-dashboard/how-to-use">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">How to Use</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step platform guide</p>
                </div>
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}