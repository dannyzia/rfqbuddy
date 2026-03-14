import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Download,
  Eye,
  Edit,
  Send,
  Award,
  FileCheck,
  Calendar,
  TrendingUp,
} from "lucide-react";

import { toast } from "sonner";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";

interface StatusChange {
  id: string;
  status:
    | "draft"
    | "published"
    | "open"
    | "clarification"
    | "amendment"
    | "closed"
    | "evaluation"
    | "awarded"
    | "cancelled"
    | "withheld";
  timestamp: Date;
  changedBy: string;
  role: string;
  reason?: string;
  details?: string;
  duration?: number; // seconds in this status
}

interface WorkflowStage {
  stage: string;
  status: "completed" | "current" | "pending" | "skipped";
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  assignedTo?: string;
  notes?: string;
}

export function RfqHistory() {
  const { id } = useParams<{ id: string }>();

  // Fetch tender data from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply", status: "open" } as any,
    [id],
  );

  const [selectedView, setSelectedView] = useState<"timeline" | "stages">("timeline");

  // Mock status history data
  const statusHistory: StatusChange[] = [
    {
      id: "1",
      status: "open",
      timestamp: new Date("2026-03-11T09:00:00"),
      changedBy: "Md. Rahman (Procurement Officer)",
      role: "Procurement Officer",
      details: "Tender published and open for bid submissions",
    },
    {
      id: "2",
      status: "amendment",
      timestamp: new Date("2026-03-10T14:00:00"),
      changedBy: "System",
      role: "System",
      reason: "Technical specification update",
      details: "Amendment #1 issued - Updated item 2 specifications",
    },
    {
      id: "3",
      status: "clarification",
      timestamp: new Date("2026-03-09T16:30:00"),
      changedBy: "Md. Rahman (Procurement Officer)",
      role: "Procurement Officer",
      reason: "Vendor queries received",
      details: "Clarification period opened for 3 vendor queries",
    },
    {
      id: "4",
      status: "open",
      timestamp: new Date("2026-03-08T10:00:00"),
      changedBy: "Md. Rahman (Procurement Officer)",
      role: "Procurement Officer",
      details: "Tender re-opened after clarification",
    },
    {
      id: "5",
      status: "published",
      timestamp: new Date("2026-03-05T11:00:00"),
      changedBy: "Md. Rahman (Procurement Officer)",
      role: "Procurement Officer",
      details: "Tender published on e-GP portal and national daily",
    },
    {
      id: "6",
      status: "draft",
      timestamp: new Date("2026-02-28T14:22:00"),
      changedBy: "Md. Rahman (Procurement Officer)",
      role: "Procurement Officer",
      details: "Initial tender document created",
    },
  ];

  // Mock workflow stages
  const workflowStages: WorkflowStage[] = [
    {
      stage: "Tender Preparation",
      status: "completed",
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-28"),
      duration: "8 days",
      assignedTo: "Procurement Officer",
      notes: "Tender documents prepared and reviewed",
    },
    {
      stage: "Internal Review",
      status: "completed",
      startDate: new Date("2026-02-28"),
      endDate: new Date("2026-03-04"),
      duration: "4 days",
      assignedTo: "Procurement Committee",
      notes: "Technical and financial review completed",
    },
    {
      stage: "Approval",
      status: "completed",
      startDate: new Date("2026-03-04"),
      endDate: new Date("2026-03-05"),
      duration: "1 day",
      assignedTo: "Head of PE",
      notes: "Tender approved for publication",
    },
    {
      stage: "Advertisement",
      status: "completed",
      startDate: new Date("2026-03-05"),
      endDate: new Date("2026-03-05"),
      duration: "< 1 day",
      assignedTo: "Authorized Officer",
      notes: "Published in Daily Star and e-GP portal",
    },
    {
      stage: "Bid Submission Period",
      status: "current",
      startDate: new Date("2026-03-05"),
      assignedTo: "System",
      notes: "Open for vendor submissions until March 20, 2026",
    },
    {
      stage: "Bid Opening",
      status: "pending",
      assignedTo: "Tender Opening Committee",
      notes: "Scheduled for March 20, 2026 at 11:00 AM",
    },
    {
      stage: "Technical Evaluation",
      status: "pending",
      assignedTo: "Evaluation Committee",
      notes: "To be conducted after bid opening",
    },
    {
      stage: "Commercial Evaluation",
      status: "pending",
      assignedTo: "Evaluation Committee",
      notes: "To be conducted after technical evaluation",
    },
    {
      stage: "Award Recommendation",
      status: "pending",
      assignedTo: "Procurement Officer",
      notes: "Pending evaluation completion",
    },
    {
      stage: "Contract Award",
      status: "pending",
      assignedTo: "Approving Authority",
      notes: "Final approval pending",
    },
  ];

  const getStatusIcon = (status: StatusChange["status"]) => {
    switch (status) {
      case "draft":
        return Edit;
      case "published":
        return Send;
      case "open":
        return Play;
      case "clarification":
        return AlertCircle;
      case "amendment":
        return FileText;
      case "closed":
        return Pause;
      case "evaluation":
        return FileCheck;
      case "awarded":
        return Award;
      case "cancelled":
        return XCircle;
      case "withheld":
        return Pause;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: StatusChange["status"]) => {
    switch (status) {
      case "draft":
        return "text-muted-foreground bg-muted";
      case "published":
        return "text-blue-600 bg-blue-100";
      case "open":
        return "text-green-600 bg-green-100";
      case "clarification":
        return "text-yellow-600 bg-yellow-100";
      case "amendment":
        return "text-orange-600 bg-orange-100";
      case "closed":
        return "text-purple-600 bg-purple-100";
      case "evaluation":
        return "text-indigo-600 bg-indigo-100";
      case "awarded":
        return "text-emerald-600 bg-emerald-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "withheld":
        return "text-red-600 bg-red-100";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStageIcon = (status: WorkflowStage["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="size-5 text-green-600" />;
      case "current":
        return <Clock className="size-5 text-blue-600 animate-pulse" />;
      case "pending":
        return <AlertCircle className="size-5 text-muted-foreground" />;
      case "skipped":
        return <XCircle className="size-5 text-red-400" />;
    }
  };

  const currentStatus = statusHistory[0];
  const totalDuration = Math.floor((new Date().getTime() - statusHistory[statusHistory.length - 1].timestamp.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="RFQ Status History"
        description={`Workflow stage transitions for Tender ${id}`}
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export History
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Current Status Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Status</CardTitle>
                <CardDescription>Tender #{id} - Office Furniture Supply</CardDescription>
              </div>
              <Badge className={`${getStatusColor(currentStatus.status)} text-lg px-4 py-2`}>
                {currentStatus.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Calendar className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-lg font-semibold">
                  {statusHistory[statusHistory.length - 1].timestamp.toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <Clock className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-semibold">{totalDuration} days</div>
              </div>
              <div className="text-center">
                <TrendingUp className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Status Changes</div>
                <div className="text-lg font-semibold">{statusHistory.length}</div>
              </div>
              <div className="text-center">
                <Users className="size-8 mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Last Changed By</div>
                <div className="text-sm font-semibold">{currentStatus.changedBy.split(" ")[0]}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="timeline">Status Timeline</TabsTrigger>
            <TabsTrigger value="stages">Workflow Stages</TabsTrigger>
          </TabsList>

          {/* Status Timeline View */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Change History</CardTitle>
                <CardDescription>Chronological record of all status transitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {statusHistory.map((change, index) => {
                      const Icon = getStatusIcon(change.status);
                      const isFirst = index === 0;
                      const duration =
                        index < statusHistory.length - 1
                          ? Math.floor(
                              (change.timestamp.getTime() - statusHistory[index + 1].timestamp.getTime()) /
                                (1000 * 60 * 60)
                            )
                          : 0;

                      return (
                        <div key={change.id} className="relative pl-14">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-0">
                            <div
                              className={`size-12 rounded-full flex items-center justify-center ${getStatusColor(
                                change.status
                              )} ${isFirst ? "ring-4 ring-offset-2 ring-current" : ""}`}
                            >
                              <Icon className="size-6" />
                            </div>
                          </div>

                          <Card className={isFirst ? "border-2 border-primary" : ""}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-lg capitalize">{change.status.replace("_", " ")}</h4>
                                    {isFirst && <Badge variant="default">Current</Badge>}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{change.details}</p>
                                  {change.reason && (
                                    <div className="flex items-start gap-2 text-sm mb-2">
                                      <span className="text-muted-foreground">Reason:</span>
                                      <span className="font-medium">{change.reason}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Separator className="my-3" />

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="size-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground">Date & Time</div>
                                    <div className="font-medium">
                                      {change.timestamp.toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="size-4 text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground">Changed By</div>
                                    <div className="font-medium">{change.changedBy}</div>
                                  </div>
                                </div>
                                {duration > 0 && (
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="size-4 text-muted-foreground" />
                                    <div>
                                      <div className="text-muted-foreground">Duration in Status</div>
                                      <div className="font-medium">
                                        {duration < 24 ? `${duration} hours` : `${Math.floor(duration / 24)} days`}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Stages View */}
          <TabsContent value="stages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
                <CardDescription>Procurement process stages and current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        stage.status === "current"
                          ? "border-blue-500 bg-blue-50"
                          : stage.status === "completed"
                          ? "border-green-200 bg-green-50"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getStageIcon(stage.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{stage.stage}</h4>
                            <Badge
                              variant={
                                stage.status === "completed"
                                  ? "default"
                                  : stage.status === "current"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {stage.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{stage.notes}</p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            {stage.assignedTo && (
                              <div>
                                <span className="text-muted-foreground">Assigned to:</span>
                                <div className="font-medium">{stage.assignedTo}</div>
                              </div>
                            )}
                            {stage.startDate && (
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>
                                <div className="font-medium">{stage.startDate.toLocaleDateString()}</div>
                              </div>
                            )}
                            {stage.endDate && (
                              <div>
                                <span className="text-muted-foreground">End Date:</span>
                                <div className="font-medium">{stage.endDate.toLocaleDateString()}</div>
                              </div>
                            )}
                            {stage.duration && (
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <div className="font-medium">{stage.duration}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="size-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {workflowStages.filter((s) => s.status === "completed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="size-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {workflowStages.filter((s) => s.status === "current").length}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="size-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold text-muted-foreground">
                      {workflowStages.filter((s) => s.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="size-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((workflowStages.filter((s) => s.status === "completed").length / workflowStages.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}