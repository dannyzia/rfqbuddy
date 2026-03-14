import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Coins, ArrowRight, Lock, DollarSign, TrendingDown, TrendingUp,
  Download, CheckCircle, AlertTriangle, Globe
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { financeApi } from "../../lib/api/finance.api";

const TENDER = {
  id: "TND-2026-0089",
  title: "Supply of IT Infrastructure Equipment",
  baseCurrency: "BDT",
  fxRateDate: "2026-03-12",
  fxSource: "Bangladesh Bank",
};

const BIDS = [
  {
    vendor: "Global Tech Solutions", country: "BD",
    bidCurrency: "BDT", bidAmount: 12450000, fxRate: 1.0, bdtEquivalent: 12450000,
    rateLockedAt: null, rateLockExpiry: null, fxRisk: "None",
    rank: 1, recommended: true,
  },
  {
    vendor: "TechPro International", country: "US",
    bidCurrency: "USD", bidAmount: 105000, fxRate: 119.85, bdtEquivalent: 12584250,
    rateLockedAt: 119.20, rateLockExpiry: "2026-05-15", fxRisk: "Low (locked)",
    rank: 2, recommended: false,
  },
  {
    vendor: "EuroParts GmbH", country: "DE",
    bidCurrency: "EUR", bidAmount: 98000, fxRate: 130.42, bdtEquivalent: 12781160,
    rateLockedAt: null, rateLockExpiry: null, fxRisk: "Medium (unlocked)",
    rank: 3, recommended: false,
  },
  {
    vendor: "UK Systems Ltd", country: "GB",
    bidCurrency: "GBP", bidAmount: 85000, fxRate: 152.18, bdtEquivalent: 12935300,
    rateLockedAt: 151.00, rateLockExpiry: "2026-06-10", fxRisk: "Low (locked)",
    rank: 4, recommended: false,
  },
  {
    vendor: "Nippon Tech Co.", country: "JP",
    bidCurrency: "JPY", bidAmount: 16200000, fxRate: 0.80, bdtEquivalent: 12960000,
    rateLockedAt: null, rateLockExpiry: null, fxRisk: "High (JPY volatile)",
    rank: 5, recommended: false,
  },
];

const currencyFlags: Record<string, string> = {
  BDT: "🇧🇩", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵",
};

export function FXComparison() {
  const { id } = useParams();

  const { data: apiFxComparison } = useApiOrMock(
    () => financeApi.getFxComparison(id!),
    { tender_id: id || TENDER.id, comparisons: [] },
    [id],
  );

  const lowestBdt = Math.min(...BIDS.map(b => b.bdtEquivalent));

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Multi-Currency Bid Comparison"
        description={`${id || TENDER.id} — ${TENDER.title} — All bids normalized to BDT for fair comparison`}
        backTo={`/tenders/${id || TENDER.id}`}
        backLabel="Back to Tender"
        actions={
          <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Comparison</Button>
        }
      />

      {/* FX Rate Info */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <span className="flex items-center gap-1.5"><Globe className="size-4 text-blue-500" />Base Currency: <strong>BDT</strong></span>
            <span className="flex items-center gap-1.5"><Coins className="size-4 text-amber-500" />Rates as of: <strong>{TENDER.fxRateDate}</strong></span>
            <span className="flex items-center gap-1.5 text-muted-foreground">Source: {TENDER.fxSource}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">|</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              USD: 119.85 • EUR: 130.42 • GBP: 152.18 • JPY: 0.80
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="size-5" />Bid Comparison (Normalized to BDT)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Bid Currency</TableHead>
                <TableHead className="text-right">Original Amount</TableHead>
                <TableHead className="text-right">FX Rate</TableHead>
                <TableHead className="text-right">BDT Equivalent</TableHead>
                <TableHead className="text-right">vs Lowest</TableHead>
                <TableHead>Rate Lock</TableHead>
                <TableHead>FX Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BIDS.map(b => {
                const diff = ((b.bdtEquivalent - lowestBdt) / lowestBdt * 100);
                return (
                  <TableRow key={b.vendor} className={b.recommended ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`size-6 rounded-full flex items-center justify-center text-xs font-medium ${b.rank === 1 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>{b.rank}</span>
                        {b.recommended && <Badge variant="default" className="text-xs">Recommended</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{b.vendor}</TableCell>
                    <TableCell><span className="text-lg">{currencyFlags[b.bidCurrency]}</span></TableCell>
                    <TableCell>
                      <Badge variant="outline">{b.bidCurrency}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{b.bidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{b.fxRate === 1.0 ? "—" : b.fxRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold text-foreground">BDT {b.bdtEquivalent.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {diff === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Lowest</span>
                      ) : (
                        <span className="text-muted-foreground">+{diff.toFixed(1)}%</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {b.rateLockedAt ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs"><Lock className="size-3" />{b.rateLockedAt} (until {b.rateLockExpiry})</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not locked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.fxRisk.startsWith("None") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        b.fxRisk.startsWith("Low") ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        b.fxRisk.startsWith("Medium") ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>{b.fxRisk}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>FX Risk Analysis</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-400 flex items-center gap-2"><CheckCircle className="size-4" />BDT bids carry zero FX risk</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Global Tech Solutions bid in BDT — no currency conversion needed</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400 flex items-center gap-2"><Lock className="size-4" />2 bids have locked FX rates</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">TechPro (USD) and UK Systems (GBP) locked rates for 90 days</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400 flex items-center gap-2"><AlertTriangle className="size-4" />JPY bid carries highest FX risk</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">JPY has shown 1.23% daily movement — recommend rate lock if selected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommendation</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2">Lowest BDT-equivalent: Global Tech Solutions</p>
              <p className="text-sm text-muted-foreground mb-3">
                BDT-denominated bid eliminates all currency risk. Second-best option (TechPro, USD) 
                is only 1.1% higher but has a locked rate protecting against further BDT depreciation.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Spread (lowest to highest):</span><span className="font-medium">4.1%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">FX exposure if non-BDT selected:</span><span className="font-medium">BDT 10.5-13M</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hedging cost estimate:</span><span className="font-medium">0.5-1.2% of bid value</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}