import { useState } from "react";
import { Link, useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  FileText, Download, CheckCircle, Clock, AlertTriangle, Calendar,
  DollarSign, Building2, User, ArrowRight, Upload, Bell, History,
  TrendingUp, Shield, ChevronDown, ChevronUp, Paperclip
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function ContractDashboard() {
  const { id } = useParams();
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  // Fetch milestones from API with mock fallback
  const { data: apiMilestones } = useApiOrMock(
    () => contractsApi.getMilestones(id!),
    [] as any[],
    [id],
  );

  const contract = apiContract || {
    id: id || "C-2026-0042",
    tenderId: "TND-2026-0089",
    tenderTitle: "Supply of Office Equipment & IT Infrastructure",
    vendor: "ABC Builders Ltd",
    vendorId: "VND-0023",
    value: 12450000,
    currency: "BDT",
    signedDate: "2026-03-10",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    status: "active" as const,
    procurementHead: "Md. Rafiqul Islam",
    contractManager: "Sarah Ahmed",
    totalMilestones: 8,
    completedMilestones: 3,
    progress: 37.5,
    totalVariations: 1,
    pendingPayments: 2,
  };

  const milestones = apiMilestones || [
    {
      id: 1, no: 1, name: "Advance Payment", description: "20% advance payment upon contract signing",
      dueDate: "2026-03-20", completedDate: "2026-03-20", amount: 2490000,
      status: "completed" as const, evidence: ["Payment Receipt.pdf"],
    },
    {
      id: 2, no: 2, name: "Site Mobilization", description: "Mobilize equipment and personnel to project site",
      dueDate: "2026-04-05", completedDate: "2026-04-03", amount: 1867500,
      status: "completed" as const, evidence: ["Mobilization Report.pdf", "Site Photos.zip"],
    },
    {
      id: 3, no: 3, name: "Delivery of Materials", description: "First batch of materials delivered and inspected",
      dueDate: "2026-05-01", completedDate: "2026-04-28", amount: 1867500,
      status: "completed" as const, evidence: ["Delivery Receipt.pdf", "Inspection Certificate.pdf"],
    },
    {
      id: 4, no: 4, name: "Phase 1 Installation", description: "Complete installation of first floor equipment",
      dueDate: "2026-06-15", completedDate: null, amount: 1867500,
      status: "in-progress" as const, evidence: [],
    },
    {
      id: 5, no: 5, name: "Phase 2 Installation", description: "Complete installation of second floor equipment",
      dueDate: "2026-08-01", completedDate: null, amount: 1245000,
      status: "pending" as const, evidence: [],
    },
    {
      id: 6, no: 6, name: "Testing & Commissioning", description: "Full system testing and commissioning",
      dueDate: "2026-10-15", completedDate: null, amount: 1245000,
      status: "pending" as const, evidence: [],
    },
    {
      id: 7, no: 7, name: "Training & Handover", description: "Staff training and system handover",
      dueDate: "2026-12-01", completedDate: null, amount: 622500,
      status: "pending" as const, evidence: [],
    },
    {
      id: 8, no: 8, name: "Final Payment & Defects Liability", description: "Final payment after defects liability period",
      dueDate: "2027-03-14", completedDate: null, amount: 1245000,
      status: "pending" as const, evidence: [],
    },
  ];

  const recentActivity = [
    { date: "2026-04-28", action: "Milestone 3 completed", user: "Sarah Ahmed", type: "milestone" },
    { date: "2026-04-25", action: "Variation #1 approved by Auditor", user: "System", type: "variation" },
    { date: "2026-04-20", action: "Variation request submitted (Cost +BDT 350,000)", user: "Sarah Ahmed", type: "variation" },
    { date: "2026-04-03", action: "Milestone 2 completed ahead of schedule", user: "Sarah Ahmed", type: "milestone" },
    { date: "2026-03-20", action: "Advance payment disbursed", user: "Finance Dept", type: "payment" },
    { date: "2026-03-10", action: "Contract signed", user: "Md. Rafiqul Islam", type: "contract" },
  ];

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    pending: "bg-muted text-muted-foreground",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    completed: <CheckCircle className="size-4 text-green-600 dark:text-green-400" />,
    "in-progress": <Clock className="size-4 text-blue-600 dark:text-blue-400" />,
    pending: <Clock className="size-4 text-muted-foreground" />,
    overdue: <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", { style: "decimal", minimumFractionDigits: 0 }).format(amount);
  };

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Timeline positions
  const totalDays = (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDays = (new Date().getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24);
  const timeProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Contract #${contract.id}`}
        description={contract.tenderTitle}
        backTo="/tenders"
        backLabel="Back to Tenders"
        actions={
          <div className="flex items-center gap-2">
            <Badge className={contract.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}>
              {contract.status === "active" ? "Active" : contract.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-1.5" /> Export
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contract Value</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(contract.value)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-lg font-bold text-foreground">{contract.completedMilestones}/{contract.totalMilestones} Milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Milestone</p>
                <p className="text-lg font-bold text-foreground">{getDaysRemaining("2026-06-15")} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Variations</p>
                <p className="text-lg font-bold text-foreground">{contract.totalVariations} Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Contract Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contract Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendor</span>
              <span className="font-medium text-foreground">{contract.vendor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Procurement Head</span>
              <span className="font-medium text-foreground">{contract.procurementHead}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Manager</span>
              <span className="font-medium text-foreground">{contract.contractManager}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Signed</span>
              <span className="font-medium text-foreground">{contract.signedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date</span>
              <span className="font-medium text-foreground">{contract.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End Date</span>
              <span className="font-medium text-foreground">{contract.endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tender Ref</span>
              <Link to={`/tenders/${contract.tenderId}`} className="text-blue-600 hover:underline dark:text-blue-400">{contract.tenderId}</Link>
            </div>
          </CardContent>
        </Card>

        {/* Right: Timeline / Progress */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contract Timeline</CardTitle>
            <CardDescription>
              {contract.startDate} to {contract.endDate} ({Math.round(totalDays)} days total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Start: {contract.startDate}</span>
                <span>{Math.round(timeProgress)}% elapsed</span>
                <span>End: {contract.endDate}</span>
              </div>
              <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-blue-500/20 dark:bg-blue-500/30 rounded-full" style={{ width: `${timeProgress}%` }} />
                <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full" style={{ width: `${contract.progress}%` }} />
                {/* Milestone markers */}
                {milestones.map((m) => {
                  const mDays = (new Date(m.dueDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24);
                  const mPos = (mDays / totalDays) * 100;
                  return (
                    <div
                      key={m.id}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background"
                      style={{ left: `${mPos}%`, backgroundColor: m.status === "completed" ? "#22c55e" : m.status === "in-progress" ? "#3b82f6" : "#d1d5db" }}
                      title={`M${m.no}: ${m.name} (${m.dueDate})`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-4">
              {milestones.slice(0, 8).map((m) => (
                <div key={m.id} className="flex items-center gap-1.5">
                  {statusIcons[m.status]}
                  <span className="text-muted-foreground truncate">M{m.no}: {m.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Milestones, Activity, Documents */}
      <Tabs defaultValue="milestones">
        <TabsList className="mb-4">
          <TabsTrigger value="milestones">Milestones ({milestones.length})</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="quickactions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {milestones.map((m) => (
                  <div key={m.id} className="p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedMilestone(expandedMilestone === m.id ? null : m.id)}
                    >
                      <div className="flex items-center gap-3">
                        {statusIcons[m.status]}
                        <div>
                          <p className="font-medium text-foreground">
                            Milestone {m.no}: {m.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Due: {m.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[m.status]}>{m.status === "in-progress" ? "In Progress" : m.status.charAt(0).toUpperCase() + m.status.slice(1)}</Badge>
                        <span className="text-sm font-medium text-muted-foreground">BDT {formatCurrency(m.amount)}</span>
                        {expandedMilestone === m.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                    </div>
                    {expandedMilestone === m.id && (
                      <div className="mt-3 pl-7 space-y-2 text-sm">
                        <p className="text-muted-foreground">{m.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium text-foreground">{((m.amount / contract.value) * 100).toFixed(0)}% of contract value</span>
                        </div>
                        {m.completedDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">{m.completedDate}</span>
                          </div>
                        )}
                        {m.evidence.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Paperclip className="size-3.5 text-muted-foreground" />
                            {m.evidence.map((e, i) => (
                              <span key={i} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-xs">{e}</span>
                            ))}
                          </div>
                        )}
                        {m.status !== "completed" && (
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline"><Upload className="size-3.5 mr-1" /> Upload Evidence</Button>
                            <Button size="sm"><CheckCircle className="size-3.5 mr-1" /> Mark Complete</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-full ${
                      a.type === "milestone" ? "bg-green-100 dark:bg-green-900/30" :
                      a.type === "variation" ? "bg-orange-100 dark:bg-orange-900/30" :
                      a.type === "payment" ? "bg-blue-100 dark:bg-blue-900/30" :
                      "bg-purple-100 dark:bg-purple-900/30"
                    }`}>
                      {a.type === "milestone" && <CheckCircle className="size-3.5 text-green-600 dark:text-green-400" />}
                      {a.type === "variation" && <AlertTriangle className="size-3.5 text-orange-600 dark:text-orange-400" />}
                      {a.type === "payment" && <DollarSign className="size-3.5 text-blue-600 dark:text-blue-400" />}
                      {a.type === "contract" && <FileText className="size-3.5 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.user} - {a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickactions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to={`/contracts/${contract.id}/variations/new`}>
              <Card className="hover:border-orange-300 dark:hover:border-orange-600 transition-colors cursor-pointer">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <AlertTriangle className="size-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Request Variation</p>
                    <p className="text-xs text-muted-foreground">Submit a change order</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Link to={`/contracts/${contract.id}/payments/new`}>
              <Card className="hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Request Payment</p>
                    <p className="text-xs text-muted-foreground">Submit payment certificate</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Link to={`/contracts/${contract.id}/performance`}>
              <Card className="hover:border-green-300 dark:hover:border-green-600 transition-colors cursor-pointer">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Rate Performance</p>
                    <p className="text-xs text-muted-foreground">Vendor rating & feedback</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Link to={`/contracts/${contract.id}/history`}>
              <Card className="hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <History className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">View Audit Trail</p>
                    <p className="text-xs text-muted-foreground">Full contract history</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Link to={`/contracts/${contract.id}/milestones`}>
              <Card className="hover:border-teal-300 dark:hover:border-teal-600 transition-colors cursor-pointer">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="p-2.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Calendar className="size-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Milestone Tracker</p>
                    <p className="text-xs text-muted-foreground">Manage deliverables</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Card className="hover:border-red-300 dark:hover:border-red-600 transition-colors cursor-pointer">
              <CardContent className="pt-5 pb-4 flex items-center gap-3">
                <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Bell className="size-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Send Notification</p>
                  <p className="text-xs text-muted-foreground">Notify vendor/team</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground ml-auto" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}