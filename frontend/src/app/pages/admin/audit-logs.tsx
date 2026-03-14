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
  Shield,
  FileJson,
  PlayCircle,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { exportToCSV, exportToJSON } from "../../utils/export-logs";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

export function AdminAuditLogs() {
  const { data: apiLogs } = useApiOrMock(
    () => adminApi.getAdminAuditLogs(),
    [],
  );

  const auditLogs = [
    {
      id: 1,
      timestamp: "2026-03-11 14:32:15",
      actor: "Admin User",
      actorType: "admin",
      action: "user.withheld",
      entityType: "vendor",
      entityName: "Industrial Machines Co.",
      entityId: "VND-008",
      details: "Vendor account withheld due to quality compliance investigation",
      ipAddress: "192.168.1.45",
      severity: "warning",
    },
    {
      id: 2,
      timestamp: "2026-03-11 14:28:03",
      actor: "Admin User",
      actorType: "admin",
      action: "rfq.withheld",
      entityType: "rfq",
      entityName: "Security Equipment",
      entityId: "RFQ-2024-007",
      details: "RFQ withheld - Specification disputes under review",
      ipAddress: "192.168.1.45",
      severity: "warning",
    },
    {
      id: 3,
      timestamp: "2026-03-11 13:15:42",
      actor: "John Doe",
      actorType: "purchaser",
      action: "rfq.published",
      entityType: "rfq",
      entityName: "Office Furniture Supply",
      entityId: "RFQ-2024-001",
      details: "RFQ published with budget $50,000",
      ipAddress: "10.0.0.125",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2026-03-11 12:45:18",
      actor: "Alice Johnson",
      actorType: "vendor",
      action: "bid.submitted",
      entityType: "bid",
      entityName: "Bid for IT Hardware Procurement",
      entityId: "BID-2024-045",
      details: "Submitted bid amount: $115,000 for RFQ-2024-002",
      ipAddress: "203.45.78.92",
      severity: "info",
    },
    {
      id: 5,
      timestamp: "2026-03-11 11:30:55",
      actor: "Admin User",
      actorType: "admin",
      action: "purchaser.approved",
      entityType: "purchaser",
      entityName: "Finance Group Inc.",
      entityId: "PUR-004",
      details: "Purchaser organization approved after verification",
      ipAddress: "192.168.1.45",
      severity: "success",
    },
    {
      id: 6,
      timestamp: "2026-03-11 10:22:33",
      actor: "Admin User",
      actorType: "admin",
      action: "vendor.rejected",
      entityType: "vendor",
      entityName: "Fake Supplies Ltd.",
      entityId: "VND-012",
      details: "Vendor registration rejected - Fraudulent documentation detected",
      ipAddress: "192.168.1.45",
      severity: "error",
    },
    {
      id: 7,
      timestamp: "2026-03-11 09:15:27",
      actor: "Jane Smith",
      actorType: "purchaser",
      action: "user.login",
      entityType: "session",
      entityName: "User Login",
      entityId: "SESSION-7723",
      details: "Successful login from Chrome browser",
      ipAddress: "10.0.0.88",
      severity: "info",
    },
    {
      id: 8,
      timestamp: "2026-03-11 08:45:12",
      actor: "Mike Brown",
      actorType: "purchaser",
      action: "rfq.closed",
      entityType: "rfq",
      entityName: "Cleaning Services Contract",
      entityId: "RFQ-2024-003",
      details: "RFQ closed - Submission deadline reached, 15 bids received",
      ipAddress: "10.0.0.156",
      severity: "info",
    },
    {
      id: 9,
      timestamp: "2026-03-11 08:12:45",
      actor: "Admin User",
      actorType: "admin",
      action: "user.activated",
      entityType: "purchaser",
      entityName: "BuildRight Construction",
      entityId: "PUR-007",
      details: "Purchaser account reactivated after compliance review",
      ipAddress: "192.168.1.45",
      severity: "success",
    },
    {
      id: 10,
      timestamp: "2026-03-10 17:55:33",
      actor: "Sarah Johnson",
      actorType: "purchaser",
      action: "contract.awarded",
      entityType: "contract",
      entityName: "Medical Supplies Contract",
      entityId: "CNT-2024-012",
      details: "Contract awarded to ABC Suppliers Ltd. - Value: $78,500",
      ipAddress: "10.0.0.201",
      severity: "success",
    },
    {
      id: 11,
      timestamp: "2026-03-10 16:30:22",
      actor: "David Lee",
      actorType: "vendor",
      action: "profile.updated",
      entityType: "vendor",
      entityName: "Tech Hardware Inc.",
      entityId: "VND-002",
      details: "Updated company certifications: Added CE, FCC",
      ipAddress: "203.45.78.145",
      severity: "info",
    },
    {
      id: 12,
      timestamp: "2026-03-10 15:18:09",
      actor: "Admin User",
      actorType: "admin",
      action: "rfq.deleted",
      entityType: "rfq",
      entityName: "Incomplete Procurement Draft",
      entityId: "RFQ-2024-099",
      details: "Draft RFQ permanently deleted by admin request",
      ipAddress: "192.168.1.45",
      severity: "error",
    },
    {
      id: 13,
      timestamp: "2026-03-10 14:05:47",
      actor: "Emma Davis",
      actorType: "purchaser",
      action: "evaluation.completed",
      entityType: "evaluation",
      entityName: "IT Hardware Procurement Evaluation",
      entityId: "EVAL-2024-018",
      details: "Bid evaluation completed - 8 bids scored and ranked",
      ipAddress: "10.0.0.99",
      severity: "success",
    },
    {
      id: 14,
      timestamp: "2026-03-10 13:42:31",
      actor: "Robert Brown",
      actorType: "vendor",
      action: "user.registered",
      entityType: "vendor",
      entityName: "Premier Services Inc.",
      entityId: "VND-006",
      details: "New vendor registration submitted - Pending approval",
      ipAddress: "203.45.78.220",
      severity: "info",
    },
    {
      id: 15,
      timestamp: "2026-03-10 12:28:15",
      actor: "Tom Clark",
      actorType: "purchaser",
      action: "user.logout",
      entityType: "session",
      entityName: "User Logout",
      entityId: "SESSION-7701",
      details: "User logged out successfully",
      ipAddress: "10.0.0.134",
      severity: "info",
    },
    {
      id: 16,
      timestamp: "2026-03-10 11:15:52",
      actor: "Admin User",
      actorType: "admin",
      action: "settings.updated",
      entityType: "platform",
      entityName: "Platform Settings",
      entityId: "SET-001",
      details: "Updated email notification settings for bid submissions",
      ipAddress: "192.168.1.45",
      severity: "info",
    },
    {
      id: 17,
      timestamp: "2026-03-10 10:05:38",
      actor: "Lisa Anderson",
      actorType: "vendor",
      action: "bid.withdrawn",
      entityType: "bid",
      entityName: "Bid for Office Furniture Supply",
      entityId: "BID-2024-032",
      details: "Bid withdrawn by vendor before deadline",
      ipAddress: "203.45.78.167",
      severity: "warning",
    },
    {
      id: 18,
      timestamp: "2026-03-10 09:30:12",
      actor: "Admin User",
      actorType: "admin",
      action: "user.deleted",
      entityType: "vendor",
      entityName: "Unverified Vendor Co.",
      entityId: "VND-011",
      details: "Rejected vendor account permanently deleted",
      ipAddress: "192.168.1.45",
      severity: "error",
    },
    {
      id: 19,
      timestamp: "2026-03-10 08:45:27",
      actor: "Bob Wilson",
      actorType: "purchaser",
      action: "rfq.created",
      entityType: "rfq",
      entityName: "Construction Materials",
      entityId: "RFQ-2024-004",
      details: "Draft RFQ created - Budget: $250,000",
      ipAddress: "10.0.0.178",
      severity: "info",
    },
    {
      id: 20,
      timestamp: "2026-03-10 07:22:15",
      actor: "John Smith",
      actorType: "vendor",
      action: "document.uploaded",
      entityType: "document",
      entityName: "ISO 9001 Certificate",
      entityId: "DOC-2024-089",
      details: "Uploaded certification document to vendor profile",
      ipAddress: "203.45.78.98",
      severity: "info",
    },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <LogIn className="size-4 text-green-600" />;
    if (action.includes("logout")) return <LogOut className="size-4 text-muted-foreground" />;
    if (action.includes("approved")) return <CheckCircle className="size-4 text-green-600" />;
    if (action.includes("rejected")) return <XCircle className="size-4 text-red-600" />;
    if (action.includes("withheld")) return <Shield className="size-4 text-yellow-600" />;
    if (action.includes("deleted")) return <Trash2 className="size-4 text-red-600" />;
    if (action.includes("activated")) return <PlayCircle className="size-4 text-green-600" />;
    if (action.includes("created")) return <FileStack className="size-4 text-blue-600" />;
    if (action.includes("updated")) return <Edit className="size-4 text-blue-600" />;
    if (action.includes("published")) return <FileStack className="size-4 text-indigo-600" />;
    if (action.includes("submitted")) return <FileStack className="size-4 text-purple-600" />;
    if (action.includes("awarded")) return <Award className="size-4 text-green-600" />;
    if (action.includes("registered")) return <UserPlus className="size-4 text-blue-600" />;
    if (action.includes("withdrawn")) return <AlertTriangle className="size-4 text-orange-600" />;
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

  const getActorTypeBadge = (actorType: string) => {
    switch (actorType) {
      case "admin":
        return <Badge className="bg-purple-600">Admin</Badge>;
      case "purchaser":
        return <Badge className="bg-blue-600">Purchaser</Badge>;
      case "vendor":
        return <Badge className="bg-green-600">Vendor</Badge>;
      default:
        return <Badge variant="secondary">{actorType}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="System Audit Logs"
        description="Complete audit trail of all activities across the platform"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportToCSV(auditLogs, "audit_logs.csv")}
            >
              <Download className="size-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToJSON(auditLogs, "audit_logs.json")}
            >
              <FileJson className="size-4 mr-2" />
              Export JSON
            </Button>
          </div>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Events</div>
            <div className="text-3xl font-bold mt-1">{auditLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-3xl font-bold mt-1">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-3xl font-bold mt-1 text-red-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Warnings</div>
            <div className="text-3xl font-bold mt-1 text-yellow-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Admin Actions</div>
            <div className="text-3xl font-bold mt-1 text-purple-600">8</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input placeholder="Search logs by actor, entity, or details..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all-actions">
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="login">User Login</SelectItem>
                <SelectItem value="logout">User Logout</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withheld">Withheld</SelectItem>
                <SelectItem value="activated">Activated</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-actors">
              <SelectTrigger>
                <SelectValue placeholder="Actor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actors">All Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="purchaser">Purchasers</SelectItem>
                <SelectItem value="vendor">Vendors</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-severity">
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-severity">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{log.actor}</div>
                        {getActorTypeBadge(log.actorType)}
                      </div>
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
                        <div className="text-sm text-muted-foreground">
                          {log.entityType} • {log.entityId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-muted-foreground">{log.details}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}