import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  FileText, CheckCircle, ArrowRight, Building2, Calendar, User,
  CreditCard, Send, Shield, AlertTriangle, Truck, Package
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { buyApi } from "../../lib/api/buy.api";

const ORDER_SUMMARY = {
  items: 7,
  vendors: 2,
  subtotal: 641500,
  vat: 48112.5,
  total: 689612.5,
  currency: "BDT",
};

const APPROVAL_CHAIN = [
  { step: 1, role: "Requestor", user: "Current User", status: "complete" },
  { step: 2, role: "Budget Owner", user: "Md. Rafiqul Islam", status: "pending", reason: "Amount > BDT 500K" },
  { step: 3, role: "Procurement Head", user: "Sarah Ahmed", status: "waiting", reason: "Final approval" },
];

export function BuyCheckout() {
  const [deliveryAddress, setDeliveryAddress] = useState("42 Motijheel C/A, Dhaka 1000, Bangladesh");
  const [costCenter, setCostCenter] = useState("CC-IT-2026");
  const [urgency, setUrgency] = useState("standard");
  const [justification, setJustification] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: apiCart } = useApiOrMock(
    () => buyApi.getCart(),
    [],
  );

  if (submitted) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-6">
            <CheckCircle className="size-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Requisition Submitted!</h1>
          <p className="text-muted-foreground mb-4">Your purchase requisition REQ-2026-0245 has been submitted for approval.</p>
          <div className="p-4 rounded-lg bg-muted text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Requisition ID</span><span className="font-medium">REQ-2026-0245</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Amount</span><span className="font-medium">BDT {ORDER_SUMMARY.total.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Next Approver</span><span className="font-medium">Md. Rafiqul Islam (Budget Owner)</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Expected PO Date</span><span className="font-medium">2026-03-14</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/buy"><Button variant="outline">Continue Shopping</Button></Link>
            <Link to="/tenders"><Button>View My Requisitions</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Requisition to PO — Checkout"
        description="Complete your purchase requisition details. Upon approval, a Purchase Order will be auto-generated."
        backTo="/buy/cart"
        backLabel="Back to Cart"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="size-5" />Delivery Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Delivery Address</Label>
                  <Input className="mt-1" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
                </div>
                <div>
                  <Label>Cost Center / Budget Code</Label>
                  <Input className="mt-1" value={costCenter} onChange={e => setCostCenter(e.target.value)} />
                </div>
                <div>
                  <Label>Delivery Urgency</Label>
                  <select
                    className="w-full mt-1 border rounded-md px-3 py-2 text-sm bg-card"
                    value={urgency} onChange={e => setUrgency(e.target.value)}
                  >
                    <option value="standard">Standard (7-14 days)</option>
                    <option value="express">Express (3-5 days)</option>
                    <option value="urgent">Urgent (1-2 days, +15% surcharge)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Business Justification</Label>
                  <textarea
                    className="w-full mt-1 border rounded-md px-3 py-2 text-sm min-h-[80px] bg-card"
                    placeholder="Explain why these items are needed..."
                    value={justification} onChange={e => setJustification(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Chain */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Approval Workflow</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {APPROVAL_CHAIN.map((step, i) => (
                  <div key={step.step} className="flex items-center gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === "complete" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      step.status === "pending" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {step.status === "complete" ? <CheckCircle className="size-4" /> : step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{step.role}</p>
                        <Badge variant={step.status === "complete" ? "default" : step.status === "pending" ? "secondary" : "outline"}>
                          {step.status === "complete" ? "Complete" : step.status === "pending" ? "Next" : "Waiting"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{step.user}{step.reason ? ` — ${step.reason}` : ""}</p>
                    </div>
                    {i < APPROVAL_CHAIN.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">This requisition requires 2 approvals because the total exceeds BDT 500,000. Estimated approval time: 1-2 business days.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="size-5" />Order Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{ORDER_SUMMARY.items} items</span><span>BDT {ORDER_SUMMARY.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (7.5%)</span><span>BDT {ORDER_SUMMARY.vat.toLocaleString()}</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>BDT {ORDER_SUMMARY.total.toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="size-5" />PO Generation</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Upon approval, the system will:</p>
                <div className="space-y-1.5">
                  {[
                    "Auto-generate Purchase Order(s)",
                    "Split by vendor (2 POs expected)",
                    "Send PO to vendor via email",
                    "Create contract entry for tracking",
                    "Set up delivery milestones",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-foreground">
                      <CheckCircle className="size-3.5 text-green-500 shrink-0" />
                      <span className="text-xs">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={() => setSubmitted(true)}>
            <Send className="size-4 mr-1.5" />Submit Requisition for Approval
          </Button>
        </div>
      </div>
    </div>
  );
}