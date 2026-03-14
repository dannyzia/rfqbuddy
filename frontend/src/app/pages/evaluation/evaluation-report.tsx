import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Download, FileText, CheckCircle, Send } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { evalApi } from "../../lib/api/eval.api";

export function EvaluationReport() {
  const { id } = useParams();

  // Fetch tender and evaluation results from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: "RFQ-2024-001", title: "Office Furniture Supply", status: "under_evaluation" } as any,
    [id],
  );

  const { data: evalResults } = useApiOrMock(
    () => evalApi.getResults(id!),
    [] as any[],
    [id],
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Evaluation Report"
        description={`${tenderData?.tender_number || "RFQ-2024-001"}: ${tenderData?.title || "Office Furniture Supply"} - Comprehensive evaluation summary`}
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="size-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Download PDF</span>
              <span className="xs:hidden">PDF</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              <Send className="size-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Submit for Approval</span>
              <span className="xs:hidden">Submit</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border border-border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">RFQ Reference</div>
                <div className="font-semibold text-foreground">RFQ-2024-001</div>
              </div>
              <div className="p-3 sm:p-4 border border-border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Published Date</div>
                <div className="font-semibold text-foreground">February 15, 2026</div>
              </div>
              <div className="p-3 sm:p-4 border border-border rounded-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">Submission Deadline</div>
                <div className="font-semibold text-foreground">March 25, 2026</div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">RFQ Description</h4>
              <p className="text-xs sm:text-sm text-foreground">
                Supply and delivery of office furniture including desks, chairs, filing cabinets, and meeting
                room furniture for our new office location in New York.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Evaluation Conducted By</h4>
              <div className="text-xs sm:text-sm space-y-1 text-foreground">
                <div>• Technical Team: John Smith (Lead), Sarah Johnson</div>
                <div>• Commercial Team: Michael Brown (Lead), Emily Davis</div>
                <div>• Evaluation Period: March 11-15, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Bid Submission Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 border border-border rounded-lg text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">5</div>
                <div className="text-[10px] sm:text-sm text-muted-foreground mt-1">Invited Vendors</div>
              </div>
              <div className="p-3 sm:p-4 border border-border rounded-lg text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">3</div>
                <div className="text-[10px] sm:text-sm text-muted-foreground mt-1">Bids Received</div>
              </div>
              <div className="p-3 sm:p-4 border border-border rounded-lg text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">3</div>
                <div className="text-[10px] sm:text-sm text-muted-foreground mt-1">Bids Evaluated</div>
              </div>
              <div className="p-3 sm:p-4 border border-border rounded-lg text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">1</div>
                <div className="text-[10px] sm:text-sm text-muted-foreground mt-1">Recommended</div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "ABC Suppliers Ltd.", badge: <Badge variant="secondary">Submitted</Badge> },
                { name: "XYZ Manufacturing", badge: <Badge className="bg-green-600">Recommended</Badge> },
                { name: "Global Traders Inc.", badge: <Badge variant="secondary">Submitted</Badge> },
                { name: "Premium Office Solutions", badge: <Badge variant="destructive">Did Not Submit</Badge> },
                { name: "Corporate Furnishings Co.", badge: <Badge variant="destructive">Did Not Submit</Badge> },
              ].map((v) => (
                <div key={v.name} className="flex items-center justify-between p-2.5 sm:p-3 border rounded-lg">
                  <span className="text-xs sm:text-sm font-medium">{v.name}</span>
                  {v.badge}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Evaluation Criteria & Weightage</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm sm:text-base">Technical Evaluation</span>
                  <span className="font-bold">50%</span>
                </div>
                <div className="ml-3 sm:ml-4 space-y-1 text-xs sm:text-sm text-muted-foreground">
                  {[["Product Quality","30%"],["Technical Specifications Compliance","25%"],["Certifications & Standards","20%"],["Past Performance","15%"],["Delivery Capability","10%"]].map(([label, pct]) => (
                    <div key={label} className="flex justify-between">
                      <span>• {label}</span><span>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm sm:text-base">Commercial Evaluation</span>
                  <span className="font-bold">50%</span>
                </div>
                <div className="ml-3 sm:ml-4 space-y-1 text-xs sm:text-sm text-muted-foreground">
                  {[["Total Bid Amount","50%"],["Payment Terms","20%"],["Warranty Period","15%"],["Additional Services","10%"],["Price Validity Period","5%"]].map(([label, pct]) => (
                    <div key={label} className="flex justify-between">
                      <span>• {label}</span><span>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Final Ranking & Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {[
                { place: "1st", vendor: "XYZ Manufacturing", bid: "$65,300", score: "93.5", tech: 92, comm: 95, border: "border-2 border-green-500", bg: "bg-green-50 dark:bg-green-900/10", badgeColor: "bg-yellow-500" },
                { place: "2nd", vendor: "ABC Suppliers Ltd.", bid: "$73,500", score: "81.5", tech: 85, comm: 78, border: "border", bg: "", badgeColor: "bg-muted-foreground" },
                { place: "3rd", vendor: "Global Traders Inc.", bid: "$81,700", score: "75.0", tech: 78, comm: 72, border: "border", bg: "", badgeColor: "bg-orange-600" },
              ].map((item) => (
                <div key={item.vendor} className={`p-3 sm:p-4 ${item.border} rounded-lg ${item.bg}`}>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Badge className={`${item.badgeColor} text-base sm:text-lg px-2 sm:px-3 py-0.5 sm:py-1`}>{item.place}</Badge>
                      <div>
                        <div className="font-bold text-sm sm:text-base">{item.vendor}</div>
                        <div className="text-[11px] sm:text-sm text-muted-foreground">Bid Amount: {item.bid}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{item.score}</div>
                      <div className="text-[10px] sm:text-sm text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>Technical Score: {item.tech}/100</div>
                    <div>Commercial Score: {item.comm}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 sm:size-6 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-green-900 dark:text-green-200 mb-2 text-sm sm:text-base">
                    Recommended Vendor: XYZ Manufacturing
                  </div>
                  <div className="text-xs sm:text-sm text-green-800 dark:text-green-300 space-y-2">
                    <p>
                      Based on comprehensive technical and commercial evaluation, XYZ Manufacturing is
                      recommended for award of this contract with an overall score of 93.5/100.
                    </p>
                    <div>
                      <div className="font-medium">Key Strengths:</div>
                      <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                        <li>Highest technical score (92/100) demonstrating superior product quality</li>
                        <li>Most competitive pricing at $65,300</li>
                        <li>Fastest delivery timeline (25 days)</li>
                        <li>Extended warranty period (36 months vs standard 24 months)</li>
                        <li>Additional value-added services including installation and training</li>
                        <li>Strong track record and certifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Next Steps</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-foreground">
                <li>Submit evaluation report for management approval</li>
                <li>Notify XYZ Manufacturing of provisional award</li>
                <li>Conduct pre-award due diligence and site visit</li>
                <li>Negotiate final contract terms</li>
                <li>Issue formal award letter and purchase order</li>
                <li>Notify unsuccessful bidders</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Report Prepared By</h4>
              <div className="text-xs sm:text-sm text-foreground">
                <div>Evaluation Committee</div>
                <div>Date: March 15, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}