import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  DollarSign, CheckCircle, XCircle, FileText, Clock, User,
  Building2, Calendar, AlertCircle, CreditCard
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function PaymentCertificateApproval() {
  const { id, pid } = useParams();

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  const [certifiedAmount, setCertifiedAmount] = useState("1867500");
  const [comment, setComment] = useState("");

  const payment = {
    id: pid || "PAY-003",
    contractId: id || "C-2026-0042",
    contractTitle: "Supply of Office Equipment & IT Infrastructure",
    vendor: "ABC Builders Ltd",
    vendorBank: "NRB Bank Ltd - Motijheel Branch",
    vendorAccount: "****4523",
    milestone: {
      no: 3,
      name: "Delivery of Materials",
      description: "First batch of materials delivered and inspected",
      completedDate: "2026-04-28",
      evidence: ["Delivery Receipt.pdf", "Inspection Certificate.pdf", "Quality Report.pdf"],
    },
    requestedAmount: 1867500,
    contractValue: 12450000,
    previousPayments: 4357500,
    percentOfContract: 15,
    requestedBy: "Sarah Ahmed",
    requestedDate: "2026-04-29",
    status: "pending_certification",
    attachments: [
      { name: "Invoice_INV-2026-0089.pdf", size: "1.4 MB" },
      { name: "Inspection_Report_M3.pdf", size: "2.8 MB" },
      { name: "Delivery_Receipt_Signed.pdf", size: "890 KB" },
    ],
  };

  const certifiedNum = parseFloat(certifiedAmount) || 0;
  const remainingBalance = payment.contractValue - payment.previousPayments - certifiedNum;
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD").format(amount);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Payment Certificate #${payment.id}`}
        description={`Contract #${payment.contractId} - Milestone ${payment.milestone.no}`}
        backTo={`/contracts/${payment.contractId}`}
        backLabel="Back to Contract"
        actions={
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="size-3.5 mr-1" /> Pending Certification
          </Badge>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Requested Amount</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(payment.requestedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Previous Payments</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(payment.previousPayments)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CreditCard className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contract Value</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(payment.contractValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining Balance</p>
                <p className="text-lg font-bold text-foreground">BDT {formatCurrency(remainingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Milestone & Vendor Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Milestone Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Milestone</span>
              <span className="font-medium text-foreground">#{payment.milestone.no} - {payment.milestone.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-foreground max-w-[60%] text-right">{payment.milestone.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium text-green-600 dark:text-green-400">{payment.milestone.completedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested By</span>
              <span className="font-medium text-foreground">{payment.requestedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Request Date</span>
              <span className="font-medium text-foreground">{payment.requestedDate}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Milestone Evidence</p>
              <div className="space-y-1">
                {payment.milestone.evidence.map((e, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="size-3.5 text-green-500" />
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Vendor Bank */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Vendor Payment Info</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendor</span>
                <span className="text-foreground">{payment.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank</span>
                <span className="text-foreground">{payment.vendorBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account</span>
                <span className="text-foreground">{payment.vendorAccount}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Supporting Documents</p>
              <div className="space-y-2">
                {payment.attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                    <FileText className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certification Decision */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Finance Certification</CardTitle>
          <CardDescription>Review and certify the payment amount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Requested Amount (BDT)</Label>
              <Input className="mt-1.5" value={formatCurrency(payment.requestedAmount)} disabled />
            </div>
            <div>
              <Label htmlFor="certified">Certified Amount (BDT)</Label>
              <Input
                id="certified"
                type="number"
                className="mt-1.5"
                value={certifiedAmount}
                onChange={(e) => setCertifiedAmount(e.target.value)}
              />
              {certifiedNum < payment.requestedAmount && certifiedNum > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Certifying BDT {formatCurrency(payment.requestedAmount - certifiedNum)} less than requested
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="cert-comment">Comments</Label>
            <Textarea
              id="cert-comment"
              className="mt-1.5"
              rows={3}
              placeholder="Add certification comments or reason for amount adjustment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="size-4 mr-1.5" /> Certify & Approve Payment
            </Button>
            <Button variant="destructive">
              <XCircle className="size-4 mr-1.5" /> Reject Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}