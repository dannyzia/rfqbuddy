import { Link } from "react-router";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Search, Calendar, DollarSign, FileText } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_RFQS = [
  { id: "RFQ-2024-001", title: "Office Furniture Supply", buyer: "Tech Corp Inc.", category: "Furniture", budget: "$50,000 - $75,000", deadline: "2026-03-25", status: "open" },
  { id: "RFQ-2024-002", title: "IT Equipment Procurement", buyer: "Finance Solutions Ltd.", category: "Technology", budget: "$100,000+", deadline: "2026-03-20", status: "open" },
  { id: "RFQ-2024-003", title: "Cleaning Services Contract", buyer: "Healthcare Systems", category: "Services", budget: "$30,000 - $45,000", deadline: "2026-03-18", status: "closing-soon" },
  { id: "RFQ-2024-004", title: "Construction Materials", buyer: "BuildRight Co.", category: "Construction", budget: "$200,000+", deadline: "2026-03-30", status: "open" },
];

function mapApiRfqs(apiTenders: any[]): typeof MOCK_RFQS {
  return apiTenders.map((t) => {
    const deadline = t.closing_date ?? t.deadline ?? "";
    const isClosingSoon = deadline && (new Date(deadline).getTime() - Date.now()) < 3 * 86400000;
    return {
      id: t.tender_number ?? t.id,
      title: t.title ?? "Untitled",
      buyer: t.org_name ?? t.buyer ?? "—",
      category: t.category ?? "General",
      budget: t.estimated_value ? `$${Number(t.estimated_value).toLocaleString()}` : "—",
      deadline: deadline ? new Date(deadline).toISOString().slice(0, 10) : "—",
      status: isClosingSoon ? "closing-soon" : "open",
    };
  });
}

export function AvailableRfqs() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rfqs } = useApiOrMock(
    async () => {
      const result = await tendersApi.list({ status: "published" });
      return mapApiRfqs(result.items ?? result as any);
    },
    MOCK_RFQS,
  );

  const filteredRfqs = searchQuery
    ? rfqs.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buyer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rfqs;

  const renderRfqCard = (rfq: typeof rfqs[0]) => (
    <Card key={rfq.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{rfq.title}</h3>
              {rfq.status === "closing-soon" && (
                <Badge variant="destructive">Closing Soon</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>RFQ ID: {rfq.id}</div>
              <div>Buyer: {rfq.buyer}</div>
              <div>Category: {rfq.category}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <DollarSign className="size-4" />
            {rfq.budget}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            Deadline: {rfq.deadline}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/rfqs/${rfq.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <FileText className="size-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Link to={`/rfqs/${rfq.id}/bid`} className="flex-1">
            <Button className="w-full">Submit Bid</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Available RFQs"
        description="Browse and bid on open procurement opportunities"
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search RFQs by title, category, or buyer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All RFQs ({filteredRfqs.length})</TabsTrigger>
          <TabsTrigger value="closing">Closing Soon ({filteredRfqs.filter(r => r.status === "closing-soon").length})</TabsTrigger>
          <TabsTrigger value="new">New ({Math.min(filteredRfqs.length, 2)})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRfqs.map(renderRfqCard)}
        </TabsContent>

        <TabsContent value="closing" className="space-y-4">
          {filteredRfqs.filter(r => r.status === "closing-soon").map(renderRfqCard)}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {filteredRfqs.slice(0, 2).map(renderRfqCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
}