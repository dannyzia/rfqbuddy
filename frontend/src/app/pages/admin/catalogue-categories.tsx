import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Plus, Edit, Trash2, Search, Save, Package, AlertTriangle,
  CheckCircle, XCircle, ArrowUpDown, Eye, EyeOff, Info
} from "lucide-react";
import tenderOptions from "../../config/tender-options.json";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

// ─── Load initial data from centralised JSON ────────────────────────────────
interface CatalogueCategory {
  value: string;
  label: string;
  icon: string;
  status: "active" | "inactive";
  itemCount?: number;
  addedBy?: string;
  addedOn?: string;
}

const INITIAL_CATEGORIES: CatalogueCategory[] = (tenderOptions.catalogueCategories || []).map(
  (c: any, idx: number) => ({
    ...c,
    itemCount: [124, 89, 312, 45, 67, 28, 53, 19, 41, 36, 22, 57, 14, 31, 18, 25, 38, 44, 33, 16, 12, 20, 9, 27, 48, 15, 11, 42, 7][idx] || 0,
    addedBy: idx < 20 ? "System Default" : "SA-Admin",
    addedOn: idx < 20 ? "2025-01-15" : "2026-03-10",
  })
);

export function CatalogueCategoryManagement() {
  const { data: apiStats } = useApiOrMock(
    () => adminApi.getStats(),
    { total_users: 0, total_organizations: 0, total_tenders: 0, total_bids: 0, total_contracts: 0, open_tickets: 0, pending_approvals: 0 },
  );

  const [categories, setCategories] = useState<CatalogueCategory[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortField, setSortField] = useState<"label" | "itemCount" | "addedOn">("label");
  const [sortAsc, setSortAsc] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CatalogueCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ value: "", label: "", icon: "Package" });

  // ─── Filtering + Sorting ─────────────────────────────────────────────────
  const filtered = categories
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter(
      (c) =>
        searchQuery === "" ||
        c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.value.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "label") cmp = a.label.localeCompare(b.label);
      else if (sortField === "itemCount") cmp = (a.itemCount || 0) - (b.itemCount || 0);
      else if (sortField === "addedOn") cmp = (a.addedOn || "").localeCompare(b.addedOn || "");
      return sortAsc ? cmp : -cmp;
    });

  const activeCount = categories.filter((c) => c.status === "active").length;
  const inactiveCount = categories.filter((c) => c.status === "inactive").length;
  const totalItems = categories.reduce((s, c) => s + (c.itemCount || 0), 0);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const generateSlug = (label: string) =>
    label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleAddCategory = () => {
    if (!newCategory.label.trim()) return;
    const cat: CatalogueCategory = {
      value: newCategory.value || generateSlug(newCategory.label),
      label: newCategory.label.trim(),
      icon: newCategory.icon || "Package",
      status: "active",
      itemCount: 0,
      addedBy: "SA-Admin",
      addedOn: new Date().toISOString().split("T")[0],
    };
    // Check duplicate
    if (categories.some((c) => c.value === cat.value)) {
      alert(`Category with slug "${cat.value}" already exists.`);
      return;
    }
    setCategories([...categories, cat]);
    setNewCategory({ value: "", label: "", icon: "Package" });
    setIsAddModalOpen(false);
  };

  const toggleStatus = (value: string) => {
    setCategories(
      categories.map((c) =>
        c.value === value
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const handleDelete = (value: string) => {
    setCategories(categories.filter((c) => c.value !== value));
    setDeleteConfirm(null);
  };

  const handleEditSave = () => {
    if (!editCategory) return;
    setCategories(
      categories.map((c) => (c.value === editCategory.value ? editCategory : c))
    );
    setEditCategory(null);
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // ─── ICON list for selection ──────────────────────────────────────────────
  const ICON_OPTIONS = [
    "Package", "Monitor", "Paperclip", "Droplets", "Zap", "PaintBucket",
    "Armchair", "Wind", "HardHat", "Wrench", "Truck", "Stethoscope",
    "FlaskConical", "SprayCan", "UtensilsCrossed", "Shirt", "Printer",
    "Wifi", "ShieldCheck", "Wheat", "Sun", "Cog", "GraduationCap",
    "Presentation", "Layers", "MoreHorizontal", "Warehouse", "Box",
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Catalogue Category Management"
        description="Manage catalogue categories used across Vendor Catalogue and Catalogue Browser. Data sourced from tender-options.json."
        backTo="/admin/settings"
        backLabel="Back to Settings"
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="size-4 mr-1.5" /> Add Category
          </Button>
        }
      />

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
        <Info className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            These categories are the <strong>single source of truth</strong> for all catalogue dropdowns across the platform.
            Changes here propagate to Vendor Catalogue Manager and Catalogue Browser.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Source: <code>/src/app/config/tender-options.json → catalogueCategories</code>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Categories</p>
            <p className="text-2xl font-bold text-foreground">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">{inactiveCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Catalogue Items</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalItems.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} of {categories.length}</Badge>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-blue-600" onClick={() => handleSort("label")}>
                    Category Name <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-blue-600" onClick={() => handleSort("itemCount")}>
                    Items <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-blue-600" onClick={() => handleSort("addedOn")}>
                    Added On <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cat, idx) => (
                <TableRow key={cat.value} className={cat.status === "inactive" ? "opacity-50" : ""}>
                  <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{cat.label}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
                      {cat.value}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-mono">{cat.icon}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{cat.itemCount || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs ${cat.addedBy === "System Default" ? "text-muted-foreground" : "text-blue-600 dark:text-blue-400"}`}>
                      {cat.addedBy}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{cat.addedOn}</TableCell>
                  <TableCell>
                    <Badge
                      className={`cursor-pointer ${
                        cat.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                      onClick={() => toggleStatus(cat.value)}
                    >
                      {cat.status === "active" ? (
                        <><Eye className="size-3 mr-1" /> Active</>
                      ) : (
                        <><EyeOff className="size-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditCategory({ ...cat })}>
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(cat.value)}
                        disabled={(cat.itemCount || 0) > 0}
                        title={(cat.itemCount || 0) > 0 ? "Cannot delete category with items" : "Delete category"}
                      >
                        <Trash2 className={`size-4 ${(cat.itemCount || 0) > 0 ? "text-muted-foreground/50" : "text-red-500"}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    <Package className="size-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No categories match your filters</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Catalogue Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="catLabel">Category Name *</Label>
              <Input
                id="catLabel"
                className="mt-1"
                placeholder="e.g. Laboratory Equipment"
                value={newCategory.label}
                onChange={(e) => {
                  setNewCategory((p) => ({
                    ...p,
                    label: e.target.value,
                    value: generateSlug(e.target.value),
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="catSlug">Slug (auto-generated)</Label>
              <Input
                id="catSlug"
                className="mt-1 font-mono text-sm"
                value={newCategory.value}
                onChange={(e) => setNewCategory((p) => ({ ...p, value: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used as unique identifier in the JSON config. Must be lowercase with hyphens.
              </p>
            </div>
            <div>
              <Label htmlFor="catIcon">Icon (Lucide icon name)</Label>
              <Select value={newCategory.icon} onValueChange={(v) => setNewCategory((p) => ({ ...p, icon: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.label.trim()}>
              <Save className="size-4 mr-1.5" /> Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editCategory && (
            <div className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  className="mt-1"
                  value={editCategory.label}
                  onChange={(e) => setEditCategory({ ...editCategory, label: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input className="mt-1 font-mono text-sm bg-muted" value={editCategory.value} disabled />
                <p className="text-xs text-muted-foreground mt-1">Slug cannot be changed after creation to prevent data integrity issues.</p>
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={editCategory.icon} onValueChange={(v) => setEditCategory({ ...editCategory, icon: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editCategory.status} onValueChange={(v: any) => setEditCategory({ ...editCategory, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>
              <Save className="size-4 mr-1.5" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="size-5" /> Delete Category
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be undone.
            Categories with existing items cannot be deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              <Trash2 className="size-4 mr-1.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}