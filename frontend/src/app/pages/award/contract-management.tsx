import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { FileText, Download, Edit, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useParams } from "react-router";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function ContractManagement() {
  const { id } = useParams();

  // Fetch contract data from API with mock fallback
  const { data: apiContract } = useApiOrMock(
    () => contractsApi.getById(id!),
    null as any,
    [id],
  );

  const contract = apiContract || {
    id: "CNT-2024-001",
    rfqId: "RFQ-2024-001",
    vendor: "XYZ Manufacturing",
    value: "$65,300",
    startDate: "2026-03-20",
    endDate: "2026-04-20",
    status: "active",
    progress: 45,
  };

  const payments = [
    {
      milestone: "Advance Payment",
      amount: "$13,060",
      dueDate: "2026-03-20",
      status: "paid",
      paidDate: "2026-03-20",
    },
    {
      milestone: "On Delivery",
      amount: "$32,650",
      dueDate: "2026-04-15",
      status: "pending",
      paidDate: null,
    },
    {
      milestone: "Final Payment",
      amount: "$19,590",
      dueDate: "2026-04-20",
      status: "pending",
      paidDate: null,
    },
  ];

  const documents = [
    { name: "Signed Contract", type: "Contract", uploadDate: "2026-03-16", size: "1.2 MB" },
    { name: "Purchase Order", type: "PO", uploadDate: "2026-03-20", size: "245 KB" },
    { name: "Vendor Insurance Certificate", type: "Insurance", uploadDate: "2026-03-18", size: "856 KB" },
    { name: "Delivery Schedule", type: "Schedule", uploadDate: "2026-03-21", size: "125 KB" },
  ];

  const amendments = [
    {
      id: "AMD-001",
      date: "2026-03-25",
      description: "Extended delivery deadline by 3 days",
      status: "approved",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Contract Management"
        description={`${contract.id} - ${contract.vendor}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="size-4 mr-2" />
              Download Contract
            </Button>
            <Link to={`/contracts/${contract.id}/milestones`}>
              <Button>
                <CheckCircle className="size-4 mr-2" />
                View Milestones
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Contract Value</div>
            <div className="text-2xl font-bold mt-1">{contract.value}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge className="mt-1 bg-green-600">Active</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Start Date</div>
            <div className="font-semibold mt-1">{contract.startDate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">End Date</div>
            <div className="font-semibold mt-1">{contract.endDate}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contract Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-semibold">{contract.progress}%</span>
            </div>
            <Progress value={contract.progress} />
            <div className="text-xs text-muted-foreground mt-2">
              Last updated: March 25, 2026
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="amendments">Amendments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Number:</span>
                  <span className="font-semibold">{contract.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RFQ Reference:</span>
                  <span className="font-semibold">{contract.rfqId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="font-semibold">{contract.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Type:</span>
                  <span className="font-semibold">Fixed Price</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty:</span>
                  <span className="font-semibold">36 months</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Contract Value:</span>
                  <span className="font-semibold">{contract.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold text-green-600">$13,060</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Pending:</span>
                  <span className="font-semibold text-orange-600">$52,240</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Progress:</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="pt-2 border-t">
                  <Progress value={20} className="mb-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Deliverables Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-green-600" />
                    <div>
                      <div className="font-medium">Contract Signing</div>
                      <div className="text-sm text-muted-foreground">Completed on March 20, 2026</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600">Completed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded bg-blue-50">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Delivery & Installation</div>
                      <div className="text-sm text-muted-foreground">In progress - Due April 15, 2026</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-600">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="size-5 border-2 border-muted-foreground rounded-full"></div>
                    <div>
                      <div className="font-medium">Training & Handover</div>
                      <div className="text-sm text-muted-foreground">Scheduled for April 18, 2026</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="size-5 border-2 border-muted-foreground rounded-full"></div>
                    <div>
                      <div className="font-medium">Final Acceptance</div>
                      <div className="text-sm text-muted-foreground">Scheduled for April 20, 2026</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.milestone}>
                        <TableCell className="font-medium">{payment.milestone}</TableCell>
                        <TableCell className="text-right font-semibold">{payment.amount}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>{payment.paidDate || "-"}</TableCell>
                        <TableCell className="text-center">
                          {payment.status === "paid" ? (
                            <Badge className="bg-green-600">Paid</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {payment.status === "paid" ? (
                            <Button variant="ghost" size="sm">
                              <Download className="size-4 mr-1" />
                              Receipt
                            </Button>
                          ) : (
                            <Button size="sm">Process Payment</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">Advance Payment - $13,060</div>
                    <div className="text-sm text-muted-foreground">
                      Paid on March 20, 2026 via Bank Transfer
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="size-4 mr-2" />
                    View Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contract Documents</CardTitle>
                <Button>
                  <FileText className="size-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-4 border rounded hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="outline" size="sm">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amendments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contract Amendments</CardTitle>
                <Button>
                  <Edit className="size-4 mr-2" />
                  Request Amendment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {amendments.length > 0 ? (
                <div className="space-y-3">
                  {amendments.map((amendment) => (
                    <div key={amendment.id} className="p-4 border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">Amendment {amendment.id}</div>
                          <div className="text-sm text-muted-foreground">Date: {amendment.date}</div>
                        </div>
                        <Badge className="bg-green-600">{amendment.status}</Badge>
                      </div>
                      <div className="text-sm">{amendment.description}</div>
                      <Button variant="outline" size="sm" className="mt-3">
                        <FileText className="size-4 mr-2" />
                        View Amendment
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No amendments have been made to this contract
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-green-600" />
                    <span>Insurance Certificate Submitted</span>
                  </div>
                  <Badge className="bg-green-600">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-green-600" />
                    <span>Quality Certifications Verified</span>
                  </div>
                  <Badge className="bg-green-600">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="size-5 text-yellow-600" />
                    <span>Delivery Schedule Updated</span>
                  </div>
                  <Badge className="bg-yellow-600">Pending Review</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="size-5 border-2 border-muted-foreground rounded-full"></div>
                    <span>Final Inspection Report</span>
                  </div>
                  <Badge variant="secondary">Not Started</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">On-Time Milestones</div>
                </div>
                <div className="p-4 border rounded text-center">
                  <div className="text-3xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-muted-foreground mt-1">Penalty Days</div>
                </div>
                <div className="p-4 border rounded text-center">
                  <div className="text-3xl font-bold">A+</div>
                  <div className="text-sm text-muted-foreground mt-1">Quality Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}