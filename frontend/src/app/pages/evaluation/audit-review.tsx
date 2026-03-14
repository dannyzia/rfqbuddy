import { useState } from "react";
import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Shield,
  Save,
  Send,
  Clock,
} from "lucide-react";

import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { evalApi } from "../../lib/api/eval.api";
import { bidsApi } from "../../lib/api/bids.api";

export function AuditReview() {
  const { id } = useParams();
  const [auditDecision, setAuditDecision] = useState<"approved" | "rejected" | "return-for-revision" | null>(null);
  const [auditRemarks, setAuditRemarks] = useState("");

  const tender = {
    ref: "PG3-2026-00456",
    title: "Procurement of Office Furniture for Ministry of Education",
    type: "PG3 - Open Tender (Goods)",
    estimatedValue: "BDT 50,00,000",
  };

  const evaluationSummary = {
    totalBidsReceived: 12,
    bidsOpened: 12,
    prequalified: 8,
    technicallyQualified: 5,
    commerciallyEvaluated: 5,
    recommendedVendor: "Global Supplies International",
    recommendedAmount: "BDT 48,75,000",
  };

  const checklistItems = [
    {
      category: "Procedural Compliance",
      items: [
        { id: 1, name: "Tender published as per PPA 2006 timelines", status: "pass", remarks: "Published 30 days before deadline" },
        { id: 2, name: "Bid opening conducted publicly", status: "pass", remarks: "Opened on 21-Mar-2026 at 10:00 AM" },
        { id: 3, name: "All bids received before deadline", status: "pass", remarks: "Deadline: 20-Mar-2026 17:00" },
        { id: 4, name: "Two-envelope system followed", status: "pass", remarks: "Technical and financial envelopes separate" },
        { id: 5, name: "Financial bids opened only for qualified bidders", status: "pass", remarks: "5 vendors qualified technically" },
      ],
    },
    {
      category: "Evaluation Compliance",
      items: [
        { id: 6, name: "Evaluation criteria as per tender document", status: "pass", remarks: "QCBS method applied correctly" },
        { id: 7, name: "Technical scoring done by qualified evaluators", status: "pass", remarks: "Technical Evaluator: John Doe" },
        { id: 8, name: "Commercial evaluation transparent", status: "warning", remarks: "Minor discrepancy in tax calculation" },
        { id: 9, name: "No conflict of interest", status: "pass", remarks: "All declarations on file" },
        { id: 10, name: "Vendor blacklist check performed", status: "pass", remarks: "All vendors verified clean" },
      ],
    },
    {
      category: "Documentation",
      items: [
        { id: 11, name: "All bid documents properly filed", status: "pass", remarks: "Physical and digital copies maintained" },
        { id: 12, name: "Evaluation worksheets complete", status: "pass", remarks: "All scoring matrices available" },
        { id: 13, name: "Committee meeting minutes", status: "pass", remarks: "Minutes signed by all members" },
        { id: 14, name: "Audit trail complete", status: "pass", remarks: "All actions logged" },
      ],
    },
    {
      category: "Financial Compliance",
      items: [
        { id: 15, name: "Within approved budget", status: "pass", remarks: "Budget: BDT 50 Lac, Award: BDT 48.75 Lac" },
        { id: 16, name: "Bid security amounts verified", status: "pass", remarks: "All BGs verified with banks" },
        { id: 17, name: "Performance security terms defined", status: "pass", remarks: "10% of contract value" },
        { id: 18, name: "Payment terms as per policy", status: "pass", remarks: "Standard govt payment terms" },
      ],
    },
  ];

  const auditObservations = [
    {
      id: 1,
      severity: "minor",
      observation: "Commercial evaluation worksheet shows a minor arithmetic discrepancy in tax calculation for one vendor",
      recommendation: "Re-verify tax calculation before award",
      status: "open",
    },
    {
      id: 2,
      severity: "info",
      observation: "Pre-qualification documentation slightly delayed by 2 days",
      recommendation: "Ensure strict timeline adherence in future",
      status: "noted",
    },
  ];

  const saveAudit = () => {
    alert("Audit review saved as draft");
  };

  const submitAudit = () => {
    if (!auditDecision) {
      alert("Please select an audit decision before submitting");
      return;
    }
    alert(`Audit review submitted: ${auditDecision}`);
  };

  return (
    <PageTemplate
      title="Audit Review Panel"
      description={`${tender.ref} - ${tender.title}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={saveAudit}>
            <Save className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Save Draft</span>
            <span className="xs:hidden">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="size-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Download Audit Report</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button size="sm" onClick={submitAudit} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <Send className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Submit Audit Decision</span>
            <span className="xs:hidden">Submit</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Audit Instructions */}
        <Alert>
          <Shield className="size-4" />
          <AlertDescription>
            <strong>Audit Review Stage:</strong> Review all procurement processes for compliance with PPA 2006, organizational
            policies, and best practices. Approve or reject the evaluation recommendation, or return for revision.
          </AlertDescription>
        </Alert>

        {/* Evaluation Summary */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Evaluation Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Tender Details</p>
                <div className="text-xs sm:text-sm space-y-1">
                  <p><strong>Reference:</strong> {tender.ref}</p>
                  <p><strong>Type:</strong> {tender.type}</p>
                  <p><strong>Est. Value:</strong> {tender.estimatedValue}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Bid Statistics</p>
                <div className="text-xs sm:text-sm space-y-1">
                  <p><strong>Bids Received:</strong> {evaluationSummary.totalBidsReceived}</p>
                  <p><strong>Prequalified:</strong> {evaluationSummary.prequalified}</p>
                  <p><strong>Technically Qualified:</strong> {evaluationSummary.technicallyQualified}</p>
                  <p><strong>Evaluated:</strong> {evaluationSummary.commerciallyEvaluated}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Recommendation</p>
                <div className="text-xs sm:text-sm space-y-1">
                  <p><strong>Vendor:</strong> {evaluationSummary.recommendedVendor}</p>
                  <p><strong>Amount:</strong> <span className="text-green-600 dark:text-green-400 font-semibold">{evaluationSummary.recommendedAmount}</span></p>
                  <p><strong>Savings:</strong> <span className="text-blue-600 dark:text-blue-400">BDT 1,25,000 (2.5%)</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Checklist Tabs */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Audit Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <Tabs defaultValue="procedural" className="w-full">
              <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 mb-4">
                <TabsList className="grid grid-cols-4 min-w-[400px] sm:min-w-0 w-full">
                  <TabsTrigger value="procedural" className="text-[11px] sm:text-sm">Procedural</TabsTrigger>
                  <TabsTrigger value="evaluation" className="text-[11px] sm:text-sm">Evaluation</TabsTrigger>
                  <TabsTrigger value="documentation" className="text-[11px] sm:text-sm">Docs</TabsTrigger>
                  <TabsTrigger value="financial" className="text-[11px] sm:text-sm">Financial</TabsTrigger>
                </TabsList>
              </div>

              {checklistItems.map((category) => (
                <TabsContent key={category.category} value={category.category.toLowerCase().replace(" ", "-")} className="space-y-4">
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="inline-block min-w-[500px] sm:min-w-0 align-middle px-3 sm:px-0 w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Checkpoint</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Auditor Remarks</TableHead>
                            <TableHead>Evidence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium text-xs sm:text-sm">
                                <div>{item.name}</div>
                                <div className="sm:hidden text-[10px] text-muted-foreground mt-0.5">{item.remarks}</div>
                              </TableCell>
                              <TableCell className="text-center">
                                {item.status === "pass" && (
                                  <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px] sm:text-xs">
                                    <CheckCircle2 className="size-3 mr-1" />Pass
                                  </Badge>
                                )}
                                {item.status === "warning" && (
                                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-[10px] sm:text-xs">
                                    <AlertTriangle className="size-3 mr-1" />Warn
                                  </Badge>
                                )}
                                {item.status === "fail" && (
                                  <Badge className="bg-red-100 text-red-700 border-red-300 text-[10px] sm:text-xs">
                                    <XCircle className="size-3 mr-1" />Fail
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{item.remarks}</TableCell>
                              <TableCell>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                  <Eye className="size-3 mr-1" />View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Audit Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Observations & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {auditObservations.map((obs) => (
              <div
                key={obs.id}
                className={`border-l-4 p-4 rounded ${
                  obs.severity === "critical"
                    ? "border-red-500 bg-red-50"
                    : obs.severity === "major"
                    ? "border-orange-500 bg-orange-50"
                    : obs.severity === "minor"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-blue-500 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={
                          obs.severity === "critical"
                            ? "bg-red-600"
                            : obs.severity === "major"
                            ? "bg-orange-600"
                            : obs.severity === "minor"
                            ? "bg-yellow-600"
                            : "bg-blue-600"
                        }
                      >
                        {obs.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{obs.status}</Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{obs.observation}</p>
                    <p className="text-sm text-foreground">
                      <strong>Recommendation:</strong> {obs.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button variant="outline" size="sm">
                + Add New Observation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Review */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Workflow Review Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Published", user: "Procurement Officer", date: "2026-02-20 10:00", status: "completed" },
                { stage: "Bid Opening", user: "Procurement Officer", date: "2026-03-21 10:00", status: "completed" },
                { stage: "Prequalification", user: "Prequalification Evaluator", date: "2026-03-22 14:30", status: "completed" },
                { stage: "Technical Evaluation", user: "Technical Evaluator", date: "2026-03-25 16:00", status: "completed" },
                { stage: "Commercial Evaluation", user: "Commercial Evaluator", date: "2026-03-27 11:00", status: "completed" },
                { stage: "Audit Review", user: "Auditor (You)", date: "In Progress", status: "current" },
                { stage: "Award Decision", user: "Procurement Head", date: "Pending", status: "pending" },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-600 text-white"
                          : step.status === "current"
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "completed" && <CheckCircle2 className="size-4" />}
                      {step.status === "current" && <Clock className="size-4" />}
                    </div>
                    {index < 6 && (
                      <div
                        className={`w-px h-12 ${
                          step.status === "completed" ? "bg-green-600" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-medium">{step.stage}</p>
                    <p className="text-sm text-muted-foreground">{step.user}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Decision */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Audit Decision</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
                Based on your audit findings, select the appropriate decision below. This will determine the next stage of
                the procurement process.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => setAuditDecision("approved")}
                className={`w-full justify-start ${
                  auditDecision === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-background hover:bg-green-50 text-green-600 border border-green-600"
                }`}
              >
                <CheckCircle2 className="size-4 mr-2" />
                Approve - Forward to Award Decision
                {auditDecision === "approved" && <span className="ml-auto">✓ Selected</span>}
              </Button>

              <Button
                onClick={() => setAuditDecision("return-for-revision")}
                className={`w-full justify-start ${
                  auditDecision === "return-for-revision"
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-background hover:bg-yellow-50 text-yellow-600 border border-yellow-600"
                }`}
              >
                <AlertTriangle className="size-4 mr-2" />
                Return for Revision - Send back to evaluation
                {auditDecision === "return-for-revision" && <span className="ml-auto">✓ Selected</span>}
              </Button>

              <Button
                onClick={() => setAuditDecision("rejected")}
                className={`w-full justify-start ${
                  auditDecision === "rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-background hover:bg-red-50 text-red-600 border border-red-600"
                }`}
              >
                <XCircle className="size-4 mr-2" />
                Reject - Non-compliance identified, cancel tender
                {auditDecision === "rejected" && <span className="ml-auto">✓ Selected</span>}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Auditor's Detailed Remarks *</label>
              <Textarea
                placeholder="Provide detailed justification for your audit decision, including reference to specific compliance checkpoints..."
                value={auditRemarks}
                onChange={(e) => setAuditRemarks(e.target.value)}
                rows={5}
              />
            </div>

            {auditDecision && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Next Action:</strong>{" "}
                  {auditDecision === "approved" &&
                    "Tender will be forwarded to Procurement Head for final award decision."}
                  {auditDecision === "return-for-revision" &&
                    "Tender will be returned to the evaluation stage for corrections and re-submission."}
                  {auditDecision === "rejected" &&
                    "Tender will be cancelled due to non-compliance. All vendors will be notified."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}