import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import {
  Save,
  Send,
  Eye,
  FileText,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Receipt,
  Award,
  Briefcase,
  Settings,
  Shield,
  Leaf,
  Factory,
  Store,
  Handshake,
  Globe,
  Tags,
  Scale,
  Umbrella,
  Monitor,
  Heart,
  Upload,
  ClipboardCheck,
  Activity,
  ChevronDown,
  ChevronUp,
  Check,
  Layers,
  CheckCircle,
} from "lucide-react";
import masterEnlistmentData from "../../../imports/Master_JSON_Enlisment.json";

// ============================================================
// Types
// ============================================================
interface EnlistmentSection {
  id: string;
  label: string;
  selectable: boolean;
  default_selected?: boolean;
  fields?: any[];
  subforms?: any[];
}

// ============================================================
// Extract from Master JSON
// ============================================================
const SECTIONS: EnlistmentSection[] =
  masterEnlistmentData.master_vendor_enlistment_template.section_library;
const METADATA = masterEnlistmentData.master_vendor_enlistment_template.metadata;

// Section icon mapping
const SECTION_ICONS: Record<string, any> = {
  enlistment_basic_info: FileText,
  company_profile: Building2,
  business_addresses: MapPin,
  ownership_structure: Users,
  key_personnel: Users,
  financial_capacity: DollarSign,
  tax_compliance: Receipt,
  trade_license: Award,
  experience_track_record: Briefcase,
  technical_capability: Settings,
  quality_assurance: Shield,
  safety_environment: Leaf,
  manufacturer_specific: Factory,
  dealer_distributor: Store,
  jv_consortium: Handshake,
  foreign_vendor: Globe,
  category_specialization: Tags,
  legal_compliance: Scale,
  insurance_coverage: Umbrella,
  digital_presence: Monitor,
  csr_sustainability: Heart,
  supporting_documents: Upload,
  enlistment_assessment: ClipboardCheck,
  audit_trail: Activity,
};

// Count fields in a section (including subform fields)
function countSectionFields(section: EnlistmentSection): number {
  let count = section.fields?.length || 0;
  if (section.subforms) {
    for (const sub of section.subforms) {
      count += sub.fields?.length || 0;
    }
  }
  return count;
}

// Enlistment type presets — which sections to enable by default
const ENLISTMENT_PRESETS: Record<
  string,
  { label: string; description: string; sections: string[] }
> = {
  supplier: {
    label: "Supplier / Goods Vendor",
    description:
      "Standard supplier for goods, equipment, raw materials, and consumables",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
  contractor: {
    label: "Contractor / Works Vendor",
    description:
      "Construction, civil works, electrical, mechanical, and infrastructure contractors",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "technical_capability",
      "quality_assurance",
      "safety_environment",
      "insurance_coverage",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
  service_provider: {
    label: "Service Provider",
    description:
      "IT services, consulting, outsourcing, maintenance, and professional services",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "quality_assurance",
      "digital_presence",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
  consultant: {
    label: "Consultant",
    description:
      "Advisory, consultancy, study, audit, and research firms",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "quality_assurance",
      "insurance_coverage",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
  manufacturer: {
    label: "Manufacturer",
    description:
      "Product manufacturers with own production facilities",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "technical_capability",
      "quality_assurance",
      "safety_environment",
      "manufacturer_specific",
      "category_specialization",
      "legal_compliance",
      "insurance_coverage",
      "supporting_documents",
    ],
  },
  dealer: {
    label: "Dealer / Distributor",
    description:
      "Authorized dealers, distributors, and agents representing manufacturers",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "dealer_distributor",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
  joint_venture: {
    label: "Joint Venture / Consortium",
    description:
      "JV or consortium entity formed for specific procurement purposes",
    sections: [
      "enlistment_basic_info",
      "company_profile",
      "business_addresses",
      "ownership_structure",
      "key_personnel",
      "financial_capacity",
      "tax_compliance",
      "trade_license",
      "experience_track_record",
      "jv_consortium",
      "category_specialization",
      "legal_compliance",
      "supporting_documents",
    ],
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export function EnlistmentFormBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Enlistment Form Builder"
        description={`Build vendor enlistment forms from the Master Template \u2014 ${SECTIONS.length} sections, ${METADATA.field_count} fields available`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/vendors")}>
              Back to Vendors
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger
            value="builder"
            className="flex items-center gap-2 text-base py-3"
          >
            <Layers className="size-5" />
            Build from Master Template
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="flex items-center gap-2 text-base py-3"
          >
            <Eye className="size-5" />
            Preview Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <BuilderTab />
        </TabsContent>

        <TabsContent value="preview">
          <PreviewTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// BUILDER TAB
// ============================================================
function BuilderTab() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [enabledSections, setEnabledSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [disabledFields, setDisabledFields] = useState<Set<string>>(
    new Set()
  );
  const [formName, setFormName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const step2Ref = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = ENLISTMENT_PRESETS[presetId];
    if (preset) {
      setEnabledSections(new Set(preset.sections));
      setFormName(`${preset.label} Enlistment Form`);
    }
    setExpandedSection(null);
    setDisabledFields(new Set());
    // Auto-scroll to step 2 after a tick so DOM has updated
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const toggleSection = (sectionId: string) => {
    const next = new Set(enabledSections);
    if (next.has(sectionId)) next.delete(sectionId);
    else next.add(sectionId);
    setEnabledSections(next);
  };

  const toggleField = (fieldKey: string) => {
    const next = new Set(disabledFields);
    if (next.has(fieldKey)) next.delete(fieldKey);
    else next.add(fieldKey);
    setDisabledFields(next);
  };

  // Get all field keys for a section
  const getAllFieldKeys = (section: EnlistmentSection): string[] => {
    const keys: string[] = [];
    section.fields?.forEach((f: any) => keys.push(`${section.id}::${f.id}`));
    section.subforms?.forEach((sub: any) => {
      sub.fields?.forEach((f: any) =>
        keys.push(`${section.id}::${sub.id}::${f.id}`)
      );
    });
    return keys;
  };

  const getSubformFieldKeys = (sectionId: string, sub: any): string[] => {
    return (sub.fields || []).map(
      (f: any) => `${sectionId}::${sub.id}::${f.id}`
    );
  };

  const selectAllFieldsInSection = (section: EnlistmentSection) => {
    const next = new Set(disabledFields);
    getAllFieldKeys(section).forEach((k) => next.delete(k));
    setDisabledFields(next);
  };

  const deselectAllFieldsInSection = (section: EnlistmentSection) => {
    const next = new Set(disabledFields);
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

  const countEnabledFields = (section: EnlistmentSection): number => {
    const allKeys = getAllFieldKeys(section);
    return allKeys.filter((k) => !disabledFields.has(k)).length;
  };

  const totalFields = useMemo(() => {
    return SECTIONS.filter((s) => enabledSections.has(s.id)).reduce(
      (sum, s) => {
        const allKeys = getAllFieldKeys(s);
        return sum + allKeys.filter((k) => !disabledFields.has(k)).length;
      },
      0
    );
  }, [enabledSections, disabledFields]);

  const handleSaveForm = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublish = () => {
    alert(
      `Enlistment form "${formName}" published with ${enabledSections.size} sections and ~${totalFields} fields!`
    );
    navigate("/vendor-enlistment");
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-700">
        <Layers className="size-5 text-emerald-600 dark:text-emerald-400" />
        <AlertDescription className="text-emerald-900 dark:text-emerald-200">
          Build a vendor enlistment form by selecting a vendor type preset and
          customizing which sections and fields to include. Source:{" "}
          <strong>Master Vendor Enlistment Template</strong> ({SECTIONS.length}{" "}
          sections, {METADATA.field_count} fields). Supports:{" "}
          {METADATA.enlistment_types.join(", ").replace(/_/g, " ")}.
        </AlertDescription>
      </Alert>

      {/* Step 1: Select Vendor Type Preset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
              1
            </span>
            Select Vendor Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.entries(ENLISTMENT_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedPreset === key
                    ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-500"
                    : "border-border hover:border-foreground/30 hover:bg-muted"
                }`}
              >
                <div className="font-medium text-sm">
                  {preset.label}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {preset.description}
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px]">
                    {preset.sections.length} sections
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Form Name */}
      {selectedPreset && (
        <div ref={step2Ref}>
          <Card className="border-emerald-200 dark:border-emerald-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
                  2
                </span>
                Form Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Form Name
                  </label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter enlistment form name"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <InfoChip
                    label="Sections"
                    value={`${enabledSections.size} / ${SECTIONS.length}`}
                  />
                  <InfoChip label="Fields" value={`~${totalFields}`} />
                  <InfoChip
                    label="Vendor Type"
                    value={selectedPreset.replace(/_/g, " ")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Toggle Sections & Fields */}
      {selectedPreset && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
                  3
                </span>
                Select Sections & Fields
                <Badge variant="outline" className="ml-2">
                  {enabledSections.size} / {SECTIONS.length} enabled
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEnabledSections(new Set(SECTIONS.map((s) => s.id)))
                  }
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedPreset) {
                      const preset = ENLISTMENT_PRESETS[selectedPreset];
                      setEnabledSections(new Set(preset.sections));
                      setDisabledFields(new Set());
                    }
                  }}
                >
                  Reset to Preset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section.id] || FileText;
              const fieldCount = countSectionFields(section);
              const isEnabled = enabledSections.has(section.id);
              const isExpanded = expandedSection === section.id;

              return (
                <div
                  key={section.id}
                  className={`border rounded-lg transition-all ${
                    isEnabled
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/10"
                      : "border-border bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isEnabled
                          ? "bg-emerald-100 dark:bg-emerald-800/40"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`size-4 ${
                          isEnabled
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {section.label}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {countEnabledFields(section)} / {fieldCount} fields
                        </Badge>
                        {section.default_selected && (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-[9px]">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedSection(isExpanded ? null : section.id)
                      }
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-3 border-t border-border pt-3">
                      {/* Section field controls */}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">
                          Click on any field to toggle it on/off. Required fields
                          are marked with{" "}
                          <span className="text-red-500">*</span>
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => selectAllFieldsInSection(section)}
                            className="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/40 transition-colors"
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

                      {/* Direct fields */}
                      {section.fields && section.fields.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                          {section.fields.map((field: any) => (
                            <FieldChip
                              key={field.id}
                              field={field}
                              disabled={disabledFields.has(
                                `${section.id}::${field.id}`
                              )}
                              onToggle={() =>
                                toggleField(`${section.id}::${field.id}`)
                              }
                            />
                          ))}
                        </div>
                      )}

                      {/* Subforms */}
                      {section.subforms?.map((sub: any) => {
                        const subKeys = getSubformFieldKeys(section.id, sub);
                        const subEnabled = subKeys.filter(
                          (k) => !disabledFields.has(k)
                        ).length;
                        return (
                          <div key={sub.id}>
                            <div className="flex items-center justify-between mt-3 mb-1.5">
                              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                {sub.label || sub.id.replace(/_/g, " ")} (
                                {sub.type})
                                <Badge
                                  variant="outline"
                                  className="text-[9px] py-0"
                                >
                                  {subEnabled}/{sub.fields?.length || 0}
                                </Badge>
                              </p>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() =>
                                    selectAllSubformFields(section.id, sub)
                                  }
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/40 transition-colors"
                                >
                                  All
                                </button>
                                <button
                                  onClick={() =>
                                    deselectAllSubformFields(section.id, sub)
                                  }
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                                >
                                  None
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {sub.fields?.map((field: any) => (
                                <FieldChip
                                  key={field.id}
                                  field={field}
                                  disabled={disabledFields.has(
                                    `${section.id}::${sub.id}::${field.id}`
                                  )}
                                  onToggle={() =>
                                    toggleField(
                                      `${section.id}::${sub.id}::${field.id}`
                                    )
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Ready */}
      {selectedPreset && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="size-5" />
                  Ready to Publish Enlistment Form
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  <strong>{formName || "Untitled Form"}</strong> |{" "}
                  {enabledSections.size} sections | ~{totalFields} fields
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveForm}>
                  <Save className="size-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePublish}
                >
                  <Send className="size-4 mr-2" />
                  Publish Form
                </Button>
                {saveSuccess && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 self-center">
                    Saved!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// PREVIEW TAB
// ============================================================
function PreviewTab() {
  return (
    <div className="space-y-6">
      <Alert>
        <Eye className="size-4" />
        <AlertDescription>
          This is a preview of how the full Master Enlistment Template looks.
          The actual published form will only show sections you've enabled in the
          Builder tab.
        </AlertDescription>
      </Alert>

      {SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.id] || FileText;
        const fieldCount = countSectionFields(section);

        return (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">{section.label}</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {fieldCount} fields
                    {section.subforms
                      ? ` + ${section.subforms.length} repeatable section(s)`
                      : ""}
                  </p>
                </div>
                {section.default_selected && (
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-[9px] ml-auto">
                    Default
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Direct fields */}
              {section.fields && section.fields.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                  {section.fields.map((field: any) => (
                    <div
                      key={field.id}
                      className="px-2.5 py-2 rounded-lg border bg-muted border-border text-xs"
                    >
                      <div className="font-medium">
                        {(field.label || field.id).replace(/_/g, " ")}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                        <span>{field.type}</span>
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subforms */}
              {section.subforms?.map((sub: any) => (
                <div key={sub.id} className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    {sub.label || sub.id.replace(/_/g, " ")} ({sub.type})
                    <Badge variant="outline" className="text-[9px] py-0">
                      {sub.fields?.length || 0} fields
                    </Badge>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {sub.fields?.map((field: any) => (
                      <div
                        key={field.id}
                        className="px-2.5 py-2 rounded-lg border bg-muted border-border text-xs"
                      >
                        <div className="font-medium">
                          {(field.label || field.id).replace(/_/g, " ")}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                          <span>{field.type}</span>
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================
function InfoChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-2 rounded-lg border bg-muted border-border text-center">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xs font-medium mt-0.5 capitalize">
        {value}
      </div>
    </div>
  );
}

function FieldChip({
  field,
  disabled,
  onToggle,
}: {
  field: any;
  disabled: boolean;
  onToggle: () => void;
}) {
  const typeColors: Record<string, string> = {
    text: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    textarea:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    select:
      "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
    multiselect:
      "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
    number:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
    currency:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700",
    calculated:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700",
    date: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700",
    datetime:
      "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700",
    boolean:
      "bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-700",
    email:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    phone:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    url: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    file: "bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-700",
    auto_generated:
      "bg-muted border-border",
  };
  const activeColor =
    typeColors[field.type] ||
    "bg-muted border-border";
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
      <div
        className={`absolute top-1.5 right-1.5 w-4 h-4 rounded flex items-center justify-center transition-all ${
          isEnabled
            ? "bg-emerald-600 dark:bg-emerald-500"
            : "border border-border bg-background"
        }`}
      >
        {isEnabled && <Check className="size-3 text-white" />}
      </div>
      <div
        className={`font-medium pr-5 ${
          isEnabled
            ? ""
            : "text-muted-foreground"
        }`}
      >
        {(field.label || field.id).replace(/_/g, " ")}
      </div>
      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
        <span>{field.type}</span>
        {field.required && <span className="text-red-500">*</span>}
      </div>
    </button>
  );
}