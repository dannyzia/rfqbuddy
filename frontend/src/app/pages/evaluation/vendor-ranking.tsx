import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Trophy, Medal, Award, FileText } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { evalApi } from "../../lib/api/eval.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_RANKINGS = [
  {
    rank: 1,
    vendor: "XYZ Manufacturing",
    technicalScore: 92,
    technicalWeighted: 46.0,
    commercialScore: 95,
    commercialWeighted: 47.5,
    totalScore: 93.5,
    bidAmount: "$65,300",
    strengths: ["Best pricing", "Fastest delivery", "Extended warranty", "Additional training"],
    weaknesses: ["None identified"],
    recommendation: "Highly Recommended",
  },
  {
    rank: 2,
    vendor: "ABC Suppliers Ltd.",
    technicalScore: 85,
    technicalWeighted: 42.5,
    commercialScore: 78,
    commercialWeighted: 39.0,
    totalScore: 81.5,
    bidAmount: "$73,500",
    strengths: ["Good quality products", "Reliable track record", "Local presence"],
    weaknesses: ["Higher pricing", "Standard warranty only"],
    recommendation: "Recommended",
  },
  {
    rank: 3,
    vendor: "Global Traders Inc.",
    technicalScore: 78,
    technicalWeighted: 39.0,
    commercialScore: 72,
    commercialWeighted: 36.0,
    totalScore: 75.0,
    bidAmount: "$81,700",
    strengths: ["Comprehensive product range", "International certifications"],
    weaknesses: ["Highest price", "Longer delivery time", "Limited local support"],
    recommendation: "Conditionally Recommended",
  },
];

export function VendorRanking() {
  const { id } = useParams();

  const { data: rankings } = useApiOrMock(
    async () => {
      const result = await evalApi.getRanking(id!);
      return result.map((r: any, i: number) => ({
        rank: r.rank ?? i + 1,
        vendor: r.vendor_name ?? r.vendor ?? "Unknown",
        technicalScore: Number(r.technical_score ?? 0),
        technicalWeighted: Number(r.technical_weighted ?? 0),
        commercialScore: Number(r.commercial_score ?? 0),
        commercialWeighted: Number(r.commercial_weighted ?? 0),
        totalScore: Number(r.total_score ?? 0),
        bidAmount: r.bid_amount ? `$${Number(r.bid_amount).toLocaleString()}` : "—",
        strengths: r.strengths ?? [],
        weaknesses: r.weaknesses ?? [],
        recommendation: r.recommendation ?? "Pending",
      }));
    },
    MOCK_RANKINGS,
    [id],
  );

  const handleGenerateReport = () => {
    toast.success("Evaluation report generated");
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-8 text-muted-foreground" />;
    return <Award className="size-8 text-orange-600" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1st Place</Badge>;
    if (rank === 2) return <Badge className="bg-muted-foreground">2nd Place</Badge>;
    return <Badge className="bg-orange-600">3rd Place</Badge>;
  };

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === "Highly Recommended") {
      return <Badge className="bg-green-600">Highly Recommended</Badge>;
    }
    if (recommendation === "Recommended") {
      return <Badge className="bg-blue-600">Recommended</Badge>;
    }
    return <Badge variant="secondary">Conditionally Recommended</Badge>;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Vendor Ranking"
        description="RFQ-2024-001: Office Furniture Supply - Final evaluation rankings"
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <Button size="sm" className="w-full sm:w-auto" onClick={handleGenerateReport}>
            <FileText className="size-4 mr-2" />
            Generate Report
          </Button>
        }
      />

      {/* Ranking Summary — desktop table / mobile cards */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Ranking Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile summary cards */}
          <div className="sm:hidden divide-y divide-border">
            {rankings.map((item) => (
              <div key={item.rank} className="p-3 flex items-center gap-3">
                <div className="shrink-0">{getRankIcon(item.rank)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{item.vendor}</p>
                  <p className="text-[11px] text-muted-foreground">{item.bidAmount}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">Tech: {item.technicalScore}</span>
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">Comm: {item.commercialScore}</span>
                    <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-bold">Total: {item.totalScore}</span>
                  </div>
                </div>
                <div className="shrink-0">{getRecommendationBadge(item.recommendation)}</div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Rank</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-center">Technical (50%)</TableHead>
                  <TableHead className="text-center">Commercial (50%)</TableHead>
                  <TableHead className="text-center">Overall Score</TableHead>
                  <TableHead className="text-right">Bid Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getRankIcon(item.rank)}
                        <span className="font-bold text-xl">{item.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{item.vendor}</TableCell>
                    <TableCell className="text-center">
                      <div>{item.technicalScore}/100</div>
                      <div className="text-xs text-muted-foreground">Weighted: {item.technicalWeighted}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div>{item.commercialScore}/100</div>
                      <div className="text-xs text-muted-foreground">Weighted: {item.commercialWeighted}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.totalScore}</div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{item.bidAmount}</TableCell>
                    <TableCell className="text-center">{getRecommendationBadge(item.recommendation)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 sm:space-y-6">
        {rankings.map((item) => (
          <Card key={item.rank}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getRankIcon(item.rank)}
                  <div>
                    <CardTitle className="text-base sm:text-lg">{item.vendor}</CardTitle>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Score: {item.totalScore.toFixed(1)} / 100
                    </div>
                  </div>
                </div>
                {getRankBadge(item.rank)}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Strengths
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {item.strengths.map((strength, idx) => (
                      <li key={idx} className="text-xs sm:text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    Weaknesses
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {item.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-xs sm:text-sm flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted rounded-lg">
                <div className="font-semibold mb-2 text-sm sm:text-base">Recommendation</div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {getRecommendationBadge(item.recommendation)}
                  {item.rank === 1 && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      - Best overall value with superior technical and commercial scores
                    </span>
                  )}
                  {item.rank === 2 && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      - Solid alternative with good track record and local presence
                    </span>
                  )}
                  {item.rank === 3 && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      - Consider if budget allows or specific certifications are required
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="p-2 sm:p-3 border border-border rounded-lg">
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Technical</div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">{item.technicalScore}</div>
                </div>
                <div className="p-2 sm:p-3 border border-border rounded-lg">
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Commercial</div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">{item.commercialScore}</div>
                </div>
                <div className="p-2 sm:p-3 border border-border rounded-lg">
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Total Score</div>
                  <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{item.totalScore}</div>
                </div>
                <div className="p-2 sm:p-3 border border-border rounded-lg">
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Rank</div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">{item.rank}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}