import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle, AlertTriangle,
  Shield, Tag, Building2, Package, Clock, CreditCard
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { buyApi } from "../../lib/api/buy.api";

const CART_ITEMS = [
  { id: 1, sku: "SKU-001", name: "Dell OptiPlex 7090 MT Desktop", vendor: "Startech BD", category: "IT Equipment", price: 85000, qty: 5, source: "punchout", compliant: true },
  { id: 2, sku: "SKU-002", name: "Dell 27\" P2722H Monitor", vendor: "Startech BD", category: "IT Equipment", price: 28000, qty: 5, source: "punchout", compliant: true },
  { id: 3, sku: "SKU-006", name: "Logitech MK270 Wireless Combo", vendor: "Startech BD", category: "IT Equipment", price: 2500, qty: 5, source: "punchout", compliant: true },
  { id: 4, sku: "SKU-004", name: "TP-Link TL-SG1024D Switch", vendor: "Startech BD", category: "Networking", price: 15000, qty: 2, source: "punchout", compliant: true },
  { id: 5, sku: "CAT-001", name: "A4 Paper (5-Ream Box)", vendor: "Bengal Stationers", category: "Office Supplies", price: 1800, qty: 20, source: "catalog", compliant: true },
];

const COMPLIANCE_CHECKS = [
  { rule: "Budget Availability", status: "pass", detail: "IT Equipment budget: BDT 8,00,000 remaining" },
  { rule: "Preferred Vendor Policy", status: "pass", detail: "All vendors are on the approved list" },
  { rule: "Spend Threshold", status: "warning", detail: "Total exceeds BDT 500K — requires Procurement Head approval" },
  { rule: "Category Policy", status: "pass", detail: "All items match approved categories" },
  { rule: "Duplicate Check", status: "pass", detail: "No similar orders in last 30 days" },
];

export function CartReview() {
  const { data: apiCart } = useApiOrMock(
    () => buyApi.getCart(),
    [],
  );

  const [items, setItems] = useState(CART_ITEMS);

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Cart Review"
        description={`${items.length} items from ${new Set(items.map(i => i.vendor)).size} vendor(s) — Review and validate before checkout`}
        backTo="/buy"
        backLabel="Continue Shopping"
        actions={
          <Link to="/buy/checkout">
            <Button size="sm" disabled={items.length === 0}><ArrowRight className="size-4 mr-1.5" />Proceed to Checkout</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="size-5" />Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-center">Compliant</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku} • {item.category}</p>
                      </TableCell>
                      <TableCell className="text-sm">{item.vendor}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{item.source === "punchout" ? "Punch-Out" : "Catalog"}</Badge></TableCell>
                      <TableCell className="text-right text-sm">BDT {item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.id, -1)}><Minus className="size-3" /></Button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.id, 1)}><Plus className="size-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">BDT {(item.price * item.qty).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {item.compliant ? <CheckCircle className="size-4 text-green-500 mx-auto" /> : <AlertTriangle className="size-4 text-amber-500 mx-auto" />}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="size-4 text-red-500" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="size-5" />Order Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span><span>BDT {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">VAT (7.5%)</span><span>BDT {vat.toLocaleString()}</span></div>
                <div className="border-t border-border pt-3 flex justify-between font-bold"><span>Total</span><span>BDT {total.toLocaleString()}</span></div>
              </div>
              <Link to="/buy/checkout">
                <Button className="w-full mt-4" disabled={items.length === 0}><ArrowRight className="size-4 mr-1.5" />Proceed to Checkout</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Compliance Validation</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {COMPLIANCE_CHECKS.map(c => (
                  <div key={c.rule} className="flex items-start gap-2">
                    {c.status === "pass" ? (
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.rule}</p>
                      <p className="text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}