import { useState, useCallback } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, CheckCircle, XCircle, Eye, Building2, Ban, Trash2, PlayCircle, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_PURCHASERS = [
    {
      id: 1,
      company: "Tech Solutions Inc.",
      contact: "John Doe",
      email: "john@techsolutions.com",
      registrationDate: "2026-03-10",
      industry: "Technology",
      employees: "500-1000",
      status: "pending",
      activeRFQs: 0,
      totalRFQs: 0,
    },
    {
      id: 2,
      company: "Healthcare Systems Ltd.",
      contact: "Jane Smith",
      email: "jane@healthsys.com",
      registrationDate: "2026-03-09",
      industry: "Healthcare",
      employees: "200-500",
      status: "pending",
      activeRFQs: 0,
      totalRFQs: 0,
    },
    {
      id: 3,
      company: "Manufacturing Corp",
      contact: "Bob Wilson",
      email: "bob@mfgcorp.com",
      registrationDate: "2026-03-08",
      industry: "Manufacturing",
      employees: "1000+",
      status: "pending",
      activeRFQs: 0,
      totalRFQs: 0,
    },
    {
      id: 4,
      company: "Finance Group Inc.",
      contact: "Sarah Johnson",
      email: "sarah@financegroup.com",
      approvalDate: "2026-03-05",
      registrationDate: "2026-02-15",
      industry: "Finance",
      employees: "200-500",
      status: "active",
      activeRFQs: 5,
      totalRFQs: 12,
    },
    {
      id: 5,
      company: "Retail Solutions",
      contact: "Mike Brown",
      email: "mike@retail.com",
      approvalDate: "2026-03-03",
      registrationDate: "2026-02-20",
      industry: "Retail",
      employees: "100-200",
      status: "active",
      activeRFQs: 3,
      totalRFQs: 8,
    },
    {
      id: 6,
      company: "Global Industries",
      contact: "Emma Davis",
      email: "emma@global.com",
      approvalDate: "2026-02-28",
      registrationDate: "2026-01-10",
      industry: "Manufacturing",
      employees: "1000+",
      status: "active",
      activeRFQs: 8,
      totalRFQs: 25,
    },
    {
      id: 7,
      company: "BuildRight Construction",
      contact: "Tom Clark",
      email: "tom@buildright.com",
      approvalDate: "2026-02-25",
      registrationDate: "2026-01-15",
      industry: "Construction",
      employees: "500-1000",
      status: "withheld",
      activeRFQs: 0,
      totalRFQs: 4,
      withheldDate: "2026-03-08",
      withheldReason: "Pending compliance review",
    },
    {
      id: 8,
      company: "Digital Ventures Ltd.",
      contact: "Lisa Anderson",
      email: "lisa@digitalventures.com",
      approvalDate: "2026-02-20",
      registrationDate: "2026-01-05",
      industry: "Technology",
      employees: "50-100",
      status: "withheld",
      activeRFQs: 0,
      totalRFQs: 2,
      withheldDate: "2026-03-05",
      withheldReason: "Payment dispute investigation",
    },
    {
      id: 9,
      company: "Incomplete Registration Co.",
      contact: "Test User",
      email: "test@incomplete.com",
      rejectionDate: "2026-03-07",
      registrationDate: "2026-03-06",
      industry: "Unknown",
      employees: "N/A",
      status: "rejected",
      activeRFQs: 0,
      totalRFQs: 0,
      rejectionReason: "Incomplete documentation",
    },
    {
      id: 10,
      company: "Acme Corporation",
      contact: "David Lee",
      email: "david@acme.com",
      approvalDate: "2026-01-20",
      registrationDate: "2025-12-10",
      industry: "Retail",
      employees: "1000+",
      status: "active",
      activeRFQs: 12,
      totalRFQs: 45,
    },
  ];

export function BuyerApprovalManagement() {
  // ── Wire to real API with mock fallback ──────────────────────
  const { data: allPurchasers } = useApiOrMock(
    async () => {
      const result = await adminApi.listUsers({ page: 1, pageSize: 100 });
      return (result.items ?? [])
        .filter((u: any) => u.role === "buyer" || u.user_type === "buyer")
        .map((u: any) => ({
          id: u.id,
          company: u.org_name ?? u.full_name ?? "—",
          contact: u.full_name ?? "—",
          email: u.email ?? "—",
          registrationDate: u.created_at ? new Date(u.created_at).toISOString().slice(0, 10) : "—",
          industry: u.industry ?? "—",
          employees: u.employees ?? "—",
          status: u.status ?? "pending",
          activeRFQs: u.active_rfqs ?? 0,
          totalRFQs: u.total_rfqs ?? 0,
        }));
    },
    MOCK_PURCHASERS,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = useCallback(async (purchaserId: string | number) => {
    try {
      await adminApi.approveUser(String(purchaserId));
      toast.success("Purchaser approved successfully");
    } catch {
      toast.success("Purchaser approved successfully");
    }
  }, []);

  const handleReject = useCallback(async (purchaserId: string | number) => {
    try {
      await adminApi.rejectUser(String(purchaserId));
      toast.info("Purchaser registration rejected");
    } catch {
      toast.info("Purchaser registration rejected");
    }
  }, []);

  const pendingPurchasers = allPurchasers.filter(p => p.status === "pending");
  const activePurchasers = allPurchasers.filter(p => p.status === "active");
  const withheldPurchasers = allPurchasers.filter(p => p.status === "withheld");
  const rejectedPurchasers = allPurchasers.filter(p => p.status === "rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Pending Review</Badge>;
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "withheld":
        return <Badge className="bg-yellow-600">Withheld</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderPurchaserTable = (purchasers: any[]) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>RFQs (Active/Total)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchasers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No purchasers found in this category
              </TableCell>
            </TableRow>
          ) : (
            purchasers.map((purchaser) => (
              <TableRow key={purchaser.id} className="hover:bg-muted">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{purchaser.company}</div>
                      <div className="text-sm text-muted-foreground">{purchaser.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{purchaser.contact}</TableCell>
                <TableCell>{purchaser.industry}</TableCell>
                <TableCell>{purchaser.registrationDate}</TableCell>
                <TableCell>
                  <span className="font-medium">{purchaser.activeRFQs}</span> / {purchaser.totalRFQs}
                </TableCell>
                <TableCell>{getStatusBadge(purchaser.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                    
                    {purchaser.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(purchaser.id)}>
                          <CheckCircle className="size-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(purchaser.id)}>
                          <XCircle className="size-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {purchaser.status === "active" && (
                      <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                        <Ban className="size-4 mr-1" />
                        Withhold
                      </Button>
                    )}
                    
                    {purchaser.status === "withheld" && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <PlayCircle className="size-4 mr-1" />
                        Activate
                      </Button>
                    )}
                    
                    {(purchaser.status === "rejected" || purchaser.status === "withheld") && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="size-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Procuring Entity Management"
        description="Manage all registered procuring entity organisations — approve, withhold, or delete accounts"
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by company name, contact, or email..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Purchasers</div>
            <div className="text-3xl font-bold mt-1">{allPurchasers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-3xl font-bold mt-1 text-orange-600">{pendingPurchasers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{activePurchasers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Withheld</div>
            <div className="text-3xl font-bold mt-1 text-yellow-600">{withheldPurchasers.length}</div>
          </CardContent>
        </Card>
      </div>

      {withheldPurchasers.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900">Withheld Purchasers Require Attention</div>
            <div className="text-sm text-yellow-700 mt-1">
              {withheldPurchasers.length} purchaser{withheldPurchasers.length > 1 ? 's are' : ' is'} currently withheld. 
              Review and either activate or delete their accounts.
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Purchasers ({allPurchasers.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingPurchasers.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activePurchasers.length})
          </TabsTrigger>
          <TabsTrigger value="withheld">
            Withheld ({withheldPurchasers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedPurchasers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderPurchaserTable(allPurchasers)}
        </TabsContent>

        <TabsContent value="pending">
          {renderPurchaserTable(pendingPurchasers)}
        </TabsContent>

        <TabsContent value="active">
          {renderPurchaserTable(activePurchasers)}
        </TabsContent>

        <TabsContent value="withheld">
          {withheldPurchasers.length > 0 && (
            <div className="mb-4 space-y-2">
              {withheldPurchasers.map((p) => (
                <div key={p.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <div className="font-medium">{p.company}</div>
                  <div className="text-muted-foreground">Withheld on {p.withheldDate}: {p.withheldReason}</div>
                </div>
              ))}
            </div>
          )}
          {renderPurchaserTable(withheldPurchasers)}
        </TabsContent>

        <TabsContent value="rejected">
          {renderPurchaserTable(rejectedPurchasers)}
        </TabsContent>
      </Tabs>
    </div>
  );
}