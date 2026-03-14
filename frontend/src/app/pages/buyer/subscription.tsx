import { useState } from "react";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
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
  ArrowUp,
  ArrowDown,
  Download,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Package,
  Users,
  HardDrive,
  Zap,
} from "lucide-react";

export function SubscriptionManagement() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = {
    name: "Professional",
    tier: "professional",
    price: "BDT 15,000/month",
    billingCycle: "Monthly",
    startDate: "2026-01-01",
    nextBilling: "2026-04-01",
    status: "active",
  };

  const usage = {
    tenders: { used: 35, limit: 50, unit: "tenders/month" },
    users: { used: 8, limit: 15, unit: "users" },
    storage: { used: 8.5, limit: 20, unit: "GB" },
    vendors: { used: 150, limit: 200, unit: "active vendors" },
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "BDT 5,000",
      billingCycle: "month",
      features: {
        tenders: 10,
        users: 5,
        storage: 5,
        vendors: 50,
        liveBidding: false,
        advancedReporting: false,
        apiAccess: false,
        support: "Email (48h response)",
      },
      recommended: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "BDT 15,000",
      billingCycle: "month",
      features: {
        tenders: 50,
        users: 15,
        storage: 20,
        vendors: 200,
        liveBidding: true,
        advancedReporting: true,
        apiAccess: false,
        support: "Email + Phone (24h response)",
      },
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "BDT 35,000",
      billingCycle: "month",
      features: {
        tenders: "Unlimited",
        users: 50,
        storage: 100,
        vendors: "Unlimited",
        liveBidding: true,
        advancedReporting: true,
        apiAccess: true,
        support: "Dedicated Account Manager",
      },
      recommended: false,
    },
    {
      id: "custom",
      name: "Custom",
      price: "Contact Sales",
      billingCycle: "",
      features: {
        tenders: "Custom",
        users: "Custom",
        storage: "Custom",
        vendors: "Custom",
        liveBidding: true,
        advancedReporting: true,
        apiAccess: true,
        support: "White-glove Support",
      },
      recommended: false,
    },
  ];

  const billingHistory = [
    { id: 1, date: "2026-03-01", amount: "BDT 15,000", status: "paid", invoice: "INV-2026-003" },
    { id: 2, date: "2026-02-01", amount: "BDT 15,000", status: "paid", invoice: "INV-2026-002" },
    { id: 3, date: "2026-01-01", amount: "BDT 15,000", status: "paid", invoice: "INV-2026-001" },
  ];

  const getUsagePercentage = (used: number, limit: number | string): number => {
    if (typeof limit === "string") return 0;
    return (used / limit) * 100;
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 75) return "bg-yellow-600";
    return "bg-green-600";
  };

  return (
    <PageTemplate
      title="Subscription Management"
      description="Manage your subscription plan, usage, and billing"
      actions={
        <Button variant="outline">
          <Download className="size-4 mr-2" />
          Download Invoice
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle2 className="size-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-2xl font-semibold text-blue-600 mt-2">{currentPlan.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">Billed {currentPlan.billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-semibold">{currentPlan.nextBilling}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Subscription Start Date</p>
                  <p className="font-medium">{currentPlan.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">
                    <CreditCard className="size-4 inline mr-1" />
                    Visa •••• 4242
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline">
                  <ArrowUp className="size-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button variant="outline">
                  <ArrowDown className="size-4 mr-2" />
                  Downgrade Plan
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Tenders</p>
                    <p className="font-semibold">12</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="font-semibold">{usage.users.used}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bids Received (MTD)</p>
                    <p className="font-semibold">87</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(usage).map(([key, data]) => {
                const percentage = getUsagePercentage(data.used, data.limit);
                const isWarning = percentage >= 75;
                const isCritical = percentage >= 90;

                return (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {key === "tenders" && <Package className="size-4 text-muted-foreground" />}
                        {key === "users" && <Users className="size-4 text-muted-foreground" />}
                        {key === "storage" && <HardDrive className="size-4 text-muted-foreground" />}
                        {key === "vendors" && <Zap className="size-4 text-muted-foreground" />}
                        <span className="font-medium capitalize">{key}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {data.used} / {data.limit} {data.unit.includes("/") ? "" : data.unit}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className={isCritical ? "text-red-600 font-medium" : isWarning ? "text-yellow-600" : "text-muted-foreground"}>
                          {percentage.toFixed(1)}% used
                        </span>
                        {isCritical && (
                          <span className="text-red-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="size-3" />
                            Near limit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(getUsagePercentage(usage.tenders.used, usage.tenders.limit) >= 75 ||
              getUsagePercentage(usage.storage.used, usage.storage.limit) >= 75) && (
              <Alert className="mt-6">
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  <strong>Usage Alert:</strong> You're approaching your plan limits. Consider upgrading to avoid service
                  interruptions.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlan.tier;
              return (
                <Card
                  key={plan.id}
                  className={`relative ${plan.recommended ? "border-blue-600 border-2" : ""} ${
                    isCurrent ? "bg-muted" : ""
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600">Recommended</Badge>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.billingCycle && <span className="text-muted-foreground">/{plan.billingCycle}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>{plan.features.tenders}</strong> tenders/month
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>{plan.features.users}</strong> team members
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>{plan.features.storage} GB</strong> storage
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>{plan.features.vendors}</strong> vendors
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        {plan.features.liveBidding ? (
                          <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span>Live Bidding</span>
                      </div>
                      <div className="flex items-start gap-2">
                        {plan.features.advancedReporting ? (
                          <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span>Advanced Reporting</span>
                      </div>
                      <div className="flex items-start gap-2">
                        {plan.features.apiAccess ? (
                          <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span>API Access</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{plan.features.support}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant={plan.recommended ? "default" : "outline"}
                      disabled={isCurrent}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {isCurrent ? "Current Plan" : plan.id === "custom" ? "Contact Sales" : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell className="font-mono text-sm">{bill.invoice}</TableCell>
                    <TableCell className="font-semibold">{bill.amount}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle2 className="size-3 mr-1" />
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        <Download className="size-3 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="size-6" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            <Button variant="outline">
              + Add New Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}