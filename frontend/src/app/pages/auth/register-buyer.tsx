import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Building2, Mail, Phone, User, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Link } from "react-router";

export function RegisterBuyer() {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState<"government" | "non-government">("government");

  const steps = ["Organisation Info", "Contact Details", "Account Setup", "Verification"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Procuring Entity Registration</h1>
        <p className="text-muted-foreground">Register your organisation to start procuring</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
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
                <span className={`text-sm ${i + 1 === step ? "font-semibold" : ""}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${i + 1 < step ? "bg-green-600" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Organization Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                The first user to register becomes the Organization Admin by default with full access rights.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <select
                id="orgType"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as "government" | "non-government")}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="government">Government Organization</option>
                <option value="non-government">Non-Government Organization</option>
              </select>
              <p className="text-sm text-muted-foreground">
                {orgType === "government"
                  ? "Can create PG/PW/PPS series tenders following Bangladesh PPA 2006"
                  : "Can create NRQ series (Simple/Detailed/Custom RFQ)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input id="orgName" placeholder="Enter legal organization name" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number *</Label>
                <Input id="regNo" placeholder="Company/Govt registration no." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax Identification Number (TIN)</Label>
                <Input id="taxId" placeholder="TIN number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Official Address *</Label>
              <Textarea id="address" placeholder="Enter full address" rows={3} required />
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

            {orgType === "government" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ministry">Ministry/Department</Label>
                  <Input id="ministry" placeholder="e.g., Ministry of Education" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingSource">Primary Funding Source</Label>
                  <select id="fundingSource" className="w-full border rounded-lg px-3 py-2">
                    <option>Government Budget</option>
                    <option>Development Partner</option>
                    <option>Own Revenue</option>
                    <option>Mixed</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>
                Next: Contact Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Details */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Primary Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                This person will be the Organization Admin and first Procurement Officer.
              </AlertDescription>
            </Alert>

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
              <Label htmlFor="designation">Designation/Title *</Label>
              <Input id="designation" placeholder="e.g., Procurement Officer" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" placeholder="email@organization.com" required />
              </div>
            </div>

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

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next: Account Setup</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Account Setup */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5" />
              Account Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input id="username" placeholder="Choose a username" required />
              <p className="text-sm text-muted-foreground">Minimum 4 characters, alphanumeric only</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" placeholder="Create a strong password" required />
              <p className="text-sm text-muted-foreground">
                Minimum 12 characters, must include uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input id="confirmPassword" type="password" placeholder="Re-enter password" required />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-semibold">Two-Factor Authentication (Optional)</Label>
              <div className="flex items-start gap-3">
                <Checkbox id="enable2FA" />
                <div className="space-y-1">
                  <label htmlFor="enable2FA" className="text-sm font-medium cursor-pointer">
                    Enable 2FA for enhanced security
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Receive a verification code via email or SMS on every login
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-semibold">Terms & Conditions</Label>
              <div className="flex items-start gap-3">
                <Checkbox id="terms" required />
                <div className="space-y-1">
                  <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                    I agree to the Terms & Conditions *
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)}>Next: Verification</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Verification */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Mail className="size-4" />
              <AlertDescription>
                A verification email has been sent to <strong>email@organization.com</strong>. Please check your inbox
                and click the verification link to complete registration.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                After email verification, your account will be reviewed by platform administrators. You'll receive a
                notification once your account is approved.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Verify your email address</li>
                  <li>Platform admin reviews your organization details</li>
                  <li>You receive approval notification</li>
                  <li>Log in and start creating tenders</li>
                  <li>As the first user, you'll have full Admin privileges</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Required Documents (Submit after approval)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Trade License / Government Registration Certificate</li>
                  <li>Tax Identification Number (TIN) Certificate</li>
                  <li>Authorization letter for Procurement Officer</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">Resend Verification Email</Button>
                <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}