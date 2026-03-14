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
  Upload,
  AlertTriangle,
  XCircle,
  Building2,
  FileJson
} from "lucide-react";
import { exportToCSV, exportToJSON } from "../../utils/export-logs";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

export function AdminVendorLogs() {
  const { data: apiLogs } = useApiOrMock(
    () => adminApi.getAllLogs({ page: 1, pageSize: 50 }),
    { data: [], total: 0, page: 1, pageSize: 50 },
  );

  const activityLogs = [
    {
      id: 1,
      timestamp: "2026-03-11 12:45:18",
      vendor: "Tech Hardware Inc.",
      user: "Alice Johnson",
      action: "bid.submitted",
      entityType: "bid",
      entityName: "Bid for IT Hardware Procurement",
      entityId: "BID-2024-045",
      details: "Submitted bid with amount $115,000 for RFQ-2024-002",
      ipAddress: "203.45.78.92",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2026-03-11 11:30:22",
      vendor: "Tech Hardware Inc.",
      user: "Alice Johnson",
      action: "document.uploaded",
      entityType: "document",
      entityName: "Technical Proposal Document",
      entityId: "DOC-2024-156",
      details: "Uploaded technical proposal for RFQ-2024-002",
      ipAddress: "203.45.78.92",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2026-03-11 10:15:45",
      vendor: "Tech Hardware Inc.",
      user: "Alice Johnson",
      action: "rfq.viewed",
      entityType: "rfq",
      entityName: "IT Hardware Procurement",
      entityId: "RFQ-2024-002",
      details: "Viewed RFQ details and technical requirements",
      ipAddress: "203.45.78.92",
      status: "info",
    },
    {
      id: 4,
      timestamp: "2026-03-11 09:30:12",
      vendor: "Tech Hardware Inc.",
      user: "David Lee",
      action: "profile.updated",
      entityType: "profile",
      entityName: "Company Profile",
      entityId: "PROF-VND-002",
      details: "Updated company certifications: Added CE, FCC compliance",
      ipAddress: "203.45.78.145",
      status: "success",
    },
    {
      id: 5,
      timestamp: "2026-03-11 08:45:33",
      vendor: "ABC Suppliers Ltd.",
      user: "Mark Thompson",
      action: "user.login",
      entityType: "session",
      entityName: "User Login",
      entityId: "SESSION-9923",
      details: "Successful login from Firefox on macOS",
      ipAddress: "203.45.79.10",
      status: "info",
    },
    {
      id: 6,
      timestamp: "2026-03-10 17:20:45",
      vendor: "Quality Products Ltd.",
      user: "Lisa Anderson",
      action: "bid.revised",
      entityType: "bid",
      entityName: "Bid for Office Furniture Supply",
      entityId: "BID-2024-032",
      details: "Revised bid amount from $52,000 to $48,500",
      ipAddress: "203.45.78.167",
      status: "warning",
    },
    {
      id: 7,
      timestamp: "2026-03-10 16:15:28",
      vendor: "Quality Products Ltd.",
      user: "Lisa Anderson",
      action: "clarification.requested",
      entityType: "clarification",
      entityName: "RFQ Clarification Request",
      entityId: "CLR-2024-033",
      details: "Requested clarification on delivery timeline for RFQ-2024-003",
      ipAddress: "203.45.78.167",
      status: "info",
    },
    {
      id: 8,
      timestamp: "2026-03-10 15:30:15",
      vendor: "Construction Materials Co.",
      user: "Robert Brown",
      action: "document.uploaded",
      entityType: "document",
      entityName: "ISO 9001 Certificate",
      entityId: "DOC-2024-145",
      details: "Uploaded ISO 9001:2015 certification to company profile",
      ipAddress: "203.45.78.220",
      status: "success",
    },
    {
      id: 9,
      timestamp: "2026-03-10 14:45:22",
      vendor: "Premier Services Inc.",
      user: "Jennifer White",
      action: "rfq.bookmarked",
      entityType: "rfq",
      entityName: "Construction Materials",
      entityId: "RFQ-2024-004",
      details: "Bookmarked RFQ for future reference",
      ipAddress: "203.45.79.55",
      status: "info",
    },
    {
      id: 10,
      timestamp: "2026-03-10 13:20:18",
      vendor: "ABC Suppliers Ltd.",
      user: "Mark Thompson",
      action: "notification.read",
      entityType: "notification",
      entityName: "New RFQ Notification",
      entityId: "NOTIF-2024-788",
      details: "Read notification about new RFQ in Technology category",
      ipAddress: "203.45.79.10",
      status: "info",
    },
    {
      id: 11,
      timestamp: "2026-03-10 12:10:33",
      vendor: "ABC Suppliers Ltd.",
      user: "Mark Thompson",
      action: "bid.won",
      entityType: "contract",
      entityName: "Medical Supplies Contract",
      entityId: "CNT-2024-012",
      details: "Notification: Your bid was selected for contract award",
      ipAddress: "203.45.79.10",
      status: "success",
    },
    {
      id: 12,
      timestamp: "2026-03-10 11:25:47",
      vendor: "Office Solutions Inc.",
      user: "Kevin Davis",
      action: "contract.signed",
      entityType: "contract",
      entityName: "Furniture Supply Contract",
      entityId: "CNT-2024-009",
      details: "Digital signature applied to contract agreement",
      ipAddress: "203.45.79.88",
      status: "success",
    },
    {
      id: 13,
      timestamp: "2026-03-10 10:40:12",
      vendor: "Security Systems Ltd.",
      user: "Patricia Moore",
      action: "bid.withdrawn",
      entityType: "bid",
      entityName: "Bid for Security Equipment",
      entityId: "BID-2024-038",
      details: "Bid withdrawn before deadline due to resource constraints",
      ipAddress: "203.45.79.122",
      status: "warning",
    },
    {
      id: 14,
      timestamp: "2026-03-10 09:15:28",
      vendor: "Tech Hardware Inc.",
      user: "David Lee",
      action: "team.invited",
      entityType: "team",
      entityName: "Team Member Invitation",
      entityId: "TEAM-VND-005",
      details: "Invited bob.smith@techhardware.com to vendor team",
      ipAddress: "203.45.78.145",
      status: "info",
    },
    {
      id: 15,
      timestamp: "2026-03-10 08:30:45",
      vendor: "Premier Services Inc.",
      user: "Jennifer White",
      action: "preferences.updated",
      entityType: "settings",
      entityName: "Notification Preferences",
      entityId: "SET-VND-002",
      details: "Updated email notification preferences for new RFQs",
      ipAddress: "203.45.79.55",
      status: "info",
    },
    {
      id: 16,
      timestamp: "2026-03-09 17:45:22",
      vendor: "Quality Products Ltd.",
      user: "Lisa Anderson",
      action: "evaluation.viewed",
      entityType: "evaluation",
      entityName: "Bid Evaluation Results",
      entityId: "EVAL-2024-018",
      details: "Viewed evaluation scores and feedback for BID-2024-042",
      ipAddress: "203.45.78.167",
      status: "info",
    },
    {
      id: 17,
      timestamp: "2026-03-09 16:20:15",
      vendor: "Construction Materials Co.",
      user: "Robert Brown",
      action: "document.downloaded",
      entityType: "document",
      entityName: "RFQ Technical Specifications",
      entityId: "DOC-2024-133",
      details: "Downloaded technical specifications for RFQ-2024-002",
      ipAddress: "203.45.78.220",
      status: "info",
    },
    {
      id: 18,
      timestamp: "2026-03-09 15:10:33",
      vendor: "Budget Supplies Inc.",
      user: "Thomas Clark",
      action: "bid.rejected",
      entityType: "bid",
      entityName: "Bid for Cleaning Services",
      entityId: "BID-2024-028",
      details: "Notification: Bid was not selected - Technical requirements not met",
      ipAddress: "203.45.79.201",
      status: "error",
    },
    {
      id: 19,
      timestamp: "2026-03-09 14:25:18",
      vendor: "Tech Hardware Inc.",
      user: "Alice Johnson",
      action: "rfq.searched",
      entityType: "search",
      entityName: "RFQ Search",
      entityId: "SEARCH-2024-445",
      details: "Searched for RFQs in 'IT Equipment' category",
      ipAddress: "203.45.78.92",
      status: "info",
    },
    {
      id: 20,
      timestamp: "2026-03-09 13:40:27",
      vendor: "ABC Suppliers Ltd.",
      user: "Mark Thompson",
      action: "user.logout",
      entityType: "session",
      entityName: "User Logout",
      entityId: "SESSION-9901",
      details: "User logged out successfully",
      ipAddress: "203.45.79.10",
      status: "info",
    },
    {
      id: 21,
      timestamp: "2026-03-09 12:15:45",
      vendor: "Industrial Machines Co.",
      user: "Gregory Wilson",
      action: "user.registered",
      entityType: "vendor",
      entityName: "Industrial Machines Co.",
      entityId: "VND-008",
      details: "New vendor registration submitted - Pending approval",
      ipAddress: "203.45.79.245",
      status: "info",
    },
    {
      id: 22,
      timestamp: "2026-03-09 11:30:22",
      vendor: "Office Solutions Inc.",
      user: "Kevin Davis",
      action: "bid.submitted",
      entityType: "bid",
      entityName: "Bid for Office Supplies",
      entityId: "BID-2024-051",
      details: "Submitted bid with amount $42,000 for RFQ-2024-006",
      ipAddress: "203.45.79.88",
      status: "success",
    },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <LogIn className="size-4 text-green-600" />;
    if (action.includes("logout")) return <LogOut className="size-4 text-muted-foreground" />;
    if (action.includes("submitted")) return <FileStack className="size-4 text-indigo-600" />;
    if (action.includes("uploaded")) return <Upload className="size-4 text-blue-600" />;
    if (action.includes("updated")) return <Edit className="size-4 text-blue-600" />;
    if (action.includes("won")) return <CheckCircle className="size-4 text-green-600" />;
    if (action.includes("signed")) return <CheckCircle className="size-4 text-green-600" />;
    if (action.includes("withdrawn")) return <AlertTriangle className="size-4 text-orange-600" />;
    if (action.includes("rejected")) return <XCircle className="size-4 text-red-600" />;
    if (action.includes("registered")) return <Upload className="size-4 text-green-600" />;
    return <Eye className="size-4 text-muted-foreground" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="All Vendor Activity Logs"
        description="Complete audit trail of all vendor activities across the platform"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportToCSV(activityLogs, "vendor_activity_logs")}>
              <Download className="size-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportToJSON(activityLogs, "vendor_activity_logs")}>
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
            <div className="text-sm text-muted-foreground">Total Activities</div>
            <div className="text-3xl font-bold mt-1">{activityLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active Vendors</div>
            <div className="text-3xl font-bold mt-1">10</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Bids Submitted</div>
            <div className="text-3xl font-bold mt-1 text-indigo-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Contracts Won</div>
            <div className="text-3xl font-bold mt-1 text-green-600">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-3xl font-bold mt-1 text-blue-600">8</div>
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
                <Input placeholder="Search vendor activity logs..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all-vendors">
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-vendors">All Vendors</SelectItem>
                <SelectItem value="tech">Tech Hardware Inc.</SelectItem>
                <SelectItem value="abc">ABC Suppliers Ltd.</SelectItem>
                <SelectItem value="quality">Quality Products Ltd.</SelectItem>
                <SelectItem value="construction">Construction Materials Co.</SelectItem>
                <SelectItem value="premier">Premier Services Inc.</SelectItem>
                <SelectItem value="office">Office Solutions Inc.</SelectItem>
                <SelectItem value="security">Security Systems Ltd.</SelectItem>
                <SelectItem value="budget">Budget Supplies Inc.</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-actions">
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="bid">Bid Actions</SelectItem>
                <SelectItem value="rfq">RFQ Actions</SelectItem>
                <SelectItem value="profile">Profile Updates</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
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
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-green-600" />
                        <span className="font-medium">{log.vendor}</span>
                      </div>
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
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
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