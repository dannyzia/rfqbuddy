import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { CheckCircle, Clock, AlertCircle, Calendar, FileText } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function MilestoneTracking() {
  const { id } = useParams();

  // Fetch contract and milestones from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  const { data: apiMilestones } = useApiOrMock(
    () => contractsApi.getMilestones(id!),
    [] as any[],
    [id],
  );

  const milestones = apiMilestones.length > 0 ? apiMilestones.map((m: any, i: number) => ({
    id: i + 1,
    name: m.title,
    description: m.description || "",
    dueDate: m.due_date,
    amount: m.amount ? `$${Number(m.amount).toLocaleString()}` : undefined,
    status: m.status,
    progress: m.status === "completed" ? 100 : m.status === "in_progress" ? 50 : 0,
  })) : [
    {
      id: 1,
      name: "Contract Signing",
      description: "Execute and finalize contract documents",
      dueDate: "2026-03-20",
      completedDate: "2026-03-20",
      status: "completed",
      progress: 100,
      deliverables: ["Signed Contract", "Purchase Order"],
    },
    {
      id: 2,
      name: "Manufacturing & Preparation",
      description: "Manufacture and prepare items for delivery",
      dueDate: "2026-04-10",
      completedDate: "2026-04-09",
      status: "completed",
      progress: 100,
      deliverables: ["Production Report", "Quality Inspection Certificate"],
    },
    {
      id: 3,
      name: "Delivery & Installation",
      description: "Deliver all items to site and complete installation",
      dueDate: "2026-04-15",
      completedDate: null,
      status: "in-progress",
      progress: 65,
      deliverables: ["Delivery Receipt", "Installation Report"],
    },
    {
      id: 4,
      name: "Training & Handover",
      description: "Conduct staff training and system handover",
      dueDate: "2026-04-18",
      completedDate: null,
      status: "pending",
      progress: 0,
      deliverables: ["Training Materials", "Handover Certificate"],
    },
    {
      id: 5,
      name: "Final Acceptance",
      description: "Final inspection and acceptance of deliverables",
      dueDate: "2026-04-20",
      completedDate: null,
      status: "pending",
      progress: 0,
      deliverables: ["Acceptance Certificate", "Warranty Documents"],
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="size-6 text-green-600" />;
    if (status === "in-progress") return <Clock className="size-6 text-blue-600" />;
    if (status === "at-risk") return <AlertCircle className="size-6 text-orange-600" />;
    return <div className="size-6 border-2 border-muted-foreground rounded-full"></div>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return <Badge className="bg-green-600">Completed</Badge>;
    if (status === "in-progress") return <Badge className="bg-blue-600">In Progress</Badge>;
    if (status === "at-risk") return <Badge className="bg-orange-600">At Risk</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-50 border-green-200";
    if (status === "in-progress") return "bg-blue-50 border-blue-200";
    if (status === "at-risk") return "bg-orange-50 border-orange-200";
    return "";
  };

  const overallProgress = Math.round(
    milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Milestone Tracking"
        description="CNT-2024-001: Office Furniture Supply - XYZ Manufacturing"
        actions={
          <Button>
            <FileText className="size-4 mr-2" />
            Generate Progress Report
          </Button>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contract Completion</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} />
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <span>Start Date: March 20, 2026</span>
              <span>Expected Completion: April 20, 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Milestones</div>
            <div className="text-3xl font-bold mt-1">{milestones.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-3xl font-bold mt-1 text-green-600">
              {milestones.filter(m => m.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-3xl font-bold mt-1 text-blue-600">
              {milestones.filter(m => m.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-3xl font-bold mt-1 text-muted-foreground">
              {milestones.filter(m => m.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id} className={`${getStatusColor(milestone.status)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(milestone.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                        {milestone.id}
                      </div>
                      <CardTitle>{milestone.name}</CardTitle>
                      {getStatusBadge(milestone.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Timeline</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-semibold">{milestone.dueDate}</span>
                    </div>
                    {milestone.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-semibold text-green-600">{milestone.completedDate}</span>
                      </div>
                    )}
                    {milestone.status === "in-progress" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Days Remaining:</span>
                        <span className="font-semibold">4 days</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Deliverables</span>
                  </div>
                  <ul className="space-y-1">
                    {milestone.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        {milestone.status === "completed" ? (
                          <CheckCircle className="size-4 text-green-600" />
                        ) : (
                          <div className="size-4 border border-muted-foreground rounded"></div>
                        )}
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="font-semibold">{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} />
              </div>

              {milestone.status === "in-progress" && (
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <Label className="text-sm">Progress Update</Label>
                    <Textarea
                      rows={2}
                      placeholder="Add progress notes, blockers, or updates..."
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Update Progress</Button>
                    <Button size="sm" variant="outline">
                      Upload Document
                    </Button>
                    {milestone.progress === 100 && (
                      <Button size="sm" className="bg-green-600">
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {milestone.status === "completed" && (
                <div className="border-t pt-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="font-medium text-green-900 mb-1">Milestone Completed</div>
                    <div className="text-green-700">
                      All deliverables submitted and approved on {milestone.completedDate}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Milestone Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex-shrink-0">
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{milestone.name}</div>
                        <div className="text-sm text-muted-foreground">Due: {milestone.dueDate}</div>
                      </div>
                      {getStatusBadge(milestone.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}