import { useState } from "react";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { SimpleSelect } from "../../components/ui/select";
import { useTenderOptions } from "../../hooks/use-tender-options";
import { ApprovalWorkflowConfig, getDefaultStages, type WorkflowStage } from "../../components/approval-workflow-config";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Shield,
  ClipboardCheck,
  Package,
  Settings,
  Eye,
  Send,
  AlertCircle,
  Building2,
  Scale,
  FileCheck,
  Zap,
  Upload,
  Paperclip,
  X,
  UserCheck,
} from "lucide-react";

const SEGMENTS = [
  { id: 1, title: "Tender Identification", icon: FileText },
  { id: 2, title: "Procurement Details", icon: Building2 },
  { id: 3, title: "Scope of Work / BOQ", icon: Package },
  { id: 4, title: "Technical Specifications", icon: Settings },
  { id: 5, title: "Eligibility Criteria", icon: Shield },
  { id: 6, title: "Qualification Requirements", icon: FileCheck },
  { id: 7, title: "Bid Submission Requirements", icon: ClipboardCheck },
  { id: 8, title: "Evaluation Methodology", icon: Scale },
  { id: 9, title: "Payment & Contract Terms", icon: DollarSign },
  { id: 10, title: "Timeline & Milestones", icon: Calendar },
  { id: 11, title: "Tender Documents", icon: FileText },
  { id: 12, title: "Vendor Selection & Invitation", icon: Users },
  { id: 13, title: "Live Bidding Configuration", icon: Zap },
  { id: 14, title: "Approval Workflow & Roles", icon: UserCheck },
  { id: 15, title: "Preview & Publish", icon: Send },
];

export function CreateRfq() {
  const [currentSegment, setCurrentSegment] = useState(1);
  const [tenderType, setTenderType] = useState<"PG" | "PW" | "PPS">("PG");
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(getDefaultStages());

  const handleNext = () => {
    if (currentSegment < 15) setCurrentSegment(currentSegment + 1);
  };

  const handlePrevious = () => {
    if (currentSegment > 1) setCurrentSegment(currentSegment - 1);
  };

  const renderSegmentContent = () => {
    switch (currentSegment) {
      case 1:
        return <TenderIdentificationSegment tenderType={tenderType} setTenderType={setTenderType} />;
      case 2:
        return <ProcurementDetailsSegment />;
      case 3:
        return <ScopeOfWorkSegment tenderType={tenderType} />;
      case 4:
        return <TechnicalSpecificationsSegment />;
      case 5:
        return <EligibilityCriteriaSegment />;
      case 6:
        return <QualificationRequirementsSegment />;
      case 7:
        return <BidSubmissionSegment />;
      case 8:
        return <EvaluationMethodologySegment />;
      case 9:
        return <PaymentContractSegment />;
      case 10:
        return <TimelineMilestonesSegment />;
      case 11:
        return <TenderDocumentsSegment />;
      case 12:
        return <VendorSelectionSegment />;
      case 13:
        return <LiveBiddingConfigSegment />;
      case 14:
        return (
          <ApprovalWorkflowConfig
            tenderType="govt-full"
            stages={workflowStages}
            onStagesChange={setWorkflowStages}
          />
        );
      case 15:
        return <PreviewPublishSegment />;
      default:
        return null;
    }
  };

  const progress = ((currentSegment - 1) / 14) * 100;

  return (
    <PageTemplate
      title="Create Government Tender (PG/PW/PPS)"
      description="Government tender creation with 15-segment comprehensive workflow"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Save className="size-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Save Draft</span>
            <span className="xs:hidden">Save</span>
          </Button>
          {currentSegment < 15 && (
            <Button size="sm" onClick={handleNext} className="flex-1 sm:flex-none">
              <span className="hidden xs:inline">Next Segment</span>
              <span className="xs:hidden">Next</span>
              <ArrowRight className="size-4 ml-1 sm:ml-2" />
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-[12px] sm:text-sm">
                <span className="font-medium">Tender Creation Progress</span>
                <span className="text-muted-foreground">
                  Segment {currentSegment} of 15
                </span>
              </div>
              <Progress value={progress} className="h-1.5 sm:h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Segment Navigation - Compact Grid */}
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar scroll-smooth">
          {SEGMENTS.map((segment) => {
            const Icon = segment.icon;
            const isActive = currentSegment === segment.id;
            const isCompleted = currentSegment > segment.id;
            
            return (
              <button
                key={segment.id}
                onClick={() => setCurrentSegment(segment.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all w-16 sm:w-20 md:flex-1 ${
                  isActive
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10"
                    : isCompleted
                    ? "border-green-600 bg-green-50 dark:bg-green-900/10"
                    : "border-border hover:border-border/80"
                }`}
                title={segment.title}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-3 sm:size-3.5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium">{segment.id}</span>
              </button>
            );
          })}
        </div>

        {/* Current Segment Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge className="text-xs sm:text-lg px-2 sm:px-4 py-1 sm:py-2 shrink-0">
            Seg {currentSegment}
          </Badge>
          <h2 className="text-lg sm:text-2xl font-bold truncate">
            {SEGMENTS[currentSegment - 1].title}
          </h2>
        </div>

        {/* Segment Content */}
        <div className="min-h-[400px]">
          {renderSegmentContent()}
        </div>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentSegment === 1}
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="size-4 mr-1 sm:mr-2" />
                Previous
              </Button>
              
              <div className="hidden sm:block text-xs sm:text-sm text-muted-foreground">
                Segment {currentSegment} of 15
              </div>

              {currentSegment < 15 ? (
                <Button size="sm" onClick={handleNext} className="flex-1 sm:flex-none">
                  Next <span className="hidden xs:inline">Segment</span>
                  <ArrowRight className="size-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
                  <Send className="size-4 mr-1 sm:mr-2" />
                  Publish <span className="hidden xs:inline">Tender</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}

// Segment Components
function TenderIdentificationSegment({ tenderType, setTenderType }: { tenderType: string; setTenderType: (type: any) => void }) {
  const options = useTenderOptions();
  const governmentTypes = options.tenderTypes.filter(t => t.category === "government");
  const subtypes = options.getTenderSubtypes(tenderType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tender Identification & Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tenderType">Tender Type *</Label>
          <SimpleSelect
            id="tenderType"
            value={tenderType}
            onChange={(e) => setTenderType(e.target.value)}
          >
            {governmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SimpleSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenderSubtype" className="text-sm">Tender Subtype *</Label>
            <SimpleSelect id="tenderSubtype" className="text-sm">
              {subtypes.map((subtype) => (
                <option key={subtype.value} value={subtype.value}>
                  {subtype.label}
                </option>
              ))}
            </SimpleSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenderNumber" className="text-sm">Tender Reference Number</Label>
            <Input id="tenderNumber" placeholder="Auto-generated" disabled className="text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenderTitle" className="text-sm">Tender Title *</Label>
          <Input id="tenderTitle" placeholder="e.g., Supply of Medical Equipment" className="text-sm" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">Tender Description *</Label>
          <Textarea id="description" rows={4} placeholder="Description..." className="text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="procuringEntity" className="text-sm">Procuring Entity *</Label>
            <Input id="procuringEntity" placeholder="Ministry of..." className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm">Project Name</Label>
            <Input id="projectName" placeholder="Project name" className="text-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcurementDetailsSegment() {
  const options = useTenderOptions();
  
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Procurement Details & Budget</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="budgetYear" className="text-xs sm:text-sm">Budget/Fiscal Year *</Label>
            <SimpleSelect id="budgetYear" className="text-xs sm:text-sm">
              <option>FY 2025-2026</option>
              <option>FY 2026-2027</option>
            </SimpleSelect>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fundingSource" className="text-xs sm:text-sm">Funding Source *</Label>
            <SimpleSelect id="fundingSource" className="text-xs sm:text-sm">
              <option>Government Budget</option>
              <option>Development Partner</option>
              <option>Mixed Funding</option>
            </SimpleSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="estimatedCost" className="text-xs sm:text-sm">Estimated Total Cost (BDT) *</Label>
            <Input id="estimatedCost" type="number" placeholder="0.00" className="text-xs sm:text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="currency" className="text-xs sm:text-sm">Currency</Label>
            <SimpleSelect id="currency" className="text-xs sm:text-sm">
              {options.currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </SimpleSelect>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="category" className="text-xs sm:text-sm">Procurement Category *</Label>
          <SimpleSelect id="category" className="text-xs sm:text-sm">
            {options.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </SimpleSelect>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Requesting Department *</Label>
          <SimpleSelect id="department">
            {options.departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </SimpleSelect>
        </div>

        <div className="space-y-2">
          <Label htmlFor="procurementMethod">Procurement Method Justification</Label>
          <Textarea id="procurementMethod" rows={3} placeholder="Explain why this procurement method was chosen..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <SimpleSelect id="contractType">
            {options.contractTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SimpleSelect>
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeOfWorkSegment({ tenderType }: { tenderType: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tenderType === "PW" ? "Bill of Quantities (BOQ)" : tenderType === "PPS" ? "Terms of Reference (TOR)" : "Scope of Work & Item Specifications"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Provide detailed specifications for all items/works/services to be procured.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-12 gap-3 p-3 bg-muted rounded-lg font-medium text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Actions</div>
            </div>

            {[1, 2, 3].map((item) => (
              <div key={item} className="grid grid-cols-12 gap-3 items-start mt-3">
              <div className="col-span-1 text-center pt-2">{item}</div>
              <div className="col-span-5 space-y-2">
                <Input placeholder="Item/Work description" />
                {/* Item Attachment */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Paperclip className="size-3 mr-1" />
                    Attach Specs
                  </Button>
                  {item === 1 && (
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 text-xs">
                      <Paperclip className="size-2.5 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">technical-spec.pdf</span>
                      <button className="text-red-500 hover:text-red-700 ml-1"><X className="size-2.5" /></button>
                    </div>
                  )}
                  {item === 1 && (
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 text-xs">
                      <Paperclip className="size-2.5 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">drawing-v3.dwg</span>
                      <button className="text-red-500 hover:text-red-700 ml-1"><X className="size-2.5" /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Each</option>
                  <option>Set</option>
                  <option>Lot</option>
                  <option>M²</option>
                  <option>Km</option>
                </select>
              </div>
              <div className="col-span-2">
                <Input type="number" placeholder="0" />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button variant="outline" size="sm">
                  Specs
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  ×
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>

        <Button variant="outline">
          + Add Item/Line
        </Button>
      </CardContent>
    </Card>
  );
}

function TechnicalSpecificationsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Specifications & Standards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="techStandards">Technical Standards & Compliance *</Label>
          <Textarea id="techStandards" rows={4} placeholder="Specify applicable technical standards, quality requirements, compliance needs..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="performance">Performance Requirements</Label>
          <Textarea id="performance" rows={3} placeholder="Expected performance specifications..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testing">Testing & Inspection Requirements</Label>
          <Textarea id="testing" rows={3} placeholder="Quality control, testing, and inspection procedures..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty & Maintenance</Label>
          <Input id="warranty" placeholder="e.g., 2 years comprehensive warranty with AMC" />
        </div>
      </CardContent>
    </Card>
  );
}

function EligibilityCriteriaSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Criteria for Bidders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Bidder Nationality/Origin</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Bangladeshi Companies</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Foreign Companies (with local registration)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Joint Ventures</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Required Registrations & Licenses</Label>
          <div className="space-y-2">
            {["Trade License", "VAT Registration", "TIN Certificate", "Company Registration", "Relevant Sector License"].map((doc) => (
              <label key={doc} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>{doc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blacklist">Blacklist/Suspension Check</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Exclude blacklisted companies</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QualificationRequirementsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualification Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minExperience">Minimum Experience (Years) *</Label>
            <Input id="minExperience" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minTurnover">Minimum Annual Turnover (BDT)</Label>
            <Input id="minTurnover" type="number" placeholder="0.00" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="similarWork">Similar Work Experience Required</Label>
          <Input id="similarWork" placeholder="e.g., At least 3 similar projects in last 5 years" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technicalCapacity">Technical Capacity Requirements</Label>
          <Textarea id="technicalCapacity" rows={3} placeholder="Equipment, facilities, personnel qualifications..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="financial">Financial Capacity Requirements</Label>
          <Textarea id="financial" rows={3} placeholder="Bank solvency, credit line, financial statements..." />
        </div>
      </CardContent>
    </Card>
  );
}

function BidSubmissionSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid Submission Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="envelopeSystem">Envelope System *</Label>
          <select id="envelopeSystem" className="w-full border rounded-lg px-3 py-2">
            <option>Single Envelope</option>
            <option>Two Envelope (Technical + Financial)</option>
            <option>Three Envelope (Eligibility + Technical + Financial)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bidLanguage">Bid Language</Label>
            <select id="bidLanguage" className="w-full border rounded-lg px-3 py-2">
              <option>English</option>
              <option>Bengali</option>
              <option>Both Accepted</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bidValidity">Bid Validity (Days) *</Label>
            <Input id="bidValidity" type="number" placeholder="90" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bidSecurity">Bid Security/Earnest Money</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="bidSecurityAmount">Amount (BDT or %)</Label>
              <Input id="bidSecurityAmount" placeholder="e.g., 2% of bid value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bidSecurityType">Accepted Forms</Label>
              <select id="bidSecurityType" className="w-full border rounded-lg px-3 py-2">
                <option>Bank Guarantee</option>
                <option>Pay Order/Demand Draft</option>
                <option>Any</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EvaluationMethodologySegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Methodology & Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="evalMethod">Primary Evaluation Method *</Label>
          <select id="evalMethod" className="w-full border rounded-lg px-3 py-2">
            <option>Lowest Evaluated Price</option>
            <option>Quality & Cost Based Selection (QCBS)</option>
            <option>Quality Based Selection (QBS)</option>
            <option>Fixed Budget Selection (FBS)</option>
            <option>Least Cost Selection (LCS)</option>
          </select>
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Define evaluation criteria with clear weightages (must total 100%).
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-3 p-3 bg-muted rounded font-medium text-sm">
            <div className="col-span-6">Evaluation Criteria</div>
            <div className="col-span-3">Weightage (%)</div>
            <div className="col-span-3">Max Score</div>
          </div>

          {["Technical Compliance", "Price/Financial Proposal", "Past Performance & Experience", "Delivery Schedule"].map((criteria, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-6">
                <Input defaultValue={criteria} />
              </div>
              <div className="col-span-3">
                <Input type="number" placeholder="0" />
              </div>
              <div className="col-span-3">
                <Input type="number" placeholder="100" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="abnormallyLow">Abnormally Low Bid Handling</Label>
          <Textarea id="abnormallyLow" rows={2} placeholder="Criteria for identifying and handling abnormally low bids..." />
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentContractSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Terms & Contract Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contractDuration">Contract Duration</Label>
          <Input id="contractDuration" placeholder="e.g., 6 months from LOA" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advancePayment">Advance Payment (%)</Label>
            <Input id="advancePayment" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retentionMoney">Retention Money (%)</Label>
            <Input id="retentionMoney" type="number" placeholder="5" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Schedule</Label>
          <select id="paymentTerms" className="w-full border rounded-lg px-3 py-2">
            <option>Upon Delivery & Acceptance</option>
            <option>Milestone-based (Multiple Installments)</option>
            <option>Monthly Progress Payment</option>
            <option>Lump Sum on Completion</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="performanceSecurity">Performance Security</Label>
          <Input id="performanceSecurity" placeholder="e.g., 10% of contract value" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="liquidatedDamages">Liquidated Damages Clause</Label>
          <Textarea id="liquidatedDamages" rows={2} placeholder="Penalty for delay: e.g., 0.5% per week, max 10%..." />
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineMilestonesSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tender Timeline & Key Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tenderPublish">Tender Publish Date *</Label>
            <Input id="tenderPublish" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preBidMeeting">Pre-Bid Meeting Date</Label>
            <Input id="preBidMeeting" type="datetime-local" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clarificationDeadline">Clarification Deadline</Label>
            <Input id="clarificationDeadline" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="submissionDeadline">Bid Submission Deadline *</Label>
            <Input id="submissionDeadline" type="datetime-local" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bidOpening">Bid Opening Date & Time *</Label>
            <Input id="bidOpening" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evaluationDuration">Evaluation Period (Days)</Label>
            <Input id="evaluationDuration" type="number" placeholder="30" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loaDate">Expected LOA Issue Date</Label>
            <Input id="loaDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Expected Delivery/Completion</Label>
            <Input id="deliveryDate" type="date" />
          </div>
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Ensure compliance with PPR 2008/2022 timeline requirements for your tender type.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function TenderDocumentsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tender Documents & Annexures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <FileText className="size-4" />
          <AlertDescription>
            Upload all tender documents, technical specifications, drawings, and annexures.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {["Tender Notice", "Instructions to Bidders", "Technical Specifications", "Bill of Quantities / TOR", "Contract Terms & Conditions", "Bid Forms & Templates"].map((docType) => (
            <div key={docType} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{docType}</div>
                  <div className="text-sm text-muted-foreground">No file uploaded</div>
                </div>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline">
          + Add Additional Document
        </Button>
      </CardContent>
    </Card>
  );
}

function VendorSelectionSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Invitation & Publication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="publicationType">Publication Type *</Label>
          <select id="publicationType" className="w-full border rounded-lg px-3 py-2">
            <option>National Tender (e-GP Portal)</option>
            <option>International Tender</option>
            <option>Limited Tender (Specific Vendors)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Publication Channels</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>e-Government Procurement (e-GP) Portal</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Organization Website</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>National Newspapers</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>UNDB Online / Development Partner Portals</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendorCategory">Auto-invite by Category</Label>
          <Input id="vendorCategory" placeholder="Select vendor categories for auto-invitation" />
        </div>

        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium mb-2">Invited Vendors: 0</div>
          <div className="text-sm text-muted-foreground">Configure publication settings above</div>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveBiddingConfigSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Bidding Configuration (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="liveBidding">Enable Live Bidding / e-Auction</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="liveBidding" value="yes" />
              <span>Yes, enable live bidding</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="liveBidding" value="no" defaultChecked />
              <span>No, standard tender only</span>
            </label>
          </div>
        </div>

        <Alert className="bg-muted">
          <Zap className="size-4" />
          <AlertDescription>
            Live bidding allows real-time competitive bidding after initial technical evaluation. Configure parameters below if enabled.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 opacity-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="biddingStartTime">Bidding Start Time *</Label>
              <Input id="biddingStartTime" type="datetime-local" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biddingEndTime">Bidding End Time *</Label>
              <Input id="biddingEndTime" type="datetime-local" disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumDecrement">Minimum Bid Decrement (%)</Label>
            <Input id="minimumDecrement" type="number" placeholder="0.5" disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extensionRule">Auto-extension Rule</Label>
            <Input id="extensionRule" placeholder="e.g., Extend 5 min if bid in last 2 min" disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewPublishSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Publish Tender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-600">
          <Eye className="size-4" />
          <AlertDescription>
            Review all tender details carefully. Once published, changes may require tender amendment process.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Tender Type</div>
              <div className="font-medium">PG1 - Open Tender</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Estimated Cost</div>
              <div className="font-medium">BDT 5,000,000</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Submission Deadline</div>
              <div className="font-medium">Not set</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Tender Documents</div>
            <div className="font-medium">0 documents uploaded</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">BOQ/TOR Items</div>
            <div className="font-medium">3 items added</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Publication Channels</div>
            <div className="font-medium">e-GP Portal, Organization Website</div>
          </div>
        </div>

        <Alert className="bg-yellow-50 border-yellow-600">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>Validation Check:</strong> Some mandatory fields are incomplete. Please review all segments.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="publishOption">Publishing Option</Label>
          <select id="publishOption" className="w-full border rounded-lg px-3 py-2">
            <option>Publish Immediately</option>
            <option>Schedule for Later</option>
            <option>Save as Draft for Approval</option>
          </select>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
          <Send className="size-5 mr-2" />
          Publish Tender
        </Button>
      </CardContent>
    </Card>
  );
}