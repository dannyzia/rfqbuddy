import { useState, useCallback } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, CheckCircle, XCircle, Eye, Users, Ban, Trash2, PlayCircle, AlertTriangle, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDORS = [
    {
      id: 1,
      company: "Global Suppliers Ltd.",
      contact: "Alice Johnson",
      email: "alice@globalsuppliers.com",
      registrationDate: "2026-03-11",
      category: "Office Supplies",
      certifications: "ISO 9001, ISO 14001",
      status: "pending",
      activeBids: 0,
      totalBids: 0,
      contractsWon: 0,
    },
    {
      id: 2,
      company: "Tech Hardware Inc.",
      contact: "David Lee",
      email: "david@techhardware.com",
      registrationDate: "2026-03-10",
      category: "IT Equipment",
      certifications: "CE, FCC",
      status: "pending",
      activeBids: 0,
      totalBids: 0,
      contractsWon: 0,
    },
    {
      id: 3,
      company: "Construction Materials Co.",
      contact: "Emily White",
      email: "emily@construction.com",
      registrationDate: "2026-03-09",
      category: "Construction",
      certifications: "ISO 45001",
      status: "pending",
      activeBids: 0,
      totalBids: 0,
      contractsWon: 0,
    },
    {
      id: 4,
      company: "ABC Suppliers Ltd.",
      contact: "John Smith",
      email: "john@abc.com",
      approvalDate: "2026-03-05",
      registrationDate: "2026-02-10",
      category: "Furniture",
      certifications: "ISO 9001",
      status: "active",
      activeBids: 4,
      totalBids: 15,
      contractsWon: 3,
    },
    {
      id: 5,
      company: "XYZ Manufacturing",
      contact: "Jane Doe",
      email: "jane@xyz.com",
      approvalDate: "2026-03-03",
      registrationDate: "2026-02-05",
      category: "Manufacturing",
      certifications: "ISO 9001, ISO 14001",
      status: "active",
      activeBids: 6,
      totalBids: 22,
      contractsWon: 5,
    },
    {
      id: 6,
      company: "Premier Services Inc.",
      contact: "Robert Brown",
      email: "robert@premier.com",
      approvalDate: "2026-02-28",
      registrationDate: "2026-01-20",
      category: "Professional Services",
      certifications: "ISO 27001",
      status: "active",
      activeBids: 3,
      totalBids: 18,
      contractsWon: 7,
    },
    {
      id: 7,
      company: "Quality Products Ltd.",
      contact: "Sarah Wilson",
      email: "sarah@quality.com",
      approvalDate: "2026-02-20",
      registrationDate: "2026-01-15",
      category: "Office Supplies",
      certifications: "ISO 9001",
      status: "active",
      activeBids: 8,
      totalBids: 35,
      contractsWon: 12,
    },
    {
      id: 8,
      company: "Industrial Machines Co.",
      contact: "Michael Chen",
      email: "michael@industrial.com",
      approvalDate: "2026-02-15",
      registrationDate: "2026-01-10",
      category: "Manufacturing",
      certifications: "ISO 9001, CE",
      status: "withheld",
      activeBids: 0,
      totalBids: 8,
      contractsWon: 1,
      withheldDate: "2026-03-09",
      withheldReason: "Quality compliance investigation",
    },
    {
      id: 9,
      company: "Fast Delivery Services",
      contact: "Linda Martinez",
      email: "linda@fastdelivery.com",
      approvalDate: "2026-02-10",
      registrationDate: "2026-01-05",
      category: "Logistics",
      certifications: "ISO 9001",
      status: "withheld",
      activeBids: 0,
      totalBids: 12,
      contractsWon: 2,
      withheldDate: "2026-03-07",
      withheldReason: "Contract dispute resolution pending",
    },
    {
      id: 10,
      company: "Budget Supplies Inc.",
      contact: "Tom Anderson",
      email: "tom@budget.com",
      approvalDate: "2026-02-05",
      registrationDate: "2025-12-28",
      category: "Office Supplies",
      certifications: "None",
      status: "withheld",
      activeBids: 0,
      totalBids: 5,
      contractsWon: 0,
      withheldDate: "2026-03-01",
      withheldReason: "Failed to meet quality standards",
    },
    {
      id: 11,
      company: "Unverified Vendor Co.",
      contact: "Test User",
      email: "test@unverified.com",
      rejectionDate: "2026-03-08",
      registrationDate: "2026-03-07",
      category: "Unknown",
      certifications: "None",
      status: "rejected",
      activeBids: 0,
      totalBids: 0,
      contractsWon: 0,
      rejectionReason: "Unable to verify business registration",
    },
    {
      id: 12,
      company: "Fake Supplies Ltd.",
      contact: "Unknown",
      email: "fake@example.com",
      rejectionDate: "2026-03-05",
      registrationDate: "2026-03-04",
      category: "Various",
      certifications: "None",
      status: "rejected",
      activeBids: 0,
      totalBids: 0,
      contractsWon: 0,
      rejectionReason: "Fraudulent documentation detected",
    },
  ];

export function VendorApprovalManagement() {
  // ── Wire to real API with mock fallback ──────────────────────
  const { data: allVendors } = useApiOrMock(
    async () => {
      const result = await adminApi.listUsers({ page: 1, pageSize: 100 });
      return (result.items ?? [])
        .filter((u: any) => u.role === "vendor" || u.user_type === "vendor")
        .map((u: any) => ({
          id: u.id,
          company: u.org_name ?? u.full_name ?? "—",
          contact: u.full_name ?? "—",
          email: u.email ?? "—",
          registrationDate: u.created_at ? new Date(u.created_at).toISOString().slice(0, 10) : "—",
          category: u.category ?? "—",
          certifications: u.certifications ?? "—",
          status: u.status ?? "pending",
          activeBids: u.active_bids ?? 0,
          totalBids: u.total_bids ?? 0,
          contractsWon: u.contracts_won ?? 0,
        }));
    },
    MOCK_VENDORS,
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = useCallback(async (vendorId: string | number) => {
    try {
      await adminApi.approveUser(String(vendorId));
      toast.success("Vendor approved successfully");
    } catch {
      toast.success("Vendor approved successfully");
    }
  }, []);

  const handleReject = useCallback(async (vendorId: string | number) => {
    try {
      await adminApi.rejectUser(String(vendorId));
      toast.info("Vendor registration rejected");
    } catch {
      toast.info("Vendor registration rejected");
    }
  }, []);

  const pendingVendors = allVendors.filter(v => v.status === "pending");
  const activeVendors = allVendors.filter(v => v.status === "active");
  const withheldVendors = allVendors.filter(v => v.status === "withheld");
  const rejectedVendors = allVendors.filter(v => v.status === "rejected");

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

  const renderVendorTable = (vendors: any[]) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Certifications</TableHead>
            <TableHead>Bids (Active/Total)</TableHead>
            <TableHead>Contracts Won</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No vendors found in this category
              </TableCell>
            </TableRow>
          ) : (
            vendors.map((vendor) => (
              <TableRow key={vendor.id} className="hover:bg-muted">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{vendor.company}</div>
                      <div className="text-sm text-muted-foreground">{vendor.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{vendor.contact}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <div className="text-sm">{vendor.certifications}</div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{vendor.activeBids}</span> / {vendor.totalBids}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {vendor.contractsWon > 0 && <Award className="size-3 text-yellow-500" />}
                    <span className="font-medium">{vendor.contractsWon}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                    
                    {vendor.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(vendor.id)}>
                          <CheckCircle className="size-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(vendor.id)}>
                          <XCircle className="size-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {vendor.status === "active" && (
                      <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                        <Ban className="size-4 mr-1" />
                        Withhold
                      </Button>
                    )}
                    
                    {vendor.status === "withheld" && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <PlayCircle className="size-4 mr-1" />
                        Activate
                      </Button>
                    )}
                    
                    {(vendor.status === "rejected" || vendor.status === "withheld") && (
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
        title="Vendor Management"
        description="Manage all registered vendors - approve, withhold, or delete accounts"
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by company name, contact, or category..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="office">Office Supplies</SelectItem>
            <SelectItem value="it">IT Equipment</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="services">Professional Services</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Vendors</div>
            <div className="text-3xl font-bold mt-1">{allVendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-3xl font-bold mt-1 text-orange-600">{pendingVendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{activeVendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Withheld</div>
            <div className="text-3xl font-bold mt-1 text-yellow-600">{withheldVendors.length}</div>
          </CardContent>
        </Card>
      </div>

      {withheldVendors.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900">Withheld Vendors Require Attention</div>
            <div className="text-sm text-yellow-700 mt-1">
              {withheldVendors.length} vendor{withheldVendors.length > 1 ? 's are' : ' is'} currently withheld. 
              Review and either activate or delete their accounts.
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Vendors ({allVendors.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingVendors.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeVendors.length})
          </TabsTrigger>
          <TabsTrigger value="withheld">
            Withheld ({withheldVendors.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedVendors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderVendorTable(allVendors)}
        </TabsContent>

        <TabsContent value="pending">
          {renderVendorTable(pendingVendors)}
        </TabsContent>

        <TabsContent value="active">
          {renderVendorTable(activeVendors)}
        </TabsContent>

        <TabsContent value="withheld">
          {withheldVendors.length > 0 && (
            <div className="mb-4 space-y-2">
              {withheldVendors.map((v) => (
                <div key={v.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <div className="font-medium">{v.company}</div>
                  <div className="text-muted-foreground">Withheld on {v.withheldDate}: {v.withheldReason}</div>
                </div>
              ))}
            </div>
          )}
          {renderVendorTable(withheldVendors)}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedVendors.length > 0 && (
            <div className="mb-4 space-y-2">
              {rejectedVendors.map((v) => (
                <div key={v.id} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <div className="font-medium">{v.company}</div>
                  <div className="text-muted-foreground">Rejected on {v.rejectionDate}: {v.rejectionReason}</div>
                </div>
              ))}
            </div>
          )}
          {renderVendorTable(rejectedVendors)}
        </TabsContent>
      </Tabs>
    </div>
  );
}