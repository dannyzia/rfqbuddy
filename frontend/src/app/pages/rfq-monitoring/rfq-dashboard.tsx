import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Link } from "react-router";
import { FileText, Users, Clock, Activity } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { bidsApi } from "../../lib/api/bids.api";

export function RfqDashboard() {
  const { id } = useParams();

  const { data: tender, loading: tenderLoading } = useApiOrMock(
    () => tendersApi.getById(id!),
    {
      id: id || "",
      tender_number: `TDR-${id}`,
      title: "Office Furniture Supply",
      status: "open" as const,
      submission_deadline: "2026-03-20T00:00:00Z",
      current_stage: "open",
    } as any,
    [id],
  );

  const { data: bids } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [
      { id: "1", bid_number: "BID-001", vendor_org_id: "v1", status: "submitted" },
      { id: "2", bid_number: "BID-002", vendor_org_id: "v2", status: "submitted" },
      { id: "3", bid_number: "BID-003", vendor_org_id: "v3", status: "draft" },
      { id: "4", bid_number: "BID-004", vendor_org_id: "v4", status: "submitted" },
      { id: "5", bid_number: "BID-005", vendor_org_id: "v5", status: "submitted" },
      { id: "6", bid_number: "BID-006", vendor_org_id: "v6", status: "submitted" },
      { id: "7", bid_number: "BID-007", vendor_org_id: "v7", status: "submitted" },
      { id: "8", bid_number: "BID-008", vendor_org_id: "v8", status: "submitted" },
    ] as any[],
    [id],
  );

  const submittedBids = bids.filter((b: any) => b.status === "submitted");
  const daysLeft = tender?.submission_deadline
    ? Math.max(0, Math.ceil((new Date(tender.submission_deadline).getTime() - Date.now()) / 86400000))
    : 5;

  const stats = [
    { label: "Bids Received", value: tenderLoading ? "…" : String(submittedBids.length), icon: FileText },
    { label: "Total Vendors", value: tenderLoading ? "…" : String(bids.length), icon: Users },
    { label: "Days Left", value: String(daysLeft), icon: Clock },
    { label: "Stage", value: tender?.status?.replace(/_/g, " ") || "Active", icon: Activity },
  ];

  return (
    <PageTemplate
      title={tender?.title || `Tender ${id}`}
      description={`${tender?.tender_number || id} — Overview of tender status and actions`}
      backTo="/tenders"
      backLabel="Back to Tenders"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  {tenderLoading ? (
                    <Skeleton className="h-7 w-16 mt-1" />
                  ) : (
                    <div className="text-2xl font-bold mt-1 capitalize">{stat.value}</div>
                  )}
                </div>
                <stat.icon className="size-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Vendor Participation", path: `/tenders/${id}/participation` },
          { title: "Live Bidding Monitor", path: `/tenders/${id}/live` },
          { title: "Bid Timeline", path: `/tenders/${id}/timeline` },
          { title: "Status History", path: `/tenders/${id}/history` },
          { title: "Audit Log", path: `/tenders/${id}/audit` },
          { title: "Bid Comparison", path: `/tenders/${id}/comparison` },
        ].map((link) => (
          <Link key={link.path} to={link.path}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold">{link.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageTemplate>
  );
}