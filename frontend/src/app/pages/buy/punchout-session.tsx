import { useState } from "react";
import { useParams, Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  ExternalLink, ShoppingCart, ArrowLeft, Search, Star, Plus, Minus,
  Package, CheckCircle, Clock, Shield, Filter, Grid
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { buyApi } from "../../lib/api/buy.api";

const VENDOR_CATALOG = {
  vendorName: "Startech BD",
  protocol: "cXML",
  sessionId: "PO-SESSION-2026-0892",
  lastSync: "2026-03-12 08:00",
  totalItems: 1234,
};

const PRODUCTS = [
  { id: "SKU-001", name: "Dell OptiPlex 7090 MT Desktop", category: "Desktop PC", price: 85000, originalPrice: 92000, inStock: true, rating: 4.8, reviews: 156, image: "🖥️", specs: "i7-11700, 16GB RAM, 512GB SSD" },
  { id: "SKU-002", name: "Dell 27\" P2722H Monitor", category: "Monitor", price: 28000, originalPrice: 28000, inStock: true, rating: 4.6, reviews: 89, image: "🖥️", specs: "Full HD IPS, USB-C, Height Adjustable" },
  { id: "SKU-003", name: "HP LaserJet Pro M404dn", category: "Printer", price: 35000, originalPrice: 38000, inStock: true, rating: 4.5, reviews: 234, image: "🖨️", specs: "Duplex, Network, 40ppm" },
  { id: "SKU-004", name: "TP-Link TL-SG1024D Switch", category: "Networking", price: 15000, originalPrice: 15000, inStock: true, rating: 4.7, reviews: 67, image: "🌐", specs: "24-Port Gigabit, Unmanaged" },
  { id: "SKU-005", name: "APC Back-UPS 1100VA", category: "UPS", price: 8500, originalPrice: 9500, inStock: false, rating: 4.4, reviews: 45, image: "🔋", specs: "660W, 6 Outlets, USB" },
  { id: "SKU-006", name: "Logitech MK270 Wireless Combo", category: "Peripherals", price: 2500, originalPrice: 2800, inStock: true, rating: 4.3, reviews: 312, image: "⌨️", specs: "Wireless Keyboard + Mouse" },
];

export function PunchOutSession() {
  const { vendor_id } = useParams();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");

  const { data: apiProducts } = useApiOrMock(
    () => buyApi.browseItems({ search }),
    { data: [], total: 0, page: 1, pageSize: 20 },
    [search],
  );

  const addToCart = (sku: string) => setCart(prev => ({ ...prev, [sku]: (prev[sku] || 0) + 1 }));
  const removeFromCart = (sku: string) => setCart(prev => {
    const n = (prev[sku] || 0) - 1;
    if (n <= 0) { const { [sku]: _, ...rest } = prev; return rest; }
    return { ...prev, [sku]: n };
  });

  const cartTotal = Object.entries(cart).reduce((sum, [sku, qty]) => {
    const product = PRODUCTS.find(p => p.id === sku);
    return sum + (product ? product.price * qty : 0);
  }, 0);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`Punch-Out: ${VENDOR_CATALOG.vendorName}`}
        description={`cXML session ${VENDOR_CATALOG.sessionId} • ${VENDOR_CATALOG.totalItems} items available • Catalog synced: ${VENDOR_CATALOG.lastSync}`}
        backTo="/buy"
        backLabel="Back to Guided Buying"
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{cartCount} items • BDT {cartTotal.toLocaleString()}</span>
            <Link to="/buy/cart">
              <Button size="sm"><ShoppingCart className="size-4 mr-1.5" />Return Cart to Platform</Button>
            </Link>
          </div>
        }
      />

      {/* Session Info */}
      <Card className="mb-6">
        <CardContent className="py-3">
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="gap-1"><ExternalLink className="size-3" />Punch-Out Session Active</Badge>
            <span className="text-muted-foreground">Protocol: {VENDOR_CATALOG.protocol}</span>
            <span className="text-muted-foreground">|</span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Shield className="size-3.5" />Secure Connection</span>
            <span className="flex-1" />
            <span className="text-muted-foreground">Session expires in 28:45</span>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={`Search ${VENDOR_CATALOG.vendorName} catalog...`} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="size-4 mr-1.5" />Category</Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => {
          const qty = cart[p.id] || 0;
          return (
            <Card key={p.id} className={`transition-shadow ${qty > 0 ? "ring-2 ring-blue-300 dark:ring-blue-600" : ""}`}>
              <CardContent className="pt-6">
                <div className="text-center mb-3">
                  <span className="text-4xl">{p.image}</span>
                </div>
                <Badge variant="outline" className="text-xs mb-2">{p.category}</Badge>
                <h3 className="font-medium text-sm text-foreground mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{p.specs}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-0.5 text-xs"><Star className="size-3 text-amber-500 fill-amber-500" />{p.rating}</span>
                  <span className="text-xs text-muted-foreground">({p.reviews})</span>
                  {p.inStock ? (
                    <Badge variant="default" className="text-xs h-5">In Stock</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs h-5">Out of Stock</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-foreground">BDT {p.price.toLocaleString()}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-xs text-muted-foreground line-through ml-2">BDT {p.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => removeFromCart(p.id)}><Minus className="size-3" /></Button>
                      <span className="font-medium text-sm w-8 text-center">{qty}</span>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => addToCart(p.id)}><Plus className="size-3" /></Button>
                      <span className="text-sm text-muted-foreground ml-2">BDT {(p.price * qty).toLocaleString()}</span>
                    </div>
                  ) : (
                    <Button className="w-full" size="sm" disabled={!p.inStock} onClick={() => addToCart(p.id)}>
                      <ShoppingCart className="size-4 mr-1.5" />{p.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}