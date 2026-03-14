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
  Send,
  AlertCircle,
  Building2,
  FileText,
  Upload,
  CheckCircle,
  Info,
} from "lucide-react";

export function ApplyEnlistment() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EnlistmentDetailsStep />;
      case 2:
        return <CompanyInformationStep />;
      case 3:
        return <DocumentsUploadStep />;
      case 4:
        return <CategorySelectionStep />;
      case 5:
        return <ReviewSubmitStep />;
      default:
        return null;
    }
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <PageTemplate
      title="Apply for Vendor Enlistment"
      description="Submit your application to become an enlisted vendor"
      actions={
        <Button variant="outline">
          <Save className="size-4 mr-2" />
          Save Draft
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Application Progress</span>
                <span className="text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="flex items-center justify-between">
                {["Details", "Company Info", "Documents", "Categories", "Review"].map((step, index) => {
                  const stepNum = index + 1;
                  const isActive = currentStep === stepNum;
                  const isCompleted = currentStep > stepNum;
                  
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="size-5" /> : stepNum}
                      </div>
                      <span className="text-xs font-medium text-center">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="size-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next Step
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="size-4 mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}

function EnlistmentDetailsStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enlistment Request Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-600">
          <Info className="size-4" />
          <AlertDescription>
            You are applying for enlistment with <strong>ABC Corporation Ltd.</strong>
            <br />
            Enlistment Form: <strong>Standard Vendor Enlistment - 2026</strong>
          </AlertDescription>
        </Alert>

        <div className="p-4 border rounded-lg bg-muted">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Purchaser Organization</div>
              <div className="font-medium">ABC Corporation Ltd.</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Enlistment Type</div>
              <div className="font-medium">General Goods & Services</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Application Deadline</div>
              <div className="font-medium">2026-04-30</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Validity Period</div>
              <div className="font-medium">2 years from approval</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Enlistment Application *</Label>
          <Textarea
            id="reason"
            rows={4}
            placeholder="Explain why you want to become an enlisted vendor with this organization..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAreas">Primary Business Areas *</Label>
          <Textarea
            id="businessAreas"
            rows={3}
            placeholder="Describe your main business activities, products, and services..."
          />
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Please ensure all information provided is accurate and up-to-date. False information may lead to disqualification.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function CompanyInformationStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input id="companyName" placeholder="Legal registered company name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tradeLicense">Trade License Number *</Label>
            <Input id="tradeLicense" placeholder="TL-XXXXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseIssueDate">License Issue Date *</Label>
            <Input id="licenseIssueDate" type="date" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tin">TIN Number *</Label>
            <Input id="tin" placeholder="XXX-XXX-XXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatReg">VAT Registration Number</Label>
            <Input id="vatReg" placeholder="VAT-XXXXXXXXX" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyType">Company Type *</Label>
          <select id="companyType" className="w-full border rounded-lg px-3 py-2">
            <option>Private Limited Company</option>
            <option>Public Limited Company</option>
            <option>Partnership Firm</option>
            <option>Sole Proprietorship</option>
            <option>Joint Venture</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Registered Office Address *</Label>
          <Textarea id="address" rows={3} placeholder="Full address with city, postal code" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone *</Label>
            <Input id="phone" type="tel" placeholder="+880-XXX-XXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Company Email *</Label>
            <Input id="email" type="email" placeholder="company@example.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input id="website" type="url" placeholder="https://www.company.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="establishmentYear">Year of Establishment *</Label>
            <Input id="establishmentYear" type="number" placeholder="YYYY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Number of Employees</Label>
            <Input id="employeeCount" type="number" placeholder="0" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualTurnover">Annual Turnover (BDT)</Label>
          <Input id="annualTurnover" type="number" placeholder="0.00" />
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsUploadStep() {
  const requiredDocuments = [
    { id: 1, name: "Trade License", description: "Valid trade license copy", required: true },
    { id: 2, name: "TIN Certificate", description: "Tax Identification Number certificate", required: true },
    { id: 3, name: "VAT Registration", description: "VAT registration certificate (if applicable)", required: false },
    { id: 4, name: "Company Incorporation Certificate", description: "Certificate of incorporation/registration", required: true },
    { id: 5, name: "Bank Solvency Certificate", description: "Recent bank solvency (within 6 months)", required: true },
    { id: 6, name: "Company Profile", description: "Detailed company profile/brochure", required: true },
    { id: 7, name: "Past Performance Certificate", description: "Work completion certificates from previous clients", required: false },
    { id: 8, name: "ISO Certifications", description: "Quality certifications (if any)", required: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <FileText className="size-4" />
          <AlertDescription>
            Upload clear, legible copies of all required documents. Accepted formats: PDF, JPG, PNG (max 5MB per file).
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {requiredDocuments.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{doc.name}</div>
                    {doc.required && (
                      <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{doc.description}</div>
                  <div className="text-sm text-muted-foreground mt-2">No file uploaded</div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="size-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Alert className="bg-yellow-50 border-yellow-600">
          <AlertCircle className="size-4" />
          <AlertDescription>
            All documents marked as "Required" must be uploaded before you can submit your application.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function CategorySelectionStep() {
  const categories = [
    { id: 1, name: "Office Supplies & Stationery", selected: false },
    { id: 2, name: "IT Equipment & Software", selected: false },
    { id: 3, name: "Furniture & Fixtures", selected: false },
    { id: 4, name: "Construction Materials", selected: false },
    { id: 5, name: "Electrical & Electronics", selected: false },
    { id: 6, name: "Printing & Publishing Services", selected: false },
    { id: 7, name: "Cleaning & Maintenance Services", selected: false },
    { id: 8, name: "Transportation & Logistics", selected: false },
    { id: 9, name: "Food & Catering Services", selected: false },
    { id: 10, name: "Security Services", selected: false },
    { id: 11, name: "Consulting Services", selected: false },
    { id: 12, name: "Training & Development", selected: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product/Service Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-600">
          <Building2 className="size-4" />
          <AlertDescription>
            Select all categories that match your business offerings. You will only be invited to tenders in selected categories.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Select Categories (Select all that apply) *</Label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
              >
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherCategories">Other Categories (if not listed above)</Label>
          <Textarea
            id="otherCategories"
            rows={3}
            placeholder="Specify any additional product/service categories you offer..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Core Specialization/Expertise *</Label>
          <Textarea
            id="specialization"
            rows={4}
            placeholder="Describe your company's core expertise and competitive advantages..."
          />
        </div>

        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            You must select at least one category to proceed with your application.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ReviewSubmitStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit Application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-600">
          <Info className="size-4" />
          <AlertDescription>
            Please review all information carefully before submitting. You can go back to previous steps to make changes.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3 flex items-center gap-2">
              <Building2 className="size-4" />
              Company Information
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Company Name:</span>
                <div className="font-medium">Not provided</div>
              </div>
              <div>
                <span className="text-muted-foreground">Trade License:</span>
                <div className="font-medium">Not provided</div>
              </div>
              <div>
                <span className="text-muted-foreground">TIN:</span>
                <div className="font-medium">Not provided</div>
              </div>
              <div>
                <span className="text-muted-foreground">Contact Email:</span>
                <div className="font-medium">Not provided</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3 flex items-center gap-2">
              <FileText className="size-4" />
              Documents Status
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Trade License</span>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Not Uploaded
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>TIN Certificate</span>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Not Uploaded
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Company Profile</span>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Not Uploaded
                </Badge>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="size-4" />
              Selected Categories
            </div>
            <div className="text-sm text-muted-foreground">
              No categories selected yet
            </div>
          </div>
        </div>

        <Alert className="bg-yellow-50 border-yellow-600">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>Validation Errors:</strong> Please complete all required fields and upload mandatory documents before submitting.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label className="text-base font-medium">Declaration *</Label>
            <label className="flex items-start gap-3 p-4 border rounded-lg">
              <input type="checkbox" className="rounded mt-1" />
              <span className="text-sm">
                I hereby declare that all information provided in this application is true, accurate, and complete to the best of my knowledge. I understand that providing false information may result in disqualification and legal consequences.
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-4 border rounded-lg">
              <input type="checkbox" className="rounded mt-1" />
              <span className="text-sm">
                I agree to the terms and conditions of the vendor enlistment program and will comply with all requirements set by the purchaser organization.
              </span>
            </label>
          </div>
        </div>

        <Alert className="bg-green-50 border-green-600">
          <CheckCircle className="size-4" />
          <AlertDescription>
            Once submitted, your application will be reviewed by the purchaser. You will receive updates via email and can track the status in your dashboard.
          </AlertDescription>
        </Alert>

        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
          <Send className="size-5 mr-2" />
          Submit Enlistment Application
        </Button>
      </CardContent>
    </Card>
  );
}