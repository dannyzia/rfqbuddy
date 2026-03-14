import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Users,
  ArrowRight,
  Shield,
  Settings,
  DollarSign,
  ClipboardCheck,
  UserCheck,
  Crown,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// PRD §7.2 — Six Procurement Process Roles
export interface WorkflowStage {
  id: string;
  role: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  required: boolean; // Some stages are mandatory per tender type
  assignedUserId: string;
  assignedUserName: string;
  canForwardTo: string; // Next role in the chain
  isCustom?: boolean; // For NRQ3 custom stages
}

export interface OrganisationMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
}

// Mock organisation members — in production, fetched from API
const MOCK_ORG_MEMBERS: OrganisationMember[] = [
  { id: "self", name: "Self (You)", email: "you@company.com", designation: "Procuring Officer", department: "Procurement" },
  { id: "u-001", name: "Dr. Rafiq Ahmed", email: "rafiq.ahmed@company.com", designation: "Chief Procurement Officer", department: "Procurement" },
  { id: "u-002", name: "Fatima Begum", email: "fatima.begum@company.com", designation: "Senior Technical Analyst", department: "Engineering" },
  { id: "u-003", name: "Mohammad Hassan", email: "m.hassan@company.com", designation: "Finance Controller", department: "Finance" },
  { id: "u-004", name: "Taslima Akter", email: "taslima.a@company.com", designation: "Compliance Manager", department: "Legal & Compliance" },
  { id: "u-005", name: "Kamal Uddin", email: "kamal.uddin@company.com", designation: "Head of Procurement", department: "Procurement" },
  { id: "u-006", name: "Nusrat Jahan", email: "nusrat.j@company.com", designation: "Deputy Procurement Officer", department: "Procurement" },
  { id: "u-007", name: "Syed Rahman", email: "syed.r@company.com", designation: "Quality Assurance Lead", department: "Quality" },
  { id: "u-008", name: "Anika Sultana", email: "anika.s@company.com", designation: "Commercial Analyst", department: "Finance" },
  { id: "u-009", name: "Imran Chowdhury", email: "imran.c@company.com", designation: "Internal Auditor", department: "Audit" },
  { id: "u-010", name: "Sabrina Nahar", email: "sabrina.n@company.com", designation: "Managing Director", department: "Management" },
];

// Default 6-stage workflow per PRD §7.2
function getDefaultStages(): WorkflowStage[] {
  return [
    {
      id: "prequal_evaluator",
      role: "prequal_evaluator",
      title: "Prequalification Evaluator",
      description: "Reviews vendor eligibility documents, rules on qualification",
      icon: Shield,
      enabled: true,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "tech_evaluator",
    },
    {
      id: "tech_evaluator",
      role: "tech_evaluator",
      title: "Technical Evaluator",
      description: "Scores technical compliance per item and feature",
      icon: Settings,
      enabled: true,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "commercial_evaluator",
    },
    {
      id: "commercial_evaluator",
      role: "commercial_evaluator",
      title: "Commercial / Financial Evaluator",
      description: "Evaluates prices, financial capacity, commercial terms",
      icon: DollarSign,
      enabled: true,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "auditor",
    },
    {
      id: "auditor",
      role: "auditor",
      title: "Auditor / Compliance Reviewer",
      description: "Reviews process integrity, checks all logs and documents",
      icon: ClipboardCheck,
      enabled: true,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "procurement_head",
    },
    {
      id: "recommender",
      role: "recommender",
      title: "Recommender",
      description: "Reviews evaluation results and recommends award decision",
      icon: UserCheck,
      enabled: false,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "procurement_head",
    },
    {
      id: "procurement_head",
      role: "procurement_head",
      title: "Approving Authority / Procurement Head",
      description: "Final authority — approves or rejects the award recommendation",
      icon: Crown,
      enabled: true,
      required: true, // Always required — someone must approve
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "",
    },
  ];
}

// Presets per tender type per PRD §10.3
type TenderTypePreset = "govt-full" | "govt-simple" | "nrq1-simple" | "nrq2-detailed" | "nrq3-custom" | "rfp";

const WORKFLOW_PRESETS: Record<TenderTypePreset, { label: string; description: string; enabledStages: string[] }> = {
  "govt-full": {
    label: "Full Government Workflow (6 Stages)",
    description: "All evaluation & approval stages required per PPA 2006 — Prequalification, Technical, Commercial, Audit, Recommendation, Final Approval",
    enabledStages: ["prequal_evaluator", "tech_evaluator", "commercial_evaluator", "auditor", "recommender", "procurement_head"],
  },
  "govt-simple": {
    label: "Standard Government Workflow (4 Stages)",
    description: "Technical, Commercial, Audit review, then Final Approval — suitable for straightforward procurements",
    enabledStages: ["tech_evaluator", "commercial_evaluator", "auditor", "procurement_head"],
  },
  "nrq1-simple": {
    label: "Simple Approval (2 Stages)",
    description: "Recommendation + Final Approval — suitable for low-value or routine purchases",
    enabledStages: ["recommender", "procurement_head"],
  },
  "nrq2-detailed": {
    label: "Detailed Evaluation (4 Stages)",
    description: "Technical Evaluation, Commercial Evaluation, Audit, then Final Approval",
    enabledStages: ["tech_evaluator", "commercial_evaluator", "auditor", "procurement_head"],
  },
  "nrq3-custom": {
    label: "Custom Workflow",
    description: "Configure your own approval stages — add, remove, or reorder stages as needed",
    enabledStages: ["procurement_head"],
  },
  "rfp": {
    label: "RFP Evaluation Workflow (5 Stages)",
    description: "Technical, Commercial, Audit, Recommendation, then Final Approval",
    enabledStages: ["tech_evaluator", "commercial_evaluator", "auditor", "recommender", "procurement_head"],
  },
};

interface ApprovalWorkflowConfigProps {
  tenderType: TenderTypePreset;
  stages: WorkflowStage[];
  onStagesChange: (stages: WorkflowStage[]) => void;
  allowCustomStages?: boolean; // NRQ3 gets this
  compact?: boolean; // For embedding in multi-segment forms
}

export function ApprovalWorkflowConfig({
  tenderType,
  stages,
  onStagesChange,
  allowCustomStages = false,
  compact = false,
}: ApprovalWorkflowConfigProps) {
  const [selectedPreset, setSelectedPreset] = useState<TenderTypePreset>(tenderType);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Apply preset on first load
  useEffect(() => {
    if (stages.length === 0) {
      applyPreset(tenderType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (preset: TenderTypePreset) => {
    setSelectedPreset(preset);
    const presetConfig = WORKFLOW_PRESETS[preset];
    const defaultStages = getDefaultStages();
    const updated = defaultStages.map((stage) => ({
      ...stage,
      enabled: presetConfig.enabledStages.includes(stage.role),
    }));
    onStagesChange(updated);
  };

  const toggleStage = (stageId: string) => {
    const updated = stages.map((s) => {
      if (s.id === stageId && !s.required) {
        return { ...s, enabled: !s.enabled };
      }
      return s;
    });
    onStagesChange(updated);
    validateWorkflow(updated);
  };

  const assignUser = (stageId: string, userId: string) => {
    const member = MOCK_ORG_MEMBERS.find((m) => m.id === userId);
    if (!member) return;
    const updated = stages.map((s) =>
      s.id === stageId ? { ...s, assignedUserId: userId, assignedUserName: member.name } : s
    );
    onStagesChange(updated);
    validateWorkflow(updated);
  };

  const addCustomStage = () => {
    const newStage: WorkflowStage = {
      id: `custom-${Date.now()}`,
      role: `custom_${Date.now()}`,
      title: "Custom Approval Stage",
      description: "",
      icon: UserCheck,
      enabled: true,
      required: false,
      assignedUserId: "self",
      assignedUserName: "Self (You)",
      canForwardTo: "",
      isCustom: true,
    };
    // Insert before the last stage (Procurement Head / Approving Authority)
    const newStages = [...stages];
    const lastIndex = newStages.length - 1;
    newStages.splice(lastIndex, 0, newStage);
    onStagesChange(newStages);
  };

  const removeCustomStage = (stageId: string) => {
    onStagesChange(stages.filter((s) => s.id !== stageId));
  };

  const updateCustomStageTitle = (stageId: string, title: string) => {
    onStagesChange(stages.map((s) => (s.id === stageId ? { ...s, title } : s)));
  };

  const updateCustomStageDescription = (stageId: string, description: string) => {
    onStagesChange(stages.map((s) => (s.id === stageId ? { ...s, description } : s)));
  };

  const moveStage = (stageId: string, direction: "up" | "down") => {
    const idx = stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    // Cannot move above position 0 or below the last (Procurement Head is always last)
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;
    // Don't allow moving past Procurement Head (always last)
    if (stages[targetIdx].required && direction === "down") return;
    const newStages = [...stages];
    [newStages[idx], newStages[targetIdx]] = [newStages[targetIdx], newStages[idx]];
    onStagesChange(newStages);
  };

  const validateWorkflow = (stgs: WorkflowStage[]) => {
    const errors: string[] = [];
    const enabledStages = stgs.filter((s) => s.enabled);

    // At least one approval stage must exist
    if (enabledStages.length === 0) {
      errors.push("At least one approval stage must be enabled.");
    }

    // Check for adjacent role conflicts (PRD §7.3 rule 4)
    for (let i = 0; i < enabledStages.length - 1; i++) {
      if (
        enabledStages[i].assignedUserId !== "self" &&
        enabledStages[i].assignedUserId === enabledStages[i + 1].assignedUserId
      ) {
        errors.push(
          `Adjacent role conflict: "${enabledStages[i].title}" and "${enabledStages[i + 1].title}" cannot be assigned to the same person.`
        );
      }
    }

    // Check max 2 roles per user (PRD §7.3 rule 3)
    const userRoleCounts: Record<string, number> = {};
    enabledStages.forEach((s) => {
      if (s.assignedUserId !== "self") {
        userRoleCounts[s.assignedUserId] = (userRoleCounts[s.assignedUserId] || 0) + 1;
      }
    });
    Object.entries(userRoleCounts).forEach(([userId, count]) => {
      if (count > 2) {
        const userName = MOCK_ORG_MEMBERS.find((m) => m.id === userId)?.name || userId;
        errors.push(`${userName} is assigned to ${count} roles (max 2 per person allowed).`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const enabledStages = stages.filter((s) => s.enabled);

  return (
    <div className="space-y-6">
      {/* Workflow Preset Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="size-5" />
            Approval Workflow Preset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Object.entries(WORKFLOW_PRESETS)
              .filter(([key]) => {
                // Show relevant presets based on tender type
                if (tenderType.startsWith("govt")) return key.startsWith("govt") || key === "nrq3-custom";
                if (tenderType === "nrq3-custom") return true;
                return key === tenderType || key === "nrq3-custom";
              })
              .map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as TenderTypePreset)}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                    selectedPreset === key
                      ? "border-blue-600 bg-blue-50"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                </button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Workflow Pipeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRight className="size-5" />
            Approval Flow
            <Badge variant="outline" className="ml-auto">
              {enabledStages.length} {enabledStages.length === 1 ? "Stage" : "Stages"} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enabledStages.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="size-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm">No approval stages enabled. At least one stage is required.</p>
            </div>
          ) : (
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {/* Procurer (always the start) */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="px-3 py-2 rounded-lg bg-muted border border-border">
                  <div className="text-xs text-muted-foreground">Creator</div>
                  <div className="text-sm font-medium">You (Procurer)</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
              </div>

              {enabledStages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`px-3 py-2 rounded-lg border ${
                      stage.required
                        ? "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700"
                        : "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">Stage {idx + 1}</div>
                    <div className="text-sm font-medium truncate max-w-[160px]">{stage.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                      {stage.assignedUserName}
                    </div>
                  </div>
                  {idx < enabledStages.length - 1 && (
                    <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}

              {/* Terminal */}
              <div className="flex items-center gap-1 shrink-0">
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                <div className="px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700">
                  <div className="text-xs text-muted-foreground">Outcome</div>
                  <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Award Issued</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-5" />
              Stage Configuration & User Assignment
            </CardTitle>
            {allowCustomStages && (
              <Button size="sm" variant="outline" onClick={addCustomStage}>
                <Plus className="size-4 mr-1" />
                Add Custom Stage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isExpanded = expandedStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`border rounded-lg transition-all ${
                  stage.enabled
                    ? "border-border bg-card"
                    : "border-border/50 bg-muted opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Drag handle for custom stages */}
                  {stage.isCustom && allowCustomStages && (
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveStage(stage.id, "up")}
                        disabled={idx === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp className="size-3" />
                      </button>
                      <button
                        onClick={() => moveStage(stage.id, "down")}
                        disabled={idx === stages.length - 1 || stages[idx + 1]?.required}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown className="size-3" />
                      </button>
                    </div>
                  )}

                  {/* Toggle */}
                  <button
                    onClick={() => !stage.required && toggleStage(stage.id)}
                    disabled={stage.required}
                    className={`shrink-0 ${stage.required ? "cursor-not-allowed" : "cursor-pointer"}`}
                    title={stage.required ? "This stage is mandatory" : `Click to ${stage.enabled ? "disable" : "enable"}`}
                  >
                    {stage.enabled ? (
                      <ToggleRight className={`size-6 ${stage.required ? "text-green-400" : "text-blue-600 dark:text-blue-400"}`} />
                    ) : (
                      <ToggleLeft className="size-6 text-muted-foreground" />
                    )}
                  </button>

                  {/* Icon */}
                  <div
                    className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                      stage.enabled
                        ? stage.required
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <StageIcon className="size-4" />
                  </div>

                  {/* Title & description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${stage.enabled ? "" : "text-muted-foreground"}`}>
                        {stage.title}
                      </span>
                      {stage.required && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-700">
                          Required
                        </Badge>
                      )}
                      {stage.isCustom && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-700">
                          Custom
                        </Badge>
                      )}
                    </div>
                    {stage.enabled && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Assigned to: <span className="font-medium">{stage.assignedUserName}</span>
                      </div>
                    )}
                  </div>

                  {/* Expand / actions */}
                  {stage.enabled && (
                    <div className="flex items-center gap-1">
                      {stage.isCustom && allowCustomStages && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomStage(stage.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                      >
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && stage.enabled && (
                  <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                    {/* Custom stage title/description edit */}
                    {stage.isCustom && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Stage Title</Label>
                          <Input
                            value={stage.title}
                            onChange={(e) => updateCustomStageTitle(stage.id, e.target.value)}
                            placeholder="e.g., Department Head Review"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={stage.description}
                            onChange={(e) => updateCustomStageDescription(stage.id, e.target.value)}
                            placeholder="What does this stage do?"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Stage description for predefined stages */}
                    {!stage.isCustom && stage.description && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded px-3 py-2">
                        <Info className="size-3.5 mt-0.5 shrink-0" />
                        {stage.description}
                      </div>
                    )}

                    {/* User assignment */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">
                        Assign {stage.isCustom ? "Approver" : stage.title}
                      </Label>
                      <select
                        value={stage.assignedUserId}
                        onChange={(e) => assignUser(stage.id, e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground"
                      >
                        {MOCK_ORG_MEMBERS.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} — {member.designation} ({member.department})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground">
                        Only members from your organisation are shown (PRD §7.3 Rule 1)
                      </p>
                    </div>

                    {/* What this role can see */}
                    {!stage.isCustom && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Visibility: </span>
                        {stage.role === "prequal_evaluator" && "Can see vendor eligibility docs (V1, V2, V4). Cannot see pricing."}
                        {stage.role === "tech_evaluator" && "Can see technical compliance (V3). Cannot see pricing."}
                        {stage.role === "commercial_evaluator" && "Can see pricing (V5) AFTER technical unlock. Also V1/V2 for context."}
                        {stage.role === "auditor" && "Can see all evaluation data and logs. Read-only — cannot score."}
                        {stage.role === "recommender" && "Can see evaluation reports and rankings. Submits recommendation."}
                        {stage.role === "procurement_head" && "Can see evaluation reports, final rankings, and audit trail only."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <AlertTriangle className="size-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-1">
              {validationErrors.map((error, idx) => (
                <div key={idx} className="text-sm text-red-700 dark:text-red-400">{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Workflow Rules Reference */}
      <Card className="bg-muted border-border">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Workflow Assignment Rules (PRD §7.3)</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Only members from your organisation can be assigned</li>
                <li>Maximum 2 roles per person per tender</li>
                <li>No adjacent roles — e.g., Technical Evaluator and Commercial Evaluator cannot be the same person</li>
                <li>Assigned users receive notifications when the tender reaches their stage</li>
                <li>Roles default to "Self" if no other user is assigned</li>
                <li>Reassignment is allowed before the relevant stage starts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export the types and defaults for use by parent forms
export { getDefaultStages, WORKFLOW_PRESETS, MOCK_ORG_MEMBERS };
export type { TenderTypePreset };