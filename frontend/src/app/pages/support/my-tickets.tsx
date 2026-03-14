import { Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function MyTickets() {
  const tickets = [
    {
      id: "TKT-2026-0015",
      subject: "Login page not loading on mobile devices",
      type: "bug" as const,
      priority: "high" as const,
      status: "in-progress" as const,
      category: "User Interface",
      submittedDate: "2026-03-11 10:30",
      lastResponse: "2026-03-11 14:20",
      responseBy: "Support Team A",
    },
    {
      id: "TKT-2026-0007",
      subject: "How to export tender data to PDF?",
      type: "general" as const,
      priority: "low" as const,
      status: "resolved" as const,
      category: "How-to Question",
      submittedDate: "2026-03-08 09:15",
      lastResponse: "2026-03-08 15:30",
      responseBy: "Support Team B",
    },
    {
      id: "TKT-2026-0003",
      subject: "Add batch upload feature for vendors",
      type: "feature" as const,
      priority: "medium" as const,
      status: "open" as const,
      category: "Workflow Improvement",
      submittedDate: "2026-03-05 11:00",
      lastResponse: "2026-03-05 11:00",
    },
  ];

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
      case "bug": return "Bug";
      case "feature": return "Feature";
      case "general": return "General";
      default: return type;
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
      closed: { icon: CheckCircle, color: "bg-muted text-muted-foreground" },
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
    { label: "Total Tickets", value: tickets.length, color: "text-blue-600 dark:text-blue-400" },
    { label: "Open", value: tickets.filter(t => t.status === "open").length, color: "text-orange-600 dark:text-orange-400" },
    { label: "In Progress", value: tickets.filter(t => t.status === "in-progress").length, color: "text-purple-600 dark:text-purple-400" },
    { label: "Resolved", value: tickets.filter(t => t.status === "resolved").length, color: "text-green-600 dark:text-green-400" },
  ];

  return (
    <PageTemplate
      title="My Support Tickets"
      description="Track your submitted feature requests, bug reports, and support issues"
      actions={
        <Link to="/support/submit-ticket">
          <Button size="sm" className="sm:size-default">
            <Plus className="size-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Submit New Ticket</span>
            <span className="sm:hidden">New Ticket</span>
          </Button>
        </Link>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Statistics — 2-col on mobile, 4-col on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mt-1`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Card View (md:hidden) */}
        <div className="space-y-3 md:hidden">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                {/* Header row: ID + Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                  {getStatusBadge(ticket.status)}
                </div>

                {/* Subject */}
                <h3 className="font-medium text-sm mb-2 leading-snug">{ticket.subject}</h3>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getTypeIcon(ticket.type)}
                    <span>{getTypeLabel(ticket.type)}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">·</span>
                  {getPriorityBadge(ticket.priority)}
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-xs text-muted-foreground">{ticket.category}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div>
                    <span className="text-muted-foreground/70">Submitted:</span> {ticket.submittedDate.split(" ")[0]}
                  </div>
                  <div>
                    <span className="text-muted-foreground/70">Updated:</span> {ticket.lastResponse.split(" ")[0]}
                  </div>
                </div>

                {/* Action */}
                <Link to={`/support/tickets/${ticket.id}`} className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="size-3.5 mr-1.5" />
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {tickets.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="size-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">No tickets submitted yet</p>
                <Link to="/support/submit-ticket">
                  <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Submit Your First Ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop Table View (hidden on mobile, visible md+) */}
        <Card className="hidden md:block">
          <CardContent className="p-4 lg:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          {ticket.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(ticket.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.category}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {ticket.submittedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-muted-foreground">{ticket.lastResponse}</div>
                          {ticket.responseBy && (
                            <div className="text-xs text-muted-foreground">
                              by {ticket.responseBy}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/support/tickets/${ticket.id}`}>
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
            </div>

            {tickets.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="size-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No tickets submitted yet</p>
                <Link to="/support/submit-ticket">
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Submit Your First Ticket
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
