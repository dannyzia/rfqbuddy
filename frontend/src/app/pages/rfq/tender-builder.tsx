import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import {
  FileText,
  Star,
  Users,
  Clock,
  Copy,
  ArrowRight,
  Settings,
  Package,
  Search,
  Building2,
  Globe,
  Layers,
  Bookmark,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  DollarSign,
  ClipboardCheck,
  Truck,
  Upload,
  Activity,
  Calendar,
  Boxes,
  Zap,
  Check,
  Minus,
  ToggleLeft,
  ToggleRight,
  Save,
  Trash2,
} from "lucide-react";
import masterTenderData from "../../../imports/Master_JSON_Tender.json";
import { useSavedPresets } from "../../hooks/use-saved-presets";

// ============================================================
// Types
// ============================================================
interface MasterSection {
  id: string;
  label: string;
  selectable: boolean;
  fields?: any[];
  subforms?: any[];
}

interface TenderTypeConfig {
  max_value?: number;
  min_value?: number;
  procurement_category: string;
  method?: string;
  applicable_to?: string;
  service_type?: string;
  scope?: string;
  tender_security: boolean;
  performance_security: boolean;
  newspaper_ad: boolean;
  submission_days_min?: number;
  submission_days_max?: number;
  validity_days?: number;
  evaluation_method?: string;
  retention_money?: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  organisation: string;
  category: string;
  tenderType: string;
  segments: number;
  usageCount: number;
  rating: number;
  isPublic: boolean;
  createdAt: string;
  tags: string[];
}

// ============================================================
// Extract data from Master JSON
// ============================================================
const SECTIONS: MasterSection[] = masterTenderData.master_tender_template.section_library;
const TENDER_TYPE_CONFIGS = masterTenderData.master_tender_template.tender_type_configurations as Record<string, TenderTypeConfig>;
const RULES_ENGINE = masterTenderData.master_tender_template.rules_engine;

// All 14 tender types grouped
const TENDER_TYPES = {
  government_goods: [
    { id: "PG1", label: "PG1 - RFQ (Goods, up to BDT 8 Lac)", method: "RFQ" },
    { id: "PG2", label: "PG2 - OTM (Goods, up to BDT 50 Lac)", method: "OTM" },
    { id: "PG3", label: "PG3 - OTM (Goods, above BDT 50 Lac)", method: "OTM" },
    { id: "PG4", label: "PG4 - International OTM (Goods)", method: "OTM" },
    { id: "PG5A", label: "PG5A - Two-Stage/Turnkey (Goods)", method: "TwoStage" },
    { id: "PG9A", label: "PG9A - Direct Procurement (Goods)", method: "DirectProcurement" },
  ],
  government_works: [
    { id: "PW1", label: "PW1 - RFQ (Works, up to BDT 15 Lac)", method: "RFQ" },
    { id: "PW3", label: "PW3 - OTM (Works, above BDT 5 Cr)", method: "OTM" },
  ],
  government_services: [
    { id: "PPS2", label: "PPS2 - Personnel Outsourcing", method: "OTM" },
    { id: "PPS3", label: "PPS3 - Physical Services", method: "OTM" },
    { id: "PPS6", label: "PPS6 - Direct Procurement (Services)", method: "DirectProcurement" },
  ],
  non_government: [
    { id: "NRQ1", label: "NRQ1 - Simple RFQ (up to BDT 20 Lac)", method: "RFQ" },
    { id: "NRQ2", label: "NRQ2 - Detailed RFQ (up to BDT 30 Lac)", method: "RFQ" },
    { id: "NRQ3", label: "NRQ3 - Request for Proposal (RFP)", method: "RFQ" },
  ],
};

// Section icon mapping
function getSectionIcon(sectionId: string) {
  const iconMap: Record<string, any> = {
    basic_information: FileText,
    procuring_entity: Building2,
    tender_schedule: Calendar,
    lot_configuration: Boxes,
    eligibility: Shield,
    qualification: ClipboardCheck,
    technical_specification: Settings,
    boq: Package,
    financial_security: DollarSign,
    evaluation: Star,
    contract_terms: FileText,
    delivery: Truck,
    compliance: Shield,
    attachments: Upload,
    audit_metadata: Activity,
  };
  return iconMap[sectionId] || FileText;
}

// Count fields in a section (including subform fields)
function countSectionFields(section: MasterSection): number {
  let count = section.fields?.length || 0;
  if (section.subforms) {
    for (const sub of section.subforms) {
      count += sub.fields?.length || 0;
    }
  }
  return count;
}

// Get the creation route for a given tender type
function getCreateRoute(tenderType: string): string {
  if (tenderType.startsWith("PG") || tenderType.startsWith("PW") || tenderType.startsWith("PPS")) return "/tenders/new";
  if (tenderType === "NRQ1") return "/tenders/new/simple";
  if (tenderType === "NRQ2") return "/tenders/new/detailed";
  if (tenderType === "NRQ3") return "/tenders/new/rfp";
  return "/tenders/new/rfp";
}

// Determine which sections are recommended for a tender type based on rules
function getRecommendedSections(tenderType: string): { enabled: string[]; disabled: string[] } {
  const config = TENDER_TYPE_CONFIGS[tenderType];
  const enabled: string[] = [];
  const disabled: string[] = [];

  // Base required sections for all
  const alwaysOn = ["basic_information", "procuring_entity", "tender_schedule", "audit_metadata"];
  enabled.push(...alwaysOn);

  if (config) {
    // Goods always get BOQ
    if (config.procurement_category === "goods") {
      enabled.push("boq", "technical_specification", "delivery");
    }
    // Works get BOQ + technical + delivery
    if (config.procurement_category === "works") {
      enabled.push("boq", "technical_specification", "delivery", "compliance");
    }
    // Services get technical spec
    if (config.procurement_category === "services") {
      enabled.push("technical_specification");
    }
    // If tender security needed
    if (config.tender_security || config.performance_security) {
      enabled.push("financial_security");
    }
    // Always evaluation
    enabled.push("evaluation");
    // Contract terms for formal tenders
    if (config.method !== "RFQ") {
      enabled.push("contract_terms", "eligibility", "qualification", "compliance", "lot_configuration");
    }
    // Attachments always useful
    enabled.push("attachments");

    // Simple RFQs disable heavy sections
    if (config.method === "RFQ" || config.method === "DirectProcurement") {
      disabled.push("lot_configuration", "eligibility", "qualification");
      if (!config.tender_security) disabled.push("financial_security");
    }
  }

  // Deduplicate
  const enabledSet = new Set(enabled);
  const disabledSet = new Set(disabled);
  // Remove disabled from enabled
  for (const d of disabledSet) enabledSet.delete(d);

  return {
    enabled: [...enabledSet],
    disabled: [...disabledSet],
  };
}

// ============================================================
// Community Templates (mock data)
// ============================================================
const COMMUNITY_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "IT Equipment Procurement RFQ",
    description: "Comprehensive template for procuring IT hardware, software, and networking equipment with detailed technical specifications and SLA requirements.",
    createdBy: "Md. Rafiq Ahmed",
    organisation: "Ministry of ICT",
    category: "goods",
    tenderType: "NRQ2",
    segments: 11,
    usageCount: 87,
    rating: 4.8,
    isPublic: true,
    createdAt: "2026-01-15",
    tags: ["IT", "Hardware", "Software"],
  },
  {
    id: "t2",
    name: "Office Furniture Supply RFQ",
    description: "Standard RFQ template for office furniture procurement including desks, chairs, cabinets with quality specs.",
    createdBy: "Fatema Begum",
    organisation: "BRAC NGO",
    category: "goods",
    tenderType: "NRQ1",
    segments: 8,
    usageCount: 124,
    rating: 4.5,
    isPublic: true,
    createdAt: "2025-11-20",
    tags: ["Furniture", "Office", "Supply"],
  },
  {
    id: "t3",
    name: "Building Construction Tender",
    description: "Full government tender template for building construction works including BOQ, technical specs, environmental compliance.",
    createdBy: "Engr. Kamal Hossain",
    organisation: "PWD Dhaka",
    category: "works",
    tenderType: "PW3",
    segments: 14,
    usageCount: 56,
    rating: 4.9,
    isPublic: true,
    createdAt: "2026-02-05",
    tags: ["Construction", "Building", "Civil Works"],
  },
  {
    id: "t4",
    name: "Security Guard Service Outsourcing",
    description: "Template for outsourcing security personnel services with manpower requirements, shift schedules, and compliance.",
    createdBy: "A.K. Siddique",
    organisation: "Bangladesh Bank",
    category: "services",
    tenderType: "PPS2",
    segments: 12,
    usageCount: 42,
    rating: 4.3,
    isPublic: true,
    createdAt: "2026-01-28",
    tags: ["Security", "Outsourcing", "Personnel"],
  },
  {
    id: "t5",
    name: "Medical Equipment Supply",
    description: "Specialized template for medical devices and hospital equipment with stringent quality standards and warranty requirements.",
    createdBy: "Dr. Nasreen Akter",
    organisation: "DGHS",
    category: "goods",
    tenderType: "PG3",
    segments: 14,
    usageCount: 38,
    rating: 4.7,
    isPublic: true,
    createdAt: "2025-12-10",
    tags: ["Medical", "Hospital", "Equipment"],
  },
  {
    id: "t6",
    name: "Consulting Services Feasibility Study",
    description: "Template for hiring consulting firms for feasibility studies including TOR, qualification criteria, and QCBS methodology.",
    createdBy: "Tahmid Rahman",
    organisation: "Planning Commission",
    category: "consultancy",
    tenderType: "NRQ3",
    segments: 10,
    usageCount: 29,
    rating: 4.6,
    isPublic: true,
    createdAt: "2026-02-20",
    tags: ["Consulting", "Feasibility", "Study"],
  },
];

const MY_TEMPLATES: Template[] = [
  {
    id: "my1",
    name: "Annual Stationery Procurement",
    description: "Your custom template for recurring annual stationery and office supplies procurement.",
    createdBy: "You",
    organisation: "Your Organization",
    category: "goods",
    tenderType: "NRQ1",
    segments: 8,
    usageCount: 5,
    rating: 0,
    isPublic: false,
    createdAt: "2026-03-01",
    tags: ["Stationery", "Office Supplies", "Recurring"],
  },
  {
    id: "my2",
    name: "Cleaning Services RFQ",
    description: "Custom template for hiring cleaning service providers with detailed scope and SLA requirements.",
    createdBy: "You",
    organisation: "Your Organization",
    category: "services",
    tenderType: "NRQ2",
    segments: 9,
    usageCount: 3,
    rating: 0,
    isPublic: true,
    createdAt: "2026-02-15",
    tags: ["Cleaning", "Services", "Outsourcing"],
  },
];

// ============================================================
// Category/Classification colors
// ============================================================
function getCategoryColor(category: string) {
  switch (category) {
    case "goods": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "works": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "services": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "consultancy": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default: return "bg-muted text-muted-foreground";
  }
}

function getClassificationBadge(tenderType: string) {
  const isGovt = tenderType.startsWith("PG") || tenderType.startsWith("PW") || tenderType.startsWith("PPS");
  return isGovt
    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    : "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function TenderBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <PageTemplate
      title="Create New Tender"
      description="Choose how you want to create your tender - use an existing template or build from a preset configuration"
      actions={
        <Button variant="outline" onClick={() => navigate("/tenders")}>
          Back to Tenders
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-8">
          <TabsTrigger value="templates" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base py-2 sm:py-3">
            <Bookmark className="size-4 sm:size-5" />
            <span className="truncate">From Template</span>
          </TabsTrigger>
          <TabsTrigger value="presets" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base py-2 sm:py-3">
            <Layers className="size-4 sm:size-5" />
            <span className="truncate">Build from Preset</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="presets">
          <PresetsTab />
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
}

// ============================================================
// TAB 1: FROM TEMPLATE
// ============================================================
function TemplatesTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCommunity = COMMUNITY_TEMPLATES.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || t.category === filter;
    return matchSearch && matchFilter;
  });

  const handleUseTemplate = (template: Template) => {
    navigate(getCreateRoute(template.tenderType));
  };

  return (
    <div className="space-y-8">
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
        <Bookmark className="size-5 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-900 dark:text-blue-200">
          Templates are pre-configured tender forms created by you or the community. Pick one and start filling in your tender details immediately.
        </AlertDescription>
      </Alert>

      {/* My Templates */}
      <section>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Star className="size-5 text-yellow-500" />
          My Templates
          <Badge variant="outline">{MY_TEMPLATES.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {MY_TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} onUse={handleUseTemplate} isMine />
          ))}
        </div>
      </section>

      <Separator />

      {/* Community Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="size-5 text-blue-600 dark:text-blue-400" />
            Community Templates
            <Badge variant="outline">{filteredCommunity.length}</Badge>
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="w-full sm:w-48 border rounded-lg px-3 py-2 bg-background border-border text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="goods">Goods</option>
            <option value="works">Works</option>
            <option value="services">Services</option>
            <option value="consultancy">Consultancy</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCommunity.map((t) => (
            <TemplateCard key={t.id} template={t} onUse={handleUseTemplate} />
          ))}
          {filteredCommunity.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No templates match your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
  isMine,
}: {
  template: Template;
  onUse: (t: Template) => void;
  isMine?: boolean;
}) {
  const isGovt = !template.tenderType.startsWith("NRQ");
  return (
    <Card className={`hover:shadow-md transition-shadow ${isMine ? "border-l-4 border-l-yellow-400" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold line-clamp-1">{template.name}</h4>
          {isMine && template.isPublic && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ml-2 shrink-0 text-[10px]">
              <Globe className="size-3 mr-1" /> Public
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
          <Badge className={getClassificationBadge(template.tenderType)}>
            {isGovt ? "Govt" : "Non-Govt"}
          </Badge>
          <Badge variant="outline">{template.tenderType}</Badge>
          <Badge variant="outline">{template.segments} sections</Badge>
        </div>

        {!isMine && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="size-3" />
              {template.organisation}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Star className="size-3 text-yellow-500 fill-yellow-500" />
              {template.rating}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="size-3" />
              {template.usageCount}
            </span>
          </div>
        )}

        {isMine && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="size-3" />
            Created {template.createdAt}
            <span className="mx-1">|</span>
            <Copy className="size-3" />
            Used {template.usageCount} times
          </div>
        )}

        <Button size="sm" className="w-full" onClick={() => onUse(template)}>
          <ArrowRight className="size-3 mr-1" />
          Use This Template
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================
// TAB 2: BUILD FROM PRESET
// ============================================================
function PresetsTab() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [enabledSections, setEnabledSections] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // Track disabled fields per section: key = "sectionId::fieldId" or "sectionId::subformId::fieldId"
  const [disabledFields, setDisabledFields] = useState<Set<string>>(new Set());
  // Save preset
  const [presetName, setPresetName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { presets: savedPresets, savePreset, deletePreset } = useSavedPresets();

  // When a tender type is selected, auto-configure sections based on rules
  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    const recommended = getRecommendedSections(typeId);
    setEnabledSections(new Set(recommended.enabled));
    setExpandedSection(null);
    setDisabledFields(new Set()); // Reset field selections
  };

  const toggleSection = (sectionId: string) => {
    const next = new Set(enabledSections);
    if (next.has(sectionId)) {
      next.delete(sectionId);
    } else {
      next.add(sectionId);
    }
    setEnabledSections(next);
  };

  const toggleField = (fieldKey: string) => {
    const next = new Set(disabledFields);
    if (next.has(fieldKey)) {
      next.delete(fieldKey);
    } else {
      next.add(fieldKey);
    }
    setDisabledFields(next);
  };

  // Get all field keys for a section
  const getAllFieldKeys = (section: MasterSection): string[] => {
    const keys: string[] = [];
    section.fields?.forEach((f: any) => keys.push(`${section.id}::${f.id}`));
    section.subforms?.forEach((sub: any) => {
      sub.fields?.forEach((f: any) => keys.push(`${section.id}::${sub.id}::${f.id}`));
    });
    return keys;
  };

  // Get all field keys for a subform
  const getSubformFieldKeys = (sectionId: string, sub: any): string[] => {
    return (sub.fields || []).map((f: any) => `${sectionId}::${sub.id}::${f.id}`);
  };

  const selectAllFieldsInSection = (section: MasterSection) => {
    const next = new Set(disabledFields);
    getAllFieldKeys(section).forEach((k) => next.delete(k));
    setDisabledFields(next);
  };

  const deselectAllFieldsInSection = (section: MasterSection) => {
    const next = new Set(disabledFields);
    // Only allow deselecting non-required fields; deselect all for simplicity, user can re-enable required ones
    getAllFieldKeys(section).forEach((k) => next.add(k));
    setDisabledFields(next);
  };

  const selectAllSubformFields = (sectionId: string, sub: any) => {
    const next = new Set(disabledFields);
    getSubformFieldKeys(sectionId, sub).forEach((k) => next.delete(k));
    setDisabledFields(next);
  };

  const deselectAllSubformFields = (sectionId: string, sub: any) => {
    const next = new Set(disabledFields);
    getSubformFieldKeys(sectionId, sub).forEach((k) => next.add(k));
    setDisabledFields(next);
  };

  // Count enabled fields in a section
  const countEnabledFields = (section: MasterSection): number => {
    const allKeys = getAllFieldKeys(section);
    return allKeys.filter((k) => !disabledFields.has(k)).length;
  };

  const config = selectedType ? TENDER_TYPE_CONFIGS[selectedType] : null;

  const totalFields = useMemo(() => {
    return SECTIONS.filter((s) => enabledSections.has(s.id)).reduce((sum, s) => {
      const allKeys = getAllFieldKeys(s);
      return sum + allKeys.filter((k) => !disabledFields.has(k)).length;
    }, 0);
  }, [enabledSections, disabledFields]);

  const handleCreateTender = () => {
    if (!selectedType) return;
    navigate(getCreateRoute(selectedType));
  };

  const handleSavePreset = () => {
    if (!selectedType || !presetName) return;
    savePreset({
      name: presetName,
      tenderType: selectedType,
      enabledSections: Array.from(enabledSections),
      disabledFields: Array.from(disabledFields),
      sectionCount: enabledSections.size,
      fieldCount: totalFields,
    });
    setPresetName("");
    setShowSaveInput(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700">
        <Layers className="size-5 text-purple-600 dark:text-purple-400" />
        <AlertDescription className="text-purple-900 dark:text-purple-200">
          Build a custom tender form by selecting a tender type and choosing which sections to include.
          Sections are auto-configured from the <strong>Master Tender Template</strong> ({SECTIONS.length} sections, {masterTenderData.master_tender_template.metadata.field_count} fields).
        </AlertDescription>
      </Alert>

      {/* Step 1: Select Tender Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
            Select Tender Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Government - Goods */}
          <div>
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
              <Building2 className="size-4" /> Government - Goods
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TENDER_TYPES.government_goods.map((t) => (
                <TenderTypeButton key={t.id} type={t} selected={selectedType === t.id} onSelect={handleSelectType} />
              ))}
            </div>
          </div>
          {/* Government - Works */}
          <div>
            <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1.5">
              <Building2 className="size-4" /> Government - Works
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TENDER_TYPES.government_works.map((t) => (
                <TenderTypeButton key={t.id} type={t} selected={selectedType === t.id} onSelect={handleSelectType} />
              ))}
            </div>
          </div>
          {/* Government - Services */}
          <div>
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
              <Building2 className="size-4" /> Government - Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TENDER_TYPES.government_services.map((t) => (
                <TenderTypeButton key={t.id} type={t} selected={selectedType === t.id} onSelect={handleSelectType} />
              ))}
            </div>
          </div>
          {/* Non-Government */}
          <div>
            <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-1.5">
              <Building2 className="size-4" /> Non-Government / Private
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TENDER_TYPES.non_government.map((t) => (
                <TenderTypeButton key={t.id} type={t} selected={selectedType === t.id} onSelect={handleSelectType} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Tender Type Config Summary (only show when selected) */}
      {selectedType && config && (
        <Card className="border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
              Configuration for {selectedType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoChip label="Category" value={config.procurement_category} />
              <InfoChip label="Method" value={config.method || "N/A"} />
              <InfoChip label="Tender Security" value={config.tender_security ? "Required" : "Not Required"} highlight={config.tender_security} />
              <InfoChip label="Performance Security" value={config.performance_security ? "Required" : "Not Required"} highlight={config.performance_security} />
              {config.max_value && <InfoChip label="Max Value" value={`BDT ${(config.max_value / 100000).toFixed(0)} Lac`} />}
              {config.min_value && <InfoChip label="Min Value" value={`BDT ${(config.min_value / 100000).toFixed(0)} Lac`} />}
              {config.submission_days_min && <InfoChip label="Submission Days" value={`${config.submission_days_min}-${config.submission_days_max} days`} />}
              {config.validity_days && <InfoChip label="Validity" value={`${config.validity_days} days`} />}
              {config.evaluation_method && <InfoChip label="Evaluation" value={config.evaluation_method.replace(/_/g, " ")} />}
              <InfoChip label="Newspaper Ad" value={config.newspaper_ad ? "Required" : "Not Required"} highlight={config.newspaper_ad} />
            </div>

            {/* Rules applied */}
            {(() => {
              const applicableRules = RULES_ENGINE.filter((rule: any) => {
                if (rule.if.tender_document_type === selectedType) return true;
                if (rule.if.procurement_method === config.method) return true;
                if (rule.if.procurement_category === config.procurement_category) return true;
                if (rule.if.or) {
                  return rule.if.or.some((cond: any) => cond.tender_document_type === selectedType);
                }
                return false;
              });
              if (applicableRules.length === 0) return null;
              return (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1">
                    <Zap className="size-3" /> Rules Auto-Applied ({applicableRules.length})
                  </p>
                  <div className="space-y-1">
                    {applicableRules.map((rule: any) => (
                      <p key={rule.rule_id} className="text-xs text-amber-700 dark:text-amber-400">
                        {rule.description}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Sections */}
      {selectedType && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">3</span>
                Select Sections
                <Badge variant="outline" className="ml-2">
                  {enabledSections.size} / {SECTIONS.length} enabled
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEnabledSections(new Set(SECTIONS.map((s) => s.id)))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const recommended = getRecommendedSections(selectedType);
                    setEnabledSections(new Set(recommended.enabled));
                  }}
                >
                  Reset to Recommended
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECTIONS.map((section) => {
              const Icon = getSectionIcon(section.id);
              const fieldCount = countSectionFields(section);
              const isEnabled = enabledSections.has(section.id);
              const isExpanded = expandedSection === section.id;

              return (
                <div
                  key={section.id}
                  className={`border rounded-lg transition-all ${
                    isEnabled
                      ? "border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/10"
                      : "border-border bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isEnabled ? "bg-blue-100 dark:bg-blue-800/40" : "bg-muted"
                    }`}>
                      <Icon className={`size-4 ${isEnabled ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{section.label}</span>
                        <Badge variant="outline" className="text-[10px]">{countEnabledFields(section)} / {fieldCount} fields</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-3 border-t border-border pt-3">
                      {/* Section field controls */}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">
                          Click on any field to toggle it on/off. Required fields are marked with <span className="text-red-500">*</span>
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => selectAllFieldsInSection(section)}
                            className="text-[10px] px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => deselectAllFieldsInSection(section)}
                            className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {section.fields?.map((field: any) => (
                          <FieldChip key={field.id} field={field} disabled={disabledFields.has(`${section.id}::${field.id}`)} onToggle={() => toggleField(`${section.id}::${field.id}`)} />
                        ))}
                        {section.subforms?.map((sub: any) => {
                          const subKeys = getSubformFieldKeys(section.id, sub);
                          const subEnabled = subKeys.filter((k) => !disabledFields.has(k)).length;
                          return (
                            <div key={sub.id} className="col-span-full">
                              <div className="flex items-center justify-between mt-3 mb-1.5">
                                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                  {sub.id.replace(/_/g, " ")} ({sub.type})
                                  <Badge variant="outline" className="text-[9px] py-0">{subEnabled}/{sub.fields?.length || 0}</Badge>
                                </p>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => selectAllSubformFields(section.id, sub)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40 transition-colors"
                                  >
                                    All
                                  </button>
                                  <button
                                    onClick={() => deselectAllSubformFields(section.id, sub)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                                  >
                                    None
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {sub.fields?.map((field: any) => (
                                  <FieldChip key={field.id} field={field} disabled={disabledFields.has(`${section.id}::${sub.id}::${field.id}`)} onToggle={() => toggleField(`${section.id}::${sub.id}::${field.id}`)} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Create */}
      {selectedType && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="size-5" />
                  Ready to Create Tender
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Type: <strong>{selectedType}</strong> | {enabledSections.size} sections | ~{totalFields} fields
                </p>
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCreateTender}
              >
                <ArrowRight className="size-5 mr-2" />
                Create Tender
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Save Preset */}
      {selectedType && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Save className="size-5" />
                  Save This Configuration
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Type: <strong>{selectedType}</strong> | {enabledSections.size} sections | ~{totalFields} fields
                </p>
              </div>
              <div className="flex gap-2">
                {showSaveInput ? (
                  <>
                    <Input
                      placeholder="Preset Name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-40"
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleSavePreset}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowSaveInput(true)}
                  >
                    Save Preset
                  </Button>
                )}
                {saveSuccess && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Saved!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Presets */}
      {savedPresets.length > 0 && (
        <Card className="bg-gradient-to-r from-muted to-muted/80 border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Layers className="size-5" />
                Saved Presets
              </h4>
            </div>
            <div className="space-y-2 mt-3">
              {savedPresets.map((preset) => (
                <div key={preset.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-muted text-muted-foreground">
                      {preset.name}
                    </Badge>
                    <Badge className="bg-muted text-muted-foreground">
                      {preset.tenderType}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setSelectedType(preset.tenderType);
                        setEnabledSections(new Set(preset.enabledSections));
                        setDisabledFields(new Set(preset.disabledFields));
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================
function TenderTypeButton({
  type,
  selected,
  onSelect,
}: {
  type: { id: string; label: string; method: string };
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
        selected
          ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-500"
          : "border-border hover:border-border/80 hover:bg-muted"
      }`}
    >
      <div className="font-medium">{type.id}</div>
      <div className="text-xs text-muted-foreground mt-0.5">
        {type.label.split(" - ")[1] || type.label}
      </div>
    </button>
  );
}

function InfoChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2 rounded-lg border text-center ${
      highlight
        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
        : "bg-muted border-border"
    }`}>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-xs font-medium mt-0.5 capitalize">{value}</div>
    </div>
  );
}

function FieldChip({ field, disabled, onToggle }: { field: any; disabled: boolean; onToggle: () => void }) {
  const typeColors: Record<string, string> = {
    text: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    textarea: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    select: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
    multiselect: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
    number: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
    currency: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700",
    date: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700",
    datetime: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700",
    boolean: "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-700",
    email: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    phone: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    url: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
  };
  const activeColor = typeColors[field.type] || "bg-muted border-border";
  const isEnabled = !disabled;

  return (
    <button
      onClick={onToggle}
      className={`relative text-left px-2.5 py-2 rounded-lg border text-xs transition-all cursor-pointer group ${
        isEnabled
          ? `${activeColor} hover:shadow-sm`
          : "bg-muted border-border opacity-50"
      }`}
    >
      {/* Checkbox indicator */}
      <div className={`absolute top-1.5 right-1.5 w-4 h-4 rounded flex items-center justify-center transition-all ${
        isEnabled
          ? "bg-blue-600 dark:bg-blue-500"
          : "border border-border bg-background"
      }`}>
        {isEnabled && <Check className="size-3 text-white" />}
      </div>
      <div className={`font-medium pr-5 ${isEnabled ? "" : "text-muted-foreground line-through"}`}>
        {field.id.replace(/_/g, " ")}
      </div>
      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
        <span>{field.type}</span>
        {field.required && <span className="text-red-500">*</span>}
      </div>
    </button>
  );
}