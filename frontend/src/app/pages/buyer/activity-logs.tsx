import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Search, 
  Download, 
  FileStack,
  CheckCircle,
  Edit,
  Eye,
  LogIn,
  LogOut,
  UserPlus,
  Award,
  XCircle,
  FileJson
} from "lucide-react";
import { exportToCSV, exportToJSON } from "../../utils/export-logs";

export function PurchaserActivityLogs() {
  const activityLogs = [
    {
      id: 1,
      timestamp: "2026-03-11 13:15:42",
      user: "John Doe",
      action: "rfq.published",
      entityType: "rfq",
      entityName: "Office Furniture Supply",
      entityId: "RFQ-2024-001",
      details: "RFQ published with budget $50,000, closing date: 2024-02-28",
      ipAddress: "10.0.0.125",
      severity: "success",
    },
    {
      id: 2,
      timestamp: "2026-03-11 12:30:18",
      user: "John Doe",
      action: "rfq.updated",
      entityType: "rfq",
      entityName: "Office Furniture Supply",
      entityId: "RFQ-2024-001",
      details: "Updated technical specifications and delivery timeline",
      ipAddress: "10.0.0.125",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2026-03-11 11:45:33",
      user: "Jane Smith",
      action: "user.login",
      entityType: "session",
      entityName: "User Login",
      entityId: "SESSION-8812",
      details: "Successful login from Chrome on Windows",
      ipAddress: "10.0.0.88",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2026-03-11 10:20:55",
      user: "Sarah Johnson",
      action: "contract.awarded",
      entityType: "contract",
      entityName: "Medical Supplies Contract",
      entityId: "CNT-2024-012",
      details: "Contract awarded to ABC Suppliers Ltd. for $78,500",
      ipAddress: "10.0.0.201",
      severity: "success",
    },
    {
      id: 5,
      timestamp: "2026-03-11 09:15:27",
      user: "Sarah Johnson",
      action: "evaluation.completed",
      entityType: "evaluation",
      entityName: "Medical Supplies Evaluation",
      entityId: "EVAL-2024-020",
      details: "Completed evaluation of 10 bids, selected top 3 vendors",
      ipAddress: "10.0.0.201",
      severity: "success",
    },
    {
      id: 6,
      timestamp: "2026-03-11 08:45:12",
      user: "Mike Brown",
      action: "rfq.closed",
      entityType: "rfq",
      entityName: "Cleaning Services Contract",
      entityId: "RFQ-2024-003",
      details: "RFQ closed at deadline - 15 bids received",
      ipAddress: "10.0.0.156",
      severity: "success",
    },
    {
      id: 7,
      timestamp: "2026-03-11 07:30:45",
      user: "Mike Brown",
      action: "vendor.invited",
      entityType: "invitation",
      entityName: "Vendor Invitation",
      entityId: "INV-2024-055",
      details: "Invited Quality Products Ltd. to bid on RFQ-2024-003",
      ipAddress: "10.0.0.156",
      severity: "info",
    },
    {
      id: 8,
      timestamp: "2026-03-10 16:22:18",
      user: "Emma Davis",
      action: "evaluation.started",
      entityType: "evaluation",
      entityName: "IT Hardware Procurement Evaluation",
      entityId: "EVAL-2024-018",
      details: "Started evaluation process for 8 submitted bids",
      ipAddress: "10.0.0.99",
      severity: "info",
    },
    {
      id: 9,
      timestamp: "2026-03-10 15:10:33",
      user: "Emma Davis",
      action: "bid.viewed",
      entityType: "bid",
      entityName: "Bid from Tech Hardware Inc.",
      entityId: "BID-2024-045",
      details: "Viewed bid submission and supporting documents",
      ipAddress: "10.0.0.99",
      severity: "info",
    },
    {
      id: 10,
      timestamp: "2026-03-10 14:05:47",
      user: "Bob Wilson",
      action: "rfq.created",
      entityType: "rfq",
      entityName: "Construction Materials",
      entityId: "RFQ-2024-004",
      details: "Created draft RFQ with estimated budget of $250,000",
      ipAddress: "10.0.0.178",
      severity: "info",
    },
    {
      id: 11,
      timestamp: "2026-03-10 13:20:12",
      user: "John Doe",
      action: "team.invited",
      entityType: "team",
      entityName: "Team Member Invitation",
      entityId: "TEAM-2024-008",
      details: "Invited alice.cooper@acme.com to join procurement team",
      ipAddress: "10.0.0.125",
      severity: "info",
    },
    {
      id: 12,
      timestamp: "2026-03-10 12:15:28",
      user: "Jane Smith",
      action: "notification.updated",
      entityType: "settings",
      entityName: "Notification Preferences",
      entityId: "SET-USER-002",
      details: "Updated notification settings for bid submissions",
      ipAddress: "10.0.0.88",
      severity: "info",
    },
    {
      id: 13,
      timestamp: "2026-03-10 11:30:55",
      user: "Sarah Johnson",
      action: "document.uploaded",
      entityType: "document",
      entityName: "Technical Requirements Document",
      entityId: "DOC-2024-112",
      details: "Uploaded requirements document for RFQ-2024-005",
      ipAddress: "10.0.0.201",
      severity: "info",
    },
    {
      id: 14,
      timestamp: "2026-03-10 10:45:22",
      user: "Mike Brown",
      action: "clarification.posted",
      entityType: "clarification",
      entityName: "RFQ Clarification",
      entityId: "CLR-2024-033",
      details: "Posted clarification response to vendor question on RFQ-2024-003",
      ipAddress: "10.0.0.156",
      severity: "info",
    },
    {
      id: 15,
      timestamp: "2026-03-10 09:20:18",
      user: "Emma Davis",
      action: "rfq.extended",
      entityType: "rfq",
      entityName: "IT Hardware Procurement",
      entityId: "RFQ-2024-002",
      details: "Extended submission deadline by 5 days to 2024-02-20",
      ipAddress: "10.0.0.99",
      severity: "warning",
    },
    {
      id: 16,
      timestamp: "2026-03-10 08:15:44",
      user: "Bob Wilson",
      action: "vendor.prequalified",
      entityType: "vendor",
      entityName: "Construction Materials Co.",
      entityId: "VND-003",
      details: "Vendor pre-qualified for construction category RFQs",
      ipAddress: "10.0.0.178",
      severity: "success",
    },
    {
      id: 17,
      timestamp: "2026-03-10 07:30:12",
      user: "John Doe",
      action: "report.generated",
      entityType: "report",
      entityName: "Monthly Procurement Report",
      entityId: "RPT-2024-003",
      details: "Generated procurement activity report for February 2024",
      ipAddress: "10.0.0.125",
      severity: "info",
    },
    {
      id: 18,
      timestamp: "2026-03-09 17:45:33",
      user: "Jane Smith",
      action: "user.logout",
      entityType: "session",
      entityName: "User Logout",
      entityId: "SESSION-8801",
      details: "User logged out successfully",
      ipAddress: "10.0.0.88",
      severity: "info",
    },
    {
      id: 19,
      timestamp: "2026-03-09 16:20:15",
      user: "Sarah Johnson",
      action: "contract.signed",
      entityType: "contract",
      entityName: "Software Licenses Contract",
      entityId: "CNT-2024-010",
      details: "Digital signature applied to contract document",
      ipAddress: "10.0.0.201",
      severity: "success",
    },
    {
      id: 20,
      timestamp: "2026-03-09 15:10:42",
      user: "Mike Brown",
      action: "bid.rejected",
      entityType: "bid",
      entityName: "Bid from Budget Supplies Inc.",
      entityId: "BID-2024-028",
      details: "Bid rejected - Did not meet minimum technical requirements",
      ipAddress: "10.0.0.156",
      severity: "warning",
    },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <LogIn className="size-4 text-green-600" />;
    if (action.includes("logout")) return <LogOut className="size-4 text-muted-foreground" />;
    if (action.includes("created")) return <FileStack className="size-4 text-blue-600" />;
    if (action.includes("updated")) return <Edit className="size-4 text-blue-600" />;
    if (action.includes("published")) return <FileStack className="size-4 text-indigo-600" />;
    if (action.includes("awarded")) return <Award className="size-4 text-yellow-600" />;
    if (action.includes("completed")) return <CheckCircle className="size-4 text-green-600" />;
    if (action.includes("invited")) return <UserPlus className="size-4 text-blue-600" />;
    if (action.includes("rejected")) return <XCircle className="size-4 text-red-600" />;
    return <Eye className="size-4 text-muted-foreground" />;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "success":
        return <Badge className="bg-green-600">Success</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "info":
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Activity Logs"
        description="Complete audit trail of all your organization's procurement activities"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(activityLogs, "my_organization_activity_logs")}>
              <Download className="size-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportToJSON(activityLogs, "my_organization_activity_logs")}>
              <FileJson className="size-4 mr-2" />
              Export JSON
            </Button>
          </div>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Activities</div>
            <div className="text-3xl font-bold mt-1">{activityLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">This Week</div>
            <div className="text-3xl font-bold mt-1">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">RFQs Published</div>
            <div className="text-3xl font-bold mt-1 text-indigo-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Contracts Awarded</div>
            <div className="text-3xl font-bold mt-1 text-green-600">2</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input placeholder="Search activity logs..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all-actions">
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="rfq">RFQ Actions</SelectItem>
                <SelectItem value="evaluation">Evaluations</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
                <SelectItem value="vendor">Vendor Management</SelectItem>
                <SelectItem value="team">Team Actions</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-users">
              <SelectTrigger>
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">All Users</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Brown</SelectItem>
                <SelectItem value="emma">Emma Davis</SelectItem>
                <SelectItem value="bob">Bob Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="md:hidden space-y-4">
            {activityLogs.map((log) => (
              <Card key={log.id} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="font-medium text-sm">{log.action}</span>
                    </div>
                    {getSeverityBadge(log.severity)}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">{log.entityName}</div>
                    <div className="text-xs text-muted-foreground">{log.entityId}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {log.details}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t mt-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">{log.user}</span>
                    </div>
                    <span className="font-mono">{log.timestamp.split(' ')[0]}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.user}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{log.entityName}</div>
                        <div className="text-sm text-muted-foreground">{log.entityId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-muted-foreground">{log.details}</div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}