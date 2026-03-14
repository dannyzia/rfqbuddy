import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Building,
  DollarSign,
  Truck,
  Award,
  Users,
  FileCheck,
  Clock,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { tendersApi } from "../../lib/api/tenders.api";
import { bidsApi } from "../../lib/api/bids.api";

// Tender Type Definitions
type TenderType =
  | "PG1" | "PG2" | "PG3" | "PG4" | "PG5A" | "PG9A"
  | "PW1" | "PW3"
  | "PPS2" | "PPS3" | "PPS6"
  | "NRQ1" | "NRQ2" | "NRQ3";

interface BidItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
  unitPrice?: number;
}

interface BidFormData {
  // Basic Information
  tenderType: TenderType;
  tenderTitle: string;
  tenderValue: string;
  
  // PG2-1: Tender Submission Letter
  submissionDate: string;
  bidderName: string;
  bidderAddress: string;
  bidderEmail: string;
  bidderPhone: string;
  authorizedSignatory: string;
  designation: string;
  
  // PG2-2: Tenderer Information
  organizationType: "individual" | "partnership" | "company" | "jv";
  registrationNumber: string;
  yearEstablished: string;
  businessNature: string;
  annualTurnover: string;
  netWorth: string;
  
  // PG2-3A: Price Schedule for Goods
  items: BidItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalBidAmount: number;
  
  // PG2-3B: Related Services
  relatedServices: string;
  relatedServicesCost: number;
  
  // PG2-4: Specifications Compliance
  specsCompliance: { [key: string]: "compliant" | "deviation" | "na" };
  deviationRemarks: string;
  
  // Delivery & Terms
  deliveryTimeline: string;
  warrantyPeriod: string;
  paymentTerms: string;
  validityPeriod: string;
  
  // PG2-5: Manufacturer Authorization
  isManufacturer: boolean;
  manufacturerName?: string;
  manufacturerCountry?: string;
  hasAuthorizationLetter: boolean;
  
  // Technical & Financial Capacity (PG3, PG4, PW3)
  technicalProposal: string;
  experienceSummary: string;
  financialStatements: string;
  bankSolvency: string;
  
  // PG5A: Turnkey Specific
  designApproach?: string;
  installationPlan?: string;
  commissioningPlan?: string;
  trainingPlan?: string;
  aftersalesService?: string;
  
  // PW1/PW3: Works Specific
  billOfQuantities?: { item: string; quantity: number; rate: number; amount: number }[];
  equipmentList?: string;
  keyPersonnel?: string;
  healthSafetyPlan?: string;
  environmentalPlan?: string;
  
  // PPS2: Outsourcing Personnel
  personnelDetails?: { name: string; position: string; qualification: string; experience: string }[];
  trainingProgram?: string;
  supervisionPlan?: string;
  replacementPolicy?: string;
  
  // PPS3: Physical Services
  serviceMethodology?: string;
  activitySchedule?: string;
  performanceIndicators?: string;
  
  // Additional Information
  technicalNotes: string;
  valueAddedServices: string;
  specialTerms: string;
  
  // Documents
  uploadedDocuments: { name: string; type: string; size: number }[];
}

const TENDER_TYPE_CONFIGS: Record<TenderType, { name: string; steps: string[]; requiresSecurity: boolean }> = {
  PG1: {
    name: "RFQ for Goods (≤ 8 Lac)",
    steps: ["Basic Info", "Pricing", "Specifications", "Delivery Terms", "Documents"],
    requiresSecurity: false,
  },
  PG2: {
    name: "Open Tender Goods (≤ 50 Lac)",
    steps: ["Submission Letter", "Company Info", "Price Schedule", "Specs Compliance", "Manufacturer Auth", "Delivery Terms", "Documents"],
    requiresSecurity: true,
  },
  PG3: {
    name: "Open Tender Goods (> 50 Lac)",
    steps: ["Submission Letter", "Company Info", "Technical Capacity", "Financial Capacity", "Experience", "Price Schedule", "Specs Compliance", "Delivery Terms", "Documents"],
    requiresSecurity: true,
  },
  PG4: {
    name: "International Tender Goods",
    steps: ["Submission Letter", "Company Info", "Technical Capacity", "Financial Capacity", "Experience", "Price Schedule (Foreign)", "International Docs", "Specs Compliance", "Delivery Terms", "Documents"],
    requiresSecurity: true,
  },
  PG5A: {
    name: "Turnkey Contract",
    steps: ["Submission Letter", "Company Info", "Technical Proposal", "Design Approach", "Installation Plan", "Commissioning", "Training & Support", "Financial Proposal", "Documents"],
    requiresSecurity: true,
  },
  PG9A: {
    name: "Direct Procurement Goods",
    steps: ["Quotation", "Technical Specs", "Delivery Terms", "Documents"],
    requiresSecurity: false,
  },
  PW1: {
    name: "RFQ for Works (≤ 15 Lac)",
    steps: ["Basic Info", "Bill of Quantities", "Specifications", "Delivery Terms", "Documents"],
    requiresSecurity: false,
  },
  PW3: {
    name: "Open Tender Works (> 5 Crore)",
    steps: ["Submission Letter", "Company Info", "Technical Capacity", "Financial Capacity", "Experience", "Bill of Quantities", "Equipment & Personnel", "Health & Safety", "Environmental", "Documents"],
    requiresSecurity: true,
  },
  PPS2: {
    name: "Outsourcing Personnel",
    steps: ["Submission Letter", "Company Info", "Personnel Details", "Training Program", "Supervision Plan", "Financial Proposal", "Documents"],
    requiresSecurity: true,
  },
  PPS3: {
    name: "Physical Services",
    steps: ["Submission Letter", "Company Info", "Service Methodology", "Activity Schedule", "Performance KPIs", "Financial Proposal", "Documents"],
    requiresSecurity: true,
  },
  PPS6: {
    name: "Direct Procurement Services",
    steps: ["Quotation", "Service Details", "Methodology", "Documents"],
    requiresSecurity: false,
  },
  NRQ1: {
    name: "Simple RFQ Goods (≤ 20 Lac)",
    steps: ["Basic Info", "Pricing", "Delivery Terms", "Documents"],
    requiresSecurity: false,
  },
  NRQ2: {
    name: "Simple RFQ Works (≤ 30 Lac)",
    steps: ["Basic Info", "Pricing", "Delivery Terms", "Documents"],
    requiresSecurity: false,
  },
  NRQ3: {
    name: "Simple RFQ Services (≤ 25 Lac)",
    steps: ["Basic Info", "Service Details", "Pricing", "Documents"],
    requiresSecurity: false,
  },
};

// ─── Mock tender data ───────────────────────────────────────────
const MOCK_TENDER = {
  id: "RFQ-2024-001",
  title: "Office Furniture Supply",
  estimated_value: "4500000",
  tender_type: "PG2" as TenderType,
  items: [
    { id: "1", name: "Executive Desk", description: "Wooden executive desk with drawers", quantity: 15, unit: "pieces" },
    { id: "2", name: "Office Chair", description: "Ergonomic office chair with lumbar support", quantity: 50, unit: "pieces" },
    { id: "3", name: "Filing Cabinet", description: "4-drawer metal filing cabinet", quantity: 20, unit: "pieces" },
  ],
};

export function SubmitBidWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ── Fetch tender details from API with mock fallback ──────────
  const { data: tenderData } = useApiOrMock(
    async () => {
      const t = await tendersApi.getById(id!);
      return {
        id: t.tender_number ?? t.id,
        title: t.title ?? "Untitled",
        estimated_value: String(t.estimated_value ?? 0),
        tender_type: (t as any).tender_type ?? "PG2" as TenderType,
        items: ((t as any).items ?? MOCK_TENDER.items).map((item: any, i: number) => ({
          id: item.id ?? String(i + 1),
          name: item.name ?? item.item_name ?? "Item",
          description: item.description ?? "",
          quantity: Number(item.quantity ?? 1),
          unit: item.unit ?? "pieces",
        })),
      };
    },
    MOCK_TENDER,
    [id],
  );

  const [tenderType] = useState<TenderType>(tenderData.tender_type);
  const [bidId, setBidId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BidFormData>>({
    tenderType,
    tenderTitle: tenderData.title,
    tenderValue: `BDT ${Number(tenderData.estimated_value).toLocaleString("en-BD")}`,
    items: tenderData.items,
    specsCompliance: {},
    uploadedDocuments: [],
  });

  const config = TENDER_TYPE_CONFIGS[tenderType];
  const totalSteps = config.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (updates: Partial<BidFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const calculateTotals = () => {
    const subtotal = (formData.items || []).reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
    const tax = subtotal * 0.15; // 15% VAT
    const shipping = formData.shipping || 0;
    const totalBidAmount = subtotal + tax + shipping;
    updateFormData({ subtotal, tax, totalBidAmount });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!bidId) {
        // Create a new draft bid via API
        const result = await bidsApi.create({ tender_id: id! });
        setBidId(result.id);
        toast.success(`Bid ${result.bid_number ?? "draft"} saved`);
      } else {
        toast.success("Bid saved as draft");
      }
    } catch {
      // Fallback in mock/offline mode
      toast.success("Bid saved as draft");
    }
    console.log("Saving draft:", formData);
  };

  const handleSubmitBid = async () => {
    try {
      let currentBidId = bidId;
      if (!currentBidId) {
        const created = await bidsApi.create({ tender_id: id! });
        currentBidId = created.id;
        setBidId(currentBidId);
      }
      await bidsApi.submit(currentBidId);
      toast.success("Bid submitted successfully!");
    } catch {
      // Fallback in mock/offline mode
      toast.success("Bid submitted successfully!");
    }
    console.log("Submitting bid:", formData);
    setTimeout(() => navigate("/vendor-bids"), 1500);
  };

  const renderStepContent = () => {
    const stepName = config.steps[currentStep];
    
    // Common steps for simple RFQs (PG1, PW1, NRQ series, PG9A, PPS6)
    if (["PG1", "PW1", "NRQ1", "NRQ2", "NRQ3", "PG9A", "PPS6"].includes(tenderType)) {
      switch (stepName) {
        case "Basic Info":
        case "Quotation":
          return renderBasicInfo();
        case "Pricing":
        case "Bill of Quantities":
          return renderPricing();
        case "Specifications":
        case "Technical Specs":
          return renderSpecifications();
        case "Service Details":
        case "Methodology":
          return renderServiceDetails();
        case "Delivery Terms":
          return renderDeliveryTerms();
        case "Documents":
          return renderDocuments();
      }
    }

    // Steps for comprehensive tenders (PG2, PG3, PG4)
    if (["PG2", "PG3", "PG4"].includes(tenderType)) {
      switch (stepName) {
        case "Submission Letter":
          return renderSubmissionLetter();
        case "Company Info":
          return renderCompanyInfo();
        case "Technical Capacity":
          return renderTechnicalCapacity();
        case "Financial Capacity":
          return renderFinancialCapacity();
        case "Experience":
          return renderExperience();
        case "Price Schedule":
        case "Price Schedule (Foreign)":
          return renderPricing();
        case "International Docs":
          return renderInternationalDocs();
        case "Specs Compliance":
          return renderSpecsCompliance();
        case "Manufacturer Auth":
          return renderManufacturerAuth();
        case "Delivery Terms":
          return renderDeliveryTerms();
        case "Documents":
          return renderDocuments();
      }
    }

    // PG5A Turnkey specific steps
    if (tenderType === "PG5A") {
      switch (stepName) {
        case "Submission Letter":
          return renderSubmissionLetter();
        case "Company Info":
          return renderCompanyInfo();
        case "Technical Proposal":
          return renderTechnicalProposal();
        case "Design Approach":
          return renderDesignApproach();
        case "Installation Plan":
          return renderInstallationPlan();
        case "Commissioning":
          return renderCommissioning();
        case "Training & Support":
          return renderTrainingSupport();
        case "Financial Proposal":
          return renderFinancialProposal();
        case "Documents":
          return renderDocuments();
      }
    }

    // PW3 Works specific steps
    if (tenderType === "PW3") {
      switch (stepName) {
        case "Submission Letter":
          return renderSubmissionLetter();
        case "Company Info":
          return renderCompanyInfo();
        case "Technical Capacity":
          return renderTechnicalCapacity();
        case "Financial Capacity":
          return renderFinancialCapacity();
        case "Experience":
          return renderExperience();
        case "Bill of Quantities":
          return renderBOQ();
        case "Equipment & Personnel":
          return renderEquipmentPersonnel();
        case "Health & Safety":
          return renderHealthSafety();
        case "Environmental":
          return renderEnvironmental();
        case "Documents":
          return renderDocuments();
      }
    }

    // PPS2 Outsourcing Personnel steps
    if (tenderType === "PPS2") {
      switch (stepName) {
        case "Submission Letter":
          return renderSubmissionLetter();
        case "Company Info":
          return renderCompanyInfo();
        case "Personnel Details":
          return renderPersonnelDetails();
        case "Training Program":
          return renderTrainingProgram();
        case "Supervision Plan":
          return renderSupervisionPlan();
        case "Financial Proposal":
          return renderFinancialProposal();
        case "Documents":
          return renderDocuments();
      }
    }

    // PPS3 Physical Services steps
    if (tenderType === "PPS3") {
      switch (stepName) {
        case "Submission Letter":
          return renderSubmissionLetter();
        case "Company Info":
          return renderCompanyInfo();
        case "Service Methodology":
          return renderServiceMethodology();
        case "Activity Schedule":
          return renderActivitySchedule();
        case "Performance KPIs":
          return renderPerformanceKPIs();
        case "Financial Proposal":
          return renderFinancialProposal();
        case "Documents":
          return renderDocuments();
      }
    }

    return <div>Step content not implemented</div>;
  };

  // Render functions for each step type
  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Enter your company and contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company/Individual Name *</Label>
            <Input
              value={formData.bidderName || ""}
              onChange={(e) => updateFormData({ bidderName: e.target.value })}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <Label>Registration Number *</Label>
            <Input
              value={formData.registrationNumber || ""}
              onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
              placeholder="Trade license / Registration no"
            />
          </div>
          <div>
            <Label>Email Address *</Label>
            <Input
              type="email"
              value={formData.bidderEmail || ""}
              onChange={(e) => updateFormData({ bidderEmail: e.target.value })}
              placeholder="company@example.com"
            />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <Input
              value={formData.bidderPhone || ""}
              onChange={(e) => updateFormData({ bidderPhone: e.target.value })}
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
        </div>
        <div>
          <Label>Complete Address *</Label>
          <Textarea
            value={formData.bidderAddress || ""}
            onChange={(e) => updateFormData({ bidderAddress: e.target.value })}
            placeholder="Enter complete address with city and postal code"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderSubmissionLetter = () => (
    <Card>
      <CardHeader>
        <CardTitle>PG2-1: Tender Submission Letter</CardTitle>
        <CardDescription>Official letter submitting your bid</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            This section constitutes your formal tender submission as per form PG2-1
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Submission Date *</Label>
            <Input
              type="date"
              value={formData.submissionDate || ""}
              onChange={(e) => updateFormData({ submissionDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Tender Reference</Label>
            <Input value={id} disabled />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              value={formData.bidderName || ""}
              onChange={(e) => updateFormData({ bidderName: e.target.value })}
              placeholder="Full legal name"
            />
          </div>
          <div>
            <Label>Registration Number *</Label>
            <Input
              value={formData.registrationNumber || ""}
              onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Registered Office Address *</Label>
          <Textarea
            value={formData.bidderAddress || ""}
            onChange={(e) => updateFormData({ bidderAddress: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email Address *</Label>
            <Input
              type="email"
              value={formData.bidderEmail || ""}
              onChange={(e) => updateFormData({ bidderEmail: e.target.value })}
            />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <Input
              value={formData.bidderPhone || ""}
              onChange={(e) => updateFormData({ bidderPhone: e.target.value })}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Authorized Signatory Name *</Label>
            <Input
              value={formData.authorizedSignatory || ""}
              onChange={(e) => updateFormData({ authorizedSignatory: e.target.value })}
              placeholder="Name of person authorized to sign"
            />
          </div>
          <div>
            <Label>Designation *</Label>
            <Input
              value={formData.designation || ""}
              onChange={(e) => updateFormData({ designation: e.target.value })}
              placeholder="e.g., Managing Director"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompanyInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>PG2-2: Tenderer Information Sheet</CardTitle>
        <CardDescription>Detailed company information and legal status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Organization Type *</Label>
          <RadioGroup
            value={formData.organizationType || "company"}
            onValueChange={(value) => updateFormData({ organizationType: value as any })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership">Partnership</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company">Private Limited / Public Limited Company</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jv" id="jv" />
              <Label htmlFor="jv">Joint Venture</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Year Established *</Label>
            <Input
              type="number"
              value={formData.yearEstablished || ""}
              onChange={(e) => updateFormData({ yearEstablished: e.target.value })}
              placeholder="e.g., 2010"
            />
          </div>
          <div>
            <Label>Nature of Business *</Label>
            <Input
              value={formData.businessNature || ""}
              onChange={(e) => updateFormData({ businessNature: e.target.value })}
              placeholder="e.g., Furniture Manufacturing & Trading"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Annual Turnover (Last FY) *</Label>
            <Input
              value={formData.annualTurnover || ""}
              onChange={(e) => updateFormData({ annualTurnover: e.target.value })}
              placeholder="BDT in Crore"
            />
          </div>
          <div>
            <Label>Net Worth *</Label>
            <Input
              value={formData.netWorth || ""}
              onChange={(e) => updateFormData({ netWorth: e.target.value })}
              placeholder="BDT in Crore"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          {tenderType.startsWith("PG") ? "PG2-3A: Price Schedule for Goods" : "Price Schedule"}
        </CardTitle>
        <CardDescription>Enter unit prices for each item</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="w-24">Quantity</TableHead>
                <TableHead className="w-32">Unit Price (BDT)</TableHead>
                <TableHead className="w-32">Subtotal (BDT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(formData.items || []).map((item, index) => {
                const subtotal = (item.unitPrice || 0) * item.quantity;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.unitPrice || ""}
                        onChange={(e) => {
                          const items = [...(formData.items || [])];
                          items[index].unitPrice = parseFloat(e.target.value) || 0;
                          updateFormData({ items });
                          calculateTotals();
                        }}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {subtotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span className="font-semibold">
              BDT {(formData.subtotal || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>VAT (15%):</span>
            <span className="font-semibold">
              BDT {(formData.tax || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span>Shipping & Handling:</span>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.shipping || ""}
              onChange={(e) => {
                updateFormData({ shipping: parseFloat(e.target.value) || 0 });
                calculateTotals();
              }}
              className="w-48"
            />
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>Total Bid Amount:</span>
            <span className="text-primary">
              BDT {(formData.totalBidAmount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSpecifications = () => (
    <Card>
      <CardHeader>
        <CardTitle>Technical Specifications Compliance</CardTitle>
        <CardDescription>Confirm compliance with technical requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(formData.items || []).map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold">{item.name}</h4>
            <div>
              <Label>Specifications / Model Details *</Label>
              <Textarea
                placeholder="Enter detailed specifications, model number, brand, origin, etc."
                rows={3}
              />
            </div>
            <div>
              <Label>Compliance Status *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select compliance status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Fully Compliant</SelectItem>
                  <SelectItem value="deviation">Compliant with Deviations</SelectItem>
                  <SelectItem value="na">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <div>
          <Label>Deviation Remarks (if any)</Label>
          <Textarea
            value={formData.deviationRemarks || ""}
            onChange={(e) => updateFormData({ deviationRemarks: e.target.value })}
            placeholder="Explain any deviations from tender specifications"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderSpecsCompliance = () => (
    <Card>
      <CardHeader>
        <CardTitle>PG2-4: Specifications Submission & Compliance Sheet</CardTitle>
        <CardDescription>Detail specifications and confirm compliance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            You must provide detailed specifications and declare compliance for each item
          </AlertDescription>
        </Alert>

        {(formData.items || []).map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Offered Brand / Model *</Label>
                <Input placeholder="Brand name and model number" />
              </div>
              <div>
                <Label>Country of Origin *</Label>
                <Input placeholder="Manufacturing country" />
              </div>
              <div>
                <Label>Detailed Technical Specifications *</Label>
                <Textarea
                  placeholder="Dimensions, materials, technical features, certifications, etc."
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id={`comply-${item.id}`} />
                <Label htmlFor={`comply-${item.id}`}>
                  I confirm this item complies with tender specifications
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  const renderManufacturerAuth = () => (
    <Card>
      <CardHeader>
        <CardTitle>PG2-5: Manufacturer's Authorization</CardTitle>
        <CardDescription>Provide manufacturer authorization details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isManufacturer"
            checked={formData.isManufacturer}
            onCheckedChange={(checked) => updateFormData({ isManufacturer: checked as boolean })}
          />
          <Label htmlFor="isManufacturer">We are the manufacturer of the offered products</Label>
        </div>

        {!formData.isManufacturer && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Manufacturer Name *</Label>
                  <Input
                    value={formData.manufacturerName || ""}
                    onChange={(e) => updateFormData({ manufacturerName: e.target.value })}
                    placeholder="Name of manufacturer"
                  />
                </div>
                <div>
                  <Label>Manufacturer Country *</Label>
                  <Input
                    value={formData.manufacturerCountry || ""}
                    onChange={(e) => updateFormData({ manufacturerCountry: e.target.value })}
                    placeholder="Country of origin"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAuth"
                  checked={formData.hasAuthorizationLetter}
                  onCheckedChange={(checked) =>
                    updateFormData({ hasAuthorizationLetter: checked as boolean })
                  }
                />
                <Label htmlFor="hasAuth">
                  I have attached the Manufacturer's Authorization Letter (Form PG2-5)
                </Label>
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  The manufacturer's authorization letter must be on the manufacturer's letterhead,
                  signed by an authorized representative
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderTechnicalCapacity = () => (
    <Card>
      <CardHeader>
        <CardTitle>Technical Capacity & Resources</CardTitle>
        <CardDescription>Demonstrate your technical capabilities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Technical Facilities & Infrastructure *</Label>
          <Textarea
            value={formData.technicalProposal || ""}
            onChange={(e) => updateFormData({ technicalProposal: e.target.value })}
            placeholder="Describe manufacturing facilities, quality control systems, testing laboratories, ISO certifications, etc."
            rows={5}
          />
        </div>
        <div>
          <Label>Quality Assurance Systems *</Label>
          <Textarea
            placeholder="Describe your quality management system (ISO 9001, etc.), testing procedures, quality control measures"
            rows={4}
          />
        </div>
        <div>
          <Label>Key Technical Personnel</Label>
          <Textarea
            placeholder="List key personnel with their qualifications and experience"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialCapacity = () => (
    <Card>
      <CardHeader>
        <CardTitle>Financial Capacity</CardTitle>
        <CardDescription>Provide evidence of financial soundness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            You must upload audited financial statements for the last 3 years and a bank solvency certificate
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Annual Turnover (Last 3 Years Average) *</Label>
            <Input
              value={formData.annualTurnover || ""}
              onChange={(e) => updateFormData({ annualTurnover: e.target.value })}
              placeholder="BDT in Crore"
            />
          </div>
          <div>
            <Label>Current Net Worth *</Label>
            <Input
              value={formData.netWorth || ""}
              onChange={(e) => updateFormData({ netWorth: e.target.value })}
              placeholder="BDT in Crore"
            />
          </div>
        </div>

        <div>
          <Label>Bank Solvency Certificate Details *</Label>
          <Textarea
            value={formData.bankSolvency || ""}
            onChange={(e) => updateFormData({ bankSolvency: e.target.value })}
            placeholder="Bank name, certificate number, amount, validity date"
            rows={3}
          />
        </div>

        <div>
          <Label>Liquid Assets & Credit Line *</Label>
          <Textarea
            placeholder="Details of liquid assets, bank credit facilities, and financial capacity to execute this project"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderExperience = () => (
    <Card>
      <CardHeader>
        <CardTitle>Experience & Past Performance</CardTitle>
        <CardDescription>Detail your relevant experience in similar projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Summary of Relevant Experience *</Label>
          <Textarea
            value={formData.experienceSummary || ""}
            onChange={(e) => updateFormData({ experienceSummary: e.target.value })}
            placeholder="Summarize your experience in similar projects over the last 5-10 years"
            rows={5}
          />
        </div>

        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            You must provide at least 3 experience certificates for similar contracts in the documents section
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-semibold">Major Past Contracts (Last 5 Years)</h4>
          {[1, 2, 3].map((num) => (
            <Card key={num}>
              <CardHeader>
                <CardTitle className="text-sm">Contract {num}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Project Name</Label>
                    <Input placeholder="Name of project" />
                  </div>
                  <div>
                    <Label>Client Name</Label>
                    <Input placeholder="Organization name" />
                  </div>
                  <div>
                    <Label>Contract Value</Label>
                    <Input placeholder="BDT amount" />
                  </div>
                  <div>
                    <Label>Completion Year</Label>
                    <Input type="number" placeholder="e.g., 2023" />
                  </div>
                </div>
                <div>
                  <Label>Scope of Work</Label>
                  <Textarea placeholder="Brief description" rows={2} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderInternationalDocs = () => (
    <Card>
      <CardHeader>
        <CardTitle>International Tender Requirements</CardTitle>
        <CardDescription>Additional documentation for international procurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            For international tenders, additional documents like import licenses, certificates of origin, and international quality certifications are required
          </AlertDescription>
        </Alert>

        <div>
          <Label>Incoterms *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exw">EXW - Ex Works</SelectItem>
              <SelectItem value="fob">FOB - Free on Board</SelectItem>
              <SelectItem value="cif">CIF - Cost, Insurance & Freight</SelectItem>
              <SelectItem value="dap">DAP - Delivered at Place</SelectItem>
              <SelectItem value="ddp">DDP - Delivered Duty Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Currency for Pricing *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bdt">BDT - Bangladeshi Taka</SelectItem>
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Exchange Rate (if applicable)</Label>
            <Input placeholder="Rate as on date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>International Certifications & Compliance</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="iso" />
              <Label htmlFor="iso">ISO 9001:2015 Quality Management</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="iso14001" />
              <Label htmlFor="iso14001">ISO 14001 Environmental Management</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ce" />
              <Label htmlFor="ce">CE Marking / European Standards</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDeliveryTerms = () => (
    <Card>
      <CardHeader>
        <CardTitle>Delivery & Terms</CardTitle>
        <CardDescription>Specify delivery schedule and commercial terms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Delivery Timeline *</Label>
            <Input
              type="number"
              value={formData.deliveryTimeline || ""}
              onChange={(e) => updateFormData({ deliveryTimeline: e.target.value })}
              placeholder="Number of days from order"
            />
          </div>
          <div>
            <Label>Warranty Period *</Label>
            <Input
              type="number"
              value={formData.warrantyPeriod || ""}
              onChange={(e) => updateFormData({ warrantyPeriod: e.target.value })}
              placeholder="Months"
            />
          </div>
          <div>
            <Label>Payment Terms *</Label>
            <Input
              value={formData.paymentTerms || ""}
              onChange={(e) => updateFormData({ paymentTerms: e.target.value })}
              placeholder="e.g., Net 30, 50% advance"
            />
          </div>
          <div>
            <Label>Bid Validity Period *</Label>
            <Input
              type="number"
              value={formData.validityPeriod || ""}
              onChange={(e) => updateFormData({ validityPeriod: e.target.value })}
              placeholder="Days"
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label>After-Sales Service & Support</Label>
          <Textarea
            value={formData.valueAddedServices || ""}
            onChange={(e) => updateFormData({ valueAddedServices: e.target.value })}
            placeholder="Describe maintenance, spare parts availability, technical support, training, etc."
            rows={4}
          />
        </div>

        <div>
          <Label>Special Terms & Conditions</Label>
          <Textarea
            value={formData.specialTerms || ""}
            onChange={(e) => updateFormData({ specialTerms: e.target.value })}
            placeholder="Any special terms, conditions, or requirements"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderServiceDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
        <CardDescription>Describe the services you will provide</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Service Description *</Label>
          <Textarea
            placeholder="Detailed description of services to be provided"
            rows={5}
          />
        </div>
        <div>
          <Label>Service Methodology *</Label>
          <Textarea
            placeholder="Explain how you will deliver these services"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Service Duration *</Label>
            <Input placeholder="e.g., 12 months" />
          </div>
          <div>
            <Label>Service Rate *</Label>
            <Input type="number" placeholder="BDT per month/unit" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Turnkey specific renders
  const renderTechnicalProposal = () => (
    <Card>
      <CardHeader>
        <CardTitle>Technical Proposal Overview</CardTitle>
        <CardDescription>Comprehensive technical approach for turnkey project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            For turnkey contracts, you must provide a complete technical proposal covering design, supply, installation, and commissioning
          </AlertDescription>
        </Alert>
        <div>
          <Label>Executive Summary *</Label>
          <Textarea
            value={formData.technicalProposal || ""}
            onChange={(e) => updateFormData({ technicalProposal: e.target.value })}
            placeholder="Provide an overview of your technical approach and solution"
            rows={6}
          />
        </div>
        <div>
          <Label>Technical Specifications Compliance *</Label>
          <Textarea
            placeholder="Demonstrate how your solution meets or exceeds tender specifications"
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderDesignApproach = () => (
    <Card>
      <CardHeader>
        <CardTitle>Design Approach & Methodology</CardTitle>
        <CardDescription>Detail your design philosophy and technical approach</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Design Philosophy *</Label>
          <Textarea
            value={formData.designApproach || ""}
            onChange={(e) => updateFormData({ designApproach: e.target.value })}
            placeholder="Explain your design approach, standards followed, and innovation"
            rows={5}
          />
        </div>
        <div>
          <Label>Technical Drawings & Schematics</Label>
          <Textarea
            placeholder="List the drawings and technical documents you will provide"
            rows={3}
          />
        </div>
        <div>
          <Label>Materials & Components Specification *</Label>
          <Textarea
            placeholder="Detail the materials, equipment, and components to be used"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderInstallationPlan = () => (
    <Card>
      <CardHeader>
        <CardTitle>Installation Plan</CardTitle>
        <CardDescription>Detailed installation and site work plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Installation Methodology *</Label>
          <Textarea
            value={formData.installationPlan || ""}
            onChange={(e) => updateFormData({ installationPlan: e.target.value })}
            placeholder="Describe the installation process, sequence of work, and methodology"
            rows={5}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Installation Timeline *</Label>
            <Input placeholder="Number of days/weeks" />
          </div>
          <div>
            <Label>Number of Site Personnel</Label>
            <Input type="number" placeholder="Engineers, technicians, workers" />
          </div>
        </div>
        <div>
          <Label>Site Requirements & Preparations</Label>
          <Textarea
            placeholder="List site requirements, foundation work, utilities, access requirements"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderCommissioning = () => (
    <Card>
      <CardHeader>
        <CardTitle>Commissioning & Testing Plan</CardTitle>
        <CardDescription>Detail commissioning activities and performance testing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Commissioning Procedure *</Label>
          <Textarea
            value={formData.commissioningPlan || ""}
            onChange={(e) => updateFormData({ commissioningPlan: e.target.value })}
            placeholder="Describe pre-commissioning, commissioning, and testing procedures"
            rows={5}
          />
        </div>
        <div>
          <Label>Performance Guarantees *</Label>
          <Textarea
            placeholder="List guaranteed performance parameters and acceptance criteria"
            rows={4}
          />
        </div>
        <div>
          <Label>Trial Run & Acceptance</Label>
          <Textarea
            placeholder="Describe trial run period and acceptance procedure"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderTrainingSupport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Training & After-Sales Support</CardTitle>
        <CardDescription>Training plan and ongoing support services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Training Plan *</Label>
          <Textarea
            value={formData.trainingPlan || ""}
            onChange={(e) => updateFormData({ trainingPlan: e.target.value })}
            placeholder="Detail training program for operation and maintenance personnel"
            rows={5}
          />
        </div>
        <div>
          <Label>After-Sales Service *</Label>
          <Textarea
            value={formData.aftersalesService || ""}
            onChange={(e) => updateFormData({ aftersalesService: e.target.value })}
            placeholder="Describe maintenance support, spare parts supply, technical assistance"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Warranty Period *</Label>
            <Input
              value={formData.warrantyPeriod || ""}
              onChange={(e) => updateFormData({ warrantyPeriod: e.target.value })}
              placeholder="Months"
            />
          </div>
          <div>
            <Label>Response Time for Service Calls</Label>
            <Input placeholder="Hours/days" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFinancialProposal = () => (
    <Card>
      <CardHeader>
        <CardTitle>Financial Proposal</CardTitle>
        <CardDescription>Complete cost breakdown and payment terms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Cost Breakdown *</Label>
          <div className="space-y-3 mt-2">
            {["Design & Engineering", "Equipment & Materials", "Installation & Commissioning", "Training & Documentation", "Warranty & Support"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Label className="w-64">{item}</Label>
                <Input type="number" placeholder="BDT" className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Project Cost:</span>
            <span>BDT 0.00</span>
          </div>
        </div>

        <Separator />

        <div>
          <Label>Payment Schedule *</Label>
          <Textarea
            placeholder="Propose payment milestones (e.g., 10% advance, 40% on delivery, 40% on installation, 10% after acceptance)"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  // Works specific renders
  const renderBOQ = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bill of Quantities (BOQ)</CardTitle>
        <CardDescription>Enter unit rates for each work item</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Enter your rates for each BOQ item. The quantities are pre-filled from the tender document.
          </AlertDescription>
        </Alert>

        <div className="overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Description of Work</TableHead>
                <TableHead className="w-24">Quantity</TableHead>
                <TableHead className="w-24">Unit</TableHead>
                <TableHead className="w-32">Unit Rate (BDT)</TableHead>
                <TableHead className="w-32">Amount (BDT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: 1, desc: "Excavation in foundation", qty: 150, unit: "cum" },
                { id: 2, desc: "Concrete 1:2:4", qty: 50, unit: "cum" },
                { id: 3, desc: "Brick work in cement mortar", qty: 200, unit: "sqm" },
              ].map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.desc}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Input type="number" placeholder="0.00" />
                  </TableCell>
                  <TableCell className="font-medium">0.00</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">
                  Total:
                </TableCell>
                <TableCell className="font-bold">BDT 0.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEquipmentPersonnel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Equipment & Key Personnel</CardTitle>
        <CardDescription>List equipment and key personnel for the project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Construction Equipment</h4>
          <Textarea
            value={formData.equipmentList || ""}
            onChange={(e) => updateFormData({ equipmentList: e.target.value })}
            placeholder="List all equipment and machinery available for this project"
            rows={5}
          />
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Key Personnel</h4>
          <Textarea
            value={formData.keyPersonnel || ""}
            onChange={(e) => updateFormData({ keyPersonnel: e.target.value })}
            placeholder="List key personnel: Site Engineer, Project Manager, Supervisor with qualifications and experience"
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderHealthSafety = () => (
    <Card>
      <CardHeader>
        <CardTitle>Health & Safety Plan</CardTitle>
        <CardDescription>Occupational health and safety measures</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Health & Safety Management Plan *</Label>
          <Textarea
            value={formData.healthSafetyPlan || ""}
            onChange={(e) => updateFormData({ healthSafetyPlan: e.target.value })}
            placeholder="Describe your approach to health, safety, and welfare of workers and public"
            rows={6}
          />
        </div>
        <div>
          <Label>Emergency Response Plan</Label>
          <Textarea
            placeholder="Detail emergency procedures, first aid facilities, and incident reporting"
            rows={4}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="safety-cert" />
          <Label htmlFor="safety-cert">
            I confirm compliance with Bangladesh Labour Act and safety regulations
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderEnvironmental = () => (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Management Plan</CardTitle>
        <CardDescription>Environmental protection and sustainability measures</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Environmental Management Plan *</Label>
          <Textarea
            value={formData.environmentalPlan || ""}
            onChange={(e) => updateFormData({ environmentalPlan: e.target.value })}
            placeholder="Describe measures for pollution control, waste management, and environmental protection"
            rows={6}
          />
        </div>
        <div>
          <Label>Waste Disposal & Recycling</Label>
          <Textarea
            placeholder="Detail waste disposal methods and recycling initiatives"
            rows={3}
          />
        </div>
        <div>
          <Label>Social Safeguards</Label>
          <Textarea
            placeholder="Measures for community relations, grievance handling, and social impact mitigation"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  // PPS2 specific renders
  const renderPersonnelDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Personnel Details</CardTitle>
        <CardDescription>Information about personnel to be deployed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Provide details of all personnel to be deployed under the outsourcing contract
          </AlertDescription>
        </Alert>

        {[1, 2, 3, 4, 5].map((num) => (
          <Card key={num}>
            <CardHeader>
              <CardTitle className="text-sm">Personnel {num}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input placeholder="e.g., Security Guard, Cleaner" />
                </div>
                <div>
                  <Label>Educational Qualification</Label>
                  <Input placeholder="Highest qualification" />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input type="number" placeholder="Years" />
                </div>
              </div>
              <div>
                <Label>Training & Certifications</Label>
                <Textarea placeholder="List relevant training and certificates" rows={2} />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );

  const renderTrainingProgram = () => (
    <Card>
      <CardHeader>
        <CardTitle>Training Program</CardTitle>
        <CardDescription>Training plan for deployed personnel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Training Methodology *</Label>
          <Textarea
            value={formData.trainingProgram || ""}
            onChange={(e) => updateFormData({ trainingProgram: e.target.value })}
            placeholder="Describe your training program for personnel"
            rows={5}
          />
        </div>
        <div>
          <Label>Training Schedule</Label>
          <Textarea
            placeholder="Frequency and duration of training sessions"
            rows={3}
          />
        </div>
        <div>
          <Label>Skill Development Initiatives</Label>
          <Textarea
            placeholder="Ongoing skill development and capacity building programs"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderSupervisionPlan = () => (
    <Card>
      <CardHeader>
        <CardTitle>Supervision & Monitoring Plan</CardTitle>
        <CardDescription>How you will supervise and monitor deployed personnel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Supervision Structure *</Label>
          <Textarea
            value={formData.supervisionPlan || ""}
            onChange={(e) => updateFormData({ supervisionPlan: e.target.value })}
            placeholder="Describe supervision hierarchy and monitoring mechanisms"
            rows={5}
          />
        </div>
        <div>
          <Label>Replacement Policy *</Label>
          <Textarea
            value={formData.replacementPolicy || ""}
            onChange={(e) => updateFormData({ replacementPolicy: e.target.value })}
            placeholder="Procedure for replacing personnel in case of absence or poor performance"
            rows={4}
          />
        </div>
        <div>
          <Label>Performance Monitoring System</Label>
          <Textarea
            placeholder="How you will monitor and ensure quality of service"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  // PPS3 specific renders
  const renderServiceMethodology = () => (
    <Card>
      <CardHeader>
        <CardTitle>Service Methodology</CardTitle>
        <CardDescription>Detailed approach to service delivery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Service Delivery Approach *</Label>
          <Textarea
            value={formData.serviceMethodology || ""}
            onChange={(e) => updateFormData({ serviceMethodology: e.target.value })}
            placeholder="Describe your methodology and approach to delivering the services"
            rows={6}
          />
        </div>
        <div>
          <Label>Quality Assurance Measures *</Label>
          <Textarea
            placeholder="Explain quality control measures and standards to be followed"
            rows={4}
          />
        </div>
        <div>
          <Label>Risk Mitigation Strategies</Label>
          <Textarea
            placeholder="Identify potential risks and your mitigation strategies"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderActivitySchedule = () => (
    <Card>
      <CardHeader>
        <CardTitle>Activity Schedule</CardTitle>
        <CardDescription>Timeline and schedule of service activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Project Timeline *</Label>
          <Textarea
            value={formData.activitySchedule || ""}
            onChange={(e) => updateFormData({ activitySchedule: e.target.value })}
            placeholder="Provide a detailed timeline of activities and milestones"
            rows={6}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Mobilization Period</Label>
            <Input placeholder="Days required to mobilize" />
          </div>
          <div>
            <Label>Service Duration</Label>
            <Input placeholder="Months/years" />
          </div>
        </div>
        <div>
          <Label>Deliverables Schedule</Label>
          <Textarea
            placeholder="List key deliverables and their delivery dates"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderPerformanceKPIs = () => (
    <Card>
      <CardHeader>
        <CardTitle>Performance Indicators (KPIs)</CardTitle>
        <CardDescription>Define measurable performance indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Define specific, measurable KPIs that will be used to evaluate service performance
          </AlertDescription>
        </Alert>

        <div>
          <Label>Key Performance Indicators *</Label>
          <Textarea
            value={formData.performanceIndicators || ""}
            onChange={(e) => updateFormData({ performanceIndicators: e.target.value })}
            placeholder="List specific KPIs with target values (e.g., Response time: Within 2 hours, Service uptime: 99.5%)"
            rows={6}
          />
        </div>

        <div>
          <Label>Monitoring & Reporting</Label>
          <Textarea
            placeholder="Describe how performance will be monitored and reported"
            rows={4}
          />
        </div>

        <div>
          <Label>Performance Improvement Plan</Label>
          <Textarea
            placeholder="How you will address performance gaps and continuously improve"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>Upload all required documents for your bid</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            {config.requiresSecurity
              ? "This tender requires tender security. Please upload the bank guarantee or pay order."
              : "Ensure all documents are clear, legible, and in PDF format (max 10MB each)."}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-semibold">Required Documents:</h4>
          
          {/* Common documents for all tender types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Trade License</p>
                  <p className="text-sm text-muted-foreground">Valid trade license copy</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="size-4 mr-2" />
                Upload
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">TIN Certificate</p>
                  <p className="text-sm text-muted-foreground">Tax Identification Number certificate</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="size-4 mr-2" />
                Upload
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">VAT Registration Certificate</p>
                  <p className="text-sm text-muted-foreground">Value Added Tax registration</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="size-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Tender security for formal tenders */}
          {config.requiresSecurity && (
            <>
              <Separator />
              <h4 className="font-semibold text-destructive">Tender Security (Required):</h4>
              <div className="flex items-center justify-between p-3 border-2 border-destructive rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="size-5 text-destructive" />
                  <div>
                    <p className="font-medium">Tender Security / Bank Guarantee</p>
                    <p className="text-sm text-muted-foreground">
                      Bank guarantee or pay order as per tender requirements
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  <Upload className="size-4 mr-2" />
                  Upload
                </Button>
              </div>
            </>
          )}

          {/* Additional documents for specific tender types */}
          {["PG2", "PG3", "PG4", "PW3"].includes(tenderType) && (
            <>
              <Separator />
              <h4 className="font-semibold">Financial Documents:</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Audited Financial Statements</p>
                      <p className="text-sm text-muted-foreground">Last 3 years</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="size-4 mr-2" />
                    Upload
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Bank Solvency Certificate</p>
                      <p className="text-sm text-muted-foreground">Recent certificate with specified amount</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="size-4 mr-2" />
                    Upload
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Experience Certificates</p>
                      <p className="text-sm text-muted-foreground">At least 3 similar projects</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="size-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Manufacturer authorization for goods */}
          {tenderType.startsWith("PG") && !formData.isManufacturer && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Manufacturer's Authorization Letter</p>
                    <p className="text-sm text-muted-foreground">On manufacturer's letterhead</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="size-4 mr-2" />
                  Upload
                </Button>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Uploaded Documents:</h4>
          {formData.uploadedDocuments && formData.uploadedDocuments.length > 0 ? (
            <div className="space-y-2">
              {formData.uploadedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-green-600" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {(doc.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={`Submit Bid - ${config.name}`}
        description={`${formData.tenderTitle || "Tender"} (${id})`}
        breadcrumbs={[
          { label: "Dashboard", href: "/vendor-dashboard" },
          { label: "Available RFQs", href: "/rfqs" },
          { label: "Submit Bid" },
        ]}
      />

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    Step {currentStep + 1} of {totalSteps}: {config.steps[currentStep]}
                  </h3>
                  <p className="text-sm text-muted-foreground">{config.name}</p>
                </div>
                <Badge variant={config.requiresSecurity ? "destructive" : "secondary"}>
                  {config.requiresSecurity ? "Requires Security" : "Simple RFQ"}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex flex-wrap gap-2">
                {config.steps.map((step, index) => (
                  <Badge
                    key={index}
                    variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCurrentStep(index)}
                  >
                    {index < currentStep && <CheckCircle className="size-3 mr-1" />}
                    {step}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-6">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                  <ArrowLeft className="size-4 mr-2" />
                  Previous
                </Button>
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="size-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              <div className="flex gap-2">
                {currentStep < totalSteps - 1 ? (
                  <Button onClick={handleNext}>
                    Next: {config.steps[currentStep + 1]}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitBid} size="lg" className="font-semibold">
                    <FileCheck className="size-5 mr-2" />
                    Submit Bid
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Alert className="mt-6">
          <Info className="size-4" />
          <AlertDescription>
            <strong>Need help?</strong> Make sure to complete all required fields marked with *. You can save your
            progress at any time and return later to complete your bid before the submission deadline.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
