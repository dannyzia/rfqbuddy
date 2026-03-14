import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  Shield, ShieldCheck, ShieldAlert, FileText, AlertTriangle, CheckCircle,
  Clock, Users, FileSearch, Scale, Lock, Eye,
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { analyticsApi } from "../../lib/api/analytics.api";
import type { ComplianceMetrics } from "../../lib/api-types";

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_COMPLIANCE: ComplianceMetrics = {
  kyc_breakdown: [
    { status: "verified", count: 42 },
    { status: "pending", count: 15 },
    { status: "failed", count: 3 },
    { status: "expired", count: 5 },
  ],
  tender_compliance: {
    total: 95,
    has_terms: 88,
    adequate_deadline: 82,
    has_documents: 91,
    has_eval_method: 95,
  },
  bid_compliance: {
    total: 324,
    declared_compliant: 298,
    has_documents: 310,
  },
  contract_compliance: {
    total_active: 38,
    overdue: 3,
    expiring_soon: 7,
  },
  audit_coverage: {
    total_tenders: 83,
    with_audit_trail: 78,
  },
};

const KYC_COLORS: Record<string, { bg: string; text: string; pie: string }> = {
  verified: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", pie: "#22c55e" },
  pending: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", pie: "#f59e0b" },
  failed: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", pie: "#ef4444" },
  expired: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", pie: "#94a3b8" },
};

function pct(num: number, denom: number) {
  return denom > 0 ? Math.round((num / denom) * 100) : 0;
}

function ComplianceGauge({ label, value, total, icon: Icon, color }: {
  label: string; value: number; total: number; icon: typeof Shield; color: string;
}) {
  const percent = pct(value, total);
  const colorClass = percent >= 90 ? "text-emerald-600 dark:text-emerald-400"
    : percent >= 70 ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400";
  const progressColor = percent >= 90 ? "[&>div]:bg-emerald-500"
    : percent >= 70 ? "[&>div]:bg-amber-500"
    : "[&>div]:bg-red-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Icon className={`size-4 ${color}`} />
          <span className="text-foreground">{label}</span>
        </div>
        <span className={`text-sm ${colorClass}`}>{percent}%</span>
      </div>
      <Progress value={percent} className={`h-2 ${progressColor}`} />
      <p className="text-xs text-muted-foreground">{value} of {total}</p>
    </div>
  );
}

export function ComplianceAnalytics() {
  const { data } = useApiOrMock(
    () => analyticsApi.getComplianceMetrics(),
    MOCK_COMPLIANCE,
    [],
  );

  const tc = data.tender_compliance;
  const bc = data.bid_compliance;
  const cc = data.contract_compliance;
  const ac = data.audit_coverage;
  const totalKyc = data.kyc_breakdown.reduce((s, d) => s + d.count, 0);
  const verifiedKyc = data.kyc_breakdown.find(d => d.status === "verified")?.count ?? 0;

  // Overall compliance score (weighted average)
  const tenderPct = tc ? pct(tc.has_terms + tc.has_documents + tc.has_eval_method, tc.total * 3) : 0;
  const bidPct = bc ? pct(bc.declared_compliant + bc.has_documents, bc.total * 2) : 0;
  const auditPct = ac ? pct(ac.with_audit_trail, ac.total_tenders) : 0;
  const kycPct = pct(verifiedKyc, totalKyc);
  const overallScore = Math.round((tenderPct + bidPct + auditPct + kycPct) / 4);

  // Bar chart: tender compliance dimensions
  const tenderComplianceBar = tc ? [
    { dimension: "Terms & Conditions", rate: pct(tc.has_terms, tc.total), count: tc.has_terms },
    { dimension: "Documents Attached", rate: pct(tc.has_documents, tc.total), count: tc.has_documents },
    { dimension: "Eval Method Set", rate: pct(tc.has_eval_method, tc.total), count: tc.has_eval_method },
    { dimension: "Adequate Deadline", rate: pct(tc.adequate_deadline, tc.total), count: tc.adequate_deadline },
  ] : [];

  // KYC pie data
  const kycPieData = data.kyc_breakdown.map(d => ({
    name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
    value: d.count,
    fill: KYC_COLORS[d.status]?.pie ?? "#6b7280",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Metrics"
        description="Monitor procurement compliance across KYC, tender requirements, and audit coverage"
        backTo="/analytics"
      />

      {/* Overall Score + Key Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
            <div className={`text-4xl ${overallScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : overallScore >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
              {overallScore}%
            </div>
            <p className="text-muted-foreground text-sm mt-1">Overall Compliance</p>
            <Badge variant="outline" className="mt-2">
              {overallScore >= 80 ? "Good" : overallScore >= 60 ? "Needs Improvement" : "At Risk"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <ShieldCheck className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">KYC Verified</p>
                <p className="text-foreground text-xl">{kycPct}%</p>
                <p className="text-xs text-muted-foreground">{verifiedKyc}/{totalKyc} vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileSearch className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Audit Coverage</p>
                <p className="text-foreground text-xl">{auditPct}%</p>
                <p className="text-xs text-muted-foreground">{ac?.with_audit_trail ?? 0}/{ac?.total_tenders ?? 0} tenders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${(cc?.overdue ?? 0) > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                <AlertTriangle className={`size-5 ${(cc?.overdue ?? 0) > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Overdue Contracts</p>
                <p className="text-foreground text-xl">{cc?.overdue ?? 0}</p>
                <p className="text-xs text-muted-foreground">{cc?.expiring_soon ?? 0} expiring soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC + Tender Compliance Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* KYC Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Vendor KYC Status
            </CardTitle>
            <CardDescription>Know Your Customer verification breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kycPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                    >
                      {kycPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                {data.kyc_breakdown.map((d) => {
                  const cfg = KYC_COLORS[d.status] ?? KYC_COLORS.expired;
                  return (
                    <div key={d.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: cfg.pie }} />
                        <span className="text-sm text-foreground capitalize">{d.status}</span>
                      </div>
                      <Badge variant="outline" className={cfg.text}>{d.count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tender Compliance Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Tender Compliance
            </CardTitle>
            <CardDescription>Requirement fulfilment across {tc?.total ?? 0} published tenders</CardDescription>
          </CardHeader>
          <CardContent>
            {tenderComplianceBar.length > 0 ? (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tenderComplianceBar} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="dimension" width={130} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`${value}%`, "Compliance Rate"]} />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                      {tenderComplianceBar.map((entry, i) => (
                        <Cell key={i} fill={entry.rate >= 90 ? "#22c55e" : entry.rate >= 70 ? "#f59e0b" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                No tender data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bid Compliance + Contract Health */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bid Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="size-5" />
              Bid Compliance
            </CardTitle>
            <CardDescription>Vendor bid submission compliance rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {bc && (
              <>
                <ComplianceGauge
                  label="Compliance Declaration"
                  value={bc.declared_compliant}
                  total={bc.total}
                  icon={CheckCircle}
                  color="text-emerald-600 dark:text-emerald-400"
                />
                <ComplianceGauge
                  label="Documents Attached"
                  value={bc.has_documents}
                  total={bc.total}
                  icon={FileText}
                  color="text-blue-600 dark:text-blue-400"
                />
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total bids evaluated</span>
                    <span className="text-foreground">{bc.total}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contract Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5" />
              Contract Health
            </CardTitle>
            <CardDescription>Active contract status and risk indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {cc && (
              <>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl text-foreground">{cc.total_active}</div>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div>
                    <div className={`text-2xl ${cc.overdue > 0 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{cc.overdue}</div>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                  <div>
                    <div className={`text-2xl ${cc.expiring_soon > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>{cc.expiring_soon}</div>
                    <p className="text-xs text-muted-foreground">Expiring Soon</p>
                  </div>
                </div>

                {cc.total_active > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Healthy</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {pct(cc.total_active - cc.overdue - cc.expiring_soon, cc.total_active)}%
                      </span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${pct(cc.total_active - cc.overdue - cc.expiring_soon, cc.total_active)}%` }}
                      />
                      <div
                        className="bg-amber-500 transition-all"
                        style={{ width: `${pct(cc.expiring_soon, cc.total_active)}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${pct(cc.overdue, cc.total_active)}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />Healthy</span>
                      <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />Expiring</span>
                      <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" />Overdue</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Audit Trail Coverage
          </CardTitle>
          <CardDescription>Percentage of non-draft tenders with complete audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          {ac && (
            <div className="max-w-lg">
              <ComplianceGauge
                label="Tenders with Audit Trail"
                value={ac.with_audit_trail}
                total={ac.total_tenders}
                icon={FileSearch}
                color="text-blue-600 dark:text-blue-400"
              />
              <p className="text-sm text-muted-foreground mt-3">
                {ac.total_tenders - ac.with_audit_trail} tenders are missing audit trail entries.
                Ensure all procurement actions are logged for compliance requirements.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ComplianceAnalytics;
