import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { bidsApi } from "../../lib/api/bids.api";

export function VendorParticipation() {
  const { id } = useParams();

  const { data: bids, loading } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [
      { id: "1", vendor_org_id: "v1", status: "submitted", created_at: "2026-03-10T10:30:00Z", submitted_at: "2026-03-10T11:00:00Z", _vendor_name: "ABC Construction" },
      { id: "2", vendor_org_id: "v2", status: "submitted", created_at: "2026-03-11T09:15:00Z", submitted_at: "2026-03-11T09:20:00Z", _vendor_name: "XYZ Engineering" },
      { id: "3", vendor_org_id: "v3", status: "draft", created_at: "2026-03-11T14:30:00Z", submitted_at: null, _vendor_name: "BuildCo Ltd" },
    ] as any[],
    [id],
  );

  const vendors = bids.map((b: any) => ({
    name: b._vendor_name || b.vendor_org_id,
    viewed: b.created_at ? new Date(b.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "-",
    downloaded: b.submitted_at ? new Date(b.submitted_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "-",
    status: b.status === "submitted" ? "Active" : b.status === "draft" ? "Viewed" : b.status,
  }));

  return (
    <PageTemplate
      title="Vendor Participation Monitor"
      description={`Real-time participation tracking for ${id}`}
      backTo={`/tenders/${id}`}
      backLabel="Back to Tender"
    >
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Viewed</TableHead>
                <TableHead>Downloaded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell className="text-sm">{vendor.viewed}</TableCell>
                  <TableCell className="text-sm">{vendor.downloaded}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </PageTemplate>
  );
}