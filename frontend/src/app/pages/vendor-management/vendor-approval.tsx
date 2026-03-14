import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Check, X, FileText } from "lucide-react";

export function VendorApproval() {
  const { id } = useParams();

  return (
    <PageTemplate
      title="Vendor Approval"
      description="Review vendor application and make decision"
      actions={
        <>
          <Button variant="outline" className="text-red-600">
            <X className="size-4 mr-2" />
            Reject
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Check className="size-4 mr-2" />
            Approve
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Company Name</div>
              <div className="font-medium mt-1">New Vendor Inc</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Registration Number</div>
              <div className="font-medium mt-1">CR-987654321</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Contact Person</div>
              <div className="font-medium mt-1">Jane Doe</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium mt-1">jane@newvendor.com</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Business License", "Tax Certificate", "Insurance", "Bank Statement"].map((doc) => (
              <div key={doc} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-blue-600" />
                  <span>{doc}</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Decision Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="notes">Comments</Label>
            <Textarea
              id="notes"
              placeholder="Enter your comments or reasons for approval/rejection..."
              className="mt-2"
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}