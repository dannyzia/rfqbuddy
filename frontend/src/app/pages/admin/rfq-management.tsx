import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { 
  Search, 
  Eye, 
  FileStack, 
  FileText,
  AlertTriangle,
  Ban,
  Trash2,
  PlayCircle,
  Download,
  CheckCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Link } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

export function AdminRfqManagement() {
  const { data: apiTenders } = useApiOrMock(
    () => adminApi.listTenders(),
    { data: [], total: 0, page: 1, pageSize: 20 },
  );

  const rfqs = [
    {
      id: "RFQ-2024-001",
      title: "Office Furniture Supply",
      purchaser: "Acme Corporation",
      category: "Furniture",
      status: "active",
      totalBids: 12,
      publishedDate: "2024-01-15",
      closingDate: "2024-02-28",
      budget: "$50,000",
      flagged: false,
    },
    {
      id: "RFQ-2024-002",
      title: "IT Hardware Procurement",
      purchaser: "TechCorp Ltd",
      category: "Technology",
      status: "evaluation",
      totalBids: 8,
      publishedDate: "2024-01-10",
      closingDate: "2024-02-15",
      budget: "$120,000",
      flagged: true,
      flagReason: "Duplicate vendors detected"
    },
    {
      id: "RFQ-2024-003",
      title: "Cleaning Services Contract",
      purchaser: "Global Industries",
      category: "Services",
      status: "closed",
      totalBids: 15,
      publishedDate: "2023-12-20",
      closingDate: "2024-01-31",
      budget: "$30,000",
      flagged: false,
    },
    {
      id: "RFQ-2024-004",
      title: "Construction Materials",
      purchaser: "BuildRight Inc",
      category: "Construction",
      status: "draft",
      totalBids: 0,
      publishedDate: "-",
      closingDate: "2024-03-15",
      budget: "$250,000",
      flagged: false,
    },
    {
      id: "RFQ-2024-005",
      title: "Medical Supplies",
      purchaser: "Healthcare Solutions",
      category: "Healthcare",
      status: "awarded",
      totalBids: 10,
      publishedDate: "2023-12-01",
      closingDate: "2024-01-15",
      budget: "$80,000",
      flagged: false,
    },
    {
      id: "RFQ-2024-006",
      title: "Software Licenses",
      purchaser: "Digital Ventures",
      category: "Technology",
      status: "active",
      totalBids: 6,
      publishedDate: "2024-01-20",
      closingDate: "2024-03-01",
      budget: "$45,000",
      flagged: true,
      flagReason: "Budget concerns raised"
    },
    {
      id: "RFQ-2024-007",
      title: "Security Equipment",
      purchaser: "Finance Group Inc.",
      category: "Security",
      status: "withheld",
      totalBids: 5,
      publishedDate: "2024-01-05",
      closingDate: "2024-02-20",
      budget: "$65,000",
      flagged: false,
      withheldDate: "2024-02-10",
      withheldReason: "Specification disputes under review"
    },
    {
      id: "RFQ-2024-008",
      title: "Marketing Services",
      purchaser: "Retail Solutions",
      category: "Services",
      status: "withheld",
      totalBids: 3,
      publishedDate: "2024-01-08",
      closingDate: "2024-02-25",
      budget: "$35,000",
      flagged: false,
      withheldDate: "2024-02-15",
      withheldReason: "Purchaser compliance investigation"
    },
  ];

  const allRfqs = rfqs;
  const activeRfqs = rfqs.filter(r => r.status === "active");
  const evaluationRfqs = rfqs.filter(r => r.status === "evaluation");
  const withheldRfqs = rfqs.filter(r => r.status === "withheld");
  const closedRfqs = rfqs.filter(r => r.status === "closed");
  const flaggedRfqs = rfqs.filter(r => r.flagged);

  const stats = {
    total: rfqs.length,
    active: activeRfqs.length,
    evaluation: evaluationRfqs.length,
    closed: closedRfqs.length,
    withheld: withheldRfqs.length,
    flagged: flaggedRfqs.length,
    totalBids: rfqs.reduce((sum, r) => sum + r.totalBids, 0),
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      draft: { label: "Draft", className: "bg-muted-foreground" },
      active: { label: "Active", className: "bg-green-600" },
      evaluation: { label: "Evaluation", className: "bg-blue-600" },
      closed: { label: "Closed", className: "bg-orange-600" },
      awarded: { label: "Awarded", className: "bg-purple-600" },
      withheld: { label: "Withheld", className: "bg-yellow-600" },
    };
    const variant = variants[status] || variants.draft;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const renderRfqTable = (rfqList: typeof rfqs) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RFQ ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Purchaser</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bids</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Closing</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfqList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                No RFQs found in this category
              </TableCell>
            </TableRow>
          ) : (
            rfqList.map((rfq) => (
              <TableRow key={rfq.id} className="hover:bg-muted">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileStack className="size-4 text-muted-foreground" />
                    {rfq.id}
                    {rfq.flagged && (
                      <AlertTriangle className="size-4 text-red-600" title="Flagged for review" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link to={`/tenders/${rfq.id}`} className="hover:text-indigo-600 hover:underline">
                    {rfq.title}
                  </Link>
                </TableCell>
                <TableCell>{rfq.purchaser}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{rfq.category}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="font-medium">{rfq.totalBids}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{rfq.publishedDate}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{rfq.closingDate}</TableCell>
                <TableCell className="font-medium">{rfq.budget}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                    
                    {(rfq.status === "active" || rfq.status === "evaluation") && (
                      <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                        <Ban className="size-4 mr-1" />
                        Withhold
                      </Button>
                    )}
                    
                    {rfq.status === "withheld" && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <PlayCircle className="size-4 mr-1" />
                        Activate
                      </Button>
                    )}
                    
                    {(rfq.status === "draft" || rfq.status === "withheld" || rfq.status === "closed") && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="size-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="RFQ/Tender Management"
        description="Oversee all RFQs and tenders across the platform - withhold or delete as needed"
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export Report
          </Button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total RFQs</div>
            <div className="text-3xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-3xl font-bold mt-1 text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">In Evaluation</div>
            <div className="text-3xl font-bold mt-1 text-blue-600">{stats.evaluation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Withheld</div>
            <div className="text-3xl font-bold mt-1 text-yellow-600">{stats.withheld}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Flagged</div>
            <div className="text-3xl font-bold mt-1 text-red-600">{stats.flagged}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Bids</div>
            <div className="text-3xl font-bold mt-1">{stats.totalBids}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search by RFQ ID, title, or purchaser..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="withheld">Withheld</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Banners */}
      {withheldRfqs.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900">Withheld RFQs Require Attention</div>
            <div className="text-sm text-yellow-700 mt-1">
              {withheldRfqs.length} RFQ{withheldRfqs.length > 1 ? 's are' : ' is'} currently withheld. 
              Review and either activate or delete them.
            </div>
          </div>
        </div>
      )}

      {flaggedRfqs.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="size-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-900">Flagged RFQs Require Review</div>
            <div className="text-sm text-red-700 mt-1">
              {flaggedRfqs.length} RFQ{flaggedRfqs.length > 1 ? 's have' : ' has'} been flagged for review. 
              Please investigate and take appropriate action.
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All RFQs ({allRfqs.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeRfqs.length})
          </TabsTrigger>
          <TabsTrigger value="evaluation">
            Evaluation ({evaluationRfqs.length})
          </TabsTrigger>
          <TabsTrigger value="withheld">
            Withheld ({withheldRfqs.length})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({flaggedRfqs.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedRfqs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderRfqTable(allRfqs)}
        </TabsContent>

        <TabsContent value="active">
          {renderRfqTable(activeRfqs)}
        </TabsContent>

        <TabsContent value="evaluation">
          {renderRfqTable(evaluationRfqs)}
        </TabsContent>

        <TabsContent value="withheld">
          {withheldRfqs.length > 0 && (
            <div className="mb-4 space-y-2">
              {withheldRfqs.map((r) => (
                <div key={r.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <div className="font-medium">{r.id} - {r.title}</div>
                  <div className="text-muted-foreground">Withheld on {r.withheldDate}: {r.withheldReason}</div>
                </div>
              ))}
            </div>
          )}
          {renderRfqTable(withheldRfqs)}
        </TabsContent>

        <TabsContent value="flagged">
          {flaggedRfqs.length > 0 && (
            <div className="mb-4 space-y-2">
              {flaggedRfqs.map((r) => (
                <div key={r.id} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <div className="font-medium">{r.id} - {r.title}</div>
                  <div className="text-muted-foreground">Flag reason: {r.flagReason}</div>
                </div>
              ))}
            </div>
          )}
          {renderRfqTable(flaggedRfqs)}
        </TabsContent>

        <TabsContent value="closed">
          {renderRfqTable(closedRfqs)}
        </TabsContent>
      </Tabs>
    </div>
  );
}