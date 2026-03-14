import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Send } from "lucide-react";

export function UploadBidDocuments() {
  const requiredDocs = [
    {
      name: "Company Profile",
      description: "Company registration and profile documents",
      required: true,
      status: "uploaded",
    },
    {
      name: "Technical Specifications",
      description: "Detailed technical specs and product catalogs",
      required: true,
      status: "uploaded",
    },
    {
      name: "Financial Documents",
      description: "Bank statements, financial capacity proof",
      required: true,
      status: "pending",
    },
    {
      name: "Compliance Certificates",
      description: "ISO certifications, quality standards",
      required: true,
      status: "pending",
    },
    {
      name: "Insurance Certificate",
      description: "Valid liability insurance",
      required: false,
      status: "not-uploaded",
    },
    {
      name: "Reference Letters",
      description: "Client references and testimonials",
      required: false,
      status: "not-uploaded",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Upload Bid Documents"
        description="RFQ-2024-001: Office Furniture Supply"
        actions={
          <div className="flex gap-2">
            <Link to="/rfqs/RFQ-2024-001/bid">
              <Button variant="outline">Back to Pricing</Button>
            </Link>
            <Button>
              <Send className="size-4 mr-2" />
              Submit Bid
            </Button>
          </div>
        }
      />

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-blue-600 mt-0.5" />
          <div>
            <div className="font-medium text-blue-900">Document Upload Requirements</div>
            <div className="text-sm text-blue-700 mt-1">
              Please upload all required documents before submitting your bid. Documents marked as required
              are mandatory for bid submission. Maximum file size: 10MB per document.
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredDocs.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center justify-between p-4 border rounded hover:bg-muted"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                  {doc.status === "uploaded" ? (
                    <CheckCircle className="size-8 text-green-600" />
                  ) : doc.status === "pending" ? (
                    <AlertCircle className="size-8 text-orange-500" />
                  ) : (
                    <FileText className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{doc.name}</h4>
                    {doc.required ? (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                  {doc.status === "uploaded" && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Uploaded: document_{doc.name.toLowerCase().replace(/\s+/g, "_")}.pdf
                    </div>
                  )}
                  {doc.status === "pending" && (
                    <div className="text-xs text-orange-600 mt-1">
                      Upload in progress...
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="size-4 mr-2" />
                  {doc.status === "uploaded" ? "Replace" : "Upload"}
                </Button>
                {doc.status === "uploaded" && (
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-muted-foreground transition-colors cursor-pointer">
            <Upload className="size-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">Upload Additional Documents</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here or click to browse
            </p>
            <Button variant="outline">Select Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div className="text-sm">
              <p className="font-medium mb-1">Declaration and Acceptance</p>
              <p className="text-muted-foreground">
                I hereby declare that all information provided in this bid is true and accurate to the best
                of my knowledge. I accept the terms and conditions specified in the RFQ document and agree to
                fulfill the requirements if awarded the contract.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}