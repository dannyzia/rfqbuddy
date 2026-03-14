import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Search, ShoppingCart, Package, Building2, Plus, Minus, FileText,
  CheckCircle, Filter, Trash2
} from "lucide-react";
import tenderOptions from "../../config/tender-options.json";

interface CartItem {
  itemCode: string;
  name: string;
  vendor: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

// ─── Read catalogue categories from centralised JSON ────────────────────────
const CATALOGUE_CATEGORIES: { value: string; label: string }[] = (
  tenderOptions.catalogueCategories || []
).filter((c: any) => c.status === "active");

export function CatalogueBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  const catalogueItems = [
    { itemCode: "ITM-001", name: "Cement OPC 50kg bag", vendor: "ABC Builders Ltd", vendorId: "VND-023", category: "Building Materials", unit: "Bag", unitPrice: 520, stock: 5000, rating: 4.2 },
    { itemCode: "ITM-002", name: "MS Rod 12mm (6m)", vendor: "ABC Builders Ltd", vendorId: "VND-023", category: "Building Materials", unit: "Pc", unitPrice: 950, stock: 1200, rating: 4.2 },
    { itemCode: "ITM-010", name: "HP LaserJet Pro MFP M428", vendor: "TechWorld BD", vendorId: "VND-045", category: "IT Equipment", unit: "Pc", unitPrice: 42000, stock: 50, rating: 4.7 },
    { itemCode: "ITM-011", name: "Dell Optiplex 7020 Desktop", vendor: "TechWorld BD", vendorId: "VND-045", category: "IT Equipment", unit: "Pc", unitPrice: 78000, stock: 80, rating: 4.7 },
    { itemCode: "ITM-020", name: "A4 Paper (80gsm, 500 sheets)", vendor: "Supply House Ltd", vendorId: "VND-067", category: "Office Supplies", unit: "Ream", unitPrice: 450, stock: 10000, rating: 3.9 },
    { itemCode: "ITM-021", name: "Ballpoint Pen (Box of 12)", vendor: "Supply House Ltd", vendorId: "VND-067", category: "Office Supplies", unit: "Box", unitPrice: 180, stock: 5000, rating: 3.9 },
    { itemCode: "ITM-030", name: "PVC Pipe 4\" (10ft)", vendor: "ABC Builders Ltd", vendorId: "VND-023", category: "Plumbing", unit: "Pc", unitPrice: 380, stock: 800, rating: 4.2 },
    { itemCode: "ITM-031", name: "Electrical Cable 2.5mm", vendor: "SecureGuard Ltd", vendorId: "VND-089", category: "Electrical", unit: "Meter", unitPrice: 45, stock: 15000, rating: 4.5 },
    { itemCode: "ITM-040", name: "Executive Office Chair", vendor: "Supply House Ltd", vendorId: "VND-067", category: "Furniture & Fixtures", unit: "Pc", unitPrice: 12500, stock: 30, rating: 3.9 },
    { itemCode: "ITM-050", name: "Safety Helmet (White)", vendor: "SafetyFirst BD", vendorId: "VND-102", category: "Safety & PPE", unit: "Pc", unitPrice: 350, stock: 2000, rating: 4.3 },
    { itemCode: "ITM-051", name: "Safety Goggles (Anti-fog)", vendor: "SafetyFirst BD", vendorId: "VND-102", category: "Safety & PPE", unit: "Pc", unitPrice: 220, stock: 1500, rating: 4.3 },
    { itemCode: "ITM-060", name: "Split AC 1.5 Ton (Gree)", vendor: "CoolTech BD", vendorId: "VND-115", category: "HVAC & Cooling", unit: "Pc", unitPrice: 52000, stock: 25, rating: 4.1 },
    { itemCode: "ITM-061", name: "Exhaust Fan 12\"", vendor: "CoolTech BD", vendorId: "VND-115", category: "HVAC & Cooling", unit: "Pc", unitPrice: 1800, stock: 100, rating: 4.1 },
    { itemCode: "ITM-070", name: "Hand Drill Machine 13mm", vendor: "ToolPro BD", vendorId: "VND-130", category: "Tools & Machinery", unit: "Pc", unitPrice: 4500, stock: 60, rating: 4.6 },
    { itemCode: "ITM-080", name: "Toner Cartridge HP 26A", vendor: "TechWorld BD", vendorId: "VND-045", category: "Printing & Stationery", unit: "Pc", unitPrice: 3200, stock: 300, rating: 4.7 },
    { itemCode: "ITM-090", name: "Cat6 Ethernet Cable (305m)", vendor: "TechWorld BD", vendorId: "VND-045", category: "Telecom & Networking", unit: "Box", unitPrice: 8500, stock: 40, rating: 4.7 },
    { itemCode: "ITM-091", name: "CCTV Camera 2MP (Dahua)", vendor: "SecureGuard Ltd", vendorId: "VND-089", category: "Security & Surveillance", unit: "Pc", unitPrice: 6500, stock: 120, rating: 4.5 },
    { itemCode: "ITM-100", name: "Solar Panel 400W Mono", vendor: "GreenEnergy BD", vendorId: "VND-150", category: "Energy & Solar", unit: "Pc", unitPrice: 18000, stock: 50, rating: 4.4 },
    { itemCode: "ITM-110", name: "Berger Weather Coat 20L", vendor: "ABC Builders Ltd", vendorId: "VND-023", category: "Finishing", unit: "Bucket", unitPrice: 5600, stock: 200, rating: 4.2 },
    { itemCode: "ITM-120", name: "Surgical Mask Box (50pc)", vendor: "MediCare BD", vendorId: "VND-160", category: "Medical Supplies", unit: "Box", unitPrice: 250, stock: 8000, rating: 4.0 },
    { itemCode: "ITM-130", name: "Floor Cleaner Phenyl 5L", vendor: "CleanPro BD", vendorId: "VND-170", category: "Cleaning & Janitorial", unit: "Bottle", unitPrice: 320, stock: 3000, rating: 3.8 },
  ];

  // Build category labels from JSON — match items by label
  const categoryLabels = CATALOGUE_CATEGORIES.map((c) => c.label);
  // Unique categories that appear in actual items
  const itemCategories = [...new Set(catalogueItems.map((i) => i.category))];
  // Merge: all JSON categories that have items + any item categories not yet in JSON
  const displayCategories = [
    ...categoryLabels.filter((label) => itemCategories.includes(label)),
    ...itemCategories.filter((label) => !categoryLabels.includes(label)),
  ];
  const vendors = [...new Set(catalogueItems.map((i) => i.vendor))];

  const filtered = catalogueItems
    .filter((i) => categoryFilter === "all" || i.category === categoryFilter)
    .filter((i) => vendorFilter === "all" || i.vendor === vendorFilter)
    .filter((i) =>
      searchQuery === "" ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const addToCart = (item: typeof catalogueItems[0]) => {
    const existing = cart.find((c) => c.itemCode === item.itemCode);
    if (existing) {
      setCart(cart.map((c) => c.itemCode === item.itemCode ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { itemCode: item.itemCode, name: item.name, vendor: item.vendor, unit: item.unit, unitPrice: item.unitPrice, quantity: 1 }]);
    }
  };

  const updateQuantity = (code: string, delta: number) => {
    setCart(cart.map((c) => {
      if (c.itemCode === code) {
        const newQty = c.quantity + delta;
        return newQty <= 0 ? c : { ...c, quantity: newQty };
      }
      return c;
    }).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (code: string) => {
    setCart(cart.filter((c) => c.itemCode !== code));
  };

  const cartTotal = cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0);
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD").format(amount);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Catalogue Browser"
        description={`Browse approved vendor catalogues and create purchase orders — ${CATALOGUE_CATEGORIES.length} categories from tender-options.json`}
        backTo="/tenders"
        backLabel="Back to Tenders"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Catalogue */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="size-4 mr-1.5" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories ({displayCategories.length})</SelectItem>
                {displayCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-[170px]">
                <Building2 className="size-4 mr-1.5" />
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">{filtered.length} items</Badge>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                categoryFilter === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-background text-muted-foreground border-border hover:border-blue-300"
              }`}
              onClick={() => setCategoryFilter("all")}
            >
              All
            </button>
            {displayCategories.map((c) => {
              const count = catalogueItems.filter((i) => i.category === c).length;
              return (
                <button
                  key={c}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    categoryFilter === c
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-background text-muted-foreground border-border hover:border-blue-300"
                  }`}
                  onClick={() => setCategoryFilter(c)}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>

          {/* Items Table */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price (BDT)</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.itemCode}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.itemCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.vendor}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{item.category}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(item.stock)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={cart.some((c) => c.itemCode === item.itemCode) ? "outline" : "default"}
                          onClick={() => addToCart(item)}
                        >
                          {cart.some((c) => c.itemCode === item.itemCode) ? (
                            <><CheckCircle className="size-3.5 mr-1" /> Added</>
                          ) : (
                            <><Plus className="size-3.5 mr-1" /> Add</>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Package className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p>No items found for the selected filters</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Source info */}
          <p className="text-xs text-muted-foreground/70 mt-3 italic">
            Categories sourced from <code className="text-indigo-500">/src/app/config/tender-options.json → catalogueCategories</code>.
            Super Admin can manage categories at <code className="text-indigo-500">/admin/catalogue-categories</code>.
          </p>
        </div>

        {/* Cart Sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Purchase Order
                {cart.length > 0 && (
                  <Badge className="bg-blue-600 text-white ml-auto">{cart.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No items added yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Browse the catalogue and add items</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.itemCode} className="p-2.5 border border-border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.vendor}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.itemCode)} className="text-muted-foreground hover:text-red-500">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
                              onClick={() => updateQuantity(item.itemCode, -1)}
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-muted/80"
                              onClick={() => updateQuantity(item.itemCode, 1)}
                            >
                              <Plus className="size-3" />
                            </button>
                            <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            BDT {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="text-foreground">{cart.reduce((s, c) => s + c.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-blue-600 dark:text-blue-400">BDT {formatCurrency(cartTotal)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4">
                    <FileText className="size-4 mr-1.5" /> Generate Purchase Order
                  </Button>
                  <Button variant="outline" className="w-full mt-2" onClick={() => setCart([])}>
                    Clear Cart
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}