import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Award, CheckCircle, XCircle, FileText, Send } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { evalApi } from "../../lib/api/eval.api";

export function AwardDecision() {
  const { id } = useParams();

  // Fetch tender and evaluation results from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: "RFQ-2024-001", title: "Office Furniture Supply" } as any,
    [id],
  );

  const { data: evalResults } = useApiOrMock(
    () => evalApi.getRanking(id!),
    [] as any[],
    [id],
  );

  const recommendedVendor = {
    name: "XYZ Manufacturing",
    bidAmount: "$65,300",
    technicalScore: 92,
    commercialScore: 95,
    overallScore: 93.5,
    deliveryDays: 25,
    warranty: "36 months",
  };

  const otherBidders = [
    {
      name: "ABC Suppliers Ltd.",
      bidAmount: "$73,500",
      overallScore: 81.5,
      status: "not-selected",
    },
    {
      name: "Global Traders Inc.",
      bidAmount: "$81,700",
      overallScore: 75.0,
      status: "not-selected",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Award Decision"
        description="RFQ-2024-001: Office Furniture Supply"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Save Draft</Button>
            <Link to="/contracts/new">
              <Button>
                <Send className="size-4 mr-2" />
                Proceed to Contract
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Award Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-muted-foreground">RFQ Reference</div>
                <div className="font-semibold">RFQ-2024-001</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-muted-foreground">Total Bids Received</div>
                <div className="font-semibold">3 Vendors</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-muted-foreground">Award Date</div>
                <div className="font-semibold">March 16, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="size-8 text-green-600" />
                <div>
                  <CardTitle>Recommended for Award</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Based on evaluation committee recommendation</p>
                </div>
              </div>
              <Badge className="bg-green-600 text-lg px-4 py-1">Winner</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Vendor Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Name:</span>
                    <span className="font-semibold">{recommendedVendor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="font-semibold text-green-600">{recommendedVendor.bidAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Timeline:</span>
                    <span className="font-semibold">{recommendedVendor.deliveryDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warranty Period:</span>
                    <span className="font-semibold">{recommendedVendor.warranty}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Evaluation Scores</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technical Score:</span>
                    <span className="font-semibold">{recommendedVendor.technicalScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commercial Score:</span>
                    <span className="font-semibold">{recommendedVendor.commercialScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overall Score:</span>
                    <span className="font-bold text-lg text-green-600">
                      {recommendedVendor.overallScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Award Justification</h4>
              <div className="text-sm text-foreground space-y-2">
                <p>
                  XYZ Manufacturing has been selected based on their superior overall score of 93.5/100,
                  representing the best value for money with:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Highest technical score demonstrating excellent product quality</li>
                  <li>Most competitive pricing at $65,300</li>
                  <li>Fastest delivery timeline (25 days)</li>
                  <li>Extended warranty (36 months) and additional training services</li>
                  <li>Strong track record and compliance with all requirements</li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" id="confirm-award" className="mt-0.5" />
                <Label htmlFor="confirm-award" className="font-medium">
                  I confirm this award decision and authorize proceeding to contract generation
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Bidders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {otherBidders.map((bidder) => (
              <div key={bidder.name} className="flex items-center justify-between flex-wrap gap-3 p-4 border rounded">
                <div className="flex items-center gap-3">
                  <XCircle className="size-6 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{bidder.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Bid Amount: {bidder.bidAmount} • Score: {bidder.overallScore}/100
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">Not Selected</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Award Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Award Letter to Winning Vendor</Label>
              <Textarea
                rows={4}
                defaultValue="Dear XYZ Manufacturing,&#10;&#10;We are pleased to inform you that your bid for RFQ-2024-001 (Office Furniture Supply) has been selected. Our procurement team will contact you shortly to proceed with contract formalization.&#10;&#10;Congratulations on your successful bid."
              />
              <Button className="mt-2" variant="outline" size="sm">
                <Send className="size-4 mr-2" />
                Send Award Letter
              </Button>
            </div>

            <Separator />

            <div>
              <Label>Regret Letter to Unsuccessful Vendors</Label>
              <Textarea
                rows={4}
                defaultValue="Dear Vendor,&#10;&#10;Thank you for participating in RFQ-2024-001 (Office Furniture Supply). After careful evaluation, we regret to inform you that your bid was not selected on this occasion. We appreciate your effort and look forward to future opportunities to work together."
              />
              <Button className="mt-2" variant="outline" size="sm">
                <Send className="size-4 mr-2" />
                Send to All Unsuccessful Vendors
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Award Approval Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="size-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Evaluation Committee</div>
                  <div className="text-sm text-muted-foreground">Approved on March 15, 2026</div>
                </div>
                <Badge className="bg-green-600">Approved</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="size-5 border-2 border-muted-foreground rounded-full mt-0.5"></div>
                <div className="flex-1">
                  <div className="font-medium">Procurement Manager</div>
                  <div className="text-sm text-muted-foreground">Pending approval</div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="size-5 border-2 border-muted-foreground rounded-full mt-0.5"></div>
                <div className="flex-1">
                  <div className="font-medium">Finance Director</div>
                  <div className="text-sm text-muted-foreground">Awaiting review</div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded">
                <div className="size-5 border-2 border-muted-foreground rounded-full mt-0.5"></div>
                <div className="flex-1">
                  <div className="font-medium">Executive Approval</div>
                  <div className="text-sm text-muted-foreground">Final sign-off required</div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}