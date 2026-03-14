import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Save } from "lucide-react";

export function VendorCategories() {
  const { id } = useParams();

  const categories = [
    { id: "goods", name: "Goods", subcategories: ["Office Supplies", "IT Equipment", "Construction Materials"] },
    { id: "works", name: "Works", subcategories: ["Building Construction", "Civil Engineering", "Road Works"] },
    { id: "services", name: "Services", subcategories: ["Consulting", "Maintenance", "Professional Services"] },
  ];

  return (
    <PageTemplate
      title="Vendor Category Assignment"
      description="Assign procurement categories to vendor"
      actions={
        <Button>
          <Save className="size-4 mr-2" />
          Save Changes
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Select Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id={category.id} />
                <Label htmlFor={category.id} className="font-semibold cursor-pointer">
                  {category.name}
                </Label>
              </div>
              <div className="ml-6 space-y-2">
                {category.subcategories.map((sub) => (
                  <div key={sub} className="flex items-center space-x-2">
                    <Checkbox id={sub} />
                    <Label htmlFor={sub} className="cursor-pointer text-sm">
                      {sub}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
