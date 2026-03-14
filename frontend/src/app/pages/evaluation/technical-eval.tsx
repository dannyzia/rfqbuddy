import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Slider } from "../../components/ui/slider";
import { Textarea } from "../../components/ui/textarea";
import { Save, CheckCircle } from "lucide-react";
import { useParams } from "react-router";
import { useState, useCallback } from "react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { evalApi } from "../../lib/api/eval.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDORS = [
  { id: 1, name: "ABC Suppliers Ltd.", status: "pending" },
  { id: 2, name: "XYZ Manufacturing", status: "pending" },
  { id: 3, name: "Global Traders Inc.", status: "pending" },
];

const MOCK_CRITERIA = [
  { id: 1, name: "Product Quality", weight: 30, maxScore: 100 },
  { id: 2, name: "Technical Specifications Compliance", weight: 25, maxScore: 100 },
  { id: 3, name: "Certifications & Standards", weight: 20, maxScore: 100 },
  { id: 4, name: "Past Performance", weight: 15, maxScore: 100 },
  { id: 5, name: "Delivery Capability", weight: 10, maxScore: 100 },
];

export function TechnicalEvaluation() {
  const { id } = useParams();

  // Wire to real API with mock fallback
  const { data: apiCriteria } = useApiOrMock(
    async () => {
      const result = await evalApi.getCriteria(id!);
      return result.map((c: any, i: number) => ({
        id: c.id ?? i + 1,
        name: c.name ?? c.criterion_name,
        weight: Number(c.weight) ?? 0,
        maxScore: Number(c.max_score ?? 100),
      }));
    },
    MOCK_CRITERIA,
    [id],
  );

  const criteria = apiCriteria;
  const vendors = MOCK_VENDORS; // Vendors come from bid list in real API

  // ─── Local scoring state ──────────────────────────────────────
  const [scores, setScores] = useState<Record<string, Record<number, number>>>({});
  const [notes, setNotes] = useState<Record<string, Record<number, string>>>({});

  const getScore = (vendorId: number, criterionId: number) =>
    scores[vendorId]?.[criterionId] ?? 0;

  const setScore = (vendorId: number, criterionId: number, value: number) => {
    setScores((prev) => ({
      ...prev,
      [vendorId]: { ...prev[vendorId], [criterionId]: value },
    }));
  };

  const getNote = (vendorId: number, criterionId: number) =>
    notes[vendorId]?.[criterionId] ?? "";

  const setNote = (vendorId: number, criterionId: number, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [vendorId]: { ...prev[vendorId], [criterionId]: value },
    }));
  };

  const getVendorTotal = (vendorId: number) =>
    criteria.reduce((sum, c) => sum + (getScore(vendorId, c.id) * c.weight / 100), 0);

  const handleSave = useCallback(() => {
    toast.success("Evaluation progress saved");
  }, []);

  const handleSubmit = useCallback(() => {
    toast.success("Technical evaluation submitted successfully");
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Technical Evaluation"
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
              <CardTitle>Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Weight (%)</TableHead>
                    <TableHead>Max Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteria.map((criterion) => (
                    <TableRow key={criterion.id}>
                      <TableCell className="font-medium">{criterion.name}</TableCell>
                      <TableCell>{criterion.weight}%</TableCell>
                      <TableCell>{criterion.maxScore}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">100%</TableCell>
                    <TableCell className="font-bold">100</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">{vendor.name}</CardTitle>
                </div>
                <Badge variant="secondary" className="w-fit text-[10px] sm:text-xs">Pending Evaluation</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{criterion.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Weight: {criterion.weight}%</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Score</div>
                      <div className="text-xl sm:text-2xl font-bold">{getScore(vendor.id, criterion.id)}/{criterion.maxScore}</div>
                    </div>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    value={[getScore(vendor.id, criterion.id)]}
                    onValueChange={([v]) => setScore(vendor.id, criterion.id, v)}
                    max={criterion.maxScore}
                    step={1}
                    className="py-2"
                  />
                  <Textarea
                    placeholder="Evaluation notes and justification..."
                    rows={2}
                    className="text-[12px] sm:text-sm"
                    value={getNote(vendor.id, criterion.id)}
                    onChange={(e) => setNote(vendor.id, criterion.id, e.target.value)}
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm sm:text-base">Total Technical Score</div>
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