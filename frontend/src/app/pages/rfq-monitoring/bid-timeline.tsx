import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Clock,
  FileText,
  Upload,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  User,
  Building,
  Calendar,
  Filter,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { bidsApi } from "../../lib/api/bids.api";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  eventType:
    | "bid_submitted"
    | "bid_updated"
    | "bid_withdrawn"
    | "document_uploaded"
    | "clarification_request"
    | "clarification_response"
    | "bid_viewed"
    | "amendment_issued"
    | "deadline_extended";
  actor: string;
  actorType: "vendor" | "purchaser" | "system";
  vendorId?: string;
  vendorName?: string;
  title: string;
  description: string;
  metadata?: {
    bidAmount?: number;
    previousAmount?: number;
    documentName?: string;
    clarificationId?: string;
    extensionDays?: number;
  };
  icon: React.ElementType;
  color: string;
}

export function BidTimeline() {
  const { id } = useParams<{ id: string }>();

  // Fetch tender data for title display
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply" } as any,
    [id],
  );

  // Fetch bids for context (vendor names etc.)
  const { data: apiBids } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [] as any[],
    [id],
  );

  const [filterEventType, setFilterEventType] = useState<string>("all");
  const [filterVendor, setFilterVendor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      timestamp: new Date("2026-03-11T14:32:15"),
      eventType: "bid_submitted",
      actor: "ABC Furniture Ltd.",
      actorType: "vendor",
      vendorId: "V001",
      vendorName: "ABC Furniture Ltd.",
      title: "Bid Submitted",
      description: "Initial bid submission with all required documents",
      metadata: { bidAmount: 4500000 },
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: "2",
      timestamp: new Date("2026-03-11T13:45:22"),
      eventType: "bid_updated",
      actor: "XYZ Trading Co.",
      actorType: "vendor",
      vendorId: "V002",
      vendorName: "XYZ Trading Co.",
      title: "Bid Updated",
      description: "Revised pricing and technical specifications",
      metadata: { bidAmount: 4425000, previousAmount: 4600000 },
      icon: Edit,
      color: "text-orange-600",
    },
    {
      id: "3",
      timestamp: new Date("2026-03-11T12:18:44"),
      eventType: "document_uploaded",
      actor: "Delta Supplies",
      actorType: "vendor",
      vendorId: "V003",
      vendorName: "Delta Supplies",
      title: "Document Uploaded",
      description: "Additional compliance certificate uploaded",
      metadata: { documentName: "ISO_9001_Certificate.pdf" },
      icon: Upload,
      color: "text-green-600",
    },
    {
      id: "4",
      timestamp: new Date("2026-03-11T11:30:00"),
      eventType: "clarification_response",
      actor: "Procurement Officer",
      actorType: "purchaser",
      title: "Clarification Response",
      description: "Response to vendor query regarding delivery terms",
      metadata: { clarificationId: "CLR-001" },
      icon: AlertCircle,
      color: "text-purple-600",
    },
    {
      id: "5",
      timestamp: new Date("2026-03-11T10:15:33"),
      eventType: "clarification_request",
      actor: "ABC Furniture Ltd.",
      actorType: "vendor",
      vendorId: "V001",
      vendorName: "ABC Furniture Ltd.",
      title: "Clarification Request",
      description: "Query regarding warranty period requirements",
      metadata: { clarificationId: "CLR-001" },
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      id: "6",
      timestamp: new Date("2026-03-10T16:20:11"),
      eventType: "bid_viewed",
      actor: "XYZ Trading Co.",
      actorType: "vendor",
      vendorId: "V002",
      vendorName: "XYZ Trading Co.",
      title: "Tender Document Viewed",
      description: "Vendor downloaded and viewed tender documents",
      icon: Eye,
      color: "text-muted-foreground",
    },
    {
      id: "7",
      timestamp: new Date("2026-03-10T14:00:00"),
      eventType: "amendment_issued",
      actor: "System",
      actorType: "system",
      title: "Amendment Issued",
      description: "Amendment #1 issued - Updated technical specifications for item 2",
      icon: FileText,
      color: "text-red-600",
    },
    {
      id: "8",
      timestamp: new Date("2026-03-09T11:00:00"),
      eventType: "deadline_extended",
      actor: "Procurement Officer",
      actorType: "purchaser",
      title: "Deadline Extended",
      description: "Submission deadline extended by 7 days",
      metadata: { extensionDays: 7 },
      icon: Calendar,
      color: "text-indigo-600",
    },
    {
      id: "9",
      timestamp: new Date("2026-03-08T15:45:28"),
      eventType: "bid_submitted",
      actor: "XYZ Trading Co.",
      actorType: "vendor",
      vendorId: "V002",
      vendorName: "XYZ Trading Co.",
      title: "Bid Submitted",
      description: "Initial bid submission",
      metadata: { bidAmount: 4600000 },
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: "10",
      timestamp: new Date("2026-03-08T10:22:15"),
      eventType: "bid_withdrawn",
      actor: "Omega Corp",
      actorType: "vendor",
      vendorId: "V005",
      vendorName: "Omega Corp",
      title: "Bid Withdrawn",
      description: "Vendor withdrew their bid submission",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      id: "11",
      timestamp: new Date("2026-03-07T14:10:00"),
      eventType: "bid_submitted",
      actor: "Delta Supplies",
      actorType: "vendor",
      vendorId: "V003",
      vendorName: "Delta Supplies",
      title: "Bid Submitted",
      description: "Initial bid submission with complete documentation",
      metadata: { bidAmount: 4680000 },
      icon: FileText,
      color: "text-blue-600",
    },
  ];

  // Get unique vendors for filter
  const uniqueVendors = Array.from(
    new Set(timelineEvents.filter((e) => e.vendorName).map((e) => e.vendorName))
  );

  // Filter events
  const filteredEvents = timelineEvents.filter((event) => {
    const matchesType = filterEventType === "all" || event.eventType === filterEventType;
    const matchesVendor = filterVendor === "all" || event.vendorName === filterVendor;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesVendor && matchesSearch;
  });

  // Group events by date
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const dateKey = event.timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventStats = () => {
    return {
      totalEvents: timelineEvents.length,
      bidsSubmitted: timelineEvents.filter((e) => e.eventType === "bid_submitted").length,
      bidsUpdated: timelineEvents.filter((e) => e.eventType === "bid_updated").length,
      documentsUploaded: timelineEvents.filter((e) => e.eventType === "document_uploaded").length,
      clarifications: timelineEvents.filter(
        (e) => e.eventType === "clarification_request" || e.eventType === "clarification_response"
      ).length,
    };
  };

  const stats = getEventStats();

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Bid Submission Timeline"
        description={`Chronological view of all bid events for Tender ${id}`}
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export Timeline
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.bidsSubmitted}</div>
                <div className="text-sm text-muted-foreground">Bids Submitted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.bidsUpdated}</div>
                <div className="text-sm text-muted-foreground">Bids Updated</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.documentsUploaded}</div>
                <div className="text-sm text-muted-foreground">Documents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.clarifications}</div>
                <div className="text-sm text-muted-foreground">Clarifications</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filter Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Event Type</label>
                <Select value={filterEventType} onValueChange={setFilterEventType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="bid_submitted">Bid Submitted</SelectItem>
                    <SelectItem value="bid_updated">Bid Updated</SelectItem>
                    <SelectItem value="bid_withdrawn">Bid Withdrawn</SelectItem>
                    <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                    <SelectItem value="clarification_request">Clarification Request</SelectItem>
                    <SelectItem value="clarification_response">Clarification Response</SelectItem>
                    <SelectItem value="amendment_issued">Amendment Issued</SelectItem>
                    <SelectItem value="deadline_extended">Deadline Extended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vendor</label>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {uniqueVendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor || ""}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
            <CardDescription>
              Showing {filteredEvents.length} of {timelineEvents.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[800px] pr-4">
              {Object.entries(groupedEvents).map(([date, events]) => (
                <div key={date} className="mb-8">
                  <div className="sticky top-0 bg-background z-10 pb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <Calendar className="size-4" />
                      {date}
                    </div>
                    <Separator className="mt-2" />
                  </div>

                  <div className="relative ml-4 mt-4">
                    {/* Vertical line */}
                    <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-border" />

                    <div className="space-y-6">
                      {events.map((event, index) => {
                        const Icon = event.icon;
                        return (
                          <div key={event.id} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className="absolute left-0 top-1">
                              <div className="size-4 rounded-full bg-background border-2 border-current flex items-center justify-center">
                                <div className={`size-2 rounded-full ${event.color.replace("text-", "bg-")}`} />
                              </div>
                            </div>

                            <Card>
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className={`${event.color} mt-0.5`}>
                                      <Icon className="size-5" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{event.title}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          {event.eventType.replace("_", " ")}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>

                                      {/* Event-specific metadata */}
                                      {event.metadata && (
                                        <div className="space-y-1">
                                          {event.metadata.bidAmount !== undefined && (
                                            <div className="flex items-center gap-2 text-sm">
                                              <span className="text-muted-foreground">Bid Amount:</span>
                                              <span className="font-semibold">
                                                BDT {event.metadata.bidAmount.toLocaleString("en-BD")}
                                              </span>
                                              {event.metadata.previousAmount && (
                                                <span className="text-muted-foreground">
                                                  (Previous: BDT {event.metadata.previousAmount.toLocaleString("en-BD")})
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          {event.metadata.documentName && (
                                            <div className="flex items-center gap-2 text-sm">
                                              <span className="text-muted-foreground">Document:</span>
                                              <span className="font-medium">{event.metadata.documentName}</span>
                                            </div>
                                          )}
                                          {event.metadata.clarificationId && (
                                            <div className="flex items-center gap-2 text-sm">
                                              <span className="text-muted-foreground">Reference:</span>
                                              <span className="font-medium">{event.metadata.clarificationId}</span>
                                            </div>
                                          )}
                                          {event.metadata.extensionDays && (
                                            <div className="flex items-center gap-2 text-sm">
                                              <span className="text-muted-foreground">Extension:</span>
                                              <span className="font-medium">{event.metadata.extensionDays} days</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          {event.actorType === "vendor" ? (
                                            <Building className="size-3" />
                                          ) : event.actorType === "purchaser" ? (
                                            <User className="size-3" />
                                          ) : (
                                            <CheckCircle className="size-3" />
                                          )}
                                          <span>{event.actor}</span>
                                        </div>
                                        {event.vendorId && (
                                          <Badge variant="outline" className="text-xs">
                                            {event.vendorId}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {event.timestamp.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No events match your filters</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}