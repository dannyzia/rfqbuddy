import { useParams, Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Edit, FileText, TrendingUp, Shield, ArrowLeft } from "lucide-react";

export function VendorProfile() {
  const { id } = useParams();

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-4">
        <Link to="/vendors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Vendor List
        </Link>
      </div>

      <PageHeader
        title="ABC Construction Ltd"
        description="Vendor Profile #001"
        actions={
          <>
            <Button variant="outline">
              <Edit className="size-4 mr-2" />
              Edit Profile
            </Button>
            <Link to={`/vendors/${id}/categories`}>
              <Button>Assign Categories</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Risk Score</div>
            <div className="text-3xl font-bold mt-1">85</div>
            <Badge className="mt-2">Low Risk</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Bids</div>
            <div className="text-3xl font-bold mt-1">24</div>
            <div className="text-xs text-muted-foreground mt-1">12 awarded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-3xl font-bold mt-1">50%</div>
            <div className="text-xs text-green-600 mt-1">Above average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-3xl font-bold mt-1">
              <Badge variant="default" className="text-base">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Company Name</dt>
                  <dd className="font-medium mt-1">ABC Construction Ltd</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Registration Number</dt>
                  <dd className="font-medium mt-1">CR-123456789</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Contact Person</dt>
                  <dd className="font-medium mt-1">John Smith</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="font-medium mt-1">john@abc-construction.com</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="font-medium mt-1">+1 234 567 8900</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Address</dt>
                  <dd className="font-medium mt-1">123 Business Street, City</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Business License", "Tax Clearance", "Insurance Certificate", "Financial Statements"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-blue-600" />
                      <span>{doc}</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">On-time Delivery</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div className="h-full w-[92%] bg-green-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Quality Rating</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div className="h-full w-[88%] bg-green-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Compliance Score</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div className="h-full w-[95%] bg-green-500 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">Goods - Construction Materials</Badge>
                <Badge variant="secondary" className="text-sm">Works - Building Construction</Badge>
                <Badge variant="secondary" className="text-sm">Works - Civil Engineering</Badge>
              </div>
              <Link to={`/vendors/${id}/categories`}>
                <Button variant="outline" className="mt-4">
                  <Edit className="size-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}