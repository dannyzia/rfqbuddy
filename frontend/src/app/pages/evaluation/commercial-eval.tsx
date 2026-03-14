import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Save, CheckCircle, DollarSign } from "lucide-react";
import { useParams } from "react-router";
import { useState, useCallback } from "react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { evalApi } from "../../lib/api/eval.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDORS = [
  { id: 1, name: "ABC Suppliers Ltd.", basePrice: "$65,000", tax: "$6,500", shipping: "$2,000", total: "$73,500" },
  { id: 2, name: "XYZ Manufacturing", basePrice: "$58,000", tax: "$5,800", shipping: "$1,500", total: "$65,300" },
  { id: 3, name: "Global Traders Inc.", basePrice: "$72,000", tax: "$7,200", shipping: "$2,500", total: "$81,700" },
];

const MOCK_CRITERIA = [
  { name: "Total Bid Amount", weight: 50 },
  { name: "Payment Terms", weight: 20 },
  { name: "Warranty Period", weight: 15 },
  { name: "Additional Services", weight: 10 },
  { name: "Price Validity Period", weight: 5 },
];

export function CommercialEvaluation() {
  const { id } = useParams();

  const { data: apiCriteria } = useApiOrMock(
    async () => {
      const result = await evalApi.getCriteria(id!);
      return result
        .filter((c: any) => c.stage === "commercial")
        .map((c: any) => ({
          name: c.name ?? c.criterion_name,
          weight: Number(c.weight) ?? 0,
        }));
    },
    MOCK_CRITERIA,
    [id],
  );

  const vendors = MOCK_VENDORS;
  const criteria = apiCriteria;

  // ─── Local scoring state ──────────────────────────────────────
  const [scores, setScores] = useState<Record<number, Record<string, number>>>({});
  const [analysisNotes, setAnalysisNotes] = useState<Record<number, { terms: string; costBenefit: string }>>({});

  const getVendorScore = (vendorId: number, field: string) =>
    scores[vendorId]?.[field] ?? 0;

  const setVendorScore = (vendorId: number, field: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [vendorId]: { ...prev[vendorId], [field]: Math.min(100, Math.max(0, value)) },
    }));
  };

  const getVendorTotal = (vendorId: number) => {
    const fields = ["price", "payment", "warranty", "services"];
    const weights = [50, 20, 15, 10];
    return fields.reduce((sum, f, i) => sum + (getVendorScore(vendorId, f) * weights[i] / 100), 0);
  };

  const handleSave = useCallback(() => {
    toast.success("Commercial evaluation progress saved");
  }, []);

  const handleSubmit = useCallback(() => {
    toast.success("Commercial evaluation submitted successfully");
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Commercial Evaluation"
        description="RFQ-2024-001: Office Furniture Supply"
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleSave}>
              <Save className="size-4 mr-1 sm:mr-2" />
              Save <span className="hidden xs:inline">Progress</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" onClick={handleSubmit}>
              <CheckCircle className="size-4 mr-1 sm:mr-2" />
              Submit <span className="hidden xs:inline">Evaluation</span>
            </Button>
          </div>
        }
      />

      <div className="mb-6 overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Price Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Base Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Shipping</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor, index) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell className="text-right">{vendor.basePrice}</TableCell>
                      <TableCell className="text-right">{vendor.tax}</TableCell>
                      <TableCell className="text-right">{vendor.shipping}</TableCell>
                      <TableCell className="text-right font-semibold">{vendor.total}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={index === 1 ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                          {index === 1 ? "Lowest" : `#${index + 1}`}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="text-right">Weight (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((criterion, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-xs sm:text-sm">{criterion.name}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">{criterion.weight}%</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold text-xs sm:text-sm">Total</TableCell>
                  <TableCell className="text-right font-bold text-xs sm:text-sm">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="hidden lg:block bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border-indigo-100 dark:border-indigo-900/30">
          <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <DollarSign className="size-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Commercial Score Calculation</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Scores are weighted based on the criteria defined in the tender. The lowest price receives the highest score for the price criterion.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">{vendor.name}</CardTitle>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <DollarSign className="size-3 sm:size-4" />
                    Total Bid: {vendor.total}
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit text-[10px] sm:text-xs">Under Review</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm">Price Score (0-100)</Label>
                  <Input
                    type="number"
                    placeholder="Enter score"
                    className="text-xs sm:text-sm"
                    value={getVendorScore(vendor.id, "price") || ""}
                    onChange={(e) => setVendorScore(vendor.id, "price", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm">Payment Terms Score (0-100)</Label>
                  <Input
                    type="number"
                    placeholder="Enter score"
                    className="text-xs sm:text-sm"
                    value={getVendorScore(vendor.id, "payment") || ""}
                    onChange={(e) => setVendorScore(vendor.id, "payment", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm">Warranty Score (0-100)</Label>
                  <Input
                    type="number"
                    placeholder="Enter score"
                    className="text-xs sm:text-sm"
                    value={getVendorScore(vendor.id, "warranty") || ""}
                    onChange={(e) => setVendorScore(vendor.id, "warranty", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm">Additional Services Score (0-100)</Label>
                  <Input
                    type="number"
                    placeholder="Enter score"
                    className="text-xs sm:text-sm"
                    value={getVendorScore(vendor.id, "services") || ""}
                    onChange={(e) => setVendorScore(vendor.id, "services", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Commercial Terms Analysis</Label>
                <Textarea
                  rows={3}
                  placeholder="Evaluate factors..."
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Cost Benefit Analysis</Label>
                <Textarea
                  rows={2}
                  placeholder="Analyze overall value proposition..."
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm sm:text-base">Total Commercial Score</div>
                  <div className="text-2xl sm:text-3xl font-bold">{Math.round(getVendorTotal(vendor.id))}/100</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}