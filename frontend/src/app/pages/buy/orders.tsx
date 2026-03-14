import { useState } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Package, Search, Eye, Filter, ArrowUpDown, Calendar,
  CheckCircle, Clock, Truck, XCircle, ShoppingCart, FileText,
} from "lucide-react";
import { useCatalogueOrders } from "../../hooks/use-catalogue";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { buyApi } from "../../lib/api/buy.api";
import type { CatalogueOrder, CatalogueOrderStatus } from "../../lib/api-types";

const STATUS_CONFIG: Record<CatalogueOrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: Package },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
};

// Mock data for demo — replaced by real data when backend connected
const MOCK_ORDERS: CatalogueOrder[] = [
  {
    id: "ord-1", order_number: "ORD-2026-ABC1", buyer_id: "u1", buyer_org_id: "org1",
    status: "delivered", total_amount: "425000", currency: "BDT",
    delivery_address: "Dhaka HQ, Level 8", notes: null,
    submitted_at: "2026-03-10T08:00:00Z", approved_at: "2026-03-10T10:30:00Z",
    delivered_at: "2026-03-12T14:00:00Z", created_at: "2026-03-10T08:00:00Z", updated_at: "2026-03-12T14:00:00Z",
  },
  {
    id: "ord-2", order_number: "ORD-2026-DEF2", buyer_id: "u1", buyer_org_id: "org1",
    status: "shipped", total_amount: "178500", currency: "BDT",
    delivery_address: "Chittagong Branch", notes: "Urgent delivery needed",
    submitted_at: "2026-03-11T09:00:00Z", approved_at: "2026-03-11T11:00:00Z",
    delivered_at: null, created_at: "2026-03-11T09:00:00Z", updated_at: "2026-03-12T09:00:00Z",
  },
  {
    id: "ord-3", order_number: "ORD-2026-GHI3", buyer_id: "u1", buyer_org_id: "org1",
    status: "approved", total_amount: "95200", currency: "BDT",
    delivery_address: "Dhaka HQ, Level 3", notes: null,
    submitted_at: "2026-03-12T07:30:00Z", approved_at: "2026-03-12T16:00:00Z",
    delivered_at: null, created_at: "2026-03-12T07:30:00Z", updated_at: "2026-03-12T16:00:00Z",
  },
  {
    id: "ord-4", order_number: "ORD-2026-JKL4", buyer_id: "u1", buyer_org_id: "org1",
    status: "submitted", total_amount: "312000", currency: "BDT",
    delivery_address: "Sylhet Regional Office", notes: "Q2 replenishment",
    submitted_at: "2026-03-13T06:00:00Z", approved_at: null,
    delivered_at: null, created_at: "2026-03-13T06:00:00Z", updated_at: "2026-03-13T06:00:00Z",
  },
  {
    id: "ord-5", order_number: "ORD-2026-MNO5", buyer_id: "u1", buyer_org_id: "org1",
    status: "cancelled", total_amount: "56000", currency: "BDT",
    delivery_address: "Dhaka HQ", notes: "Duplicate order — cancelled",
    submitted_at: "2026-03-08T10:00:00Z", approved_at: null,
    delivered_at: null, created_at: "2026-03-08T10:00:00Z", updated_at: "2026-03-09T08:00:00Z",
  },
  {
    id: "ord-6", order_number: "ORD-2026-PQR6", buyer_id: "u1", buyer_org_id: "org1",
    status: "processing", total_amount: "640000", currency: "BDT",
    delivery_address: "Dhaka HQ, IT Dept", notes: "Annual IT refresh",
    submitted_at: "2026-03-09T12:00:00Z", approved_at: "2026-03-09T15:00:00Z",
    delivered_at: null, created_at: "2026-03-09T12:00:00Z", updated_at: "2026-03-11T10:00:00Z",
  },
];

function formatCurrency(amount: string | number, currency = "BDT") {
  return `${currency} ${Number(amount).toLocaleString("en-BD")}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }: { status: CatalogueOrderStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${config.color} border-0`}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

type FilterStatus = "all" | CatalogueOrderStatus;

export function CatalogueOrders() {
  const { data: apiOrders } = useCatalogueOrders();

  const { data: apiBuyOrders } = useApiOrMock(
    () => buyApi.listOrders(),
    [],
  );

  const orders = apiOrders && apiOrders.length > 0 ? apiOrders : MOCK_ORDERS;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase())
      || (o.delivery_address ?? "").toLowerCase().includes(search.toLowerCase())
      || (o.notes ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortField === "date") {
      const diff = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      return sortDir === "asc" ? diff : -diff;
    }
    const diff = Number(a.total_amount) - Number(b.total_amount);
    return sortDir === "asc" ? diff : -diff;
  });

  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // Summary stats
  const totalOrders = orders.length;
  const totalSpend = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_amount), 0);
  const activeOrders = orders.filter(o => ["submitted", "approved", "processing", "shipped"].includes(o.status)).length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order History"
        description="Track and manage your catalogue purchase orders"
        backTo="/buy"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <ShoppingCart className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-foreground text-xl">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Package className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Spend</p>
                <p className="text-foreground text-xl">{formatCurrency(totalSpend)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active</p>
                <p className="text-foreground text-xl">{activeOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Delivered</p>
                <p className="text-foreground text-xl">{deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "submitted", "approved", "processing", "shipped", "delivered", "cancelled"] as FilterStatus[]).map(s => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all" ? "All" : STATUS_CONFIG[s].label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Orders ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="size-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
              <p className="text-sm mt-1">Your catalogue orders will appear here</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/buy">Browse Catalogue</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Calendar className="size-3" />
                        Date
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        Amount
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Delivery</TableHead>
                    <TableHead className="hidden lg:table-cell">Notes</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-foreground">{order.order_number}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(order.submitted_at)}</TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell className="text-foreground">{formatCurrency(order.total_amount, order.currency)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[180px] truncate">
                        {order.delivery_address ?? "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[200px] truncate">
                        {order.notes ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/buy/orders/${order.id}`}>
                            <Eye className="size-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CatalogueOrders;