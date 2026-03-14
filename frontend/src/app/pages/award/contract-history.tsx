import { useState } from "react";
import { useParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  CheckCircle, AlertTriangle, DollarSign, FileText, User, Shield,
  Clock, Download, Search, Filter, Forward, Star, Lock
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";
import type { ContractAuditEvent } from "../../lib/api-types";

export function ContractHistory() {
  const { id } = useParams();
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const contractId = id || "C-2026-0042";

  // Fetch audit history from API with mock fallback
  const { data: apiEvents } = useApiOrMock<ContractAuditEvent[]>(
    () => contractsApi.getAuditHistory(contractId),
    [],
    [contractId],
  );

  const mockAuditEvents = [
    {
      id: "EVT-001", timestamp: "2026-03-10 10:30:22", action: "CONTRACT_SIGNED",
      description: "Contract signed by Procurement Head", user: "Md. Rafiqul Islam",
      role: "Procurement Head", type: "contract",
      details: { value: "BDT 12,450,000", vendor: "ABC Builders Ltd" },
    },
    {
      id: "EVT-002", timestamp: "2026-03-15 09:00:00", action: "CONTRACT_ACTIVATED",
      description: "Contract status changed to Active", user: "System",
      role: "System", type: "contract", details: { startDate: "2026-03-15" },
    },
    {
      id: "EVT-003", timestamp: "2026-03-20 14:15:33", action: "MILESTONE_COMPLETED",
      description: "Milestone 1: Advance Payment marked as completed", user: "Sarah Ahmed",
      role: "Contract Manager", type: "milestone",
      details: { milestone: "Advance Payment", amount: "BDT 2,490,000" },
    },
    {
      id: "EVT-004", timestamp: "2026-03-20 15:00:00", action: "PAYMENT_CERTIFIED",
      description: "Payment certificate PAY-001 certified and approved", user: "Finance Dept",
      role: "Finance Approver", type: "payment",
      details: { amount: "BDT 2,490,000", method: "NRB Bank" },
    },
    {
      id: "EVT-005", timestamp: "2026-03-20 15:30:00", action: "PAYMENT_DISBURSED",
      description: "Payment disbursed to vendor bank account", user: "System",
      role: "System", type: "payment",
      details: { reference: "NRB-TXN-2026-04523", amount: "BDT 2,490,000" },
    },
    {
      id: "EVT-006", timestamp: "2026-04-03 11:20:45", action: "MILESTONE_COMPLETED",
      description: "Milestone 2: Site Mobilization completed ahead of schedule", user: "Sarah Ahmed",
      role: "Contract Manager", type: "milestone",
      details: { milestone: "Site Mobilization", daysEarly: 2 },
    },
    {
      id: "EVT-007", timestamp: "2026-04-03 14:00:00", action: "PAYMENT_CERTIFIED",
      description: "Payment certificate PAY-002 certified", user: "Finance Dept",
      role: "Finance Approver", type: "payment",
      details: { amount: "BDT 1,867,500" },
    },
    {
      id: "EVT-008", timestamp: "2026-04-20 10:30:00", action: "VARIATION_REQUESTED",
      description: "Variation #VAR-001 submitted: Cost increase due to material price changes",
      user: "Sarah Ahmed", role: "Contract Manager", type: "variation",
      details: { costDelta: "+BDT 350,000", reason: "Material price increase" },
    },
    {
      id: "EVT-009", timestamp: "2026-04-20 10:31:00", action: "WORKFLOW_FORWARDED",
      description: "Variation auto-forwarded to Procurement Head for review", user: "System",
      role: "System", type: "workflow",
      details: { from: "Contract Manager", to: "Procurement Head" },
    },
    {
      id: "EVT-010", timestamp: "2026-04-21 09:15:00", action: "WORKFLOW_FORWARDED",
      description: "Variation forwarded to approver by Procurement Head", user: "Md. Rafiqul Islam",
      role: "Procurement Head", type: "workflow",
      details: { comment: "Reviewed - material price increase is justified per market data" },
    },
    {
      id: "EVT-011", timestamp: "2026-04-25 16:45:00", action: "VARIATION_APPROVED",
      description: "Variation #VAR-001 approved", user: "Audit Review Board",
      role: "Auditor", type: "variation",
      details: { newContractValue: "BDT 12,800,000" },
    },
    {
      id: "EVT-012", timestamp: "2026-04-28 09:00:00", action: "MILESTONE_COMPLETED",
      description: "Milestone 3: Delivery of Materials completed", user: "Sarah Ahmed",
      role: "Contract Manager", type: "milestone",
      details: { milestone: "Delivery of Materials", evidence: "3 documents attached" },
    },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    contract: <FileText className="size-4 text-purple-600 dark:text-purple-400" />,
    milestone: <CheckCircle className="size-4 text-green-600 dark:text-green-400" />,
    payment: <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />,
    variation: <AlertTriangle className="size-4 text-orange-600 dark:text-orange-400" />,
    workflow: <Forward className="size-4 text-cyan-600 dark:text-cyan-400" />,
    performance: <Star className="size-4 text-yellow-600 dark:text-yellow-400" />,
  };

  const typeBgColors: Record<string, string> = {
    contract: "bg-purple-100 dark:bg-purple-900/30",
    milestone: "bg-green-100 dark:bg-green-900/30",
    payment: "bg-blue-100 dark:bg-blue-900/30",
    variation: "bg-orange-100 dark:bg-orange-900/30",
    workflow: "bg-cyan-100 dark:bg-cyan-900/30",
    performance: "bg-yellow-100 dark:bg-yellow-900/30",
  };

  const auditEvents = (apiEvents && apiEvents.length > 0) ? apiEvents : mockAuditEvents;

  const filtered = auditEvents
    .filter((e) => filterType === "all" || e.type === filterType)
    .filter((e) =>
      searchQuery === "" ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Contract Archive & History"
        description={`Immutable audit trail for Contract #${contractId}`}
        backTo={`/contracts/${contractId}`}
        backLabel="Back to Contract"
        actions={
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-1.5" /> Export Audit Log
          </Button>
        }
      />

      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
        <Lock className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This is an immutable audit log. All entries are append-only and cannot be modified or deleted.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="size-4 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="milestone">Milestones</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="variation">Variations</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} events</Badge>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {filtered.map((event) => (
                <div key={event.id} className="relative pl-14">
                  <div className={`absolute left-2.5 top-1 w-6 h-6 rounded-full flex items-center justify-center ${typeBgColors[event.type]}`}>
                    {typeIcons[event.type]}
                  </div>
                  <div className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs font-mono">{event.action}</Badge>
                          <span className="text-xs text-muted-foreground">{event.id}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="size-3" /> {event.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="size-3" /> {event.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground/70 whitespace-nowrap flex items-center gap-1">
                        <Clock className="size-3" /> {event.timestamp}
                      </span>
                    </div>
                    {event.details && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(event.details).map(([key, val]) => (
                          <span key={key} className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}