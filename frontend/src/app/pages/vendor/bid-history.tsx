import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FileText, Calendar, DollarSign, Award, Eye } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { bidsApi } from "../../lib/api/bids.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_BIDS = [
  {
    id: "BID-001",
    rfqId: "RFQ-2024-001",
    title: "Office Furniture Supply",
    buyer: "Tech Corp Inc.",
    bidAmount: "$65,000",
    submittedDate: "2026-03-10",
    status: "under-review",
    statusText: "Under Review",
  },
  {
    id: "BID-002",
    rfqId: "RFQ-2024-005",
    title: "IT Equipment Procurement",
    buyer: "Finance Solutions Ltd.",
    bidAmount: "$120,000",
    submittedDate: "2026-03-08",
    status: "shortlisted",
    statusText: "Shortlisted",
  },
  {
    id: "BID-003",
    rfqId: "RFQ-2024-012",
    title: "Construction Materials",
    buyer: "BuildRight Co.",
    bidAmount: "$185,000",
    submittedDate: "2026-03-05",
    status: "awarded",
    statusText: "Awarded",
  },
  {
    id: "BID-004",
    rfqId: "RFQ-2024-008",
    title: "Cleaning Services Contract",
    buyer: "Healthcare Systems",
    bidAmount: "$38,000",
    submittedDate: "2026-02-28",
    status: "not-awarded",
    statusText: "Not Awarded",
  },
  {
    id: "BID-005",
    rfqId: "RFQ-2024-015",
    title: "Security Equipment Supply",
    buyer: "Retail Group Inc.",
    bidAmount: "$92,000",
    submittedDate: "2026-02-20",
    status: "awarded",
    statusText: "Awarded",
  },
];

// ─── Status mapping helper ──────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  submitted: "under-review",
  under_review: "under-review",
  shortlisted: "shortlisted",
  awarded: "awarded",
  rejected: "not-awarded",
  withdrawn: "not-awarded",
};

const STATUS_TEXT: Record<string, string> = {
  "under-review": "Under Review",
  shortlisted: "Shortlisted",
  awarded: "Awarded",
  "not-awarded": "Not Awarded",
};

function mapApiBids(apiBids: any[]): typeof MOCK_BIDS {
  return apiBids.map((b) => {
    const mappedStatus = STATUS_MAP[b.status] ?? b.status;
    return {
      id: b.bid_number ?? b.id,
      rfqId: b.tender_number ?? b.tender_id,
      title: b.tender_title ?? b.title ?? "Untitled",
      buyer: b.buyer_name ?? "—",
      bidAmount: b.total_amount != null ? `$${Number(b.total_amount).toLocaleString()}` : "—",
      submittedDate: b.submitted_at ? new Date(b.submitted_at).toISOString().slice(0, 10) : "—",
      status: mappedStatus,
      statusText: STATUS_TEXT[mappedStatus] ?? mappedStatus,
    };
  });
}

export function BidHistory() {
  const { data: apiBids } = useApiOrMock(
    async () => {
      const result = await bidsApi.list();
      return mapApiBids(result);
    },
    MOCK_BIDS,
  );

  const bids = apiBids;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "under-review": "secondary",
      "shortlisted": "default",
      "awarded": "default",
      "not-awarded": "destructive",
    };

    const colors: Record<string, string> = {
      "under-review": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      "shortlisted": "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "awarded": "bg-green-100 text-green-800 hover:bg-green-100",
      "not-awarded": "bg-muted text-foreground hover:bg-muted",
    };

    return (
      <Badge className={colors[status]}>
        {bids.find(b => b.status === status)?.statusText}
      </Badge>
    );
  };

  const renderBidCard = (bid: typeof bids[0]) => (
    <Card key={bid.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{bid.title}</h3>
              {getStatusBadge(bid.status)}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Bid ID: {bid.id} • RFQ ID: {bid.rfqId}</div>
              <div>Buyer: {bid.buyer}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <DollarSign className="size-4" />
            {bid.bidAmount}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            Submitted: {bid.submittedDate}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Eye className="size-4 mr-2" />
            View Bid
          </Button>
          {bid.status === "awarded" && (
            <Link to={`/contracts/${bid.rfqId}`} className="flex-1">
              <Button className="w-full">
                <Award className="size-4 mr-2" />
                View Contract
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Bid History"
        description="Track your submitted bids and their status"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Bids</div>
            <div className="text-3xl font-bold mt-1">{bids.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Under Review</div>
            <div className="text-3xl font-bold mt-1">
              {bids.filter(b => b.status === "under-review").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Shortlisted</div>
            <div className="text-3xl font-bold mt-1">
              {bids.filter(b => b.status === "shortlisted").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Awarded</div>
            <div className="text-3xl font-bold mt-1 text-green-600">
              {bids.filter(b => b.status === "awarded").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Bids ({bids.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({bids.filter(b => b.status === "under-review" || b.status === "shortlisted").length})
          </TabsTrigger>
          <TabsTrigger value="awarded">
            Awarded ({bids.filter(b => b.status === "awarded").length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({bids.filter(b => b.status === "not-awarded").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bids.map(renderBidCard)}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {bids
            .filter(b => b.status === "under-review" || b.status === "shortlisted")
            .map(renderBidCard)}
        </TabsContent>

        <TabsContent value="awarded" className="space-y-4">
          {bids.filter(b => b.status === "awarded").map(renderBidCard)}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {bids.filter(b => b.status === "not-awarded").map(renderBidCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
}