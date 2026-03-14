import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Calendar, DollarSign, Download, FileText, Building2, Clock } from "lucide-react";

export function RfqDetails() {
  const rfq = {
    id: "RFQ-2024-001",
    title: "Office Furniture Supply",
    buyer: "Tech Corp Inc.",
    status: "Open",
    publishDate: "2026-02-15",
    deadline: "2026-03-25",
    budget: "$50,000 - $75,000",
    category: "Furniture",
    description: "Supply and delivery of office furniture including desks, chairs, filing cabinets, and meeting room furniture for our new office location.",
  };

  const items = [
    { id: 1, name: "Executive Desk", quantity: 15, unit: "pieces", specs: "Wooden, L-shaped, with drawers" },
    { id: 2, name: "Office Chair", quantity: 50, unit: "pieces", specs: "Ergonomic, adjustable height, mesh back" },
    { id: 3, name: "Filing Cabinet", quantity: 20, unit: "pieces", specs: "4-drawer, lockable, metal" },
    { id: 4, name: "Conference Table", quantity: 3, unit: "pieces", specs: "12-seater, wooden finish" },
  ];

  const documents = [
    { name: "RFQ_Specifications.pdf", size: "2.4 MB", uploadDate: "2026-02-15" },
    { name: "Technical_Requirements.pdf", size: "1.8 MB", uploadDate: "2026-02-15" },
    { name: "Terms_and_Conditions.pdf", size: "856 KB", uploadDate: "2026-02-15" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title={rfq.title}
        description={`RFQ ID: ${rfq.id}`}
        actions={
          <div className="flex gap-2">
            <Link to={`/rfqs/${rfq.id}/bid`}>
              <Button>
                <FileText className="size-4 mr-2" />
                Submit Bid
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building2 className="size-8 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Buyer</div>
                <div className="font-semibold">{rfq.buyer}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="size-8 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="font-semibold">{rfq.budget}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="size-8 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Deadline</div>
                <div className="font-semibold">{rfq.deadline}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="size-8 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className="mt-1">{rfq.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items ({items.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-6">{rfq.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Key Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{rfq.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="font-medium">{rfq.publishDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bid Submission Deadline:</span>
                      <span className="font-medium">{rfq.deadline}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Delivery Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Location:</span>
                      <span className="font-medium">New York, NY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Delivery:</span>
                      <span className="font-medium">Within 30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Terms:</span>
                      <span className="font-medium">Net 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Required Items</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Specifications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.specs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-4 border rounded hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">{doc.size} • Uploaded {doc.uploadDate}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="size-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>1. Bid Submission</h4>
              <p>All bids must be submitted through the platform before the deadline. Late submissions will not be accepted.</p>
              
              <h4>2. Pricing</h4>
              <p>Quoted prices must be valid for 90 days from the bid submission date and include all taxes and delivery charges.</p>
              
              <h4>3. Evaluation Criteria</h4>
              <p>Bids will be evaluated based on price (40%), quality (30%), delivery timeline (20%), and vendor reputation (10%).</p>
              
              <h4>4. Payment Terms</h4>
              <p>Payment will be made within 30 days of successful delivery and acceptance of goods.</p>
              
              <h4>5. Warranty</h4>
              <p>All items must come with a minimum 2-year manufacturer warranty.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}