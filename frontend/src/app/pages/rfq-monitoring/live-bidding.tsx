import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import {
  Radio,
  TrendingDown,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Activity,
  Eye,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { bidsApi } from "../../lib/api/bids.api";

interface LiveBid {
  id: string;
  vendorName: string;
  vendorId: string;
  timestamp: Date;
  amount: number;
  rank: number;
  isLeading: boolean;
  bidCount: number;
}

interface BidActivity {
  id: string;
  vendorId: string;
  vendorName: string;
  action: "submit" | "update" | "withdraw";
  amount?: number;
  timestamp: Date;
}

export function LiveBidding() {
  const { id } = useParams<{ id: string }>();

  // Fetch tender details from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply", status: "open" } as any,
    [id],
  );

  // Fetch bids for this tender from API with mock fallback
  const { data: apiBids } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [] as any[],
    [id],
  );
  
  // Mock data - in real app, use WebSocket for real-time updates
  const [sessionStatus, setSessionStatus] = useState<"scheduled" | "active" | "paused" | "ended">("active");
  const [timeRemaining, setTimeRemaining] = useState(1847); // seconds
  const [autoExtensionEnabled, setAutoExtensionEnabled] = useState(true);
  const [bidsVisibility, setBidsVisibility] = useState<"open" | "anonymous">("open");
  
  const [liveBids, setLiveBids] = useState<LiveBid[]>([
    {
      id: "1",
      vendorName: "ABC Furniture Ltd.",
      vendorId: "V001",
      timestamp: new Date(Date.now() - 125000),
      amount: 4350000,
      rank: 1,
      isLeading: true,
      bidCount: 3,
    },
    {
      id: "2",
      vendorName: "XYZ Trading Co.",
      vendorId: "V002",
      timestamp: new Date(Date.now() - 245000),
      amount: 4425000,
      rank: 2,
      isLeading: false,
      bidCount: 2,
    },
    {
      id: "3",
      vendorName: "Delta Supplies",
      vendorId: "V003",
      timestamp: new Date(Date.now() - 567000),
      amount: 4680000,
      rank: 3,
      isLeading: false,
      bidCount: 1,
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<BidActivity[]>([
    {
      id: "1",
      vendorId: "V001",
      vendorName: "ABC Furniture Ltd.",
      action: "update",
      amount: 4350000,
      timestamp: new Date(Date.now() - 125000),
    },
    {
      id: "2",
      vendorId: "V002",
      vendorName: "XYZ Trading Co.",
      action: "update",
      amount: 4425000,
      timestamp: new Date(Date.now() - 245000),
    },
    {
      id: "3",
      vendorId: "V001",
      vendorName: "ABC Furniture Ltd.",
      action: "update",
      amount: 4500000,
      timestamp: new Date(Date.now() - 425000),
    },
  ]);

  // Simulate countdown timer
  useEffect(() => {
    if (sessionStatus !== "active") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          setSessionStatus("ended");
          toast.success("Bidding session has ended");
          return 0;
        }
        // Auto-extend if bid submitted in last 5 minutes
        if (autoExtensionEnabled && prev < 300 && Math.random() > 0.95) {
          toast.info("Session extended by 5 minutes due to recent bid");
          return prev + 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStatus, autoExtensionEnabled]);

  // Simulate real-time bid updates
  useEffect(() => {
    if (sessionStatus !== "active") return;

    const bidUpdateInterval = setInterval(() => {
      // Randomly simulate new bid (10% chance every 5 seconds)
      if (Math.random() > 0.9) {
        const vendors = ["ABC Furniture Ltd.", "XYZ Trading Co.", "Delta Supplies"];
        const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
        const currentLowest = Math.min(...liveBids.map((b) => b.amount));
        const newAmount = currentLowest - Math.floor(Math.random() * 50000) - 10000;

        const newActivity: BidActivity = {
          id: Date.now().toString(),
          vendorId: "V" + Math.floor(Math.random() * 100),
          vendorName: randomVendor,
          action: "update",
          amount: newAmount,
          timestamp: new Date(),
        };

        setRecentActivity((prev) => [newActivity, ...prev].slice(0, 10));
        toast.info(`New bid received from ${randomVendor}: BDT ${newAmount.toLocaleString("en-BD")}`);
      }
    }, 5000);

    return () => clearInterval(bidUpdateInterval);
  }, [sessionStatus, liveBids]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return "text-destructive";
    if (timeRemaining < 900) return "text-orange-600";
    return "text-green-600";
  };

  const handlePauseResume = () => {
    if (sessionStatus === "active") {
      setSessionStatus("paused");
      toast.info("Bidding session paused");
    } else if (sessionStatus === "paused") {
      setSessionStatus("active");
      toast.success("Bidding session resumed");
    }
  };

  const handleEndSession = () => {
    setSessionStatus("ended");
    toast.success("Bidding session ended manually");
  };

  const lowestBid = liveBids.length > 0 ? Math.min(...liveBids.map((b) => b.amount)) : 0;
  const highestBid = liveBids.length > 0 ? Math.max(...liveBids.map((b) => b.amount)) : 0;
  const bidSpread = highestBid - lowestBid;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Live Bidding Monitor"
        description={`Real-time bidding session for Tender ${id}`}
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <div className="flex gap-2">
            {sessionStatus === "active" && (
              <Button variant="outline" onClick={handlePauseResume}>
                <PauseCircle className="size-4 mr-2" />
                Pause Session
              </Button>
            )}
            {sessionStatus === "paused" && (
              <Button variant="outline" onClick={handlePauseResume}>
                <PlayCircle className="size-4 mr-2" />
                Resume Session
              </Button>
            )}
            {(sessionStatus === "active" || sessionStatus === "paused") && (
              <Button variant="destructive" onClick={handleEndSession}>
                End Session
              </Button>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Session Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className={sessionStatus === "active" ? "size-5 text-green-600 animate-pulse" : "size-5"} />
                  Live Bidding Session
                </CardTitle>
                <CardDescription>Tender #{id} - Office Furniture Supply</CardDescription>
              </div>
              <Badge
                variant={
                  sessionStatus === "active"
                    ? "default"
                    : sessionStatus === "paused"
                    ? "secondary"
                    : sessionStatus === "ended"
                    ? "destructive"
                    : "outline"
                }
                className="text-lg px-4 py-2"
              >
                {sessionStatus === "active" && <Activity className="size-4 mr-2 animate-pulse" />}
                {sessionStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Clock className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className={`text-3xl font-bold ${getTimeColor()}`}>{formatTime(timeRemaining)}</div>
                <Progress value={(timeRemaining / 3600) * 100} className="mt-2 h-2" />
              </div>
              <div className="text-center">
                <Users className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Active Bidders</div>
                <div className="text-3xl font-bold">{liveBids.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Total: {liveBids.length + 2}</div>
              </div>
              <div className="text-center">
                <TrendingDown className="size-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm text-muted-foreground">Lowest Bid</div>
                <div className="text-2xl font-bold text-green-600">
                  BDT {lowestBid.toLocaleString("en-BD")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Spread: BDT {bidSpread.toLocaleString("en-BD")}
                </div>
              </div>
              <div className="text-center">
                <Activity className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Total Bids</div>
                <div className="text-3xl font-bold">{liveBids.reduce((sum, b) => sum + b.bidCount, 0)}</div>
                <div className="text-xs text-muted-foreground mt-1">Last: 2m ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bid Visibility:</span>
                <Badge variant={bidsVisibility === "open" ? "default" : "secondary"}>
                  {bidsVisibility === "open" ? (
                    <>
                      <Eye className="size-3 mr-1" />
                      Open
                    </>
                  ) : (
                    "Anonymous"
                  )}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Auto-Extension:</span>
                <Badge variant={autoExtensionEnabled ? "default" : "outline"}>
                  {autoExtensionEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Extension Trigger:</span>
                <span className="text-sm font-medium">Last 5 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Extension Duration:</span>
                <span className="text-sm font-medium">5 minutes</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">Session Start:</span>
                <span className="text-sm font-medium">11:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Scheduled End:</span>
                <span className="text-sm font-medium">12:00 PM</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bidding Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription className="space-y-2">
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Bids must be lower than the current lowest bid</li>
                    <li>Minimum bid decrement: BDT 10,000</li>
                    <li>Session auto-extends if bids received in last 5 min</li>
                    <li>Maximum extensions: 3 times (15 minutes total)</li>
                    <li>Vendors can update bids until session ends</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Current Bids */}
        <Card>
          <CardHeader>
            <CardTitle>Current Bids - Live Rankings</CardTitle>
            <CardDescription>Bids are ranked by price (lowest first)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Bid Count</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveBids
                    .sort((a, b) => a.amount - b.amount)
                    .map((bid, index) => {
                      const timeSince = Math.floor((Date.now() - bid.timestamp.getTime()) / 1000);
                      return (
                        <TableRow key={bid.id} className={index === 0 ? "bg-green-50" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {index === 0 && <CheckCircle className="size-4 text-green-600" />}
                              <span className="font-bold">{index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{bid.vendorName}</div>
                            <div className="text-sm text-muted-foreground">{bid.vendorId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-lg">
                              BDT {bid.amount.toLocaleString("en-BD")}
                            </div>
                            {index === 0 && (
                              <Badge variant="default" className="text-xs mt-1">
                                <TrendingDown className="size-3 mr-1" />
                                Leading
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{bid.bidCount} bids</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {timeSince < 60
                                ? `${timeSince}s ago`
                                : timeSince < 3600
                                ? `${Math.floor(timeSince / 60)}m ago`
                                : `${Math.floor(timeSince / 3600)}h ago`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {index === 0 ? "Winning" : "Active"}
                            </Badge>
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

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live feed of bid submissions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const timeSince = Math.floor((Date.now() - activity.timestamp.getTime()) / 1000);
                const timeStr =
                  timeSince < 60
                    ? `${timeSince}s ago`
                    : timeSince < 3600
                    ? `${Math.floor(timeSince / 60)}m ago`
                    : `${Math.floor(timeSince / 3600)}h ago`;

                return (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div
                      className={`size-2 rounded-full ${
                        activity.action === "submit"
                          ? "bg-blue-600"
                          : activity.action === "update"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.vendorName}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.action}
                        </Badge>
                      </div>
                      {activity.amount && (
                        <div className="text-sm text-muted-foreground">
                          Bid: BDT {activity.amount.toLocaleString("en-BD")}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{timeStr}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Session End Alert */}
        {sessionStatus === "ended" && (
          <Alert>
            <CheckCircle className="size-4 text-green-600" />
            <AlertDescription>
              <strong>Bidding Session Ended</strong>
              <br />
              The live bidding session has concluded. The lowest bid is <strong>BDT {lowestBid.toLocaleString("en-BD")}</strong> from{" "}
              <strong>{liveBids.find((b) => b.amount === lowestBid)?.vendorName}</strong>. Proceed to bid evaluation.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}