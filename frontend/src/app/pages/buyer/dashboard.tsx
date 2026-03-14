import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileStack, Users, TrendingUp, Clock, Plus, ArrowRight, Map, BookOpen } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";

// ─── Mock fallback data ──────────────────────────────────────────

const MOCK_STATS = {
  active_tenders: 12,
  total_bids: 48,
  enlisted_vendors: 156,
  pending_actions: 5,
};

const MOCK_ACTIVITY = [
  { action: "New bid received", tender: "PG-2026-001", time: "2 hours ago" },
  { action: "Tender published", tender: "PW-2026-015", time: "5 hours ago" },
  { action: "Vendor approved", tender: "ABC Construction Ltd", time: "1 day ago" },
  { action: "Evaluation completed", tender: "PG-2026-003", time: "2 days ago" },
];

export function BuyerDashboard() {
  const { theme } = useTheme();

  // Wire to real API with mock fallback
  const { data: apiStats, loading, isUsingMock } = useApiOrMock(
    () => analyticsApi.getProcurementStats(),
    MOCK_STATS,
  );

  const stats = [
    { label: "Active Tenders", value: String(apiStats.active_tenders ?? 12), icon: FileStack, color: "text-blue-600" },
    { label: "Total Bids", value: String(apiStats.total_bids ?? 48), icon: TrendingUp, color: "text-green-600" },
    { label: "Enlisted Vendors", value: String(apiStats.enlisted_vendors ?? 156), icon: Users, color: "text-purple-600" },
    { label: "Pending Actions", value: String(apiStats.pending_actions ?? 5), icon: Clock, color: "text-orange-600" },
  ];

  const recentActivity = MOCK_ACTIVITY;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Purchaser Dashboard"
        description="Overview of your procurement activities"
      />

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-secondary border border-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="font-semibold text-secondary-foreground">Welcome to the RFQ Platform Demo</div>
          <div className="text-sm text-muted-foreground mt-1">
            Explore all 52 screens across 9 categories. View the complete site map or read the step-by-step guide.
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link to="/how-to-use">
            <Button variant="outline" size="sm">
              <BookOpen className="size-4 mr-2" />
              How to Use
            </Button>
          </Link>
          <Link to="/site-map">
            <Button variant="outline" size="sm">
              <Map className="size-4 mr-2" />
              Site Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          if (theme === "sky") {
            const skyColors = [
              { bg: "bg-[#369FFF]", shadow: "shadow-[0_10px_30px_rgba(54,159,255,0.3)]", circle1: "rgba(0,110,211,0.4)", circle2: "white", progress: "100%", dash: 0 },
              { bg: "bg-[#FF993A]", shadow: "shadow-[0_10px_30px_rgba(255,153,58,0.3)]", circle1: "#FF7E07", circle2: "white", progress: "75%", dash: 37.5 },
              { bg: "bg-[#8AC53E]", shadow: "shadow-[0_10px_30px_rgba(138,197,62,0.3)]", circle1: "rgba(0,104,56,0.4)", circle2: "white", progress: "50%", dash: 75 },
              { bg: "bg-[#FFD143]", shadow: "shadow-[0_10px_30px_rgba(255,209,67,0.3)]", circle1: "#FFC000", circle2: "white", progress: "25%", dash: 112.5 },
            ];
            const color = skyColors[idx % 4];

            return (
              <div key={stat.label} className={`relative overflow-hidden rounded-[20px] ${color.bg} text-white p-5 md:p-6 ${color.shadow} flex flex-col justify-between h-[160px] transition-transform hover:scale-[1.02]`}>
                <div className="absolute right-[-10%] top-[-20%] opacity-20 pointer-events-none">
                  <Icon size={160} strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold drop-shadow-sm">{stat.value}</h3>
                  <p className="text-sm text-white/90 mt-1 font-medium drop-shadow-sm">{stat.label}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="relative size-[56px] flex items-center justify-center">
                    <svg className="absolute inset-0 size-full -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke={color.circle1} strokeWidth="4" fill="none" />
                      <circle cx="28" cy="28" r="24" stroke={color.circle2} strokeWidth="4" fill="none" strokeDasharray="150" strokeDashoffset={color.dash} strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-bold relative z-10 drop-shadow-md">{color.progress}</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`size-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create RFQ/Tender */}
        <Card>
          <CardHeader>
            <CardTitle>Create RFQ/Tender</CardTitle>
            <CardDescription>Start a new procurement process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/tenders/new">
              <Button className="w-full justify-start">
                <Plus className="size-4 mr-2" />
                New Tender
              </Button>
            </Link>
            <Link to="/tenders">
              <Button variant="outline" className="w-full justify-start">
                <FileStack className="size-4 mr-2" />
                View All Tenders
              </Button>
            </Link>
            <Link to="/tenders/create">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Custom RFQ/Tender Builder
                <ArrowRight className="size-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* RFQ/Tender Management */}
        <Card>
          <CardHeader>
            <CardTitle>RFQ/Tender Management</CardTitle>
            <CardDescription>Manage existing tenders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/tenders">
              <Button variant="outline" className="w-full justify-start">
                <FileStack className="size-4 mr-2" />
                All Tenders
              </Button>
            </Link>
            <Link to="/activity">
              <Button variant="outline" className="w-full justify-start">
                Activity Feed
                <ArrowRight className="size-4 ml-auto" />
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Deadlines Calendar
                <ArrowRight className="size-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Manage Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Vendors</CardTitle>
            <CardDescription>Vendor enlistment & management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/vendors">
              <Button variant="outline" className="w-full justify-start">
                <Users className="size-4 mr-2" />
                Vendor List
              </Button>
            </Link>
            <Link to="/vendor-enlistment">
              <Button variant="outline" className="w-full justify-start">
                Enlistment Requests
                <ArrowRight className="size-4 ml-auto" />
              </Button>
            </Link>
            <Link to="/vendor-risk">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Risk Dashboard
                <ArrowRight className="size-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest procurement events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.tender}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
          <Link to="/activity">
            <Button variant="link" className="w-full mt-4">
              View All Activity
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}