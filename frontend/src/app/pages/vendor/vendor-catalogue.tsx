import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import {
  Plus, Edit, Trash2, Upload, Search, Package, CheckCircle, Clock,
  FileText, AlertCircle, Save
} from "lucide-react";
import tenderOptions from "../../config/tender-options.json";

// ─── Read catalogue categories from centralised JSON ────────────────────────
const CATALOGUE_CATEGORIES: { value: string; label: string }[] = (
  tenderOptions.catalogueCategories || []
).filter((c: any) => c.status === "active");

interface CatalogueItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  description: string;
  status: "active" | "pending";
}

export function VendorCatalogueManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CatalogueItem | null>(null);
  const [newItem, setNewItem] = useState({
    code: "", name: "", category: "", unit: "", unitPrice: "", stock: "", description: "",
  });

  const [items, setItems] = useState<CatalogueItem[]>([
    { id: "1", code: "ITM-001", name: "Cement OPC 50kg bag", category: "Building Materials", unit: "Bag", unitPrice: 520, stock: 5000, description: "OPC Grade 43 cement", status: "active" },
    { id: "2", code: "ITM-002", name: "MS Rod 12mm (6m)", category: "Building Materials", unit: "Pc", unitPrice: 950, stock: 1200, description: "Mild steel deformed bar", status: "active" },
    { id: "3", code: "ITM-003", name: "PVC Pipe 4\" (10ft)", category: "Plumbing", unit: "Pc", unitPrice: 380, stock: 800, description: "Schedule 40 PVC pipe", status: "active" },
    { id: "4", code: "ITM-004", name: "Electrical Cable 2.5mm", category: "Electrical", unit: "Meter", unitPrice: 45, stock: 15000, description: "Copper core PVC insulated", status: "active" },
    { id: "5", code: "ITM-005", name: "Sand (Sylhet)", category: "Building Materials", unit: "CFT", unitPrice: 35, stock: 50000, description: "Fine grade river sand", status: "active" },
    { id: "6", code: "ITM-006", name: "Paint (Berger Weather Coat)", category: "Finishing", unit: "Gallon", unitPrice: 2800, stock: 200, description: "Exterior weather resistant paint", status: "pending" },
  ]);

  const filtered = items.filter((item) =>
    searchQuery === "" ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    const item: CatalogueItem = {
      id: String(items.length + 1),
      code: newItem.code || `ITM-${String(items.length + 1).padStart(3, "0")}`,
      name: newItem.name,
      category: newItem.category,
      unit: newItem.unit,
      unitPrice: parseFloat(newItem.unitPrice) || 0,
      stock: parseInt(newItem.stock) || 0,
      description: newItem.description,
      status: "pending",
    };
    setItems([...items, item]);
    setNewItem({ code: "", name: "", category: "", unit: "", unitPrice: "", stock: "", description: "" });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD").format(amount);
  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="My Catalogue"
        description={`${items.length} items | Last updated: 8 Mar 2026`}
        backTo="/vendor-dashboard"
        backLabel="Back to Dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="size-3 mr-1" /> Approved
            </Badge>
          </div>
        }
      />

      {pendingCount > 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
          <Clock className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <strong>{pendingCount} item(s)</strong> pending buyer approval. Changes will be visible after approval.
          </p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="size-4 mr-1.5" /> Add New Item
        </Button>
        <Button variant="outline">
          <Upload className="size-4 mr-1.5" /> Bulk Upload CSV
        </Button>
      </div>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price (BDT)</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.code}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right">
                    <span className={item.stock < 100 ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                      {item.stock < 100 && <AlertCircle className="size-3 inline mr-1" />}
                      {formatCurrency(item.stock)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={item.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }>
                      {item.status === "active" ? "Active" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Catalogue Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="itemCode">Item Code</Label>
                <Input id="itemCode" className="mt-1" placeholder="ITM-007" value={newItem.code} onChange={(e) => setNewItem((p) => ({ ...p, code: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="itemUnit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(v) => setNewItem((p) => ({ ...p, unit: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pc">Pc</SelectItem>
                    <SelectItem value="Bag">Bag</SelectItem>
                    <SelectItem value="Meter">Meter</SelectItem>
                    <SelectItem value="CFT">CFT</SelectItem>
                    <SelectItem value="Gallon">Gallon</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Set">Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input id="itemName" className="mt-1" placeholder="e.g. Cement OPC 50kg bag" value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="itemCat">Category</Label>
              <Select value={newItem.category} onValueChange={(v) => setNewItem((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATALOGUE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="itemPrice">Unit Price (BDT)</Label>
                <Input id="itemPrice" type="number" className="mt-1" placeholder="0" value={newItem.unitPrice} onChange={(e) => setNewItem((p) => ({ ...p, unitPrice: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="itemStock">Stock Quantity</Label>
                <Input id="itemStock" type="number" className="mt-1" placeholder="0" value={newItem.stock} onChange={(e) => setNewItem((p) => ({ ...p, stock: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="itemDesc">Description</Label>
              <Textarea id="itemDesc" className="mt-1" rows={2} placeholder="Brief description..." value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={!newItem.name}><Save className="size-4 mr-1.5" /> Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}