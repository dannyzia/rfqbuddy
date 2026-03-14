import { useState } from "react";
import { useParams, Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Shield, CheckCircle, Clock, AlertTriangle, User, Calendar,
  FileText, Send, Upload, MessageSquare, ArrowRight, Target
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { riskApi } from "../../lib/api/risk.api";

const MITIGATION = {
  id: "MIT-002",
  title: "PEP Investigation & Resolution",
  vendor: "Global Tech Solutions",
  vendorId: "VND-004",
  riskDimension: "Compliance",
  riskScore: 90,
  status: "in_progress",
  priority: "critical",
  owner: "Nadia Khan (Compliance Officer)",
  createdAt: "2026-03-10",
  dueDate: "2026-03-25",
  description: "Ahmed Hossain (25% UBO) flagged as Politically Exposed Person. Investigation required to determine ongoing risk and whether enhanced due diligence measures are sufficient.",
};

const TASKS = [
  { id: 1, task: "Obtain PEP screening report from Dow Jones", assignee: "Nadia Khan", status: "completed", dueDate: "2026-03-11", completedAt: "2026-03-10" },
  { id: 2, task: "Request vendor explanation & documentation on UBO role", assignee: "Nadia Khan", status: "completed", dueDate: "2026-03-12", completedAt: "2026-03-11" },
  { id: 3, task: "Verify UBO's current government affiliation status", assignee: "Rafiq Ahmed", status: "in_progress", dueDate: "2026-03-15", completedAt: null },
  { id: 4, task: "Review vendor transaction history for anomalies", assignee: "Finance Team", status: "in_progress", dueDate: "2026-03-18", completedAt: null },
  { id: 5, task: "Prepare compliance assessment report", assignee: "Nadia Khan", status: "pending", dueDate: "2026-03-20", completedAt: null },
  { id: 6, task: "Submit recommendation to Procurement Head", assignee: "Nadia Khan", status: "pending", dueDate: "2026-03-22", completedAt: null },
  { id: 7, task: "Final decision: Continue/Suspend/Terminate", assignee: "Procurement Head", status: "pending", dueDate: "2026-03-25", completedAt: null },
];

const COMMENTS = [
  { user: "Nadia Khan", date: "2026-03-11 14:30", text: "Dow Jones report received. Ahmed Hossain was a Deputy Secretary in Ministry of Commerce (retired 2020). Currently classified as PEP-Former. Continuing investigation.", type: "internal" },
  { user: "Delta Supplies (Vendor)", date: "2026-03-11 16:00", text: "We confirm Mr. Hossain retired from government in 2020 and has no current government role. He serves as a silent partner only. We can provide additional documentation as needed.", type: "vendor" },
  { user: "Rafiq Ahmed", date: "2026-03-12 09:15", text: "Checking with RJSC records and public disclosure databases. Will have UBO status confirmation by March 15.", type: "internal" },
];

export function MitigationWorkflow() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  const { data: apiAssessments } = useApiOrMock(
    () => riskApi.listAssessments(),
    { data: [], total: 0, page: 1, pageSize: 20 },
  );

  const completedTasks = TASKS.filter(t => t.status === "completed").length;
  const progressPct = (completedTasks / TASKS.length) * 100;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Mitigation: ${id || MITIGATION.id}`}
        description={`${MITIGATION.title} — ${MITIGATION.vendor}`}
        backTo={`/vendors/${MITIGATION.vendorId}/risk`}
        backLabel="Back to Risk Profile"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="size-4 mr-1.5" />Export Report</Button>
            <Button size="sm" variant="destructive"><AlertTriangle className="size-4 mr-1.5" />Escalate</Button>
          </div>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant="secondary" className="mt-1">In Progress</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Priority</p>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Critical</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Progress</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progressPct} className="h-2 flex-1" />
              <span className="text-sm font-medium">{completedTasks}/{TASKS.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="font-medium text-foreground flex items-center gap-1 mt-1"><Calendar className="size-4" />{MITIGATION.dueDate}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="size-5" />Mitigation Tasks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TASKS.map(t => (
                  <div key={t.id} className={`flex items-start gap-3 p-3 rounded-lg border border-border ${t.status === "completed" ? "bg-green-50/50 dark:bg-green-900/5" : t.status === "in_progress" ? "bg-blue-50/50 dark:bg-blue-900/5" : ""}`}>
                    <div className="mt-0.5">
                      {t.status === "completed" ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : t.status === "in_progress" ? (
                        <Clock className="size-5 text-blue-500" />
                      ) : (
                        <div className="size-5 rounded-full border-2 border-border" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${t.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.task}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="size-3" />{t.assignee}</span>
                        <span className="flex items-center gap-1"><Calendar className="size-3" />Due: {t.dueDate}</span>
                        {t.completedAt && <span className="text-green-600 dark:text-green-400">Completed: {t.completedAt}</span>}
                      </div>
                    </div>
                    <Badge variant={t.status === "completed" ? "default" : t.status === "in_progress" ? "secondary" : "outline"}>
                      {t.status === "completed" ? "Done" : t.status === "in_progress" ? "In Progress" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Context & Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{MITIGATION.description}</p>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>This vendor currently has BDT 4.25M in active contracts. If suspended, contingency planning is required. Estimated impact: 2 active tenders.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comments */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="size-5" />Discussion</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {COMMENTS.map((c, i) => (
                <div key={i} className={`p-3 rounded-lg ${c.type === "vendor" ? "bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800" : "bg-muted"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{c.user}</span>
                    {c.type === "vendor" && <Badge variant="outline" className="text-xs h-4">Vendor</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-card"
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="flex-1"><Send className="size-4 mr-1.5" />Post</Button>
                <Button variant="outline" size="sm"><Upload className="size-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}