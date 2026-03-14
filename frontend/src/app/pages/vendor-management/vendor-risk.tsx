import { Link } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function VendorRisk() {
  const vendors = [
    { id: 1, name: "ABC Construction", compliance: 95, financial: 88, performance: 92, delivery: 90, overall: 91, band: "Low" },
    { id: 2, name: "XYZ Engineering", compliance: 85, financial: 78, performance: 82, delivery: 85, overall: 83, band: "Medium" },
    { id: 3, name: "BuildCo Ltd", compliance: 58, financial: 62, performance: 55, delivery: 60, overall: 59, band: "High" },
  ];

  return (
    <PageTemplate
      title="Vendor Risk Score Dashboard"
      description="Monitor vendor risk scores and compliance"
    >
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Financial</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Risk Band</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <Link to={`/vendors/${vendor.id}`} className="hover:text-blue-600">
                        {vendor.name}
                      </Link>
                    </TableCell>
                    <TableCell>{vendor.compliance}</TableCell>
                    <TableCell>{vendor.financial}</TableCell>
                    <TableCell>{vendor.performance}</TableCell>
                    <TableCell>{vendor.delivery}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{vendor.overall}</span>
                        {vendor.overall >= 80 && <CheckCircle className="size-4 text-green-600" />}
                        {vendor.overall >= 60 && vendor.overall < 80 && <AlertTriangle className="size-4 text-yellow-600" />}
                        {vendor.overall < 60 && <XCircle className="size-4 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vendor.band === "Low" ? "default" : vendor.band === "Medium" ? "secondary" : "destructive"}
                      >
                        {vendor.band}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/vendors/${vendor.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
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