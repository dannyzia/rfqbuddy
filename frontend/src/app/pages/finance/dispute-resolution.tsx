import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Scale, AlertTriangle, CheckCircle, Clock, MessageSquare, FileText,
  User, Send, Upload, ArrowRight, XCircle, DollarSign
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { financeApi } from "../../lib/api/finance.api";

const DISPUTE = {
  id: "DSP-2026-0045",
  invoiceId: "INV-2026-0236",
  vendor: "Delta Supplies LLC",
  vendorId: "VND-003",
  poNumber: "PO-2026-0085",
  grnNumber: "GRN-2026-0149",
  type: "Price Variance",
  severity: "high",
  status: "under_review",
  invoiceAmount: 320000,
  poAmount: 280000,
  grnAmount: 280000,
  variance: 14.29,
  createdAt: "2026-03-09",
  assignedTo: "Accounts Payable — Farah Akter",
  description: "Vendor invoiced BDT 320,000 against PO amount of BDT 280,000 (14.29% variance). GRN confirms receipt of exact PO quantities. Vendor claims price adjustment due to raw material cost increase.",
};

const TIMELINE = [
  { date: "2026-03-09 10:30", user: "System", action: "Dispute auto-created: Invoice variance exceeds 5% threshold", type: "system" },
  { date: "2026-03-09 11:00", user: "System", action: "Assigned to Accounts Payable — Farah Akter", type: "system" },
  { date: "2026-03-09 14:15", user: "Farah Akter (AP)", action: "Reviewed invoice and PO. Price difference of BDT 40,000 not covered by contract terms. Requesting vendor clarification.", type: "internal" },
  { date: "2026-03-10 09:00", user: "Farah Akter (AP)", action: "Sent clarification request to vendor via email", type: "outbound" },
  { date: "2026-03-10 16:30", user: "Delta Supplies (Vendor)", action: "Response: 'Steel prices increased 15% since PO date. Requesting contract variation for BDT 40,000 additional.' Attached market price evidence.", type: "vendor" },
  { date: "2026-03-11 10:00", user: "Farah Akter (AP)", action: "Forwarded to Procurement Head for decision. Contract clause 8.3 may cover force majeure price adjustments.", type: "internal" },
];

const LINE_ITEMS = [
  { item: "Steel Reinforcement Bar 12mm", poQty: 100, poPrice: 1800, invQty: 100, invPrice: 2100, grnQty: 100, variance: "16.7%" },
  { item: "Steel Reinforcement Bar 16mm", poQty: 50, poPrice: 2000, invQty: 50, invPrice: 2300, grnQty: 50, variance: "15.0%" },
  { item: "Cement (50kg bags)", poQty: 200, poPrice: 550, invQty: 200, invPrice: 550, grnQty: 200, variance: "0%" },
];

export function DisputeResolution() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  const { data: apiPayments } = useApiOrMock(
    () => financeApi.listPayments(),
    { data: [], total: 0, page: 1, pageSize: 20 },
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Dispute ${id || DISPUTE.id}`}
        description={`${DISPUTE.type} — ${DISPUTE.vendor} — Invoice ${DISPUTE.invoiceId}`}
        backTo="/finance/matching"
        backLabel="Back to Matching Queue"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><XCircle className="size-4 mr-1.5" />Reject Invoice</Button>
            <Button variant="outline" size="sm" className="text-amber-600 border-amber-300"><ArrowRight className="size-4 mr-1.5" />Request Variation</Button>
            <Button size="sm"><CheckCircle className="size-4 mr-1.5" />Approve with Adjustment</Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground">Invoice Amount</p>
            <p className="text-xl font-bold text-foreground">BDT {DISPUTE.invoiceAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground">PO Amount</p>
            <p className="text-xl font-bold text-foreground">BDT {DISPUTE.poAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground">Variance</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">+{DISPUTE.variance}%</p>
            <p className="text-xs text-red-500">BDT {(DISPUTE.invoiceAmount - DISPUTE.poAmount).toLocaleString()} over PO</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant="secondary" className="mt-1">Under Review</Badge>
            <p className="text-xs text-muted-foreground mt-1">{DISPUTE.assignedTo}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Dispute Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{DISPUTE.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Line Item Comparison</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">PO Qty</TableHead>
                    <TableHead className="text-right">PO Price</TableHead>
                    <TableHead className="text-center">Inv Qty</TableHead>
                    <TableHead className="text-right">Inv Price</TableHead>
                    <TableHead className="text-center">GRN Qty</TableHead>
                    <TableHead className="text-center">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LINE_ITEMS.map(li => (
                    <TableRow key={li.item} className={li.variance !== "0%" ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}>
                      <TableCell className="font-medium">{li.item}</TableCell>
                      <TableCell className="text-center">{li.poQty}</TableCell>
                      <TableCell className="text-right">{li.poPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{li.invQty}</TableCell>
                      <TableCell className="text-right">{li.invPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{li.grnQty}</TableCell>
                      <TableCell className="text-center">
                        <span className={li.variance === "0%" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400 font-medium"}>
                          {li.variance}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="size-5" />Resolution Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TIMELINE.map((entry, i) => (
                  <div key={i} className="relative pl-6 pb-4 border-l-2 border-border last:border-transparent last:pb-0">
                    <div className={`absolute left-[-5px] top-1 size-2 rounded-full ${
                      entry.type === "vendor" ? "bg-purple-500" : entry.type === "system" ? "bg-blue-500" : entry.type === "outbound" ? "bg-amber-500" : "bg-green-500"
                    }`} />
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{entry.user}</p>
                    <p className="text-sm text-muted-foreground mt-1">{entry.action}</p>
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
                  <Button size="sm" className="flex-1"><Send className="size-4 mr-1.5" />Add Comment</Button>
                  <Button variant="outline" size="sm"><Upload className="size-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}