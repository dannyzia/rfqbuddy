import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Search } from "lucide-react";

export function VendorSelection() {
  const vendors = ["ABC Construction Ltd", "XYZ Engineering Corp", "BuildCo International", "Tech Solutions Inc"];

  return (
    <PageTemplate
      title="Vendor Selection"
      description="Select vendors to invite for limited tender"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Vendors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-10" />
            </div>
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <div key={vendor} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                  <Checkbox id={vendor} />
                  <Label htmlFor={vendor} className="flex-1 cursor-pointer">{vendor}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Valid business license", "Tax clearance certificate", "Minimum 3 years experience", "Financial capacity"].map((criteria) => (
              <div key={criteria} className="flex items-center space-x-2 p-2">
                <Checkbox id={criteria} defaultChecked />
                <Label htmlFor={criteria} className="cursor-pointer">{criteria}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}