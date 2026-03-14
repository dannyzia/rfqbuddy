import { useState } from "react";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import {
  Save,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  Package,
  DollarSign,
  Paperclip,
  Settings,
  Users,
  CheckCircle,
  Upload,
  X,
  UserCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ApprovalWorkflowConfig, getDefaultStages, type WorkflowStage } from "../../components/approval-workflow-config";

export function CreateNRQ1Simple() {
  const [currentSegment, setCurrentSegment] = useState(1);
  const [items, setItems] = useState([{ id: 1, name: "", category: "", quantity: "", unit: "", spec: "", attachments: [] as { name: string; size: string }[] }]);
  const [liveBiddingEnabled, setLiveBiddingEnabled] = useState(false);
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(getDefaultStages());

  const segments = [
    { num: 1, name: "Buyer Information", icon: Building2 },
    { num: 2, name: "RFQ Details", icon: FileText },
    { num: 3, name: "Item Details", icon: Package },
    { num: 4, name: "Commercial Terms", icon: DollarSign },
    { num: 5, name: "Attachments", icon: Paperclip },
    { num: 6, name: "Bidding Mode", icon: Settings },
    { num: 7, name: "Approval Workflow & Roles", icon: UserCheck },
    { num: 8, name: "Review & Publish", icon: CheckCircle },
  ];

  const addItem = () => {
    setItems([...items, { id: items.length + 1, name: "", category: "", quantity: "", unit: "", spec: "", attachments: [] }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const nextSegment = () => {
    if (currentSegment < 8) setCurrentSegment(currentSegment + 1);
  };

  const prevSegment = () => {
    if (currentSegment > 1) setCurrentSegment(currentSegment - 1);
  };

  return (
    <PageTemplate
      title="Create Simple RFQ (NRQ1)"
      description="Non-Government Simple Request for Quotation - 8 Segments"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div key={seg.num} className="flex items-center flex-shrink-0">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                      currentSegment === seg.num
                        ? "bg-blue-600 text-white border-blue-600"
                        : currentSegment > seg.num
                        ? "bg-green-50 border-green-600 text-green-700"
                        : "bg-card border-border text-muted-foreground"
                    }`}
                    onClick={() => setCurrentSegment(seg.num)}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium whitespace-nowrap">
                      S{seg.num}: {seg.name}
                    </span>
                  </div>
                  {seg.num < 8 && <div className="w-6 h-px bg-border mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Segment 1: Buyer Information */}
        {currentSegment === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                S1: Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  Organization details are pre-filled from your profile. You can update department and contact
                  information.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" value="ABC Non-Profit Organization" disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department / Division *</Label>
                <Input id="department" placeholder="e.g., Procurement Department" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input id="contactPerson" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input id="contactEmail" type="email" placeholder="email@organization.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input id="contactPhone" type="tel" placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryCity">Delivery City *</Label>
                  <Input id="deliveryCity" placeholder="City for delivery" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Segment 2: RFQ Details */}
        {currentSegment === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                S2: RFQ Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">RFQ Title *</Label>
                <Input id="title" placeholder="Enter descriptive RFQ title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refNo">Reference Number</Label>
                  <Input id="refNo" value="NRQ-2026-00123" disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Auto-generated format: NRQ-YYYY-XXXXX</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select id="type" className="w-full border rounded-lg px-3 py-2">
                    <option value="NRQ1-Goods">NRQ1 - Goods</option>
                    <option value="NRQ1-Works">NRQ1 - Works</option>
                    <option value="NRQ1-Services">NRQ1 - Services</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" type="date" value={new Date().toISOString().split("T")[0]} disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Auto-filled with today's date</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Submission Deadline *</Label>
                  <Input id="deadline" type="datetime-local" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Brief description of requirements" rows={4} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Segment 3: Item Details */}
        {currentSegment === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Package className="size-5" />
                  S3: Item Details
                </div>
                <Button size="sm" onClick={addItem}>
                  + Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Item #{index + 1}</h4>
                    {items.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`itemName-${item.id}`}>Item Name *</Label>
                    <Input id={`itemName-${item.id}`} placeholder="e.g., Office Desktop Computer" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`category-${item.id}`}>Category *</Label>
                    <select id={`category-${item.id}`} className="w-full border rounded-lg px-3 py-2">
                      <option>Office Equipment</option>
                      <option>Furniture</option>
                      <option>Stationery</option>
                      <option>IT Equipment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                      <Input id={`quantity-${item.id}`} type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unit-${item.id}`}>Unit *</Label>
                      <select id={`unit-${item.id}`} className="w-full border rounded-lg px-3 py-2">
                        <option>Piece(s)</option>
                        <option>Set(s)</option>
                        <option>Box(es)</option>
                        <option>Kilogram(s)</option>
                        <option>Meter(s)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`spec-${item.id}`}>Specification Notes</Label>
                    <Textarea id={`spec-${item.id}`} placeholder="Brief technical specifications" rows={2} />
                  </div>

                  {/* Item Attachments */}
                  <div className="space-y-2">
                    <Label>Item Attachments</Label>
                    <p className="text-xs text-muted-foreground">Upload specs, drawings, or reference documents for this item (PDF, DOC, XLSX, JPG, PNG - Max 25MB each)</p>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                      <Upload className="mx-auto size-6 text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">.pdf, .doc, .docx, .xls, .xlsx, .jpg, .png, .zip</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Paperclip className="size-3 mr-1" />
                        Choose Files
                      </Button>
                    </div>
                    {/* Mock attached files */}
                    {index === 0 && (
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded px-3 py-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Paperclip className="size-3 text-blue-600" />
                            <span className="text-blue-700 dark:text-blue-300">item-spec-sheet.pdf</span>
                            <span className="text-muted-foreground text-xs">(245 KB)</span>
                          </div>
                          <button className="text-red-500 hover:text-red-700"><X className="size-3" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Segment 4: Commercial Terms */}
        {currentSegment === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                S4: Commercial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Expected Delivery Date *</Label>
                  <Input id="deliveryDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                  <Input id="deliveryLocation" placeholder="Full address" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerm">Payment Term *</Label>
                <select id="paymentTerm" className="w-full border rounded-lg px-3 py-2">
                  <option>100% on Delivery</option>
                  <option>50% Advance, 50% on Delivery</option>
                  <option>Net 30 Days</option>
                  <option>Net 60 Days</option>
                  <option>Custom (specify in notes)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <select id="currency" className="w-full border rounded-lg px-3 py-2">
                    <option>BDT - Bangladeshi Taka</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxIncluded">Tax Included *</Label>
                  <select id="taxIncluded" className="w-full border rounded-lg px-3 py-2">
                    <option>Yes - Including all taxes</option>
                    <option>No - Excluding taxes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incoterm">Incoterm (if applicable)</Label>
                <select id="incoterm" className="w-full border rounded-lg px-3 py-2">
                  <option value="">Not applicable</option>
                  <option>EXW - Ex Works</option>
                  <option>FOB - Free on Board</option>
                  <option>CIF - Cost, Insurance & Freight</option>
                  <option>DDP - Delivered Duty Paid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentNotes">Additional Payment Notes</Label>
                <Textarea id="paymentNotes" placeholder="Any special payment conditions" rows={3} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Segment 5: Attachments */}
        {currentSegment === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="size-5" />
                S5: Attachments (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  Upload any supporting documents: specifications, drawings, samples, terms & conditions, etc.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted cursor-pointer">
                <Paperclip className="size-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                  <br />
                  <span className="text-xs text-muted-foreground">PDF, DOC, XLS, JPG, PNG (max 10MB per file)</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Storage Quota:</strong> 450 MB used / 1000 MB available
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Uploaded Files</h4>
                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Segment 6: Bidding Mode */}
        {currentSegment === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                S6: Bidding Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Enable Live Bidding</p>
                  <p className="text-sm text-muted-foreground">Allow vendors to bid in real-time competitive session</p>
                </div>
                <Switch checked={liveBiddingEnabled} onCheckedChange={setLiveBiddingEnabled} />
              </div>

              {!liveBiddingEnabled && (
                <Alert>
                  <AlertDescription>
                    <strong>Sealed Bidding Mode (Default)</strong>
                    <br />
                    Vendors submit sealed bids before the deadline. Bids are opened only after the deadline.
                  </AlertDescription>
                </Alert>
              )}

              {liveBiddingEnabled && (
                <div className="space-y-6 border-t pt-6">
                  <Alert>
                    <AlertDescription>
                      <strong>Live Bidding Enabled</strong>
                      <br />
                      Vendors will participate in a real-time bidding session with visible competitive pricing.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="liveStartDate">Bidding Start Time *</Label>
                      <Input id="liveStartDate" type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="liveEndTime">Bidding End Time *</Label>
                      <Input id="liveEndTime" type="datetime-local" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biddingType">Bidding Type *</Label>
                    <select id="biddingType" className="w-full border rounded-lg px-3 py-2">
                      <option>Forward Auction (Highest Bid Wins)</option>
                      <option>Reverse Auction (Lowest Bid Wins)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minIncrement">Minimum Bid Increment *</Label>
                    <Input id="minIncrement" type="number" placeholder="e.g., 100" />
                    <p className="text-sm text-muted-foreground">Minimum amount by which each bid must differ</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Vendor Pre-selection</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox id="preselect" />
                      <label htmlFor="preselect" className="text-sm">
                        Require vendor pre-qualification before live session
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Segment 7: Approval Workflow & Roles */}
        {currentSegment === 7 && (
          <ApprovalWorkflowConfig
            tenderType="nrq1-simple"
            stages={workflowStages}
            onStagesChange={setWorkflowStages}
          />
        )}

        {/* Segment 8: Review & Publish */}
        {currentSegment === 8 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5" />
                S8: Review & Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  Review all information before publishing. Once published, the RFQ becomes visible to vendors.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Buyer Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Organization:</strong> ABC Non-Profit Organization
                    </p>
                    <p>
                      <strong>Department:</strong> Procurement Department
                    </p>
                    <p>
                      <strong>Contact:</strong> John Doe
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">RFQ Details</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Reference:</strong> NRQ-2026-00123
                    </p>
                    <p>
                      <strong>Type:</strong> NRQ1 - Goods
                    </p>
                    <p>
                      <strong>Deadline:</strong> March 25, 2026 17:00
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Items</h4>
                  <div className="text-sm">
                    <p>{items.length} item(s) specified</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Bidding Mode</h4>
                  <div className="text-sm">
                    <p>{liveBiddingEnabled ? "Live Bidding Enabled" : "Sealed Bidding"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Weekly Quota:</strong> 8 RFQs created / 10 allowed this week
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Validation Warnings</h4>
                <p className="text-sm text-green-600">✓ All required fields completed</p>
                <p className="text-sm text-green-600">✓ At least one item specified</p>
                <p className="text-sm text-green-600">✓ Deadline is in the future</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevSegment} disabled={currentSegment === 1}>
            <ArrowLeft className="size-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentSegment < 8 ? (
              <Button onClick={nextSegment}>
                Next
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-green-600 hover:bg-green-700">Publish RFQ</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}