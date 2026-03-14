import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Save, FileText, Send, Download } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { contractsApi } from "../../lib/api/contracts.api";

export function ContractGeneration() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Contract Generation"
        description="RFQ-2024-001: Office Furniture Supply - XYZ Manufacturing"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Save className="size-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Download className="size-4 mr-2" />
              Preview PDF
            </Button>
            <Button>
              <Send className="size-4 mr-2" />
              Send for Signature
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="scope">Scope of Work</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="payment">Payment Schedule</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Contract Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contract Number</Label>
                  <Input defaultValue="CNT-2024-001" />
                </div>
                <div>
                  <Label>Contract Date</Label>
                  <Input type="date" defaultValue="2026-03-16" />
                </div>
                <div>
                  <Label>Contract Type</Label>
                  <Select defaultValue="fixed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="time">Time & Materials</SelectItem>
                      <SelectItem value="cost">Cost Plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contract Value</Label>
                  <Input defaultValue="$65,300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" defaultValue="2026-03-20" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" defaultValue="2026-04-20" />
                </div>
                <div>
                  <Label>Contract Duration</Label>
                  <Input defaultValue="30 days" disabled />
                </div>
                <div>
                  <Label>Renewal Option</Label>
                  <Select defaultValue="no">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No Renewal</SelectItem>
                      <SelectItem value="auto">Auto Renewal</SelectItem>
                      <SelectItem value="manual">Manual Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Vendor Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input defaultValue="XYZ Manufacturing" />
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input defaultValue="REG-87654321" />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input defaultValue="Jane Doe" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" defaultValue="jane.doe@xyzmanufacturing.com" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue="+1 234 567 8900" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input defaultValue="456 Industrial Park, NY 10002" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Buyer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input defaultValue="Tech Corp Inc." />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input defaultValue="Procurement" />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input defaultValue="John Smith" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" defaultValue="john.smith@techcorp.com" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope">
          <Card>
            <CardHeader>
              <CardTitle>Scope of Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Description</Label>
                <Textarea
                  rows={4}
                  defaultValue="Supply and delivery of office furniture including executive desks, office chairs, filing cabinets, and conference tables as per specifications in RFQ-2024-001."
                />
              </div>

              <div>
                <Label>Deliverables</Label>
                <Textarea
                  rows={6}
                  defaultValue={`1. 15 Executive Desks (L-shaped, wooden, with drawers)
2. 50 Office Chairs (Ergonomic, adjustable height, mesh back)
3. 20 Filing Cabinets (4-drawer, lockable, metal)
4. 3 Conference Tables (12-seater, wooden finish)

All items must comply with specifications outlined in the RFQ document.`}
                />
              </div>

              <div>
                <Label>Quality Standards</Label>
                <Textarea
                  rows={3}
                  defaultValue="All furniture must meet ISO 9001 quality standards and comply with relevant safety regulations. Items must be new, unused, and in original manufacturer packaging."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Location</Label>
                  <Input defaultValue="123 Main Street, New York, NY 10001" />
                </div>
                <div>
                  <Label>Delivery Deadline</Label>
                  <Input type="date" defaultValue="2026-04-15" />
                </div>
              </div>

              <div>
                <Label>Vendor Responsibilities</Label>
                <Textarea
                  rows={5}
                  defaultValue={`- Deliver all items to specified location within agreed timeline
- Provide installation and assembly services
- Conduct staff training on proper use and maintenance
- Provide warranty documentation and maintenance guidelines
- Ensure compliance with all safety and quality standards`}
                />
              </div>

              <div>
                <Label>Buyer Responsibilities</Label>
                <Textarea
                  rows={3}
                  defaultValue={`- Provide access to delivery location
- Designate point of contact for coordination
- Conduct timely inspection and acceptance of delivered items`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Warranty Terms</Label>
                <Textarea
                  rows={3}
                  defaultValue="The Vendor shall provide a comprehensive warranty of 36 months from the date of delivery covering all manufacturing defects and workmanship issues. Warranty includes free replacement of defective items."
                />
              </div>

              <div>
                <Label>Penalties & Liquidated Damages</Label>
                <Textarea
                  rows={3}
                  defaultValue="Late delivery penalty: 0.5% of contract value per day, up to a maximum of 10% of total contract value. Defective items not replaced within 7 days will incur additional penalties."
                />
              </div>

              <div>
                <Label>Dispute Resolution</Label>
                <Select defaultValue="arbitration">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arbitration">Arbitration</SelectItem>
                    <SelectItem value="mediation">Mediation</SelectItem>
                    <SelectItem value="litigation">Litigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Governing Law</Label>
                <Input defaultValue="New York State Law" />
              </div>

              <div>
                <Label>Confidentiality</Label>
                <Textarea
                  rows={2}
                  defaultValue="Both parties agree to maintain confidentiality of all proprietary information shared during the contract period and for 2 years thereafter."
                />
              </div>

              <div>
                <Label>Termination Clause</Label>
                <Textarea
                  rows={3}
                  defaultValue="Either party may terminate this contract with 30 days written notice. In case of material breach, immediate termination is permitted. Termination fees may apply as per schedule."
                />
              </div>

              <div>
                <Label>Force Majeure</Label>
                <Textarea
                  rows={2}
                  defaultValue="Neither party shall be liable for delays or failures in performance resulting from acts of God, war, natural disasters, or other events beyond reasonable control."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Terms</Label>
                  <Input defaultValue="Net 30" />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select defaultValue="bank">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="ach">ACH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Payment Milestones</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-4 p-3 border rounded flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <div className="font-medium">Advance Payment</div>
                      <div className="text-sm text-muted-foreground">Upon contract signing</div>
                    </div>
                    <Input type="number" className="w-24" defaultValue="20" />
                    <span>%</span>
                    <div className="font-semibold">$13,060</div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <div className="font-medium">On Delivery</div>
                      <div className="text-sm text-muted-foreground">Upon delivery completion</div>
                    </div>
                    <Input type="number" className="w-24" defaultValue="50" />
                    <span>%</span>
                    <div className="font-semibold">$32,650</div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <div className="font-medium">Final Payment</div>
                      <div className="text-sm text-muted-foreground">Upon installation and acceptance</div>
                    </div>
                    <Input type="number" className="w-24" defaultValue="30" />
                    <span>%</span>
                    <div className="font-semibold">$19,590</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Contract Value</span>
                  <span>$65,300</span>
                </div>
              </div>

              <div>
                <Label>Banking Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Bank Name</Label>
                    <Input defaultValue="Global Bank" />
                  </div>
                  <div>
                    <Label className="text-sm">Account Number</Label>
                    <Input defaultValue="1234567890" />
                  </div>
                  <div>
                    <Label className="text-sm">Account Name</Label>
                    <Input defaultValue="XYZ Manufacturing" />
                  </div>
                  <div>
                    <Label className="text-sm">SWIFT Code</Label>
                    <Input defaultValue="GLBBUS33XXX" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Contract Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 border rounded bg-background" style={{ fontFamily: "serif" }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">SUPPLY CONTRACT</h2>
                  <div className="text-sm">Contract No: CNT-2024-001</div>
                  <div className="text-sm">Date: March 16, 2026</div>
                </div>

                <div className="space-y-6 text-sm">
                  <div>
                    <p className="font-bold mb-2">THIS CONTRACT is made on March 16, 2026</p>
                    <p className="mb-4">BETWEEN:</p>
                    <p><strong>Tech Corp Inc.</strong> ("the Buyer")</p>
                    <p className="mb-2">123 Main Street, New York, NY 10001</p>
                    <p className="mb-4">AND</p>
                    <p><strong>XYZ Manufacturing</strong> ("the Vendor")</p>
                    <p>456 Industrial Park, NY 10002</p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">1. CONTRACT DETAILS</h3>
                    <p>Contract Value: $65,300</p>
                    <p>Duration: March 20, 2026 to April 20, 2026</p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">2. SCOPE OF WORK</h3>
                    <p>
                      The Vendor shall supply and deliver office furniture including executive desks, office
                      chairs, filing cabinets, and conference tables as specified in RFQ-2024-001.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">3. PAYMENT TERMS</h3>
                    <p>20% advance payment upon contract signing</p>
                    <p>50% upon delivery completion</p>
                    <p>30% upon installation and final acceptance</p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">4. WARRANTY</h3>
                    <p>36 months comprehensive warranty from date of delivery</p>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-8">
                    <div>
                      <div className="border-t border-black pt-2">
                        <p className="font-bold">For Tech Corp Inc.</p>
                        <p className="text-xs mt-2">Name:</p>
                        <p className="text-xs">Title:</p>
                        <p className="text-xs">Date:</p>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-black pt-2">
                        <p className="font-bold">For XYZ Manufacturing</p>
                        <p className="text-xs mt-2">Name:</p>
                        <p className="text-xs">Title:</p>
                        <p className="text-xs">Date:</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}