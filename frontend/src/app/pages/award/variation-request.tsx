import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { AlertTriangle, Upload, FileText, Trash2, Save, Send, Calculator } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function VariationRequestForm() {
  const { id } = useParams();

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reason: "",
    type: "",
    costDelta: "",
    timeDelta: "",
    justification: "",
    affectedMilestones: [] as number[],
  });
  const [files, setFiles] = useState<{ name: string; size: string; date: string }[]>([]);

  const contract = apiContract || {
    id: id || "C-2026-0042",
    value: 12450000,
    endDate: "2027-03-14",
    currency: "BDT",
  };

  const milestones = [
    { id: 4, name: "Phase 1 Installation", dueDate: "2026-06-15", amount: 1867500 },
    { id: 5, name: "Phase 2 Installation", dueDate: "2026-08-01", amount: 1245000 },
    { id: 6, name: "Testing & Commissioning", dueDate: "2026-10-15", amount: 1245000 },
    { id: 7, name: "Training & Handover", dueDate: "2026-12-01", amount: 622500 },
    { id: 8, name: "Final Payment & Defects Liability", dueDate: "2027-03-14", amount: 1245000 },
  ];

  const costDeltaNum = parseFloat(formData.costDelta) || 0;
  const timeDeltaNum = parseInt(formData.timeDelta) || 0;
  const newTotal = contract.value + costDeltaNum;
  const percentChange = contract.value > 0 ? (costDeltaNum / contract.value) * 100 : 0;
  const isHighImpact = Math.abs(percentChange) > 10;

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD").format(amount);

  const addEndDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const handleToggleMilestone = (mid: number) => {
    setFormData((prev) => ({
      ...prev,
      affectedMilestones: prev.affectedMilestones.includes(mid)
        ? prev.affectedMilestones.filter((m) => m !== mid)
        : [...prev.affectedMilestones, mid],
    }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="New Variation Request"
        description={`Contract #${contract.id}`}
        backTo={`/contracts/${contract.id}`}
        backLabel="Back to Contract Dashboard"
      />

      {isHighImpact && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-300">Variation &gt;10% of contract value</p>
            <p className="text-sm text-amber-700 dark:text-amber-400">This variation exceeds 10% of the original contract value and will require Auditor review before approval.</p>
          </div>
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { num: 1, label: "Variation Details" },
          { num: 2, label: "Impact Assessment" },
          { num: 3, label: "Attachments" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                step === s.num
                  ? "bg-blue-600 text-white"
                  : step > s.num
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{s.num}</span>
              {s.label}
            </button>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Variation Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variation Details</CardTitle>
            <CardDescription>Describe the proposed change to the contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="type">Variation Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select variation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost_increase">Cost Increase</SelectItem>
                  <SelectItem value="cost_decrease">Cost Decrease</SelectItem>
                  <SelectItem value="time_extension">Time Extension</SelectItem>
                  <SelectItem value="scope_change">Scope Change</SelectItem>
                  <SelectItem value="cost_and_time">Cost + Time Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Variation</Label>
              <Textarea
                id="reason"
                className="mt-1.5"
                rows={4}
                placeholder="Describe the reason for this variation request..."
                value={formData.reason}
                onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="costDelta">Cost Delta (BDT)</Label>
                <Input
                  id="costDelta"
                  type="number"
                  className="mt-1.5"
                  placeholder="e.g. 350000 or -100000"
                  value={formData.costDelta}
                  onChange={(e) => setFormData((p) => ({ ...p, costDelta: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">Use negative values for cost reductions</p>
              </div>
              <div>
                <Label htmlFor="timeDelta">Time Delta (days)</Label>
                <Input
                  id="timeDelta"
                  type="number"
                  className="mt-1.5"
                  placeholder="e.g. 30"
                  value={formData.timeDelta}
                  onChange={(e) => setFormData((p) => ({ ...p, timeDelta: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">Additional days required</p>
              </div>
            </div>

            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                className="mt-1.5"
                rows={5}
                placeholder="Provide detailed justification for this variation including any technical or contractual basis..."
                value={formData.justification}
                onChange={(e) => setFormData((p) => ({ ...p, justification: e.target.value }))}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Next: Impact Assessment</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Impact Assessment */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="size-5" /> Impact Assessment
            </CardTitle>
            <CardDescription>Review the calculated impact on contract terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Original Value</p>
                  <p className="text-lg font-bold text-foreground">BDT {formatCurrency(contract.value)}</p>
                </CardContent>
              </Card>
              <Card className={`border-2 ${costDeltaNum > 0 ? "border-red-200 dark:border-red-800" : costDeltaNum < 0 ? "border-green-200 dark:border-green-800" : ""}`}>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">New Total Value</p>
                  <p className="text-lg font-bold text-foreground">BDT {formatCurrency(newTotal)}</p>
                  {costDeltaNum !== 0 && (
                    <p className={`text-xs mt-0.5 ${costDeltaNum > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      {costDeltaNum > 0 ? "+" : ""}{percentChange.toFixed(2)}%
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">New End Date</p>
                  <p className="text-lg font-bold text-foreground">
                    {timeDeltaNum > 0 ? addEndDays(contract.endDate, timeDeltaNum) : contract.endDate}
                  </p>
                  {timeDeltaNum > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">+{timeDeltaNum} days</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Label className="mb-3 block">Affected Milestones</Label>
              <div className="space-y-2 border rounded-lg p-3 border-border">
                {milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                    <Checkbox
                      checked={formData.affectedMilestones.includes(m.id)}
                      onCheckedChange={() => handleToggleMilestone(m.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">Due: {m.dueDate} | Amount: BDT {formatCurrency(m.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
              <Button onClick={() => setStep(3)}>Next: Attachments</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Attachments */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supporting Documents</CardTitle>
            <CardDescription>Upload supporting documents (max 50 MB total)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground/70">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10 MB per file)</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setFiles([...files, { name: `Supporting_Doc_${files.length + 1}.pdf`, size: "1.2 MB", date: "2026-04-28" }])}>
                Browse Files
              </Button>
            </div>

            {files.length > 0 && (
              <div className="border rounded-lg divide-y border-border divide-border">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.size} | Uploaded {f.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Previous</Button>
              <div className="flex gap-2">
                <Button variant="outline"><Save className="size-4 mr-1.5" /> Save Draft</Button>
                <Button><Send className="size-4 mr-1.5" /> Submit for Approval</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}