import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { FileText, Download } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { evalApi } from "../../lib/api/eval.api";
import { toast } from "sonner";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_VENDORS = [
  {
    name: "ABC Suppliers Ltd.",
    technicalScore: 85,
    commercialScore: 78,
    totalScore: 81.5,
    bidAmount: "$73,500",
    deliveryDays: 30,
    warranty: "24 months",
    paymentTerms: "Net 30",
  },
  {
    name: "XYZ Manufacturing",
    technicalScore: 92,
    commercialScore: 95,
    totalScore: 93.5,
    bidAmount: "$65,300",
    deliveryDays: 25,
    warranty: "36 months",
    paymentTerms: "Net 30",
  },
  {
    name: "Global Traders Inc.",
    technicalScore: 78,
    commercialScore: 72,
    totalScore: 75,
    bidAmount: "$81,700",
    deliveryDays: 35,
    warranty: "24 months",
    paymentTerms: "Net 45",
  },
];

const MOCK_ITEMS = [
  {
    name: "Executive Desk",
    qty: 15,
    abc: { price: "$800", total: "$12,000" },
    xyz: { price: "$720", total: "$10,800" },
    global: { price: "$900", total: "$13,500" },
  },
  {
    name: "Office Chair",
    qty: 50,
    abc: { price: "$350", total: "$17,500" },
    xyz: { price: "$320", total: "$16,000" },
    global: { price: "$380", total: "$19,000" },
  },
  {
    name: "Filing Cabinet",
    qty: 20,
    abc: { price: "$450", total: "$9,000" },
    xyz: { price: "$400", total: "$8,000" },
    global: { price: "$500", total: "$10,000" },
  },
  {
    name: "Conference Table",
    qty: 3,
    abc: { price: "$2,500", total: "$7,500" },
    xyz: { price: "$2,200", total: "$6,600" },
    global: { price: "$2,800", total: "$8,400" },
  },
];

export function BidComparison() {
  const { id } = useParams();
  const { data: vendors } = useApiOrMock(
    async () => {
      const result = await evalApi.getComparison(id!);
      return result.map((r: any) => ({
        name: r.bid?.vendor_name ?? "Unknown",
        technicalScore: Number(r.results?.[0]?.technical_score ?? 0),
        commercialScore: Number(r.results?.[0]?.commercial_score ?? 0),
        totalScore: Number(r.results?.[0]?.total_score ?? 0),
        bidAmount: r.bid?.total_amount ? `$${Number(r.bid.total_amount).toLocaleString()}` : "—",
        deliveryDays: r.bid?.delivery_days ?? 0,
        warranty: r.bid?.warranty ?? "—",
        paymentTerms: r.bid?.payment_terms ?? "—",
      }));
    },
    MOCK_VENDORS,
    [id],
  );

  const items = MOCK_ITEMS; // Item-wise breakdown stays mock until API endpoint exists

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Bid Comparison"
        description="RFQ-2024-001: Office Furniture Supply"
        backTo={`/tenders/${id}`}
        backLabel="Back to Tender"
        actions={
          <Button size="sm">
            <Download className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Export Report</span>
            <span className="xs:hidden">Export</span>
          </Button>
        }
      />

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
            <TabsTrigger value="technical" className="flex-1">Technical</TabsTrigger>
            <TabsTrigger value="commercial" className="flex-1">Commercial</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Overall Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="text-center">Technical</TableHead>
                        <TableHead className="text-center">Commercial</TableHead>
                        <TableHead className="text-center">Overall</TableHead>
                        <TableHead className="text-right">Total Bid</TableHead>
                        <TableHead className="text-center">Rank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors
                        .sort((a, b) => b.totalScore - a.totalScore)
                        .map((vendor, index) => (
                          <TableRow key={vendor.name}>
                            <TableCell className="font-medium text-xs sm:text-sm">{vendor.name}</TableCell>
                            <TableCell className="text-center text-xs sm:text-sm">{vendor.technicalScore}/100</TableCell>
                            <TableCell className="text-center text-xs sm:text-sm">{vendor.commercialScore}/100</TableCell>
                            <TableCell className="text-center">
                              <span className="text-sm sm:text-lg font-bold">{vendor.totalScore}/100</span>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-xs sm:text-sm">{vendor.bidAmount}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 0 ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                                {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {vendors
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((vendor, index) => (
                <Card key={vendor.name} className={index === 0 ? "border-green-500 dark:border-green-600" : ""}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">{vendor.name}</CardTitle>
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-[10px]">
                        Rank {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="font-bold text-base sm:text-lg">{vendor.totalScore}/100</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm border-t pt-2">
                      <span className="text-muted-foreground">Total Bid</span>
                      <span className="font-semibold">{vendor.bidAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{vendor.deliveryDays} days</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Warranty</span>
                      <span>{vendor.warranty}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Payment</span>
                      <span>{vendor.paymentTerms}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-[800px] align-middle px-4 sm:px-0">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Item-wise Price Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead colSpan={2} className="text-center bg-muted">ABC Suppliers</TableHead>
                        <TableHead colSpan={2} className="text-center bg-blue-50/30 dark:bg-blue-900/10">XYZ Manufacturing</TableHead>
                        <TableHead colSpan={2} className="text-center bg-muted">Global Traders</TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                        <TableHead className="text-right bg-muted/50">Unit</TableHead>
                        <TableHead className="text-right bg-muted/50">Total</TableHead>
                        <TableHead className="text-right bg-blue-50/20 dark:bg-blue-900/5">Unit</TableHead>
                        <TableHead className="text-right bg-blue-50/20 dark:bg-blue-900/5 font-bold">Total</TableHead>
                        <TableHead className="text-right bg-muted/50">Unit</TableHead>
                        <TableHead className="text-right bg-muted/50">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                          <TableCell className="text-center text-xs sm:text-sm">{item.qty}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">{item.abc.price}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">{item.abc.total}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm text-green-600 dark:text-green-400">{item.xyz.price}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm font-bold text-green-700 dark:text-green-300">{item.xyz.total}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">{item.global.price}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">{item.global.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-[640px] align-middle px-4 sm:px-0">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Technical Evaluation Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        <TableHead className="text-center">Weight</TableHead>
                        <TableHead className="text-center">ABC Suppliers</TableHead>
                        <TableHead className="text-center">XYZ Manufacturing</TableHead>
                        <TableHead className="text-center">Global Traders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Product Quality</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">30%</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">82</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">90</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">75</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Specifications Compliance</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">25%</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">88</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">95</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Certifications</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">20%</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">85</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">92</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">78</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Past Performance</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">15%</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">84</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">90</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Delivery Capability</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">10%</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">86</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">93</TableCell>
                        <TableCell className="text-center text-xs sm:text-sm">76</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-xs sm:text-sm">Total Technical Score</TableCell>
                        <TableCell className="text-center font-bold text-xs sm:text-sm">100%</TableCell>
                        <TableCell className="text-center font-bold text-xs sm:text-sm">85</TableCell>
                        <TableCell className="text-center font-bold text-xs sm:text-sm">92</TableCell>
                        <TableCell className="text-center font-bold text-xs sm:text-sm">78</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commercial">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-[560px] align-middle px-4 sm:px-0">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Commercial Terms Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        <TableHead>ABC Suppliers</TableHead>
                        <TableHead>XYZ Manufacturing</TableHead>
                        <TableHead>Global Traders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Total Bid Amount</TableCell>
                        <TableCell className="text-xs sm:text-sm">$73,500</TableCell>
                        <TableCell className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">$65,300</TableCell>
                        <TableCell className="text-xs sm:text-sm">$81,700</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Payment Terms</TableCell>
                        <TableCell className="text-xs sm:text-sm">Net 30</TableCell>
                        <TableCell className="text-xs sm:text-sm">Net 30</TableCell>
                        <TableCell className="text-xs sm:text-sm">Net 45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Delivery Timeline</TableCell>
                        <TableCell className="text-xs sm:text-sm">30 days</TableCell>
                        <TableCell className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">25 days</TableCell>
                        <TableCell className="text-xs sm:text-sm">35 days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Warranty Period</TableCell>
                        <TableCell className="text-xs sm:text-sm">24 months</TableCell>
                        <TableCell className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">36 months</TableCell>
                        <TableCell className="text-xs sm:text-sm">24 months</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Price Validity</TableCell>
                        <TableCell className="text-xs sm:text-sm">90 days</TableCell>
                        <TableCell className="text-xs sm:text-sm">90 days</TableCell>
                        <TableCell className="text-xs sm:text-sm">60 days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Additional Services</TableCell>
                        <TableCell className="text-xs sm:text-sm">Installation included</TableCell>
                        <TableCell className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">Installation + Training</TableCell>
                        <TableCell className="text-xs sm:text-sm">Installation included</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}