import { useState } from "react";
import { Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { ticketsApi } from "../../lib/api/tickets.api";

interface Ticket {
  id: string;
  subject: string;
  type: "bug" | "feature" | "general";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  category: string;
  submittedBy: string;
  submittedDate: string;
  lastUpdated: string;
  assignee?: string;
}

export function AdminTickets() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const { data: apiTickets } = useApiOrMock(
    () => ticketsApi.list(),
    [],
  );

  const tickets: Ticket[] = [
    {
      id: "TKT-2026-0015",
      subject: "Login page not loading on mobile devices",
      type: "bug",
      priority: "high",
      status: "in-progress",
      category: "User Interface",
      submittedBy: "John Doe (ABC Corp)",
      submittedDate: "2026-03-11 10:30",
      lastUpdated: "2026-03-11 14:20",
      assignee: "Support Team A",
    },
    {
      id: "TKT-2026-0014",
      subject: "Add export to Excel feature for reports",
      type: "feature",
      priority: "medium",
      status: "open",
      category: "Reporting",
      submittedBy: "Sarah Johnson (XYZ Ltd)",
      submittedDate: "2026-03-11 09:15",
      lastUpdated: "2026-03-11 09:15",
    },
    {
      id: "TKT-2026-0013",
      subject: "How to setup automated email notifications?",
      type: "general",
      priority: "low",
      status: "resolved",
      category: "How-to Question",
      submittedBy: "Mike Wilson (Global Traders)",
      submittedDate: "2026-03-10 16:45",
      lastUpdated: "2026-03-11 08:30",
      assignee: "Support Team B",
    },
    {
      id: "TKT-2026-0012",
      subject: "Database timeout errors during peak hours",
      type: "bug",
      priority: "critical",
      status: "in-progress",
      category: "Performance",
      submittedBy: "Admin User",
      submittedDate: "2026-03-10 14:00",
      lastUpdated: "2026-03-11 12:00",
      assignee: "Development Team",
    },
    {
      id: "TKT-2026-0011",
      subject: "Integrate with external accounting system",
      type: "feature",
      priority: "high",
      status: "open",
      category: "Integration",
      submittedBy: "Finance Dept (Ministry of Finance)",
      submittedDate: "2026-03-10 11:20",
      lastUpdated: "2026-03-10 11:20",
    },
    {
      id: "TKT-2026-0010",
      subject: "Vendor cannot upload documents",
      type: "bug",
      priority: "high",
      status: "resolved",
      category: "Data/Database",
      submittedBy: "Vendor Support",
      submittedDate: "2026-03-09 15:30",
      lastUpdated: "2026-03-10 10:00",
      assignee: "Support Team A",
    },
    {
      id: "TKT-2026-0009",
      subject: "Need training materials for new users",
      type: "general",
      priority: "medium",
      status: "in-progress",
      category: "Training",
      submittedBy: "HR Department",
      submittedDate: "2026-03-09 10:00",
      lastUpdated: "2026-03-10 14:30",
      assignee: "Training Team",
    },
    {
      id: "TKT-2026-0008",
      subject: "Add multi-language support",
      type: "feature",
      priority: "medium",
      status: "open",
      category: "User Experience",
      submittedBy: "International Users",
      submittedDate: "2026-03-08 13:45",
      lastUpdated: "2026-03-08 13:45",
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    if (filterType !== "all" && ticket.type !== filterType) return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="size-4 text-red-600 dark:text-red-400" />;
      case "feature":
        return <Lightbulb className="size-4 text-blue-600 dark:text-blue-400" />;
      case "general":
        return <HelpCircle className="size-4 text-green-600 dark:text-green-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bug":
        return "Bug Report";
      case "feature":
        return "Feature Request";
      case "general":
        return "General Issue";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
      high: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
      low: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    };
    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      open: { icon: Clock, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
      "in-progress": { icon: AlertCircle, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
      resolved: { icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      closed: { icon: XCircle, color: "bg-muted text-muted-foreground" },
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="size-3 mr-1" />
        {status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
      </Badge>
    );
  };

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Open",
      value: tickets.filter((t) => t.status === "open").length,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "in-progress").length,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <PageTemplate
      title="Support Tickets Management"
      description="Manage feature requests, bug reports, and general support issues"
      actions={
        <Button>
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className={`text-3xl font-bold ${stat.color} mt-1`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets by ID, subject, or submitter..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background border-border"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background border-border"
                >
                  <option value="all">All Types</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="general">General Issue</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background border-border"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="font-mono text-sm font-medium">
                        {ticket.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(ticket.type)}
                        <span className="text-sm">
                          {getTypeLabel(ticket.type)?.split(" ")[0]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate font-medium">
                        {ticket.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {ticket.category}
                      </span>
                    </TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{ticket.submittedBy}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {ticket.submittedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {ticket.assignee || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/admin/tickets/${ticket.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="size-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No tickets found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}