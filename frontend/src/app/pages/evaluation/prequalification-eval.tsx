import { useState } from "react";
import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Save,
  Send,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { evalApi } from "../../lib/api/eval.api";
import { bidsApi } from "../../lib/api/bids.api";

export function PrequalificationEval() {
  const { id } = useParams();

  // Fetch tender, criteria, and bids from API with mock fallback
  const { data: tenderData } = useApiOrMock(
    () => tendersApi.getById(id!),
    { id: id || "", tender_number: `TDR-${id}`, title: "Office Furniture Supply" } as any,
    [id],
  );

  const { data: apiCriteria } = useApiOrMock(
    () => evalApi.getCriteria(id!),
    [] as any[],
    [id],
  );

  const { data: apiBids } = useApiOrMock(
    () => bidsApi.listByTender(id!),
    [] as any[],
    [id],
  );

  const [evaluationStatus, setEvaluationStatus] = useState<Record<number, "qualified" | "disqualified" | null>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  const tender = tenderData || {
    ref: "PG3-2026-00456",
    title: "Procurement of Office Furniture for Ministry of Education",
    type: "PG3 - Open Tender (Goods)",
  };

  const eligibilityCriteria = apiCriteria || [
    { id: 1, name: "Valid Trade License", mandatory: true },
    { id: 2, name: "TIN Certificate", mandatory: true },
    { id: 3, name: "VAT Registration Certificate", mandatory: true },
    { id: 4, name: "Bank Solvency Certificate (Min BDT 50 Lac)", mandatory: true },
    { id: 5, name: "Audited Financial Statements (Last 3 Years)", mandatory: true },
    { id: 6, name: "Experience Certificate (Min 3 similar projects)", mandatory: true },
    { id: 7, name: "No Litigation Declaration", mandatory: true },
    { id: 8, name: "Bid Security (EMD) - BDT 5 Lac", mandatory: true },
    { id: 9, name: "Not Blacklisted / Debarred", mandatory: true },
  ];

  const vendors = apiBids || [
    {
      id: 1,
      vendorId: "V-2024-1234",
      vendorName: "ABC Trading Company Ltd.",
      documents: {
        1: { submitted: true, valid: true, remarks: "Valid until 2027" },
        2: { submitted: true, valid: true, remarks: "TIN: 123456789" },
        3: { submitted: true, valid: true, remarks: "VAT Reg: 987654321" },
        4: { submitted: true, valid: true, remarks: "BDT 75 Lac solvency" },
        5: { submitted: true, valid: false, remarks: "Only 2 years submitted" },
        6: { submitted: true, valid: true, remarks: "5 similar projects completed" },
        7: { submitted: true, valid: true, remarks: "Declaration signed" },
        8: { submitted: true, valid: true, remarks: "BG from Sonali Bank" },
        9: { submitted: true, valid: true, remarks: "Not in blacklist" },
      },
    },
    {
      id: 2,
      vendorId: "V-2025-0045",
      vendorName: "Global Supplies International",
      documents: {
        1: { submitted: true, valid: true, remarks: "Valid until 2026" },
        2: { submitted: true, valid: true, remarks: "TIN: 987654321" },
        3: { submitted: true, valid: true, remarks: "VAT Reg: 123456789" },
        4: { submitted: true, valid: true, remarks: "BDT 100 Lac solvency" },
        5: { submitted: true, valid: true, remarks: "3 years audited statements" },
        6: { submitted: true, valid: true, remarks: "7 similar projects completed" },
        7: { submitted: true, valid: true, remarks: "Declaration signed" },
        8: { submitted: true, valid: true, remarks: "BG from IFIC Bank" },
        9: { submitted: true, valid: true, remarks: "Not in blacklist" },
      },
    },
    {
      id: 3,
      vendorId: "V-2024-0789",
      vendorName: "Premium Office Solutions",
      documents: {
        1: { submitted: true, valid: true, remarks: "Valid until 2027" },
        2: { submitted: true, valid: true, remarks: "TIN: 456789123" },
        3: { submitted: false, valid: false, remarks: "Not submitted" },
        4: { submitted: true, valid: true, remarks: "BDT 60 Lac solvency" },
        5: { submitted: true, valid: true, remarks: "3 years audited statements" },
        6: { submitted: true, valid: true, remarks: "4 similar projects completed" },
        7: { submitted: true, valid: true, remarks: "Declaration signed" },
        8: { submitted: true, valid: true, remarks: "BG from Agrani Bank" },
        9: { submitted: true, valid: true, remarks: "Not in blacklist" },
      },
    },
  ];

  const toggleVendorStatus = (vendorId: number, status: "qualified" | "disqualified") => {
    setEvaluationStatus((prev) => ({
      ...prev,
      [vendorId]: prev[vendorId] === status ? null : status,
    }));
  };

  const saveEvaluation = () => {
    alert("Prequalification evaluation saved as draft");
  };

  const submitEvaluation = () => {
    const allEvaluated = vendors.every((v) => evaluationStatus[v.id]);
    if (!allEvaluated) {
      alert("Please evaluate all vendors before submitting");
      return;
    }
    alert("Prequalification evaluation submitted. Forwarding to Technical Evaluation stage.");
  };

  return (
    <PageTemplate
      title="Prequalification Evaluation"
      description={`${tender.ref} - ${tender.title}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={saveEvaluation}>
            <Save className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Save Draft</span>
            <span className="xs:hidden">Save</span>
          </Button>
          <Button size="sm" onClick={submitEvaluation} className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">
            <Send className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Submit & Forward</span>
            <span className="xs:hidden">Submit</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Instructions */}
        <Alert>
          <AlertDescription>
            <strong>Prequalification Stage:</strong> Review each vendor's eligibility documents against the mandatory
            criteria. Only vendors meeting ALL mandatory requirements should be qualified for technical evaluation.
          </AlertDescription>
        </Alert>

        {/* Evaluation Summary */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Evaluation Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Vendors</p>
                <p className="font-semibold text-xl sm:text-2xl">{vendors.length}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Qualified</p>
                <p className="font-semibold text-xl sm:text-2xl text-green-600 dark:text-green-400">
                  {Object.values(evaluationStatus).filter((s) => s === "qualified").length}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Disqualified</p>
                <p className="font-semibold text-xl sm:text-2xl text-red-600 dark:text-red-400">
                  {Object.values(evaluationStatus).filter((s) => s === "disqualified").length}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Review</p>
                <p className="font-semibold text-xl sm:text-2xl text-yellow-600 dark:text-yellow-400">
                  {vendors.length - Object.keys(evaluationStatus).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Criteria Reference */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Mandatory Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {eligibilityCriteria.map((criterion) => (
                <div key={criterion.id} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="size-3.5 sm:size-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{criterion.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Evaluation */}
        {vendors.map((vendor) => {
          const qualifiedCount = Object.values(vendor.documents).filter((d) => d.submitted && d.valid).length;
          const totalCriteria = eligibilityCriteria.length;
          const status = evaluationStatus[vendor.id];

          return (
            <Card key={vendor.id} className={status === "qualified" ? "border-green-500" : status === "disqualified" ? "border-red-500" : ""}>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{vendor.vendorName}</p>
                      <p className="text-xs text-muted-foreground">{vendor.vendorId}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {status === "qualified" && (
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px] sm:text-xs">
                          <CheckCircle2 className="size-3 mr-1" />Qualified
                        </Badge>
                      )}
                      {status === "disqualified" && (
                        <Badge className="bg-red-100 text-red-700 border-red-300 text-[10px] sm:text-xs">
                          <XCircle className="size-3 mr-1" />Disqualified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {qualifiedCount}/{totalCriteria} met
                    </span>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="size-3 mr-1" />Docs
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                {/* Document Checklist */}
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <div className="inline-block min-w-[480px] sm:min-w-0 align-middle px-3 sm:px-0 w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Criterion</TableHead>
                          <TableHead className="text-center w-16">Sub.</TableHead>
                          <TableHead className="text-center w-16">Valid</TableHead>
                          <TableHead className="hidden sm:table-cell">Remarks</TableHead>
                          <TableHead className="w-14">Doc</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eligibilityCriteria.map((criterion) => {
                          const doc = vendor.documents[criterion.id];
                          return (
                            <TableRow key={criterion.id} className={!doc.valid ? "bg-red-50 dark:bg-red-900/10" : ""}>
                              <TableCell className="font-medium text-xs sm:text-sm">
                                <div>{criterion.name}</div>
                                <div className="sm:hidden text-[10px] text-muted-foreground">{doc.remarks}</div>
                              </TableCell>
                              <TableCell className="text-center">
                                {doc.submitted ? (
                                  <CheckCircle2 className="size-3.5 sm:size-4 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="size-3.5 sm:size-4 text-red-600 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {doc.valid ? (
                                  <CheckCircle2 className="size-3.5 sm:size-4 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="size-3.5 sm:size-4 text-red-600 mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-xs sm:text-sm text-muted-foreground">{doc.remarks}</TableCell>
                              <TableCell>
                                {doc.submitted && (
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    <FileText className="size-3 mr-0.5" />View
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Evaluator Remarks */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Evaluator Remarks</label>
                  <Textarea
                    placeholder="Enter your evaluation remarks and justification for the decision..."
                    value={remarks[vendor.id] || ""}
                    onChange={(e) => setRemarks({ ...remarks, [vendor.id]: e.target.value })}
                    rows={3}
                    className="text-xs sm:text-sm"
                  />
                </div>

                {/* Decision Buttons */}
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                  <Button
                    onClick={() => toggleVendorStatus(vendor.id, "qualified")}
                    size="sm"
                    className={`flex-1 xs:flex-none ${
                      status === "qualified"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-background hover:bg-green-50 text-green-600 border border-green-600"
                    }`}
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    {status === "qualified" ? "Qualified ✓" : "Mark Qualified"}
                  </Button>
                  <Button
                    onClick={() => toggleVendorStatus(vendor.id, "disqualified")}
                    size="sm"
                    variant={status === "disqualified" ? "default" : "outline"}
                    className={`flex-1 xs:flex-none ${
                      status === "disqualified"
                        ? "bg-red-600 hover:bg-red-700"
                        : "hover:bg-red-50 text-red-600 border-red-600"
                    }`}
                  >
                    <XCircle className="size-4 mr-2" />
                    {status === "disqualified" ? "Disqualified ✓" : "Mark Disqualified"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Submission Warning */}
        <Alert>
          <AlertTriangle className="size-4" />
          <AlertDescription>
            <strong>Important:</strong> Once submitted, disqualified vendors will NOT proceed to technical evaluation.
            Only qualified vendors will advance to the next stage.
          </AlertDescription>
        </Alert>
      </div>
    </PageTemplate>
  );
}