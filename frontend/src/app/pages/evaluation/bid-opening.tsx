import { useState } from "react";
import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Lock,
  Unlock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Shield,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { bidsApi } from "../../lib/api/bids.api";

export function BidOpening() {
  const { id } = useParams();

  // Fetch tender and bids from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply", status: "open" } as any,
    [id],
  );

  const { data: apiBids } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [] as any[],
    [id],
  );

  const [ceremonyStatus, setCeremonyStatus] = useState<"scheduled" | "in-progress" | "completed">("scheduled");
  const [openedBids, setOpenedBids] = useState<number[]>([]);

  const tender = tenderData || {
    ref: "PG3-2026-00456",
    title: "Procurement of Office Furniture for Ministry of Education",
    type: "PG3 - Open Tender (Goods)",
    deadline: "2026-03-20 17:00",
    openingDate: "2026-03-21 10:00",
    totalBids: 12,
  };

  const bids = apiBids || [
    {
      id: 1,
      vendorId: "V-2024-1234",
      vendorName: "ABC Trading Company Ltd.",
      submittedAt: "2026-03-20 14:32:15",
      status: "sealed",
      technicalEnvelope: "Tech_ABC_20Mar26.pdf",
      financialEnvelope: "Fin_ABC_20Mar26_SEALED.pdf",
      bidSecurity: "BG_ABC_5Lac.pdf",
      hash: "a3f5d9e2b1c4...",
    },
    {
      id: 2,
      vendorId: "V-2025-0045",
      vendorName: "Global Supplies International",
      submittedAt: "2026-03-20 16:45:22",
      status: "sealed",
      technicalEnvelope: "Tech_Global_20Mar26.pdf",
      financialEnvelope: "Fin_Global_20Mar26_SEALED.pdf",
      bidSecurity: "BG_Global_5Lac.pdf",
      hash: "b8a2c6f1d3e7...",
    },
    {
      id: 3,
      vendorId: "V-2024-0789",
      vendorName: "Premium Office Solutions",
      submittedAt: "2026-03-20 15:10:45",
      status: "sealed",
      technicalEnvelope: "Tech_Premium_20Mar26.pdf",
      financialEnvelope: "Fin_Premium_20Mar26_SEALED.pdf",
      bidSecurity: "BG_Premium_5Lac.pdf",
      hash: "c7d4e9a2f6b1...",
    },
  ];

  const openBid = (bidId: number) => {
    if (ceremonyStatus === "in-progress") {
      setOpenedBids([...openedBids, bidId]);
    }
  };

  const startCeremony = () => {
    setCeremonyStatus("in-progress");
  };

  const completeCeremony = () => {
    if (openedBids.length === bids.length) {
      setCeremonyStatus("completed");
    }
  };

  return (
    <PageTemplate
      title="Bid Opening Ceremony"
      description={`${tender.ref} - ${tender.title}`}
      backTo={`/tenders/${id}`}
      backLabel="Back to Tender"
      actions={
        <div className="flex flex-wrap gap-2">
          {ceremonyStatus === "scheduled" ? (
            <Button size="sm" onClick={startCeremony} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Unlock className="size-4 mr-1 sm:mr-2" />
              Start <span className="hidden xs:inline">Bid Opening Ceremony</span>
            </Button>
          ) : ceremonyStatus === "in-progress" ? (
            <Button
              size="sm"
              onClick={completeCeremony}
              disabled={openedBids.length !== bids.length}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <CheckCircle2 className="size-4 mr-1 sm:mr-2" />
              Complete <span className="hidden xs:inline">Ceremony</span>
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                <Download className="size-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Download Opening Report</span>
                <span className="xs:hidden">Report</span>
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                Proceed <span className="hidden xs:inline">to Prequalification</span>
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Ceremony Status */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="size-5" />
                Bid Opening Ceremony
              </div>
              <div className="flex items-center gap-2">
                {ceremonyStatus === "scheduled" && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-[10px] sm:text-xs">
                    <Clock className="size-3 mr-1" />
                    Scheduled
                  </Badge>
                )}
                {ceremonyStatus === "in-progress" && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[10px] sm:text-xs">
                    <Eye className="size-3 mr-1" />
                    In Progress
                  </Badge>
                )}
                {ceremonyStatus === "completed" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-[10px] sm:text-xs">
                    <CheckCircle2 className="size-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Scheduled</p>
                <p className="text-xs sm:text-sm font-semibold">{tender.openingDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Bids</p>
                <p className="font-bold text-lg sm:text-2xl">{tender.totalBids}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Opened</p>
                <p className="font-bold text-lg sm:text-2xl">
                  {openedBids.length} / {bids.length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Officer</p>
                <p className="text-xs sm:text-sm font-semibold">You</p>
              </div>
            </div>

            {ceremonyStatus === "scheduled" && (
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  <strong>Important:</strong> Bid opening ceremony must be conducted at the scheduled time (
                  {tender.openingDate}) as per tender conditions. All bids are currently sealed and cannot be accessed
                  until the ceremony begins.
                </AlertDescription>
              </Alert>
            )}

            {ceremonyStatus === "in-progress" && (
              <Alert>
                <AlertDescription>
                  <strong>Ceremony in Progress:</strong> Click "Open Bid" for each vendor to unseal their technical and
                  financial envelopes. All actions are logged in the audit trail.
                </AlertDescription>
              </Alert>
            )}

            {ceremonyStatus === "completed" && (
              <Alert>
                <CheckCircle2 className="size-4" />
                <AlertDescription>
                  <strong>Ceremony Completed:</strong> All {bids.length} bids have been opened successfully. You may now
                  proceed to the Prequalification Evaluation stage.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Regulatory Compliance Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regulatory Compliance - PPA 2006</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="size-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong>Public Opening Required:</strong> As per Bangladesh Public Procurement Act 2006, bid opening
                  must be conducted publicly at the specified time and location
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="size-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong>Two-Envelope System:</strong> Technical envelope opened first; financial envelope opened only
                  for technically qualified bidders
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="size-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong>Audit Trail:</strong> All bid opening actions are cryptographically logged with timestamps and
                  hashes
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bids Table */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Submitted Bids</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile bid cards */}
            <div className="sm:hidden divide-y divide-border">
              {bids.map((bid) => {
                const isOpened = openedBids.includes(bid.id);
                return (
                  <div key={bid.id} className={`p-3 space-y-2 ${isOpened ? "bg-green-50/50 dark:bg-green-900/10" : ""}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{bid.vendorName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{bid.vendorId}</p>
                      </div>
                      {isOpened ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px]">
                          <Unlock className="size-3 mr-1" />Opened
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          <Lock className="size-3 mr-1" />Sealed
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Submitted: {bid.submittedAt}</p>
                    <div className="text-[10px] space-y-0.5">
                      <div className="flex items-center gap-1">
                        <FileText className="size-3 text-muted-foreground" />
                        {isOpened ? <a href="#" className="text-blue-600 hover:underline">{bid.technicalEnvelope}</a> : <span className="text-muted-foreground">{bid.technicalEnvelope}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="size-3 text-muted-foreground" />
                        {isOpened ? <a href="#" className="text-blue-600 hover:underline">{bid.financialEnvelope.replace("_SEALED", "")}</a> : <span className="text-muted-foreground">{bid.financialEnvelope}</span>}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      {ceremonyStatus === "in-progress" && !isOpened ? (
                        <Button size="sm" onClick={() => openBid(bid.id)} className="h-7 text-xs">
                          <Unlock className="size-3 mr-1" />Open Bid
                        </Button>
                      ) : isOpened ? (
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          <Eye className="size-3 mr-1" />View
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="h-7 text-xs">
                          <Lock className="size-3 mr-1" />Sealed
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto p-4 sm:p-6">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Hash</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids.map((bid) => {
                      const isOpened = openedBids.includes(bid.id);
                      return (
                        <TableRow key={bid.id} className={isOpened ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
                          <TableCell className="font-medium text-sm">{bid.vendorName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">{bid.vendorId}</TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{bid.submittedAt}</TableCell>
                          <TableCell>
                            {isOpened ? (
                              <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px]">
                                <Unlock className="size-3 mr-1" />Opened
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                <Lock className="size-3 mr-1" />Sealed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1">
                                <FileText className="size-3 text-muted-foreground" />
                                {isOpened ? (
                                  <a href="#" className="text-blue-600 hover:underline">{bid.technicalEnvelope}</a>
                                ) : (
                                  <span className="text-muted-foreground">{bid.technicalEnvelope}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Lock className="size-3 text-muted-foreground" />
                                {isOpened ? (
                                  <a href="#" className="text-blue-600 hover:underline">{bid.financialEnvelope.replace("_SEALED", "")}</a>
                                ) : (
                                  <span className="text-muted-foreground">{bid.financialEnvelope}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[10px] font-mono text-muted-foreground truncate max-w-[80px]">{bid.hash}</TableCell>
                          <TableCell className="text-right">
                            {ceremonyStatus === "in-progress" && !isOpened ? (
                              <Button size="sm" onClick={() => openBid(bid.id)} className="h-8">
                                <Unlock className="size-3 mr-1" />Open
                              </Button>
                            ) : isOpened ? (
                              <Button size="sm" variant="ghost" className="h-8">
                                <Eye className="size-3 mr-1" />View
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" disabled className="h-8">
                                <Lock className="size-3 mr-1" />Sealed
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opening Log (Audit Trail) */}
        {ceremonyStatus !== "scheduled" && (
          <Card>
            <CardHeader>
              <CardTitle>Opening Log (Audit Trail)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {ceremonyStatus === "in-progress" && (
                  <p className="text-muted-foreground italic">
                    Log entries will be recorded as bids are opened during the ceremony...
                  </p>
                )}
                {openedBids.map((bidId) => {
                  const bid = bids.find((b) => b.id === bidId);
                  return (
                    <div key={bidId} className="border-l-2 border-green-500 pl-4 py-2">
                      <p className="font-medium">{bid?.vendorName}</p>
                      <p className="text-xs text-muted-foreground">
                        Opened at: {new Date().toLocaleString()} | Officer: Procurement Officer | IP: 192.168.1.100 |
                        Hash verified: ✓
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdrawal Notice */}
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-base">Withdrawn Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Supreme Furniture House</p>
                  <p className="text-xs text-muted-foreground">
                    Withdrawn on: 2026-03-19 23:45 | Reason: Unable to meet delivery timeline
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}