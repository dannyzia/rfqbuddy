import { useState } from "react";
import { Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Send,
  Upload,
  Bug,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  ArrowLeft,
} from "lucide-react";

export function SubmitTicket() {
  const [ticketType, setTicketType] = useState<"bug" | "feature" | "general">("bug");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageTemplate
        title="Support Ticket"
        description="Submit feature requests, bug reports, and general issues"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="size-6 sm:size-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Ticket Submitted Successfully!</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                Your ticket has been created with ID: <strong className="text-foreground">#TKT-2026-0001</strong>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                You will receive updates via email. You can also track your ticket status in your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full sm:w-auto">
                  Submit Another Ticket
                </Button>
                <Link to="/support/my-tickets" className="w-full sm:w-auto">
                  <Button className="w-full">View My Tickets</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Submit Support Ticket"
      description="Report bugs, request features, or get help with general issues"
      actions={
        <Link to="/support/my-tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4 mr-1.5" />
            <span className="hidden sm:inline">My Tickets</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {/* Ticket Type Selection — stacked on mobile, row on sm+ */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Select Ticket Type</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => setTicketType("bug")}
                className={`flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-2 rounded-lg transition-all text-left sm:text-center ${
                  ticketType === "bug"
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Bug className="size-6 sm:size-8 sm:mx-auto sm:mb-2 text-red-600 dark:text-red-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Bug Report</div>
                  <div className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    Report issues or errors
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTicketType("feature")}
                className={`flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-2 rounded-lg transition-all text-left sm:text-center ${
                  ticketType === "feature"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Lightbulb className="size-6 sm:size-8 sm:mx-auto sm:mb-2 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">Feature Request</div>
                  <div className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    Suggest new features
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTicketType("general")}
                className={`flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-2 rounded-lg transition-all text-left sm:text-center ${
                  ticketType === "general"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-500"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <HelpCircle className="size-6 sm:size-8 sm:mx-auto sm:mb-2 text-green-600 dark:text-green-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base">General Issue</div>
                  <div className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    Other questions or help
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Details */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder={
                  ticketType === "bug"
                    ? "Brief description of the bug"
                    : ticketType === "feature"
                    ? "Feature you'd like to see"
                    : "What do you need help with?"
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background border-border"
                >
                  {ticketType === "bug" ? (
                    <>
                      <option>User Interface</option>
                      <option>Performance</option>
                      <option>Data/Database</option>
                      <option>Authentication</option>
                      <option>Reports/Analytics</option>
                      <option>Other</option>
                    </>
                  ) : ticketType === "feature" ? (
                    <>
                      <option>Workflow Improvement</option>
                      <option>New Module</option>
                      <option>Integration</option>
                      <option>Reporting</option>
                      <option>User Experience</option>
                      <option>Other</option>
                    </>
                  ) : (
                    <>
                      <option>Account/Profile</option>
                      <option>Billing/Subscription</option>
                      <option>How-to Question</option>
                      <option>Documentation</option>
                      <option>Training</option>
                      <option>Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background border-border"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description">
                {ticketType === "bug"
                  ? "Bug Description *"
                  : ticketType === "feature"
                  ? "Feature Description *"
                  : "Issue Description *"}
              </Label>
              <Textarea
                id="description"
                rows={5}
                className="text-sm"
                placeholder={
                  ticketType === "bug"
                    ? "Please provide:\n1. What happened?\n2. What did you expect to happen?\n3. Steps to reproduce the issue\n4. Any error messages you saw"
                    : ticketType === "feature"
                    ? "Please describe:\n1. What feature you want\n2. Why it would be useful\n3. How you envision it working"
                    : "Please describe your issue in detail..."
                }
              />
            </div>

            {ticketType === "bug" && (
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="environment">Environment Information</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input id="browser" placeholder="Browser (e.g., Chrome 120)" />
                  <Input id="os" placeholder="OS (e.g., Windows 11, Android 14)" />
                </div>
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center border-border">
                <Upload className="size-6 sm:size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Screenshots, logs, or documents (Max 10MB per file)
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Upload className="size-3.5 mr-1.5" />
                  Choose Files
                </Button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 sm:p-3 border rounded-lg border-border"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{file}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 ml-2"
                        onClick={() =>
                          setAttachments(attachments.filter((_, i) => i !== index))
                        }
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Priority Information */}
        <Alert className="border-border">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>Priority Guidelines:</strong>
            <ul className="mt-2 space-y-1 text-xs sm:text-sm">
              <li><strong>Critical:</strong> System down or major functionality broken</li>
              <li><strong>High:</strong> Significant impact on operations</li>
              <li><strong>Medium:</strong> Moderate impact, workaround available</li>
              <li><strong>Low:</strong> Minor issue or enhancement</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Submit — stacked on mobile */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                All fields marked with * are required
              </div>
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                <Send className="size-4 sm:size-5 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
