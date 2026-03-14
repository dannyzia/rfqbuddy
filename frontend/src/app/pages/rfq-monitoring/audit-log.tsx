import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import {
  Shield,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash,
  Upload,
  Lock,
  Unlock,
  User,
  Clock,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  userType: "purchaser" | "vendor" | "admin" | "system";
  action:
    | "view"
    | "create"
    | "update"
    | "delete"
    | "download"
    | "upload"
    | "approve"
    | "reject"
    | "publish"
    | "withhold"
    | "login"
    | "logout";
  entity: string; // tender, bid, document, user, etc.
  entityId: string;
  description: string;
  ipAddress: string;
  userAgent?: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
  severity: "info" | "warning" | "critical";
  metadata?: Record<string, any>;
}

export function RfqAuditLog() {
  const { id } = useParams<{ id: string }>();

  // Fetch tender data from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply", status: "open" } as any,
    [id],
  );

  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterUserType, setFilterUserType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: "1",
      timestamp: new Date("2026-03-11T14:32:15"),
      userId: "V001",
      userName: "ABC Furniture Ltd.",
      userRole: "Vendor",
      userType: "vendor",
      action: "upload",
      entity: "bid_document",
      entityId: "BID-001-DOC-5",
      description: "Uploaded technical compliance certificate",
      ipAddress: "103.45.178.22",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "info",
      metadata: {
        fileName: "Technical_Certificate.pdf",
        fileSize: "2.3 MB",
        documentType: "compliance_certificate",
      },
    },
    {
      id: "2",
      timestamp: new Date("2026-03-11T14:15:08"),
      userId: "P001",
      userName: "Md. Rahman",
      userRole: "Procurement Officer",
      userType: "purchaser",
      action: "update",
      entity: "tender",
      entityId: id || "TDR-2024-001",
      description: "Updated tender submission deadline",
      ipAddress: "192.168.1.45",
      severity: "warning",
      changes: [
        { field: "submission_deadline", oldValue: "2026-03-15", newValue: "2026-03-20" },
        { field: "deadline_extended_by", oldValue: "0", newValue: "5 days" },
      ],
    },
    {
      id: "3",
      timestamp: new Date("2026-03-11T13:45:22"),
      userId: "V002",
      userName: "XYZ Trading Co.",
      userRole: "Vendor",
      userType: "vendor",
      action: "update",
      entity: "bid",
      entityId: "BID-002",
      description: "Revised bid pricing",
      ipAddress: "27.147.168.99",
      severity: "info",
      changes: [
        { field: "total_bid_amount", oldValue: "4,600,000", newValue: "4,425,000" },
        { field: "item_2_unit_price", oldValue: "1,200", newValue: "1,150" },
      ],
    },
    {
      id: "4",
      timestamp: new Date("2026-03-11T12:30:44"),
      userId: "P001",
      userName: "Md. Rahman",
      userRole: "Procurement Officer",
      userType: "purchaser",
      action: "view",
      entity: "bid_list",
      entityId: id || "TDR-2024-001",
      description: "Viewed submitted bids list",
      ipAddress: "192.168.1.45",
      severity: "info",
    },
    {
      id: "5",
      timestamp: new Date("2026-03-11T11:20:15"),
      userId: "SYSTEM",
      userName: "System",
      userRole: "System",
      userType: "system",
      action: "publish",
      entity: "amendment",
      entityId: "AMD-001",
      description: "Published amendment notice to all vendors",
      ipAddress: "127.0.0.1",
      severity: "critical",
      metadata: {
        notificationsSent: 45,
        emailsSent: 45,
        smsSent: 45,
      },
    },
    {
      id: "6",
      timestamp: new Date("2026-03-11T10:15:33"),
      userId: "V001",
      userName: "ABC Furniture Ltd.",
      userRole: "Vendor",
      userType: "vendor",
      action: "download",
      entity: "tender_document",
      entityId: "TDR-2024-001-DOC",
      description: "Downloaded tender document package",
      ipAddress: "103.45.178.22",
      severity: "info",
      metadata: {
        fileSize: "15.7 MB",
        downloadCount: 3,
      },
    },
    {
      id: "7",
      timestamp: new Date("2026-03-10T16:45:00"),
      userId: "P002",
      userName: "Ms. Sultana",
      userRole: "Procurement Head",
      userType: "purchaser",
      action: "approve",
      entity: "tender",
      entityId: id || "TDR-2024-001",
      description: "Approved tender for publication",
      ipAddress: "192.168.1.88",
      severity: "critical",
    },
    {
      id: "8",
      timestamp: new Date("2026-03-10T14:00:00"),
      userId: "P001",
      userName: "Md. Rahman",
      userRole: "Procurement Officer",
      userType: "purchaser",
      action: "create",
      entity: "amendment",
      entityId: "AMD-001",
      description: "Created amendment #1 for technical specifications",
      ipAddress: "192.168.1.45",
      severity: "warning",
      changes: [
        { field: "item_2_specification", oldValue: "Office Chair - Standard", newValue: "Office Chair - Ergonomic with lumbar support" },
      ],
    },
    {
      id: "9",
      timestamp: new Date("2026-03-09T09:30:12"),
      userId: "V005",
      userName: "Omega Corp",
      userRole: "Vendor",
      userType: "vendor",
      action: "delete",
      entity: "bid",
      entityId: "BID-005",
      description: "Withdrew bid submission",
      ipAddress: "119.40.81.45",
      severity: "warning",
      metadata: {
        reason: "Unable to meet delivery timeline",
      },
    },
    {
      id: "10",
      timestamp: new Date("2026-03-08T15:45:28"),
      userId: "V002",
      userName: "XYZ Trading Co.",
      userRole: "Vendor",
      userType: "vendor",
      action: "create",
      entity: "bid",
      entityId: "BID-002",
      description: "Submitted initial bid",
      ipAddress: "27.147.168.99",
      severity: "info",
      metadata: {
        bidAmount: 4600000,
        documentsCount: 8,
      },
    },
    {
      id: "11",
      timestamp: new Date("2026-03-05T11:00:00"),
      userId: "P001",
      userName: "Md. Rahman",
      userRole: "Procurement Officer",
      userType: "purchaser",
      action: "publish",
      entity: "tender",
      entityId: id || "TDR-2024-001",
      description: "Published tender on e-GP portal",
      ipAddress: "192.168.1.45",
      severity: "critical",
      metadata: {
        publicationChannels: ["e-GP Portal", "Daily Star", "Organization Website"],
      },
    },
  ];

  // Filter audit logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesUserType = filterUserType === "all" || log.userType === filterUserType;
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAction && matchesUserType && matchesSeverity && matchesSearch;
  });

  const getActionIcon = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "view":
        return Eye;
      case "create":
        return FileText;
      case "update":
        return Edit;
      case "delete":
        return Trash;
      case "download":
        return Download;
      case "upload":
        return Upload;
      case "approve":
        return CheckCircle;
      case "reject":
        return XCircle;
      case "publish":
        return FileText;
      case "withhold":
        return Lock;
      case "login":
        return Unlock;
      case "logout":
        return Lock;
      default:
        return FileText;
    }
  };

  const getActionColor = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "create":
      case "approve":
      case "publish":
        return "text-green-600 bg-green-100";
      case "update":
      case "upload":
        return "text-blue-600 bg-blue-100";
      case "delete":
      case "reject":
      case "withhold":
        return "text-red-600 bg-red-100";
      case "view":
      case "download":
        return "text-muted-foreground bg-muted";
      default:
        return "text-purple-600 bg-purple-100";
    }
  };

  const getSeverityIcon = (severity: AuditLogEntry["severity"]) => {
    switch (severity) {
      case "info":
        return <Info className="size-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="size-4 text-orange-600" />;
      case "critical":
        return <AlertTriangle className="size-4 text-red-600" />;
    }
  };

  const getSeverityBadge = (severity: AuditLogEntry["severity"]) => {
    switch (severity) {
      case "info":
        return <Badge variant="outline">Info</Badge>;
      case "warning":
        return <Badge className="bg-orange-100 text-orange-700">Warning</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
    }
  };

  const handleExportLogs = () => {
    toast.success("Audit logs exported successfully");
  };

  const stats = {
    totalLogs: auditLogs.length,
    criticalEvents: auditLogs.filter((l) => l.severity === "critical").length,
    warningEvents: auditLogs.filter((l) => l.severity === "warning").length,
    uniqueUsers: new Set(auditLogs.map((l) => l.userId)).size,
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="RFQ Audit Log"
        description={`Complete immutable audit trail for Tender ${id}`}
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <Button onClick={handleExportLogs}>
            <Download className="size-4 mr-2" />
            Export Audit Log
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="size-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalLogs}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="size-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.criticalEvents}</div>
                <div className="text-sm text-muted-foreground">Critical Events</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="size-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">{stats.warningEvents}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="size-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</div>
                <div className="text-sm text-muted-foreground">Unique Users</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filter Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="upload">Upload</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="publish">Publish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">User Type</label>
                <Select value={filterUserType} onValueChange={setFilterUserType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="purchaser">Purchaser</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogs.length} audit entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-40">Timestamp</TableHead>
                    <TableHead className="w-32">Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Severity</TableHead>
                    <TableHead className="w-32">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const Icon = getActionIcon(log.action);
                    return (
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedEntry(log)}
                      >
                        <TableCell>
                          <div className={`size-8 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                            <Icon className="size-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.timestamp.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.userRole} • {log.userId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{log.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {log.entity} • {log.entityId}
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell>
                          <div className="text-xs font-mono">{log.ipAddress}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="size-12 mx-auto mb-4 opacity-50" />
                <p>No audit entries match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Entry Details */}
        {selectedEntry && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Audit Entry Details</CardTitle>
                  <CardDescription>Comprehensive details for selected audit entry</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                    <div className="font-mono text-sm">{selectedEntry.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <div className="font-medium">
                      {selectedEntry.timestamp.toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User</label>
                    <div className="font-medium">{selectedEntry.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEntry.userRole} • {selectedEntry.userId}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Action</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getActionColor(selectedEntry.action)} variant="secondary">
                        {selectedEntry.action}
                      </Badge>
                      {getSeverityBadge(selectedEntry.severity)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entity</label>
                    <div className="font-medium capitalize">{selectedEntry.entity.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">{selectedEntry.entityId}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <div className="font-mono text-sm">{selectedEntry.ipAddress}</div>
                  </div>
                  {selectedEntry.userAgent && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                      <div className="text-sm">{selectedEntry.userAgent}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Description</label>
                <div className="text-sm">{selectedEntry.description}</div>
              </div>

              {selectedEntry.changes && selectedEntry.changes.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-3">Changes Made</label>
                    <div className="space-y-2">
                      {selectedEntry.changes.map((change, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground mb-1">Field</div>
                                <div className="font-medium capitalize">{change.field.replace("_", " ")}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground mb-1">Old Value</div>
                                <div className="font-mono text-red-600">{change.oldValue}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground mb-1">New Value</div>
                                <div className="font-mono text-green-600">{change.newValue}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedEntry.metadata && Object.keys(selectedEntry.metadata).length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-3">Additional Metadata</label>
                    <div className="rounded-md border p-4 bg-muted/50">
                      <pre className="text-xs font-mono overflow-auto">
                        {JSON.stringify(selectedEntry.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}