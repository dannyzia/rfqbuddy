import { Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Check, X } from "lucide-react";

export function VendorEnlistment() {
  const requests = [
    { id: 1, company: "New Vendor Inc", submitted: "2 days ago", status: "Pending" },
    { id: 2, company: "Tech Solutions Ltd", submitted: "5 days ago", status: "Pending" },
    { id: 3, company: "Global Services Corp", submitted: "1 week ago", status: "Pending" },
  ];

  return (
    <PageTemplate
      title="Vendor Enlistment Requests"
      description="Review and approve pending vendor applications"
    >
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.company}</TableCell>
                    <TableCell>{req.submitted}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{req.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/vendor-enlistment/${req.id}`}>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-green-600">
                        <Check className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <X className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}