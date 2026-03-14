import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
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
  Zap,
  Upload,
  Paperclip,
  X,
  Plus,
  Trash2,
  Lightbulb,
  Target,
  UserCheck,
} from "lucide-react";
import rfpConfig from "../../config/forms/nrq3-rfp.json";
import { ApprovalWorkflowConfig, WorkflowStage } from "../../components/approval-workflow-config";

// Icon map for dynamic segment icons
const ICON_MAP: Record<string, any> = {
  FileText, Building2, Target, Package, Settings, Users, Shield,
  ClipboardCheck, Scale, DollarSign, Calendar, Paperclip, Send, Lightbulb, Eye, UserCheck,
};

// Get the form config from JSON
const FORM = rfpConfig.form_config;
const JSON_SEGMENTS = FORM.segments;

// Virtual segment for Approval Workflow — inserted before "Review & Publish"
const LAST_JSON_SEG = JSON_SEGMENTS[JSON_SEGMENTS.length - 1]; // "Review & Publish" (id: 14)
const APPROVAL_WORKFLOW_SEGMENT_ID = JSON_SEGMENTS.length; // display position 14
const REVIEW_DISPLAY_ID = JSON_SEGMENTS.length + 1; // display position 15
const TOTAL_SEGMENTS = JSON_SEGMENTS.length + 1; // +1 for the approval workflow

export function CreateRFP() {
  const navigate = useNavigate();
  const [currentSegment, setCurrentSegment] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [repeatableData, setRepeatableData] = useState<Record<string, any[]>>({});
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([]);

  // Map display segment to actual JSON segment
  const getJsonSegment = (displaySeg: number) => {
    if (displaySeg < APPROVAL_WORKFLOW_SEGMENT_ID) return displaySeg;
    if (displaySeg === APPROVAL_WORKFLOW_SEGMENT_ID) return null; // virtual segment
    return displaySeg - 1; // Review shifted by 1
  };

  const jsonSegId = getJsonSegment(currentSegment);
  const currentConfig = jsonSegId !== null ? JSON_SEGMENTS.find((s) => s.id === jsonSegId) : null;
  const progress = Math.round((currentSegment / TOTAL_SEGMENTS) * 100);
  const isApprovalSegment = currentSegment === APPROVAL_WORKFLOW_SEGMENT_ID;
  const isReviewSegment = currentSegment === REVIEW_DISPLAY_ID;

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [`${currentSegment}::${fieldId}`]: value }));
  };

  const getFieldValue = (fieldId: string) => {
    return formData[`${currentSegment}::${fieldId}`] || "";
  };

  const addRepeatableRow = (subformId: string) => {
    const key = `${currentSegment}::${subformId}`;
    const existing = repeatableData[key] || [];
    setRepeatableData((prev) => ({
      ...prev,
      [key]: [...existing, { _id: Date.now() }],
    }));
  };

  const removeRepeatableRow = (subformId: string, index: number) => {
    const key = `${currentSegment}::${subformId}`;
    const existing = repeatableData[key] || [];
    setRepeatableData((prev) => ({
      ...prev,
      [key]: existing.filter((_, i) => i !== index),
    }));
  };

  const updateRepeatableField = (subformId: string, rowIndex: number, fieldId: string, value: any) => {
    const key = `${currentSegment}::${subformId}`;
    const existing = repeatableData[key] || [];
    const updated = [...existing];
    updated[rowIndex] = { ...updated[rowIndex], [fieldId]: value };
    setRepeatableData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleNext = () => {
    if (currentSegment < TOTAL_SEGMENTS) setCurrentSegment(currentSegment + 1);
  };

  const handlePrevious = () => {
    if (currentSegment > 1) setCurrentSegment(currentSegment - 1);
  };

  // Render a single field based on its config
  const renderField = (field: any, valueGetter: () => any, valueSetter: (val: any) => void) => {
    const value = valueGetter();

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return (
          <Input
            type={field.type === "phone" ? "tel" : field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={3}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
            placeholder={field.placeholder || "0"}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      case "currency":
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">BDT</span>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => valueSetter(e.target.value)}
              className="pl-12"
              placeholder="0.00"
            />
          </div>
        );
      case "select":
        return (
          <select
            value={value || field.default || ""}
            onChange={(e) => valueSetter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-background border-border"
          >
            <option value="">Select {field.label}</option>
            {(field.options || []).map((opt: string) => (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px] border-border">
            {(field.options || []).map((opt: string) => {
              const selected = Array.isArray(value) ? value.includes(opt) : false;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const arr = Array.isArray(value) ? [...value] : [];
                    if (selected) valueSetter(arr.filter((v: string) => v !== opt));
                    else valueSetter([...arr, opt]);
                  }}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    selected
                      ? "bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-600"
                      : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                  }`}
                >
                  {opt.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={value === true || value === "true"}
              onCheckedChange={(checked) => valueSetter(checked)}
            />
            <span className="text-sm text-muted-foreground">
              {value ? "Yes" : "No"}
            </span>
          </div>
        );
      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
          />
        );
      case "datetime":
        return (
          <Input
            type="datetime-local"
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
          />
        );
      case "file":
        return (
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted transition-colors cursor-pointer border-border">
            <Upload className="size-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">
              Click to upload {field.accept ? `(${field.accept})` : ""}
            </p>
          </div>
        );
      case "user_select":
      case "user_multiselect":
        return (
          <Input
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
            placeholder={`Search and select ${field.type === "user_multiselect" ? "team members" : "a user"}`}
          />
        );
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => valueSetter(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  const renderSegmentContent = () => {
    if (!currentConfig) return null;

    return (
      <div className="space-y-6">
        {/* Description Alert */}
        <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700">
          <Lightbulb className="size-4 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-purple-800 dark:text-purple-200">
            {currentConfig.description}
          </AlertDescription>
        </Alert>

        {/* Regular Fields */}
        {currentConfig.fields && currentConfig.fields.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentConfig.fields.map((field: any) => {
                  // Check if field should span full width
                  const isFullWidth = ["textarea", "file"].includes(field.type) || field.id.includes("overview") || field.id.includes("description") || field.id.includes("background") || field.id.includes("objectives") || field.id.includes("requirements") || field.id.includes("scope") || field.id.includes("additional") || field.id.includes("constraints") || field.id.includes("assumptions");
                  return (
                    <div key={field.id} className={`space-y-1.5 ${isFullWidth ? "col-span-full" : ""}`}>
                      <Label className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.help_text && (
                        <p className="text-[11px] text-muted-foreground/70">{field.help_text}</p>
                      )}
                      {renderField(
                        field,
                        () => getFieldValue(field.id),
                        (val) => updateField(field.id, val)
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subforms (repeatable sections) */}
        {currentConfig.subforms && currentConfig.subforms.map((sub: any) => {
          const key = `${currentSegment}::${sub.id}`;
          const rows = repeatableData[key] || [{ _id: 1 }];

          return (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{sub.label}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sub.type === "repeatable" ? "Add or remove rows as needed" : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => addRepeatableRow(sub.id)}>
                    <Plus className="size-3 mr-1" /> Add Row
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {rows.map((row, rowIndex) => (
                  <div key={row._id} className="border rounded-lg p-4 bg-muted/50 border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        #{rowIndex + 1}
                      </Badge>
                      {rows.length > (sub.min_rows || 1) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRepeatableRow(sub.id, rowIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="size-3 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sub.fields.map((field: any) => {
                        const isFullWidth = ["textarea"].includes(field.type);
                        return (
                          <div key={field.id} className={`space-y-1.5 ${isFullWidth ? "col-span-full" : ""}`}>
                            <Label className="text-xs flex items-center gap-1">
                              {field.label}
                              {field.required && <span className="text-red-500">*</span>}
                            </Label>
                            {renderField(
                              field,
                              () => row[field.id] || "",
                              (val) => updateRepeatableField(sub.id, rowIndex, field.id, val)
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <PageTemplate
      title={`Create ${FORM.name}`}
      description={FORM.description}
      actions={
        <>
          <Button variant="outline" onClick={() => navigate("/tenders")}>
            Cancel
          </Button>
          <Button variant="outline">
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
        </>
      }
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Segment {currentSegment} of {TOTAL_SEGMENTS}
          </span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Segment Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-4 mb-6">
        {/* JSON segments 1 through N-1 (all except the last "Review" segment) */}
        {JSON_SEGMENTS.slice(0, -1).map((seg) => {
          const Icon = ICON_MAP[seg.icon] || FileText;
          const isActive = seg.id === currentSegment;
          const isPast = seg.id < currentSegment;
          return (
            <button
              key={seg.id}
              onClick={() => setCurrentSegment(seg.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-xs transition-all shrink-0 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : isPast
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="size-3.5" />
              <span className="hidden lg:inline">{seg.title}</span>
              <span className="lg:hidden">{seg.id}</span>
            </button>
          );
        })}
        {/* Approval Workflow Segment (inserted before Review) */}
        <button
          key={APPROVAL_WORKFLOW_SEGMENT_ID}
          onClick={() => setCurrentSegment(APPROVAL_WORKFLOW_SEGMENT_ID)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-xs transition-all shrink-0 ${
            isApprovalSegment
              ? "bg-purple-600 text-white shadow-md"
              : APPROVAL_WORKFLOW_SEGMENT_ID < currentSegment
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <UserCheck className="size-3.5" />
          <span className="hidden lg:inline">Approval Workflow</span>
          <span className="lg:hidden">{APPROVAL_WORKFLOW_SEGMENT_ID}</span>
        </button>
        {/* Last JSON segment "Review & Publish" — displayed at position N+1 */}
        {LAST_JSON_SEG && (() => {
          const Icon = ICON_MAP[LAST_JSON_SEG.icon] || FileText;
          const isActive = currentSegment === REVIEW_DISPLAY_ID;
          const isPast = REVIEW_DISPLAY_ID < currentSegment;
          return (
            <button
              key={REVIEW_DISPLAY_ID}
              onClick={() => setCurrentSegment(REVIEW_DISPLAY_ID)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-xs transition-all shrink-0 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md"
                  : isPast
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="size-3.5" />
              <span className="hidden lg:inline">{LAST_JSON_SEG.title}</span>
              <span className="lg:hidden">{REVIEW_DISPLAY_ID}</span>
            </button>
          );
        })()}
      </div>

      {/* Current Segment Header */}
      {currentConfig && (
        <div className="flex items-center gap-3 mb-6">
          {(() => {
            const Icon = ICON_MAP[currentConfig.icon] || FileText;
            return (
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Icon className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
            );
          })()}
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {currentConfig.title}
              {currentConfig.required && (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-[10px]">Required</Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              Segment {currentSegment} of {TOTAL_SEGMENTS} &bull; {currentConfig.fields?.length || 0} fields
              {currentConfig.subforms ? ` + ${currentConfig.subforms.length} dynamic section(s)` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Segment Content */}
      {isApprovalSegment ? (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <UserCheck className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Approval Workflow & Roles
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-[10px]">Required</Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Segment {APPROVAL_WORKFLOW_SEGMENT_ID} of {TOTAL_SEGMENTS} &bull; Configure evaluation &amp; approval pipeline per PRD §7.2
              </p>
            </div>
          </div>
          <ApprovalWorkflowConfig
            tenderType="rfp"
            stages={workflowStages}
            onStagesChange={setWorkflowStages}
            compact
          />
        </>
      ) : (
        renderSegmentContent()
      )}

      {/* Navigation Footer */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSegment === 1}
            >
              <ArrowLeft className="size-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentSegment} / {TOTAL_SEGMENTS}
              </span>
            </div>

            {currentSegment < TOTAL_SEGMENTS ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Send className="size-4 mr-2" />
                Submit RFP
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}