import { useState } from "react";
import { useParams, Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  Fingerprint, Shield, AlertTriangle, CheckCircle, Clock, FileText,
  Building2, User, Download, RefreshCw, Eye, Upload, XCircle, Globe
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { complianceApi } from "../../lib/api/compliance.api";

const VENDOR = {
  id: "VND-001",
  name: "ABC Construction Ltd",
  tin: "123456789012",
  tradeLicense: "TL-2024-8876",
  registeredAddress: "42 Motijheel C/A, Dhaka 1000",
  incorporationDate: "2010-04-15",
  kycLevel: "Enhanced",
  status: "verified",
  verifiedAt: "2026-01-15",
  expiresAt: "2027-01-15",
  pepStatus: "Clear",
  sanctionsStatus: "Clear",
  adverseMedia: "None Found",
  riskScore: 12,
  contactPerson: "Md. Karim Rahman",
  email: "karim@abcconstruction.com.bd",
  phone: "+880 1711-223344",
};

const BENEFICIAL_OWNERS = [
  { name: "Md. Karim Rahman", ownership: 45, role: "Managing Director", pep: false, nationality: "Bangladesh", dob: "1975-03-12" },
  { name: "Fatima Rahman", ownership: 30, role: "Director", pep: false, nationality: "Bangladesh", dob: "1978-09-22" },
  { name: "Ahmed Hossain", ownership: 25, role: "Silent Partner", pep: true, nationality: "Bangladesh", dob: "1960-01-05" },
];

const KYC_CHECKS = [
  { id: 1, type: "TIN Verification", provider: "NBR API", result: "Match", checkedAt: "2026-01-14 10:30", nextDue: "2027-01-14", status: "pass" },
  { id: 2, type: "Trade License", provider: "RJSC OCR", result: "Valid", checkedAt: "2026-01-14 10:31", nextDue: "2027-01-14", status: "pass" },
  { id: 3, type: "Bank Account", provider: "BB Verification", result: "Confirmed", checkedAt: "2026-01-14 10:35", nextDue: "2027-01-14", status: "pass" },
  { id: 4, type: "Sanctions Screening", provider: "LSEG World-Check", result: "No Hits", checkedAt: "2026-01-15 08:00", nextDue: "2026-04-15", status: "pass" },
  { id: 5, type: "PEP Screening", provider: "Dow Jones", result: "1 Hit (UBO)", checkedAt: "2026-01-15 08:05", nextDue: "2026-04-15", status: "warning" },
  { id: 6, type: "Adverse Media", provider: "Google News NLP", result: "No adverse findings", checkedAt: "2026-01-15 09:00", nextDue: "2026-07-15", status: "pass" },
  { id: 7, type: "UN/OFAC List", provider: "Treasury OFAC API", result: "Clear", checkedAt: "2026-01-15 08:02", nextDue: "2026-04-15", status: "pass" },
];

const DOCUMENTS = [
  { name: "Trade License 2025-2026", type: "Trade License", uploadedAt: "2026-01-10", status: "verified", size: "2.1 MB" },
  { name: "TIN Certificate", type: "TIN", uploadedAt: "2026-01-10", status: "verified", size: "540 KB" },
  { name: "Bank Account Statement", type: "Financial", uploadedAt: "2026-01-12", status: "verified", size: "1.8 MB" },
  { name: "Beneficial Ownership Declaration", type: "UBO", uploadedAt: "2026-01-13", status: "verified", size: "320 KB" },
  { name: "Source of Funds Declaration", type: "AML", uploadedAt: "2026-01-13", status: "under_review", size: "450 KB" },
];

export function VendorKYCDetail() {
  const { id } = useParams();

  const { data: apiDetail } = useApiOrMock(
    () => complianceApi.getKycDetail(id!),
    VENDOR,
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title={`KYC Profile — ${apiDetail.name}`}
        description={`Vendor ${id || apiDetail.id} • KYC Level: ${apiDetail.kycLevel} • Risk Score: ${apiDetail.riskScore}/100`}
        backTo="/compliance/kyc"
        backLabel="Back to KYC Dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" />Export Report</Button>
            <Button variant="outline" size="sm"><RefreshCw className="size-4 mr-1.5" />Re-screen</Button>
            <Button size="sm"><CheckCircle className="size-4 mr-1.5" />Approve KYC</Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <Shield className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">KYC Status</p>
                <Badge variant="default" className="mt-1">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Fingerprint className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">KYC Level</p>
                <p className="font-medium text-foreground">Enhanced</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Globe className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sanctions</p>
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm font-medium"><CheckCircle className="size-3.5" />Clear</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Clock className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="font-medium text-foreground">{apiDetail.expiresAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checks">Verification Checks</TabsTrigger>
          <TabsTrigger value="owners">Beneficial Owners</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Audit History</TabsTrigger>
        </TabsList>

        <TabsContent value="checks">
          <Card>
            <CardHeader><CardTitle>KYC/AML Verification Checks</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Check Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Checked At</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {KYC_CHECKS.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.provider}</TableCell>
                      <TableCell>{c.result}</TableCell>
                      <TableCell className="text-sm">{c.checkedAt}</TableCell>
                      <TableCell className="text-sm">{c.nextDue}</TableCell>
                      <TableCell>
                        {c.status === "pass" ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm"><CheckCircle className="size-3.5" />Pass</span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm"><AlertTriangle className="size-3.5" />Review</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owners">
          <Card>
            <CardHeader><CardTitle>Beneficial Owners (UBO Declaration)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Ownership %</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>PEP Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BENEFICIAL_OWNERS.map(o => (
                    <TableRow key={o.name}>
                      <TableCell className="font-medium">{o.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={o.ownership} className="h-2 w-16" />
                          <span className="text-sm">{o.ownership}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{o.role}</TableCell>
                      <TableCell>{o.nationality}</TableCell>
                      <TableCell className="text-sm">{o.dob}</TableCell>
                      <TableCell>
                        {o.pep ? (
                          <Badge variant="destructive" className="gap-1"><AlertTriangle className="size-3" />PEP</Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1"><CheckCircle className="size-3" />Clear</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>KYC Documents</CardTitle>
                <Button size="sm"><Upload className="size-4 mr-1.5" />Upload Document</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DOCUMENTS.map(d => (
                    <TableRow key={d.name}>
                      <TableCell className="font-medium flex items-center gap-2"><FileText className="size-4 text-muted-foreground" />{d.name}</TableCell>
                      <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
                      <TableCell className="text-sm">{d.uploadedAt}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.size}</TableCell>
                      <TableCell>
                        {d.status === "verified" ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm"><CheckCircle className="size-3.5" />Verified</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-sm"><Clock className="size-3.5" />Under Review</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Eye className="size-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="size-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>Audit History</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2026-01-15 09:30", action: "KYC Status upgraded to Verified", user: "System (Auto)", type: "success" },
                  { date: "2026-01-15 09:00", action: "Adverse media screening completed — No findings", user: "System (Google NLP)", type: "info" },
                  { date: "2026-01-15 08:05", action: "PEP screening flagged UBO Ahmed Hossain — manual review cleared", user: "Compliance Officer (Nadia Khan)", type: "warning" },
                  { date: "2026-01-15 08:00", action: "Sanctions screening completed — Clear on all lists", user: "System (LSEG)", type: "success" },
                  { date: "2026-01-14 10:35", action: "Bank account verification confirmed", user: "System (BB API)", type: "success" },
                  { date: "2026-01-14 10:31", action: "Trade license OCR verified — Valid until 2026-12-31", user: "System (RJSC)", type: "success" },
                  { date: "2026-01-14 10:30", action: "TIN verification matched with NBR records", user: "System (NBR API)", type: "success" },
                  { date: "2026-01-10 14:00", action: "Enhanced KYC initiated — vendor exceeds BDT 10 Lac threshold", user: "System", type: "info" },
                ].map((entry, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted">
                    <div className={`mt-0.5 ${entry.type === "success" ? "text-green-500" : entry.type === "warning" ? "text-amber-500" : "text-blue-500"}`}>
                      {entry.type === "success" ? <CheckCircle className="size-4" /> : entry.type === "warning" ? <AlertTriangle className="size-4" /> : <Clock className="size-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{entry.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.user} • {entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}