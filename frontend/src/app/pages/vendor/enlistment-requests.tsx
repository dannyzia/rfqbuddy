import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FileText, Clock, CheckCircle, XCircle, Upload, Send } from "lucide-react";

export function VendorEnlistmentRequests() {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const enlistmentRequests = [
    {
      id: 1,
      purchaserName: "Ministry of Public Works",
      formTitle: "Construction & Works Vendor Enlistment",
      status: "pending",
      receivedDate: "2026-03-01",
      deadline: "2026-03-20",
      description: "Enlistment for construction and infrastructure projects",
    },
    {
      id: 2,
      purchaserName: "National Healthcare Authority",
      formTitle: "Medical Equipment Supplier Enlistment",
      status: "submitted",
      receivedDate: "2026-02-15",
      deadline: "2026-03-10",
      submittedDate: "2026-03-05",
      description: "Enlistment for medical equipment and supplies procurement",
    },
    {
      id: 3,
      purchaserName: "Department of IT Services",
      formTitle: "IT & Technical Services Enlistment",
      status: "approved",
      receivedDate: "2026-01-20",
      deadline: "2026-02-15",
      submittedDate: "2026-02-10",
      approvedDate: "2026-02-18",
      description: "Enlistment for IT consulting and technical services",
    },
    {
      id: 4,
      purchaserName: "City Development Authority",
      formTitle: "General Goods Supplier Enlistment",
      status: "rejected",
      receivedDate: "2026-01-10",
      deadline: "2026-02-01",
      submittedDate: "2026-01-28",
      rejectedDate: "2026-02-05",
      rejectionReason: "Incomplete documentation. Missing financial statements.",
      description: "Enlistment for general goods and supplies",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600 flex items-center gap-1"><Clock className="size-3" /> Pending Response</Badge>;
      case "submitted":
        return <Badge className="bg-blue-600 flex items-center gap-1"><FileText className="size-3" /> Submitted</Badge>;
      case "approved":
        return <Badge className="bg-green-600 flex items-center gap-1"><CheckCircle className="size-3" /> Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 flex items-center gap-1"><XCircle className="size-3" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingRequests = enlistmentRequests.filter(r => r.status === "pending");
  const submittedRequests = enlistmentRequests.filter(r => r.status === "submitted");
  const approvedRequests = enlistmentRequests.filter(r => r.status === "approved");
  const rejectedRequests = enlistmentRequests.filter(r => r.status === "rejected");

  const renderEnlistmentForm = (request: typeof enlistmentRequests[0]) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Application Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="font-semibold mb-4">Company Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input placeholder="Your Company Name" />
            </div>
            <div>
              <Label>Registration Number</Label>
              <Input placeholder="REG-12345" />
            </div>
            <div>
              <Label>Tax Identification Number (TIN)</Label>
              <Input placeholder="TIN-XXXXX" />
            </div>
            <div>
              <Label>Year Established</Label>
              <Input type="number" placeholder="2010" />
            </div>
            <div>
              <Label>Company Type</Label>
              <select className="w-full border rounded-lg px-3 py-2">
                <option>Select type</option>
                <option>Proprietorship</option>
                <option>Partnership</option>
                <option>Private Limited</option>
                <option>Public Limited</option>
              </select>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="company@example.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="+880 1234567890" />
            </div>
            <div>
              <Label>Website</Label>
              <Input placeholder="www.company.com" />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div>
          <h3 className="font-semibold mb-4">Business Details</h3>
          <div className="space-y-4">
            <div>
              <Label>Business Address</Label>
              <Textarea rows={3} placeholder="Complete business address" />
            </div>
            <div>
              <Label>Business Categories (Select all that apply)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["Goods", "Works", "Services"].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <input type="checkbox" className="size-4" />
                    <Label className="font-normal">{cat}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Product/Service Description</Label>
              <Textarea rows={4} placeholder="Describe your products or services" />
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div>
          <h3 className="font-semibold mb-4">Required Documents</h3>
          <div className="space-y-3">
            {[
              { name: "Valid Trade License", required: true },
              { name: "TIN Certificate", required: true },
              { name: "VAT Registration Certificate", required: false },
              { name: "Company Profile", required: false },
              { name: "Bank Solvency Certificate", required: true },
            ].map((doc, index) => (
              <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {doc.name} {doc.required && <span className="text-red-600">*</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {doc.required ? "Required" : "Optional"} • PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="size-4 mr-2" />
                  Upload
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Send className="size-4 mr-2" />
            Submit Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Enlistment Requests"
        description="Manage purchaser enlistment requests and applications"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-3xl font-bold mt-1">{enlistmentRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending Response</div>
            <div className="text-3xl font-bold mt-1 text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Rejected</div>
            <div className="text-3xl font-bold mt-1 text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="cursor-pointer hover:border-blue-500" onClick={() => setSelectedRequest(request.id)}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.formTitle}</h3>
                      <p className="text-sm text-muted-foreground">{request.purchaserName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-foreground mb-4">{request.description}</p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>Received: {request.receivedDate}</span>
                    <span className="text-red-600 font-semibold">Deadline: {request.deadline}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Apply Now</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {selectedRequest && renderEnlistmentForm(enlistmentRequests.find(r => r.id === selectedRequest)!)}
          </div>
        </TabsContent>

        <TabsContent value="submitted">
          <div className="grid gap-4">
            {submittedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.formTitle}</h3>
                      <p className="text-sm text-muted-foreground">{request.purchaserName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-foreground mb-4">{request.description}</p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>Submitted: {request.submittedDate}</span>
                    <span>Awaiting purchaser review</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4">View Application</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid gap-4">
            {approvedRequests.map((request) => (
              <Card key={request.id} className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.formTitle}</h3>
                      <p className="text-sm text-muted-foreground">{request.purchaserName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-foreground mb-4">{request.description}</p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>Approved: {request.approvedDate}</span>
                    <span className="text-green-600 font-semibold">✓ You are now enlisted!</span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4">View Certificate</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid gap-4">
            {rejectedRequests.map((request) => (
              <Card key={request.id} className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.formTitle}</h3>
                      <p className="text-sm text-muted-foreground">{request.purchaserName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-foreground mb-4">{request.description}</p>
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-red-900">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{request.rejectionReason}</p>
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>Rejected: {request.rejectedDate}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Reapply</Button>
                    <Button size="sm" variant="outline">View Application</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}