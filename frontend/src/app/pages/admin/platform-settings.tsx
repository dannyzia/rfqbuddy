import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Save, Settings } from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { adminApi } from "../../lib/api/admin.api";

export function PlatformSettings() {
  const { data: apiSettings } = useApiOrMock(
    () => adminApi.getSettings(),
    [],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Platform Settings"
        description="Configure platform-wide settings and preferences"
        actions={
          <Button>
            <Save className="size-4 mr-2" />
            Save All Changes
          </Button>
        }
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rfq">RFQ Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Platform Name</Label>
                <Input defaultValue="RFQ/Tendering Platform" />
              </div>

              <div>
                <Label>Platform URL</Label>
                <Input defaultValue="https://rfq-platform.com" />
              </div>

              <div>
                <Label>Support Email</Label>
                <Input type="email" defaultValue="support@rfq-platform.com" />
              </div>

              <div>
                <Label>Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Terms & Conditions</Label>
                <Textarea rows={4} defaultValue="Platform terms and conditions..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfq">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-publish RFQs</Label>
                  <div className="text-sm text-muted-foreground">Automatically publish RFQs after approval</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Buyer Approval</Label>
                  <div className="text-sm text-muted-foreground">New buyers must be approved by admin</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Vendor Approval</Label>
                  <div className="text-sm text-muted-foreground">New vendors must be approved by admin</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>Default RFQ Duration (days)</Label>
                <Input type="number" defaultValue="30" />
              </div>

              <div>
                <Label>Minimum Bid Submission Time (hours)</Label>
                <Input type="number" defaultValue="48" />
              </div>

              <div>
                <Label>Maximum File Upload Size (MB)</Label>
                <Input type="number" defaultValue="10" />
              </div>

              <div>
                <Label>Allowed File Types</Label>
                <Input defaultValue=".pdf, .doc, .docx, .xls, .xlsx, .zip" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">Send email notifications to users</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <div className="text-sm text-muted-foreground">Send SMS notifications for urgent updates</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>In-App Notifications</Label>
                  <div className="text-sm text-muted-foreground">Show notifications within the platform</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notify on New RFQ</Label>
                  <div className="text-sm text-muted-foreground">Alert vendors when new RFQs are published</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notify on Bid Submission</Label>
                  <div className="text-sm text-muted-foreground">Alert buyers when bids are received</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Deadline Reminders</Label>
                  <div className="text-sm text-muted-foreground">Send reminders before RFQ deadlines</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>Reminder Before Deadline (hours)</Label>
                <Input type="number" defaultValue="24" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">Require 2FA for all users</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Verification Required</Label>
                  <div className="text-sm text-muted-foreground">Users must verify email before access</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>Password Minimum Length</Label>
                <Input type="number" defaultValue="8" />
              </div>

              <div>
                <Label>Password Complexity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (letters only)</SelectItem>
                    <SelectItem value="medium">Medium (letters + numbers)</SelectItem>
                    <SelectItem value="high">High (letters + numbers + symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="60" />
              </div>

              <div>
                <Label>Maximum Login Attempts</Label>
                <Input type="number" defaultValue="5" />
              </div>

              <div>
                <Label>Account Lockout Duration (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Payment Gateway</Label>
                  <div className="text-sm text-muted-foreground">Integrate with payment processors</div>
                </div>
                <Switch />
              </div>

              <div>
                <Label>Payment Gateway Provider</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>API Key</Label>
                <Input type="password" placeholder="Enter API key..." />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Cloud Storage</Label>
                  <div className="text-sm text-muted-foreground">Store documents in cloud storage</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>Cloud Storage Provider</Label>
                <Select defaultValue="aws">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS S3</SelectItem>
                    <SelectItem value="azure">Azure Storage</SelectItem>
                    <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Analytics</Label>
                  <div className="text-sm text-muted-foreground">Track platform usage and metrics</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}