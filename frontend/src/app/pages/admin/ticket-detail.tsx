import { useState } from "react";
import { useParams, Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  ArrowLeft,
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  User,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Send,
  Download,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { ticketsApi } from "../../lib/api/tickets.api";

export function AdminTicketDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState("in-progress");
  const [assignee, setAssignee] = useState("Support Team A");
  const [newComment, setNewComment] = useState("");

  const { data: apiTicket } = useApiOrMock(
    () => ticketsApi.getById(id!),
    { ticket: null as any, messages: [] },
    [id],
  );

  const ticket = {
    id: id || "TKT-2026-0015",
    subject: "Login page not loading on mobile devices",
    type: "bug" as const,
    priority: "high" as const,
    status: "in-progress" as const,
    category: "User Interface",
    submittedBy: "John Doe",
    organization: "ABC Corporation Ltd.",
    email: "john.doe@abccorp.com",
    submittedDate: "2026-03-11 10:30",
    lastUpdated: "2026-03-11 14:20",
    assignee: "Support Team A",
    description: `When trying to access the login page on mobile devices (tested on iPhone 13 and Samsung Galaxy S21), the page fails to load completely. 

Steps to reproduce:
1. Open mobile browser (Safari or Chrome)
2. Navigate to the login page
3. Page shows loading spinner but never completes

Expected behavior:
Login page should load normally on all devices.

Actual behavior:
Page remains stuck on loading screen.

Environment:
- Browser: Safari 16.5, Chrome Mobile 120
- OS: iOS 16.4, Android 13
- Screen resolution: Various mobile sizes

Error seen in console:
"Failed to load resource: net::ERR_CONNECTION_TIMED_OUT"`,
    attachments: ["screenshot-mobile-error.png", "console-log.txt"],
    browser: "Safari 16.5, Chrome Mobile 120",
    os: "iOS 16.4, Android 13",
  };

  const comments = [
    {
      id: 1,
      author: "Support Team A",
      role: "Support",
      timestamp: "2026-03-11 11:00",
      message: "Thank you for reporting this issue. We are investigating the mobile login problem and will update you shortly.",
    },
    {
      id: 2,
      author: "Development Team",
      role: "Developer",
      timestamp: "2026-03-11 12:30",
      message: "Issue identified. There's a CSS conflict affecting mobile viewports. Working on a fix now. ETA: 2-3 hours.",
    },
    {
      id: 3,
      author: "Support Team A",
      role: "Support",
      timestamp: "2026-03-11 14:20",
      message: "Fix has been deployed to staging environment. Please test and confirm if the issue is resolved.",
    },
  ];

  const getTypeConfig = (type: string) => {
    const configs = {
      bug: { icon: Bug, label: "Bug Report", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
      feature: { icon: Lightbulb, label: "Feature Request", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
      general: { icon: HelpCircle, label: "General Issue", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    };
    return configs[type as keyof typeof configs];
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

  const typeConfig = getTypeConfig(ticket.type);
  const TypeIcon = typeConfig.icon;

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("");
    }
  };

  const handleUpdateStatus = () => {
    // Update status logic here
    alert(`Ticket status updated to: ${status}`);
  };

  return (
    <PageTemplate
      title={`Ticket ${ticket.id}`}
      description="View and manage support ticket"
      actions={
        <Link to="/admin/tickets">
          <Button variant="outline">
            <ArrowLeft className="size-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Ticket Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                  <TypeIcon className={`size-6 ${typeConfig.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-border">
                      {typeConfig.label}
                    </Badge>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{ticket.submittedBy} ({ticket.organization})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{ticket.submittedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="size-4" />
                      <span>{ticket.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {ticket.description}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Environment Info (for bugs) */}
          {ticket.type === "bug" && (
            <Card>
              <CardHeader>
                <CardTitle>Environment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Browser</div>
                    <div className="font-medium">{ticket.browser}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Operating System</div>
                    <div className="font-medium">{ticket.os}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments ({ticket.attachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ticket.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg border-border"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments/Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Comments & Activity</CardTitle>
                <Badge variant="outline" className="border-border">
                  <MessageSquare className="size-3 mr-1" />
                  {comments.length} Comments
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-blue-600 dark:border-blue-400 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author}</span>
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          {comment.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.message}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="mt-6 pt-6 border-t border-border">
                <Label htmlFor="newComment" className="mb-2 block">Add Comment</Label>
                <Textarea
                  id="newComment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Type your response or update here..."
                  className="mb-3"
                />
                <Button onClick={handleAddComment}>
                  <Send className="size-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-background border-border"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <select
                  id="assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-background border-border"
                >
                  <option value="">Unassigned</option>
                  <option value="Support Team A">Support Team A</option>
                  <option value="Support Team B">Support Team B</option>
                  <option value="Development Team">Development Team</option>
                  <option value="Training Team">Training Team</option>
                </select>
              </div>

              <Button onClick={handleUpdateStatus} className="w-full">
                <CheckCircle className="size-4 mr-2" />
                Update Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Ticket ID</div>
                <div className="font-mono font-medium">{ticket.id}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Created</div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  {ticket.submittedDate}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  {ticket.lastUpdated}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Submitter</div>
                <div className="text-sm">
                  {ticket.submittedBy}
                  <div className="text-muted-foreground">{ticket.organization}</div>
                  <div className="text-blue-600 dark:text-blue-400">{ticket.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="size-4 mr-2" />
                Escalate to Development
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="size-4 mr-2" />
                Request More Info
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="size-4 mr-2" />
                Mark as Resolved
              </Button>
            </CardContent>
          </Card>

          {/* SLA Information */}
          <Alert className="border-border">
            <AlertCircle className="size-4" />
            <AlertDescription>
              <strong>SLA Status:</strong> Within target
              <div className="text-xs mt-1">
                Response time: 2h 30m (Target: 4h)
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </PageTemplate>
  );
}