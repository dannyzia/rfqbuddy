import { useState } from "react";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Send,
  AlertCircle,
  Settings,
  FileText,
  GripVertical,
  UserCheck,
} from "lucide-react";
import { ApprovalWorkflowConfig, getDefaultStages, type WorkflowStage } from "../../components/approval-workflow-config";

interface CustomSegment {
  id: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
}

export function CreateNRQ3Custom() {
  const [segments, setSegments] = useState<CustomSegment[]>([
    {
      id: "1",
      title: "Basic Information",
      description: "General RFQ details and overview",
      required: true,
      order: 1,
    },
  ]);

  const [currentView, setCurrentView] = useState<"builder" | "form">("builder");
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(getDefaultStages());

  const addSegment = () => {
    const newSegment: CustomSegment = {
      id: Date.now().toString(),
      title: "New Segment",
      description: "",
      required: false,
      order: segments.length + 1,
    };
    setSegments([...segments, newSegment]);
  };

  const removeSegment = (id: string) => {
    setSegments(segments.filter((s) => s.id !== id));
  };

  const moveSegment = (id: string, direction: "up" | "down") => {
    const index = segments.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === segments.length - 1)
    ) {
      return;
    }

    const newSegments = [...segments];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSegments[index], newSegments[targetIndex]] = [
      newSegments[targetIndex],
      newSegments[index],
    ];

    newSegments.forEach((seg, idx) => {
      seg.order = idx + 1;
    });

    setSegments(newSegments);
  };

  const updateSegment = (id: string, field: keyof CustomSegment, value: any) => {
    setSegments(
      segments.map((seg) => (seg.id === id ? { ...seg, [field]: value } : seg))
    );
  };

  return (
    <PageTemplate
      title="Create Custom RFQ (NRQ3)"
      description="Non-Government Custom Request for Quotation - Build Your Own Workflow"
      actions={
        <>
          <Button variant="outline">
            <Save className="size-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" onClick={() => setCurrentView(currentView === "builder" ? "form" : "builder")}>
            <Eye className="size-4 mr-2" />
            {currentView === "builder" ? "Preview Form" : "Back to Builder"}
          </Button>
          {currentView === "form" && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="size-4 mr-2" />
              Publish RFQ
            </Button>
          )}
        </>
      }
    >
      {currentView === "builder" ? (
        <BuilderView
          segments={segments}
          addSegment={addSegment}
          removeSegment={removeSegment}
          moveSegment={moveSegment}
          updateSegment={updateSegment}
          workflowStages={workflowStages}
          onWorkflowStagesChange={setWorkflowStages}
        />
      ) : (
        <FormView segments={segments} />
      )}
    </PageTemplate>
  );
}

function BuilderView({
  segments,
  addSegment,
  removeSegment,
  moveSegment,
  updateSegment,
  workflowStages,
  onWorkflowStagesChange,
}: {
  segments: CustomSegment[];
  addSegment: () => void;
  removeSegment: (id: string) => void;
  moveSegment: (id: string, direction: "up" | "down") => void;
  updateSegment: (id: string, field: keyof CustomSegment, value: any) => void;
  workflowStages: WorkflowStage[];
  onWorkflowStagesChange: (stages: WorkflowStage[]) => void;
}) {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-600">
        <Settings className="size-4" />
        <AlertDescription>
          <strong>Custom RFQ Builder:</strong> Create a tailored RFQ workflow by adding, removing, and reordering segments. Each segment can have custom fields and requirements.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>RFQ Segments Configuration</CardTitle>
            <Button onClick={addSegment}>
              <Plus className="size-4 mr-2" />
              Add Segment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {segments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="size-12 mx-auto mb-3 text-muted-foreground" />
              <p>No segments added yet. Click "Add Segment" to start building your RFQ.</p>
            </div>
          ) : (
            segments.map((segment, index) => (
              <div
                key={segment.id}
                className="border rounded-lg p-4 space-y-4 bg-muted"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-2 pt-2">
                    <GripVertical className="size-5 text-muted-foreground cursor-move" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-600">
                        Segment {segment.order}
                      </Badge>
                      <Input
                        value={segment.title}
                        onChange={(e) =>
                          updateSegment(segment.id, "title", e.target.value)
                        }
                        className="flex-1 font-medium"
                        placeholder="Segment Title"
                      />
                      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={segment.required}
                          onChange={(e) =>
                            updateSegment(segment.id, "required", e.target.checked)
                          }
                          className="rounded"
                          disabled={segment.order === 1}
                        />
                        <span>Required</span>
                      </label>
                    </div>

                    <div>
                      <Textarea
                        value={segment.description}
                        onChange={(e) =>
                          updateSegment(segment.id, "description", e.target.value)
                        }
                        placeholder="Segment description and instructions..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>

                    <SegmentFieldBuilder segmentId={segment.id} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSegment(segment.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSegment(segment.id, "down")}
                      disabled={index === segments.length - 1}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSegment(segment.id)}
                      disabled={segment.order === 1}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RFQ Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name (Optional)</Label>
              <Input id="templateName" placeholder="e.g., Complex IT Procurement" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Default Category</Label>
              <select id="category" className="w-full border rounded-lg px-3 py-2">
                <option>Goods</option>
                <option>Services</option>
                <option>Works</option>
                <option>Consultancy</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saveTemplate">Save as Reusable Template</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="saveTemplate" value="yes" />
                <span>Yes, save for future use</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="saveTemplate" value="no" defaultChecked />
                <span>No, one-time use only</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-5" />
            Approval Workflow Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure who reviews and approves this tender. You can add custom approval stages, remove stages you don't need, and assign specific users from your organisation.
          </p>
        </CardHeader>
      </Card>

      <ApprovalWorkflowConfig
        tenderType="nrq3-custom"
        stages={workflowStages}
        onStagesChange={onWorkflowStagesChange}
        allowCustomStages={true}
      />
    </div>
  );
}

function SegmentFieldBuilder({ segmentId }: { segmentId: string }) {
  const [fields, setFields] = useState<any[]>([]);

  const addField = (type: string) => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
      },
    ]);
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Custom Fields</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addField("text")}
          >
            + Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addField("number")}
          >
            + Number
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addField("date")}
          >
            + Date
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addField("file")}
          >
            + File
          </Button>
        </div>
      </div>

      {fields.length > 0 && (
        <div className="space-y-2 pl-4 border-l-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center gap-2 p-2 bg-background rounded border"
            >
              <Badge variant="outline" className="text-xs">
                {field.type}
              </Badge>
              <Input
                value={field.label}
                onChange={(e) => {
                  setFields(
                    fields.map((f) =>
                      f.id === field.id ? { ...f, label: e.target.value } : f
                    )
                  );
                }}
                className="flex-1 text-sm"
                placeholder="Field label"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => {
                    setFields(
                      fields.map((f) =>
                        f.id === field.id
                          ? { ...f, required: e.target.checked }
                          : f
                      )
                    );
                  }}
                  className="rounded"
                />
                Required
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFields(fields.filter((f) => f.id !== field.id))}
                className="text-red-600"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4 bg-card rounded border-2 border-dashed">
          No custom fields added. Click buttons above to add fields.
        </div>
      )}
    </div>
  );
}

function FormView({ segments }: { segments: CustomSegment[] }) {
  return (
    <div className="space-y-6">
      <Alert>
        <Eye className="size-4" />
        <AlertDescription>
          This is how vendors will see and fill out your custom RFQ form.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-2 mb-6">
        {segments.map((segment, index) => (
          <div key={segment.id} className="flex items-center">
            <div className="px-3 py-1 rounded bg-muted text-sm">
              {index + 1}. {segment.title}
            </div>
            {index < segments.length - 1 && (
              <div className="w-8 h-px bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      {segments.map((segment) => (
        <Card key={segment.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge>Segment {segment.order}</Badge>
              <CardTitle>{segment.title}</CardTitle>
              {segment.required && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Required
                </Badge>
              )}
            </div>
            {segment.description && (
              <p className="text-sm text-muted-foreground mt-2">{segment.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Sample Field {segment.required && <span className="text-red-600">*</span>}
              </Label>
              <Input placeholder="This is a preview of how fields will appear" />
            </div>
            <div className="text-sm text-muted-foreground italic">
              Custom fields defined for this segment will appear here.
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline">
              <Save className="size-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="size-4 mr-2" />
              Publish Custom RFQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}