import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  AlertCircle,
  Upload,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";

export function RegisterVendor() {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const steps = ["Company Info", "Contact & Account", "Categories", "Documents", "Verification"];

  const categories = [
    { id: "goods_general", name: "General Goods", subcategories: ["Office Supplies", "Furniture", "Electronics"] },
    { id: "goods_medical", name: "Medical Supplies", subcategories: ["Pharmaceuticals", "Equipment", "Consumables"] },
    { id: "works_construction", name: "Construction Works", subcategories: ["Building", "Roads", "Bridges"] },
    { id: "works_maintenance", name: "Maintenance Works", subcategories: ["Building Maintenance", "Equipment"] },
    { id: "services_consulting", name: "Consulting Services", subcategories: ["IT", "Management", "Engineering"] },
    { id: "services_it", name: "IT Services", subcategories: ["Software Development", "Support", "Infrastructure"] },
  ];

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Vendor Registration</h1>
          <p className="text-muted-foreground">Register to bid on available tenders</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      i + 1 === step
                        ? "bg-blue-600 text-white"
                        : i + 1 < step
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs ${i + 1 === step ? "font-semibold" : ""}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${i + 1 < step ? "bg-green-600" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Company Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  All fields marked with * are mandatory. Ensure information matches your legal documents.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="companyName">Legal Company Name *</Label>
                <Input id="companyName" placeholder="As per trade license" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <select id="businessType" className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Select business type</option>
                  <option>Sole Proprietorship</option>
                  <option>Partnership</option>
                  <option>Private Limited Company</option>
                  <option>Public Limited Company</option>
                  <option>NGO/Non-Profit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tradeLicenseNo">Trade License Number *</Label>
                  <Input id="tradeLicenseNo" placeholder="License number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
                  <Input id="licenseExpiry" type="date" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tinNo">Tax Identification Number (TIN) *</Label>
                  <Input id="tinNo" placeholder="TIN number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNo">VAT Registration Number</Label>
                  <Input id="vatNo" placeholder="VAT number (if applicable)" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEstablished">Year Established *</Label>
                <Input id="yearEstablished" type="number" placeholder="YYYY" min="1900" max="2026" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Registered Office Address *</Label>
                <Textarea id="address" placeholder="Full address" rows={3} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="City" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" placeholder="Postal code" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input id="website" type="url" placeholder="https://www.example.com" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)}>Next: Contact & Account</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contact & Account */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Contact Details & Account Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Primary Contact Person</h4>
                <p className="text-sm">This person will be the account administrator for your company.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="First name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Last name" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input id="designation" placeholder="e.g., Managing Director, Sales Manager" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10" placeholder="email@company.com" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input id="phone" type="tel" className="pl-10" placeholder="+880 1XXX-XXXXXX" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altPhone">Alternative Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input id="altPhone" type="tel" className="pl-10" placeholder="+880 1XXX-XXXXXX" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lock className="size-4" />
                  Account Credentials
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input id="username" placeholder="Choose a username" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" placeholder="Create a strong password" required />
                  <p className="text-sm text-muted-foreground">Minimum 12 characters with uppercase, lowercase, number, and special character</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" placeholder="Re-enter password" required />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Next: Select Categories</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Business Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Select all categories relevant to your business. You'll only see tenders matching these categories.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={cat.id} className="font-medium cursor-pointer">
                          {cat.name}
                        </label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cat.subcategories.map((sub) => (
                            <span key={sub} className="text-xs bg-muted px-2 py-1 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    <CheckCircle2 className="size-4 inline mr-2" />
                    {selectedCategories.length} {selectedCategories.length === 1 ? "category" : "categories"} selected
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} disabled={selectedCategories.length === 0}>
                  Next: Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" />
                Upload Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Upload clear, legible copies of all required documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
                </AlertDescription>
              </Alert>

              {[
                { id: "tradeLicense", name: "Trade License", required: true },
                { id: "tinCert", name: "TIN Certificate", required: true },
                { id: "vatCert", name: "VAT Registration Certificate", required: false },
                { id: "bankSolvency", name: "Bank Solvency Certificate", required: true },
                { id: "companyProfile", name: "Company Profile", required: false },
                { id: "financialStatements", name: "Latest Audited Financial Statements", required: false },
                { id: "experienceCerts", name: "Experience Certificates / Work Orders", required: false },
              ].map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {doc.name}
                        {doc.required && <span className="text-red-600 ml-1">*</span>}
                      </span>
                    </div>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted cursor-pointer">
                    <Upload className="size-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                      <br />
                      <span className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</span>
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Document Guidelines</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Ensure all documents are valid and not expired</li>
                  <li>Documents should be clear and legible</li>
                  <li>File names should be descriptive (e.g., "TradeLicense_2026.pdf")</li>
                  <li>You can update documents later from your profile</li>
                </ul>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button onClick={() => setStep(5)}>Next: Verification</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Verification */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Terms & Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox id="termsAccept" required />
                  <div className="space-y-1">
                    <label htmlFor="termsAccept" className="text-sm font-medium cursor-pointer">
                      I accept the Terms & Conditions *
                    </label>
                    <p className="text-sm text-muted-foreground">
                      <a href="#" className="text-blue-600 hover:underline">
                        Read Terms of Service
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="privacyAccept" required />
                  <div className="space-y-1">
                    <label htmlFor="privacyAccept" className="text-sm font-medium cursor-pointer">
                      I accept the Privacy Policy *
                    </label>
                    <p className="text-sm text-muted-foreground">
                      <a href="#" className="text-blue-600 hover:underline">
                        Read Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="dataAccuracy" required />
                  <div className="space-y-1">
                    <label htmlFor="dataAccuracy" className="text-sm font-medium cursor-pointer">
                      I confirm all provided information is accurate *
                    </label>
                  </div>
                </div>
              </div>

              <Alert>
                <Mail className="size-4" />
                <AlertDescription>
                  After submission, you'll receive a verification email. Your account will be reviewed by buyers before
                  you can participate in tenders.
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Verify your email address</li>
                  <li>Your documents will be reviewed (typically 2-5 business days)</li>
                  <li>You'll receive approval notification</li>
                  <li>Complete enlistment forms from buyers (if required)</li>
                  <li>Start bidding on available tenders</li>
                </ol>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Back
                </Button>
                <Button onClick={() => alert("Registration submitted successfully!")}>Submit Registration</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
}