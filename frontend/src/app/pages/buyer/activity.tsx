import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, FileStack, Users, Award, Bell } from "lucide-react";

export function RfqActivityFeed() {
  const activities = [
    { type: "bid", icon: FileStack, title: "New bid received on PG-2026-001", vendor: "ABC Corp", time: "2 hours ago", color: "bg-blue-100 text-blue-600" },
    { type: "publish", icon: Bell, title: "Tender PW-2026-015 published", description: "Road Construction Project", time: "5 hours ago", color: "bg-green-100 text-green-600" },
    { type: "vendor", icon: Users, title: "Vendor approved", vendor: "XYZ Ltd", time: "1 day ago", color: "bg-purple-100 text-purple-600" },
    { type: "award", icon: Award, title: "Award issued for PG-2026-003", vendor: "BuildCo", time: "2 days ago", color: "bg-orange-100 text-orange-600" },
    { type: "deadline", icon: Clock, title: "Deadline approaching", description: "PPS-2026-008 closes in 3 days", time: "3 days ago", color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="RFQ Activity Feed"
        description="Timeline of procurement lifecycle events"
      />

      <div className="max-w-4xl">
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${activity.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          {activity.vendor && (
                            <p className="text-sm text-muted-foreground mt-1">Vendor: {activity.vendor}</p>
                          )}
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}