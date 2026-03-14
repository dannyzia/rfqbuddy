import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Package, CheckCircle, Camera, Upload, Save, Send, AlertTriangle,
  Truck, ClipboardCheck, Calendar, User, FileText, Plus, Minus
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { financeApi } from "../../lib/api/finance.api";

const PO_ITEMS = [
  { id: 1, item: "Desktop Computer — Dell OptiPlex 7090", unit: "pcs", orderedQty: 50, unitPrice: 85000, deliveredPrev: 0 },
  { id: 2, item: "LED Monitor — Dell 27\" P2722H", unit: "pcs", orderedQty: 50, unitPrice: 28000, deliveredPrev: 0 },
  { id: 3, item: "Keyboard & Mouse Combo — Logitech MK270", unit: "sets", orderedQty: 50, unitPrice: 2500, deliveredPrev: 25 },
  { id: 4, item: "UPS — APC Back-UPS 1100VA", unit: "pcs", orderedQty: 50, unitPrice: 8500, deliveredPrev: 0 },
  { id: 5, item: "Network Cable Cat6 — 305m Box", unit: "box", orderedQty: 10, unitPrice: 12000, deliveredPrev: 5 },
  { id: 6, item: "Ethernet Switch — TP-Link 24-Port", unit: "pcs", orderedQty: 5, unitPrice: 15000, deliveredPrev: 2 },
];

export function GRNCreation() {
  const { id } = useParams();

  const { data: apiPayments } = useApiOrMock(
    () => financeApi.listPayments(),
    { data: [], total: 0, page: 1, pageSize: 20 },
  );

  const [receivedQtys, setReceivedQtys] = useState<Record<number, number>>(
    Object.fromEntries(PO_ITEMS.map(item => [item.id, item.orderedQty - item.deliveredPrev]))
  );
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [conditions, setConditions] = useState<Record<number, string>>(
    Object.fromEntries(PO_ITEMS.map(item => [item.id, "good"]))
  );

  const updateQty = (itemId: number, delta: number) => {
    setReceivedQtys(prev => {
      const item = PO_ITEMS.find(i => i.id === itemId)!;
      const max = item.orderedQty - item.deliveredPrev;
      const newVal = Math.max(0, Math.min(max, (prev[itemId] || 0) + delta));
      return { ...prev, [itemId]: newVal };
    });
  };

  const totalValue = PO_ITEMS.reduce((sum, item) => sum + (receivedQtys[item.id] || 0) * item.unitPrice, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Goods Receipt Note (GRN)"
        description={`Contract ${id || "C-2026-0042"} • PO-2026-0089 • Mobile-optimized for warehouse receiving`}
        backTo={`/contracts/${id || "C-2026-0042"}`}
        backLabel="Back to Contract"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Save className="size-4 mr-1.5" />Save Draft</Button>
            <Button size="sm"><Send className="size-4 mr-1.5" />Submit GRN</Button>
          </div>
        }
      />

      {/* GRN Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Truck className="size-4 text-blue-500" /><span className="text-muted-foreground">Vendor:</span><span className="font-medium text-foreground">ABC Builders Ltd</span></div>
              <div className="flex items-center gap-2 text-sm"><FileText className="size-4 text-blue-500" /><span className="text-muted-foreground">PO Number:</span><span className="font-medium text-foreground">PO-2026-0089</span></div>
              <div className="flex items-center gap-2 text-sm"><Calendar className="size-4 text-blue-500" /><span className="text-muted-foreground">Delivery Date:</span><span className="font-medium text-foreground">2026-03-12</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><User className="size-4 text-green-500" /><span className="text-muted-foreground">Received By:</span><span className="font-medium text-foreground">Current User</span></div>
              <div className="flex items-center gap-2 text-sm"><ClipboardCheck className="size-4 text-green-500" /><span className="text-muted-foreground">GRN No:</span><span className="font-medium text-foreground">GRN-2026-0156 (Auto)</span></div>
              <div className="flex items-center gap-2 text-sm"><Calendar className="size-4 text-green-500" /><span className="text-muted-foreground">Receipt Date:</span><span className="font-medium text-foreground">2026-03-12</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total GRN Value</p>
              <p className="text-2xl font-bold text-foreground">BDT {totalValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">{PO_ITEMS.length} line items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="size-5" />Items Received</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-center">Ordered</TableHead>
                  <TableHead className="text-center">Prev. Delivered</TableHead>
                  <TableHead className="text-center">Remaining</TableHead>
                  <TableHead className="text-center">Received Now</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Value (BDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PO_ITEMS.map((item, idx) => {
                  const remaining = item.orderedQty - item.deliveredPrev;
                  const received = receivedQtys[item.id] || 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell className="text-center">{item.orderedQty}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{item.deliveredPrev}</TableCell>
                      <TableCell className="text-center font-medium">{remaining}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => updateQty(item.id, -1)}><Minus className="size-3" /></Button>
                          <Input
                            type="number"
                            className="w-16 text-center h-8"
                            value={received}
                            onChange={e => setReceivedQtys(prev => ({ ...prev, [item.id]: Math.min(remaining, Math.max(0, parseInt(e.target.value) || 0)) }))}
                          />
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => updateQty(item.id, 1)}><Plus className="size-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          className="border rounded px-2 py-1 text-sm bg-card"
                          value={conditions[item.id] || "good"}
                          onChange={e => setConditions(prev => ({ ...prev, [item.id]: e.target.value }))}
                        >
                          <option value="good">Good</option>
                          <option value="damaged">Damaged</option>
                          <option value="partial">Partial</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right font-medium">{(received * item.unitPrice).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Attachments & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="size-5" />Photos & Attachments</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Drag photos or documents here</p>
              <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, PDF up to 10MB each</p>
              <Button variant="outline" size="sm" className="mt-3"><Camera className="size-4 mr-1.5" />Take Photo</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivery Notes & Remarks</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Delivery Challan Number</Label>
                <Input placeholder="e.g. DC-2026-0089" className="mt-1" />
              </div>
              <div>
                <Label>Vehicle/Transport Details</Label>
                <Input placeholder="e.g. Dhaka Metro - 12-3456" className="mt-1" />
              </div>
              <div>
                <Label>General Remarks</Label>
                <textarea className="w-full border rounded-md px-3 py-2 text-sm mt-1 min-h-[80px] bg-card" placeholder="Any observations, damages, or notes..." />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}