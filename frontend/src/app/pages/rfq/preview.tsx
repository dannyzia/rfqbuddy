import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowRight, Edit } from "lucide-react";

export function RfqPreview() {
  return (
    <PageTemplate
      title="RFQ Preview"
      description="Review all details before publishing"
      actions={
        <Button>
          Publish Tender
          <ArrowRight className="size-4 ml-2" />
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
              <Button variant="ghost" size="sm"><Edit className="size-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-muted-foreground">Title:</span> <span className="font-medium">Office Supplies Procurement</span></div>
            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">Procurement of Goods (PG)</span></div>
            <div><span className="text-muted-foreground">Method:</span> <span className="font-medium">Open Tender</span></div>
            <div><span className="text-muted-foreground">Deadline:</span> <span className="font-medium">March 20, 2026 11:59 PM</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Items (3)</CardTitle>
              <Button variant="ghost" size="sm"><Edit className="size-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">3 items with specifications and quantities defined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Documents (2)</CardTitle>
              <Button variant="ghost" size="sm"><Edit className="size-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">2 files uploaded</p>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}