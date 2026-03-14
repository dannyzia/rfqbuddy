import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  ShoppingCart, Search, Star, ArrowRight, Package, Zap,
  Building2, Tag, TrendingUp, Clock, CheckCircle, Filter, Grid, List
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { buyApi } from "../../lib/api/buy.api";

const CATEGORIES = [
  { id: 1, name: "IT Equipment", icon: "💻", count: 234, trending: true },
  { id: 2, name: "Office Supplies", icon: "📎", count: 567, trending: false },
  { id: 3, name: "Furniture", icon: "🪑", count: 89, trending: false },
  { id: 4, name: "Lab Equipment", icon: "🔬", count: 45, trending: true },
  { id: 5, name: "Electrical", icon: "⚡", count: 123, trending: false },
  { id: 6, name: "Safety Equipment", icon: "🦺", count: 78, trending: false },
  { id: 7, name: "Printing & Stationery", icon: "🖨️", count: 345, trending: false },
  { id: 8, name: "Networking", icon: "🌐", count: 67, trending: true },
];

const PREFERRED_VENDORS = [
  { id: "pv-1", name: "Startech BD", logo: "⭐", categories: ["IT Equipment", "Networking"], punchOut: true, rating: 4.8, lastOrder: "2 days ago" },
  { id: "pv-2", name: "Ryans Computers", logo: "🖥️", categories: ["IT Equipment"], punchOut: true, rating: 4.6, lastOrder: "1 week ago" },
  { id: "pv-3", name: "Bengal Stationers", logo: "📝", categories: ["Office Supplies", "Printing"], punchOut: false, rating: 4.3, lastOrder: "3 days ago" },
  { id: "pv-4", name: "HATIL Furniture", logo: "🏠", categories: ["Furniture"], punchOut: false, rating: 4.5, lastOrder: "2 weeks ago" },
  { id: "pv-5", name: "Amazon Business", logo: "📦", categories: ["IT Equipment", "Office Supplies"], punchOut: true, rating: 4.9, lastOrder: "Yesterday" },
];

const RECENT_ORDERS = [
  { id: "REQ-2026-0234", item: "Dell OptiPlex 7090 Desktop", vendor: "Startech BD", amount: 425000, status: "delivered", date: "2026-03-10" },
  { id: "REQ-2026-0230", item: "HP LaserJet Pro M404dn Printer", vendor: "Ryans Computers", amount: 35000, status: "in_transit", date: "2026-03-08" },
  { id: "REQ-2026-0225", item: "Ergonomic Office Chair (x10)", vendor: "HATIL Furniture", amount: 150000, status: "approved", date: "2026-03-05" },
];

const QUICK_BUY_ITEMS = [
  { id: 1, name: "A4 Paper (5-Ream Box)", vendor: "Bengal Stationers", price: 1800, unit: "box", moq: 1 },
  { id: 2, name: "Toner Cartridge HP 26A", vendor: "Ryans Computers", price: 4500, unit: "pcs", moq: 1 },
  { id: 3, name: "Cat6 Network Cable 3m", vendor: "Startech BD", price: 250, unit: "pcs", moq: 10 },
  { id: 4, name: "Whiteboard Marker Set", vendor: "Bengal Stationers", price: 350, unit: "set", moq: 1 },
];

export function GuidedBuying() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: apiItems } = useApiOrMock(
    () => buyApi.browseItems({ search }),
    { data: [], total: 0, page: 1, pageSize: 20 },
    [search],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Guided Buying"
        description="Shop from approved vendors and catalogs — Amazon Business-like experience for procurement"
        actions={
          <Link to="/buy/cart">
            <Button size="sm"><ShoppingCart className="size-4 mr-1.5" />Cart (3 items)</Button>
          </Link>
        }
      />

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input placeholder="Search for products, vendors, or categories..." className="pl-12 h-12 text-base" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="lg"><Filter className="size-4 mr-1.5" />Filters</Button>
            <Button size="lg"><Search className="size-4 mr-1.5" />Search</Button>
          </div>
          <div className="flex gap-2 mt-3">
            {["All", "Under BDT 50K", "Preferred Vendors", "Same-Day Delivery", "Punch-Out Available"].map(f => (
              <Badge key={f} variant="outline" className="cursor-pointer hover:bg-muted">{f}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Package className="size-5" />Browse Categories</CardTitle>
                <div className="flex gap-1">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}><Grid className="size-4" /></Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}><List className="size-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-3" : "space-y-2"}>
                {CATEGORIES.map(c => (
                  <Link key={c.id} to={`/catalogues/browse?category=${c.name}`}>
                    <div className={`p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer ${viewMode === "list" ? "flex items-center gap-4" : "text-center"}`}>
                      <span className="text-2xl">{c.icon}</span>
                      <div className={viewMode === "list" ? "flex-1" : "mt-2"}>
                        <p className="font-medium text-sm text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.count} items</p>
                      </div>
                      {c.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Buy */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="size-5" />Quick Buy — Frequently Ordered</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUICK_BUY_ITEMS.map(item => (
                  <div key={item.id} className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.vendor} • MOQ: {item.moq} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">BDT {item.price.toLocaleString()}</p>
                      <Button size="sm" variant="outline" className="mt-1 text-xs h-7">Add to Cart</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preferred Vendors */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5" />Preferred Vendors</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PREFERRED_VENDORS.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                    <span className="text-2xl">{v.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{v.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Star className="size-3 text-amber-500 fill-amber-500" />{v.rating}</span>
                        {v.punchOut && <Badge variant="outline" className="text-xs h-4 px-1">Punch-Out</Badge>}
                      </div>
                    </div>
                    <Link to={v.punchOut ? `/buy/punchout/${v.id}` : `/catalogues/browse?vendor=${v.name}`}>
                      <Button variant="ghost" size="sm"><ArrowRight className="size-4" /></Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="size-5" />Recent Orders</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_ORDERS.map(o => (
                  <div key={o.id} className="p-3 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground">{o.item}</p>
                    <p className="text-xs text-muted-foreground">{o.vendor} • BDT {o.amount.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{o.date}</span>
                      <Badge variant={o.status === "delivered" ? "default" : o.status === "in_transit" ? "secondary" : "outline"}>
                        {o.status === "delivered" ? "Delivered" : o.status === "in_transit" ? "In Transit" : "Approved"}
                      </Badge>
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