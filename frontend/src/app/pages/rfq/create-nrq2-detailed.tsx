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
  Upload,
  Paperclip,
  X,
  UserCheck,
} from "lucide-react";
import { ApprovalWorkflowConfig, getDefaultStages, type WorkflowStage } from "../../components/approval-workflow-config";

const SEGMENTS = [
  { id: 1, title: "Basic Information", icon: FileText },
  { id: 2, title: "Item Specifications", icon: Package },
  { id: 3, title: "Technical Requirements", icon: Settings },
  { id: 4, title: "Qualification Criteria", icon: Shield },
  { id: 5, title: "Submission Requirements", icon: ClipboardCheck },
  { id: 6, title: "Evaluation Criteria", icon: ClipboardCheck },
  { id: 7, title: "Payment Terms", icon: DollarSign },
  { id: 8, title: "Timeline & Deadlines", icon: Calendar },
  { id: 9, title: "Vendor Selection", icon: Users },
  { id: 10, title: "Approval Workflow & Roles", icon: UserCheck },
  { id: 11, title: "Preview & Review", icon: Eye },
  { id: 12, title: "Publish", icon: Send },
];

export function CreateNRQ2Detailed() {
  const [currentSegment, setCurrentSegment] = useState(1);
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(getDefaultStages());

  const handleNext = () => {
    if (currentSegment < 12) setCurrentSegment(currentSegment + 1);
  };

  const handlePrevious = () => {
    if (currentSegment > 1) setCurrentSegment(currentSegment - 1);
  };

  const renderSegmentContent = () => {
    switch (currentSegment) {
      case 1:
        return <BasicInformationSegment />;
      case 2:
        return <ItemSpecificationsSegment />;
      case 3:
        return <TechnicalRequirementsSegment />;
      case 4:
        return <QualificationCriteriaSegment />;
      case 5:
        return <SubmissionRequirementsSegment />;
      case 6:
        return <EvaluationCriteriaSegment />;
      case 7:
        return <PaymentTermsSegment />;
      case 8:
        return <TimelineSegment />;
      case 9:
        return <VendorSelectionSegment />;
      case 10:
        return (
          <ApprovalWorkflowConfig
            tenderType="nrq2-detailed"
            stages={workflowStages}
            onStagesChange={setWorkflowStages}
          />
        );
      case 11:
        return <PreviewSegment />;
      case 12:
        return <PublishSegment />;
      default:
        return null;
    }
  };

  const progress = ((currentSegment - 1) / 11) * 100;

  return (
    <PageTemplate
      title="Create Detailed RFQ (NRQ2)"
      description="Non-Government Detailed Request for Quotation - 12 Segment Wizard"
      actions={
        <>
          <Button variant="outline">
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
          {currentSegment < 12 && (
            <Button onClick={handleNext}>
              Next Segment
              <ArrowRight className="size-4 ml-2" />
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">RFQ Creation Progress</span>
                <span className="text-muted-foreground">
                  Segment {currentSegment} of 12
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Segment Navigation */}
        <div className="grid grid-cols-12 gap-2">
          {SEGMENTS.map((segment) => {
            const Icon = segment.icon;
            const isActive = currentSegment === segment.id;
            const isCompleted = currentSegment > segment.id;
            
            return (
              <button
                key={segment.id}
                onClick={() => setCurrentSegment(segment.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? "border-blue-600 bg-blue-50"
                    : isCompleted
                    ? "border-green-600 bg-green-50"
                    : "border-border hover:border-border"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-xs text-center font-medium">{segment.id}</span>
              </button>
            );
          })}
        </div>

        {/* Current Segment Title */}
        <div className="flex items-center gap-3">
          <Badge className="text-lg px-4 py-2">
            Segment {currentSegment}
          </Badge>
          <h2 className="text-2xl font-bold">
            {SEGMENTS[currentSegment - 1].title}
          </h2>
        </div>

        {/* Segment Content */}
        {renderSegmentContent()}

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSegment === 1}
              >
                <ArrowLeft className="size-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Segment {currentSegment} of 12
              </div>

              {currentSegment < 12 ? (
                <Button onClick={handleNext}>
                  Next Segment
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="size-4 mr-2" />
                  Publish RFQ
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
function BasicInformationSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic RFQ Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="rfqTitle">RFQ Title *</Label>
          <Input id="rfqTitle" placeholder="e.g., Office Furniture and Equipment Supply" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rfqNumber">RFQ Reference Number</Label>
            <Input id="rfqNumber" placeholder="Auto-generated" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select id="category" className="w-full border rounded-lg px-3 py-2">
              <option>Goods</option>
              <option>Services</option>
              <option>Works</option>
              <option>Consultancy</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description *</Label>
          <Textarea id="description" rows={5} placeholder="Provide comprehensive description of the requirement..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department/Division</Label>
            <Input id="department" placeholder="e.g., Administration" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget (BDT)</Label>
            <Input id="budget" type="number" placeholder="0.00" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemSpecificationsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Specifications & Bill of Quantities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Add all items, quantities, and technical specifications required for this RFQ.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted rounded-lg font-medium text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Item Description</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Specifications</div>
            <div className="col-span-1">Action</div>
          </div>

          {[1, 2].map((item) => (
            <div key={item} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-1 pt-2">{item}</div>
              <div className="col-span-4 space-y-2">
                <Input placeholder="Item description" />
                {/* Item Attachment */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Paperclip className="size-3 mr-1" />
                    Attach Specs
                  </Button>
                  {item === 1 && (
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1 text-xs">
                      <Paperclip className="size-2.5 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">spec-v2.pdf</span>
                      <button className="text-red-500 hover:text-red-700 ml-1"><X className="size-2.5" /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Piece</option>
                  <option>Set</option>
                  <option>Lot</option>
                  <option>Kg</option>
                </select>
              </div>
              <div className="col-span-2">
                <Input type="number" placeholder="0" />
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="sm" className="w-full">
                  Add Specs
                </Button>
              </div>
              <div className="col-span-1">
                <Button variant="ghost" size="sm" className="text-red-600">
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline">
          + Add Item
        </Button>
      </CardContent>
    </Card>
  );
}

function TechnicalRequirementsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Requirements & Standards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="techSpecs">Technical Specifications</Label>
          <Textarea id="techSpecs" rows={4} placeholder="Detailed technical requirements, standards, and compliance needs..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">Required Certifications</Label>
          <Textarea id="certifications" rows={3} placeholder="ISO certifications, quality standards, etc..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty & Support Requirements</Label>
          <Input id="warranty" placeholder="e.g., 2 years comprehensive warranty" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="packaging">Packaging & Labeling Requirements</Label>
          <Textarea id="packaging" rows={2} placeholder="Specify packaging standards..." />
        </div>
      </CardContent>
    </Card>
  );
}

function QualificationCriteriaSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Qualification Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="experience">Minimum Experience Required (Years)</Label>
          <Input id="experience" type="number" placeholder="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="turnover">Minimum Annual Turnover (BDT)</Label>
          <Input id="turnover" type="number" placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="similarProjects">Similar Projects/References Required</Label>
          <Input id="similarProjects" type="number" placeholder="Number of similar projects" />
        </div>

        <div className="space-y-2">
          <Label>Required Documents</Label>
          <div className="space-y-2">
            {["Trade License", "Tax Clearance Certificate", "Bank Solvency", "Company Profile", "Past Performance Certificates"].map((doc) => (
              <label key={doc} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>{doc}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRequirementsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid Submission Requirements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="format">Bid Format</Label>
          <select id="format" className="w-full border rounded-lg px-3 py-2">
            <option>Single Envelope</option>
            <option>Two Envelope (Technical + Financial)</option>
            <option>Three Envelope (Eligibility + Technical + Financial)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Bid Language</Label>
          <select id="language" className="w-full border rounded-lg px-3 py-2">
            <option>English</option>
            <option>Bengali</option>
            <option>Both</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="validity">Bid Validity Period (Days)</Label>
          <Input id="validity" type="number" placeholder="90" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="security">Bid Security Required</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="security" value="yes" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="security" value="no" defaultChecked />
              <span>No</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EvaluationCriteriaSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Methodology & Criteria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="method">Evaluation Method</Label>
          <select id="method" className="w-full border rounded-lg px-3 py-2">
            <option>Lowest Price</option>
            <option>Quality & Cost Based Selection (QCBS)</option>
            <option>Technical Score + Price Weighting</option>
            <option>Best Value</option>
          </select>
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Define clear evaluation criteria with weightages that total 100%.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded font-medium text-sm">
            <div className="col-span-6">Criteria</div>
            <div className="col-span-3">Weight (%)</div>
            <div className="col-span-3">Max Score</div>
          </div>

          {["Technical Compliance", "Price", "Past Performance", "Delivery Timeline"].map((criteria, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 items-center">
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
      </CardContent>
    </Card>
  );
}

function PaymentTermsSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentMode">Payment Mode</Label>
          <select id="paymentMode" className="w-full border rounded-lg px-3 py-2">
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>Letter of Credit</option>
            <option>Mixed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Schedule</Label>
          <select id="paymentTerms" className="w-full border rounded-lg px-3 py-2">
            <option>100% Upon Delivery</option>
            <option>Advance + Balance</option>
            <option>Milestone-based</option>
            <option>Net 30 Days</option>
            <option>Net 60 Days</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="advancePayment">Advance Payment (%)</Label>
          <Input id="advancePayment" type="number" placeholder="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="retention">Retention Money (%)</Label>
          <Input id="retention" type="number" placeholder="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select id="currency" className="w-full border rounded-lg px-3 py-2">
            <option>BDT</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFQ Timeline & Key Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publishDate">Publish Date</Label>
            <Input id="publishDate" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closeDate">Submission Deadline *</Label>
            <Input id="closeDate" type="datetime-local" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clarificationDeadline">Clarification Deadline</Label>
            <Input id="clarificationDeadline" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bidOpeningDate">Bid Opening Date</Label>
            <Input id="bidOpeningDate" type="datetime-local" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="evaluationPeriod">Evaluation Period (Days)</Label>
            <Input id="evaluationPeriod" type="number" placeholder="15" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDeadline">Expected Delivery/Completion</Label>
            <Input id="deliveryDeadline" type="date" />
          </div>
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Ensure adequate time between each milestone for vendor preparation and internal review.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function VendorSelectionSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Vendors to Invite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="inviteMode">Invitation Mode</Label>
          <select id="inviteMode" className="w-full border rounded-lg px-3 py-2">
            <option>Open to All Registered Vendors</option>
            <option>Invite Specific Vendors Only</option>
            <option>Category-based Auto-invite</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Vendor Categories (if applicable)</Label>
          <div className="space-y-2">
            {["Office Equipment", "Furniture Suppliers", "IT Hardware", "Stationery"].map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Search & Add Specific Vendors</Label>
          <Input id="search" placeholder="Search vendors by name, registration number..." />
        </div>

        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium mb-2">Selected Vendors: 0</div>
          <div className="text-sm text-muted-foreground">No vendors selected yet</div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review RFQ Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Please review all information carefully before publishing. You can edit any segment by clicking on it above.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">RFQ Title</div>
              <div className="font-medium">Office Furniture Supply</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="font-medium">Goods</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Budget</div>
              <div className="font-medium">BDT 500,000</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Total Items</div>
            <div className="font-medium">2 items added</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Submission Deadline</div>
            <div className="font-medium">Not set</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Invited Vendors</div>
            <div className="font-medium">0 vendors</div>
          </div>
        </div>

        <Alert className="bg-yellow-50 border-yellow-600">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>Validation Required:</strong> Please complete mandatory fields in all segments before publishing.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function PublishSegment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish RFQ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-600">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Once published, the RFQ will be visible to selected vendors and they can start submitting bids.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="publishOption">Publishing Option</Label>
          <select id="publishOption" className="w-full border rounded-lg px-3 py-2">
            <option>Publish Immediately</option>
            <option>Schedule for Later</option>
            <option>Save as Draft</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notification">Notification Settings</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Send email notification to invited vendors</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Post on vendor portal dashboard</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Send SMS alerts</span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-green-50 border border-green-600 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">Ready to Publish</div>
              <div className="text-sm text-green-700 mt-1">
                All required information has been provided. Click "Publish RFQ" to make it live.
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
          <Send className="size-5 mr-2" />
          Publish RFQ
        </Button>
      </CardContent>
    </Card>
  );
}