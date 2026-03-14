import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Star, Save, Send, Building2, FileText, Award } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function ContractPerformanceRating() {
  const { id } = useParams();

  const categories = [
    { key: "quality", label: "Quality of Work", description: "Materials, workmanship, and deliverable standards" },
    { key: "timeliness", label: "Timeliness", description: "Adherence to deadlines and milestone delivery" },
    { key: "communication", label: "Communication", description: "Responsiveness, clarity, and proactive updates" },
    { key: "compliance", label: "Compliance & Safety", description: "Regulatory compliance, safety standards, and documentation" },
  ];

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  // Fetch existing performance rating from API with mock fallback
  const { data: apiRating } = useApiOrMock(
    () => contractsApi.getPerformanceRating(id!),
    null as any,
    [id],
  );

  const [ratings, setRatings] = useState<Record<string, number>>(
    apiRating?.ratings ?? { quality: 4, timeliness: 3, communication: 5, compliance: 4 },
  );
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});
  const [strengths, setStrengths] = useState(apiRating?.strengths ?? "Excellent quality of materials delivered. Proactive communication about potential delays.");
  const [improvements, setImprovements] = useState(apiRating?.improvements ?? "Milestone 4 was slightly delayed due to resource allocation. Recommend improving project scheduling for future contracts.");

  const contract = apiContract ? {
    id: apiContract.contract_number,
    title: apiContract.title,
    vendor: apiContract.vendor_org_id,
    value: `${apiContract.currency} ${apiContract.contract_value}`,
    startDate: apiContract.start_date,
    endDate: apiContract.end_date,
    completedDate: apiContract.end_date,
  } : {
    id: id || "C-2026-0042",
    title: "Supply of Office Equipment & IT Infrastructure",
    vendor: "ABC Builders Ltd",
    value: "BDT 12,450,000",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    completedDate: "2027-02-28",
  };

  const overallScore = Object.values(ratings).reduce((sum, r) => sum + r, 0) / Object.values(ratings).length;

  const renderStars = (category: string) => {
    const currentRating = ratings[category] || 0;
    const hover = hoverRating[category] || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-0.5 transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating((p) => ({ ...p, [category]: star }))}
            onMouseLeave={() => setHoverRating((p) => ({ ...p, [category]: 0 }))}
            onClick={() => setRatings((p) => ({ ...p, [category]: star }))}
          >
            <Star
              className={`size-7 transition-colors ${
                star <= (hover || currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium">
          {(hover || currentRating).toFixed(1)}
        </span>
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600 dark:text-green-400";
    if (score >= 3.5) return "text-blue-600 dark:text-blue-400";
    if (score >= 2.5) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Satisfactory";
    if (score >= 1.5) return "Below Average";
    return "Poor";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Rate Vendor Performance"
        description={`Contract #${contract.id}`}
        backTo={`/contracts/${contract.id}`}
        backLabel="Back to Contract"
      />

      {/* Contract Info */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-medium text-foreground">{contract.vendor}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Contract:</span>
              <span className="font-medium text-foreground">{contract.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium text-foreground">{contract.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium text-foreground">{contract.startDate} to {contract.completedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Rating Categories */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance Ratings</CardTitle>
              <CardDescription>Rate the vendor's performance in each category (1-5 stars)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.key} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-3 rounded-lg hover:bg-muted">
                  <div>
                    <p className="font-medium text-foreground">{cat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                  </div>
                  {renderStars(cat.key)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="size-5" /> Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <div className={`text-5xl font-bold ${getScoreColor(overallScore)} mb-2`}>
              {overallScore.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">out of 5.0</p>
            <Badge className={`mt-3 ${
              overallScore >= 4 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              overallScore >= 3 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
              "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
            }`}>
              {getScoreLabel(overallScore)}
            </Badge>

            <div className="mt-6 space-y-2 text-left text-sm">
              {categories.map((cat) => (
                <div key={cat.key} className="flex justify-between">
                  <span className="text-muted-foreground">{cat.label}</span>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{ratings[cat.key]}.0</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Vendor Visible Summary:</strong><br />
                "This contract received an overall rating of {overallScore.toFixed(2)}/5 from the buyer."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Comments & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="strengths">Strengths</Label>
            <Textarea
              id="strengths"
              className="mt-1.5"
              rows={3}
              placeholder="What did the vendor do well?"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="improvements">Areas for Improvement</Label>
            <Textarea
              id="improvements"
              className="mt-1.5"
              rows={3}
              placeholder="What could the vendor improve?"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline"><Save className="size-4 mr-1.5" /> Save Draft</Button>
        <Button><Send className="size-4 mr-1.5" /> Submit Rating</Button>
      </div>
    </div>
  );
}