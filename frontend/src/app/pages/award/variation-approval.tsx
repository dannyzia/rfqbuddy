import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  AlertTriangle, CheckCircle, XCircle, FileText, Clock, Forward,
  DollarSign, Calendar, User, ArrowRight
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function VariationApproval() {
  const { id, vid } = useParams();

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"" | "approve" | "reject" | "forward">("");

  const variation = {
    id: vid || "VAR-001",
    contractId: id || "C-2026-0042",
    type: "Cost Increase",
    status: "pending_approval",
    submittedBy: "Sarah Ahmed",
    submittedDate: "2026-04-20",
    reason: "Unexpected increase in raw material costs due to global supply chain disruptions. Steel prices have increased by 18% since contract signing, and cement prices by 12%. The original pricing was based on March 2026 market rates which are no longer achievable.",
    costDelta: 350000,
    timeDelta: 15,
    justification: "The cost increase is directly attributable to documented market price changes beyond the vendor's control. Supporting evidence includes:\n1. Steel market price index showing 18% increase (Mar-Apr 2026)\n2. Cement manufacturer price notification letter\n3. Updated BOQ with revised unit rates\n4. Comparative analysis of original vs current material costs",
    originalValue: 12450000,
    newValue: 12800000,
    percentChange: 2.81,
    affectedMilestones: ["Phase 1 Installation", "Phase 2 Installation"],
    attachments: [
      { name: "Steel_Price_Index_Report.pdf", size: "2.1 MB" },
      { name: "Cement_Price_Notification.pdf", size: "450 KB" },
      { name: "Updated_BOQ_v2.xlsx", size: "1.8 MB" },
      { name: "Cost_Comparison_Analysis.pdf", size: "890 KB" },
    ],
    auditTrail: [
      { date: "2026-04-20 10:30", action: "Variation submitted", user: "Sarah Ahmed (Contract Manager)" },
      { date: "2026-04-20 10:31", action: "Auto-assigned to Procurement Head for review", user: "System" },
      { date: "2026-04-21 09:15", action: "Reviewed by Procurement Head - forwarded for approval", user: "Md. Rafiqul Islam" },
    ],
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD").format(amount);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Variation #${variation.id}`}
        description={`Contract #${variation.contractId} - ${variation.type}`}
        backTo={`/contracts/${variation.contractId}`}
        backLabel="Back to Contract"
        actions={
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="size-3.5 mr-1" /> Pending Approval
          </Badge>
        }
      />

      {variation.percentChange > 5 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">Auditor Review Required</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This variation exceeds 5% of contract value ({variation.percentChange.toFixed(2)}%). Forward to Auditor for mandatory review.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Impact Summary */}
        <Card className="border-2">
          <CardContent className="pt-5 pb-4 text-center">
            <DollarSign className="size-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-xs text-muted-foreground">Cost Impact</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">+BDT {formatCurrency(variation.costDelta)}</p>
            <p className="text-xs text-muted-foreground mt-1">+{variation.percentChange.toFixed(2)}% of contract value</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-5 pb-4 text-center">
            <Calendar className="size-6 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
            <p className="text-xs text-muted-foreground">Time Impact</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">+{variation.timeDelta} days</p>
            <p className="text-xs text-muted-foreground mt-1">Extension requested</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="pt-5 pb-4 text-center">
            <DollarSign className="size-6 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <p className="text-xs text-muted-foreground">New Contract Value</p>
            <p className="text-xl font-bold text-foreground">BDT {formatCurrency(variation.newValue)}</p>
            <p className="text-xs text-muted-foreground mt-1">from BDT {formatCurrency(variation.originalValue)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Request Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Submitted By</p>
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{variation.submittedBy} on {variation.submittedDate}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Reason</p>
              <p className="text-sm">{variation.reason}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Justification</p>
              <p className="text-sm whitespace-pre-line">{variation.justification}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Affected Milestones</p>
              <div className="flex flex-wrap gap-2">
                {variation.affectedMilestones.map((m, i) => (
                  <Badge key={i} variant="outline">{m}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments & Audit */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Attachments ({variation.attachments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {variation.attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                    <FileText className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {variation.auditTrail.map((a, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-1 bg-blue-200 dark:bg-blue-800 rounded-full shrink-0" />
                    <div>
                      <p className="text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.user} - {a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Decision</CardTitle>
          <CardDescription>Review the variation request and provide your decision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="decision-comment">Comments</Label>
            <Textarea
              id="decision-comment"
              className="mt-1.5"
              rows={4}
              placeholder="Add your comments or conditions for approval..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setDecision("approve")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="size-4 mr-1.5" /> Approve Variation
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDecision("reject")}
            >
              <XCircle className="size-4 mr-1.5" /> Reject Variation
            </Button>
            {variation.percentChange > 5 && (
              <Button
                variant="outline"
                onClick={() => setDecision("forward")}
              >
                <Forward className="size-4 mr-1.5" /> Forward to Auditor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}