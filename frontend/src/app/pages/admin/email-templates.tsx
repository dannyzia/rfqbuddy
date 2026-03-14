import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Save, Send, Eye, Mail, Upload, FileText, FileJson } from "lucide-react";
import { useState } from "react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

export function EmailTemplates() {
  const { data: apiTemplates } = useApiOrMock(
    () => adminApi.getEmailTemplates(),
    [],
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [uploadFormat, setUploadFormat] = useState<"text" | "json">("text");
  const [uploadedContent, setUploadedContent] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (uploadFormat === "json") {
        try {
          const parsed = JSON.parse(content);
          setUploadedContent(JSON.stringify(parsed, null, 2));
        } catch (error) {
          alert("Invalid JSON file");
          return;
        }
      } else {
        setUploadedContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleEditClick = (template: any) => {
    setSelectedTemplate(template);
    setUploadedContent(template.body);
    setEditDialogOpen(true);
  };

  const templates = apiTemplates || [
    {
      id: "welcome-purchaser",
      name: "Welcome Email - Purchaser",
      category: "Onboarding",
      status: "active",
      subject: "Welcome to the RFQ Platform",
      body: "Dear {purchaser_name},\n\nWelcome to our RFQ/Tendering Platform! We're excited to have you on board...",
    },
    {
      id: "welcome-vendor",
      name: "Welcome Email - Vendor",
      category: "Onboarding",
      status: "active",
      subject: "Welcome to the Vendor Portal",
      body: "Dear {vendor_name},\n\nThank you for registering as a vendor on our platform...",
    },
    {
      id: "rfq-published",
      name: "RFQ Published Notification",
      category: "RFQ",
      status: "active",
      subject: "New RFQ Available: {rfq_title}",
      body: "Dear Vendor,\n\nA new RFQ matching your category has been published...",
    },
    {
      id: "bid-received",
      name: "Bid Received Confirmation",
      category: "Bidding",
      status: "active",
      subject: "Bid Received - {rfq_id}",
      body: "Dear {vendor_name},\n\nWe have received your bid for {rfq_title}...",
    },
    {
      id: "award-winner",
      name: "Award Notification - Winner",
      category: "Award",
      status: "active",
      subject: "Congratulations! You've been awarded {rfq_title}",
      body: "Dear {vendor_name},\n\nCongratulations! Your bid has been selected...",
    },
    {
      id: "award-regret",
      name: "Regret Letter - Unsuccessful Bidder",
      category: "Award",
      status: "active",
      subject: "Thank you for your bid - {rfq_title}",
      body: "Dear {vendor_name},\n\nThank you for submitting your bid. Unfortunately...",
    },
  ];

  const categories = ["All", "Onboarding", "RFQ", "Bidding", "Award", "Notifications"];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Email Templates"
        description="Manage automated email templates for the platform"
        actions={
          <Button>
            <Mail className="size-4 mr-2" />
            Create New Template
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Templates</div>
            <div className="text-3xl font-bold mt-1">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-3xl font-bold mt-1 text-green-600">
              {templates.filter(t => t.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Categories</div>
            <div className="text-3xl font-bold mt-1">{categories.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat.toLowerCase()}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge className="bg-green-600">{template.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="size-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>Edit</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Subject Line</Label>
                    <div className="text-sm mt-1">{template.subject}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Template Body (Preview)</Label>
                    <div className="text-sm text-foreground mt-1 p-3 bg-muted rounded border">
                      {template.body.substring(0, 150)}...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {categories.slice(1).map((category) => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-4">
            {templates
              .filter(t => t.category === category)
              .map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge className="bg-green-600">{template.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="size-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>Edit</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Subject Line</Label>
                        <div className="text-sm mt-1">{template.subject}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Template Body (Preview)</Label>
                        <div className="text-sm text-foreground mt-1 p-3 bg-muted rounded border">
                          {template.body.substring(0, 150)}...
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Make changes to the template and save them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input placeholder="e.g., Welcome Email - Buyer" value={selectedTemplate?.name} />
            </div>

            <div>
              <Label>Category</Label>
              <Input placeholder="e.g., Onboarding" value={selectedTemplate?.category} />
            </div>

            <div>
              <Label>Email Subject</Label>
              <Input placeholder="Use {variables} for dynamic content" value={selectedTemplate?.subject} />
              <div className="text-xs text-muted-foreground mt-1">
                Available variables: {"{buyer_name}"}, {"{vendor_name}"}, {"{rfq_id}"}, {"{rfq_title}"}
              </div>
            </div>

            <div>
              <Label>Email Body</Label>
              <Textarea rows={10} placeholder="Compose your email template here..." value={uploadedContent} onChange={(e) => setUploadedContent(e.target.value)} />
            </div>

            <div className="border-t pt-4 mt-4">
              <Label className="mb-2 block">Upload Template Format</Label>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">Format Type</Label>
                  <Select value={uploadFormat} onValueChange={(value: "text" | "json") => setUploadFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4" />
                          Text Format (.txt)
                        </div>
                      </SelectItem>
                      <SelectItem value="json">
                        <div className="flex items-center gap-2">
                          <FileJson className="size-4" />
                          JSON Format (.json)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="size-4 mr-2" />
                        Upload File
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={uploadFormat === "json" ? ".json" : ".txt"}
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Upload a {uploadFormat === "json" ? "JSON" : "text"} file to populate the email template. 
                {uploadFormat === "json" && " JSON should contain 'subject' and 'body' fields."}
              </div>
            </div>

            <div className="flex gap-2">
              <Button>
                <Save className="size-4 mr-2" />
                Save Template
              </Button>
              <Button variant="outline">
                <Send className="size-4 mr-2" />
                Send Test
              </Button>
              <Button variant="outline">
                <Eye className="size-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}