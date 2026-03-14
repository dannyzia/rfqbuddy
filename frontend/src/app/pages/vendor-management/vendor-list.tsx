import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Search, Plus, Upload, Shield, CheckCircle, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function VendorList() {
  const vendors = [
    { id: 1, name: "ABC Construction Ltd", categories: "Works, Goods", status: "Active", riskScore: 85, enlisted: true, enlistmentStatus: "approved" },
    { id: 2, name: "XYZ Engineering Corp", categories: "Services", status: "Active", riskScore: 92, enlisted: true, enlistmentStatus: "approved" },
    { id: 3, name: "BuildCo International", categories: "Works", status: "On Hold", riskScore: 65, enlisted: true, enlistmentStatus: "withheld" },
    { id: 4, name: "Tech Solutions Inc", categories: "Goods, Services", status: "Active", riskScore: 78, enlisted: false, enlistmentStatus: "not-enlisted" },
    { id: 5, name: "Global Supplies Ltd", categories: "Goods", status: "Active", riskScore: 88, enlisted: true, enlistmentStatus: "approved" },
    { id: 6, name: "Premier Contractors", categories: "Works", status: "Active", riskScore: 91, enlisted: false, enlistmentStatus: "not-enlisted" },
    { id: 7, name: "Quality Materials Co", categories: "Goods", status: "Active", riskScore: 83, enlisted: true, enlistmentStatus: "approved" },
  ];

  const enlistedVendors = vendors.filter(v => v.enlisted);
  const notEnlistedVendors = vendors.filter(v => !v.enlisted);

  const getEnlistmentBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 flex items-center gap-1"><CheckCircle className="size-3" /> Enlisted</Badge>;
      case "withheld":
        return <Badge className="bg-orange-600 flex items-center gap-1"><Shield className="size-3" /> Withheld</Badge>;
      case "not-enlisted":
        return <Badge variant="outline" className="text-muted-foreground">Not Enlisted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderVendorTable = (vendorList: typeof vendors) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Enlistment Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendorList.map((vendor) => (
            <TableRow key={vendor.id} className="cursor-pointer hover:bg-muted">
              <TableCell className="font-medium">
                <Link to={`/vendors/${vendor.id}`} className="hover:text-blue-600">
                  {vendor.name}
                </Link>
              </TableCell>
              <TableCell>{vendor.categories}</TableCell>
              <TableCell>
                {getEnlistmentBadge(vendor.enlistmentStatus)}
              </TableCell>
              <TableCell>
                <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${vendor.riskScore >= 80 ? "bg-green-500" : vendor.riskScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${vendor.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm">{vendor.riskScore}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Link to={`/vendors/${vendor.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  {vendor.enlisted && vendor.enlistmentStatus === "approved" && (
                    <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600">
                      <Shield className="size-4 mr-1" />
                      Withhold
                    </Button>
                  )}
                  {vendor.enlisted && vendor.enlistmentStatus === "withheld" && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="size-4 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Vendor Management"
        description="Search all vendors and manage enlistments"
        actions={
          <>
            <Link to="/vendor-enlistment/form-builder">
              <Button variant="outline">
                <Plus className="size-4 mr-2" />
                Create Enlistment Form
              </Button>
            </Link>
            <Button variant="outline">
              <Upload className="size-4 mr-2" />
              Export
            </Button>
            <Link to="/vendor-enlistment">
              <Button>
                <CheckCircle className="size-4 mr-2" />
                Enlistment Requests
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Vendors</div>
            <div className="text-3xl font-bold mt-1">{vendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Enlisted Vendors</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{enlistedVendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Not Enlisted</div>
            <div className="text-3xl font-bold mt-1 text-muted-foreground">{notEnlistedVendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Withheld</div>
            <div className="text-3xl font-bold mt-1 text-orange-600">
              {vendors.filter(v => v.enlistmentStatus === "withheld").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Vendors ({vendors.length})</TabsTrigger>
          <TabsTrigger value="enlisted">Enlisted ({enlistedVendors.length})</TabsTrigger>
          <TabsTrigger value="not-enlisted">Not Enlisted ({notEnlistedVendors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search all vendors by name, category, or status..." className="pl-10" />
                </div>
                <select className="border rounded-lg px-3 py-2 text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>On Hold</option>
                  <option>Blacklisted</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm">
                  <option>All Categories</option>
                  <option>Goods</option>
                  <option>Works</option>
                  <option>Services</option>
                </select>
              </div>

              {renderVendorTable(vendors)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enlisted">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search enlisted vendors..." className="pl-10" />
                </div>
              </div>
              {renderVendorTable(enlistedVendors)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="not-enlisted">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search non-enlisted vendors..." className="pl-10" />
                </div>
              </div>
              {renderVendorTable(notEnlistedVendors)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}