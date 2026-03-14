import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ArrowRight, Save } from "lucide-react";

export function SubmitBid() {
  const items = [
    { id: 1, name: "Executive Desk", quantity: 15, unit: "pieces" },
    { id: 2, name: "Office Chair", quantity: 50, unit: "pieces" },
    { id: 3, name: "Filing Cabinet", quantity: 20, unit: "pieces" },
    { id: 4, name: "Conference Table", quantity: 3, unit: "pieces" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Submit Bid"
        description="RFQ-2024-001: Office Furniture Supply"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="size-4 mr-2" />
              Save Draft
            </Button>
            <Link to="/rfqs/RFQ-2024-001/bid/documents">
              <Button>
                Continue to Documents
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Information</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price ($)</TableHead>
                  <TableHead>Subtotal ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Input type="number" placeholder="0.00" className="w-32" />
                    </TableCell>
                    <TableCell className="font-medium">$0.00</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">
                    Subtotal:
                  </TableCell>
                  <TableCell className="font-semibold">$0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">
                    Tax (10%):
                  </TableCell>
                  <TableCell>$0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">
                    Shipping & Handling:
                  </TableCell>
                  <TableCell>
                    <Input type="number" placeholder="0.00" className="w-32" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-bold">
                    Total Bid Amount:
                  </TableCell>
                  <TableCell className="font-bold text-lg">$0.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery & Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Delivery Timeline (days)</Label>
                <Input type="number" placeholder="e.g., 30" />
              </div>
              <div>
                <Label>Warranty Period (months)</Label>
                <Input type="number" placeholder="e.g., 24" />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Input placeholder="e.g., Net 30" />
              </div>
              <div>
                <Label>Validity Period (days)</Label>
                <Input type="number" placeholder="e.g., 90" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Technical Specifications & Notes</Label>
              <Textarea
                rows={4}
                placeholder="Provide detailed specifications, certifications, and any additional information about the products..."
              />
            </div>
            <div>
              <Label>Value Added Services</Label>
              <Textarea
                rows={3}
                placeholder="Describe any additional services like installation, training, maintenance, etc..."
              />
            </div>
            <div>
              <Label>Special Terms & Conditions</Label>
              <Textarea
                rows={3}
                placeholder="Any special terms, conditions, or requirements..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}