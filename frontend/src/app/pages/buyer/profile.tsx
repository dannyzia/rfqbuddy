import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import {
  Save,
  Building2,
  Settings,
  Shield,
  SlidersHorizontal,
  Activity,
  Users,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  FileStack,
  AlertTriangle,
  Trash2,
  Edit,
  Lock,
  Smartphone,
  Mail,
  Globe,
  Bell,
  CreditCard,
  Calendar,
  TrendingUp,
  PlayCircle,
} from "lucide-react";
import { useTenderOptions } from "../../hooks/use-tender-options";

export function PurchaserProfile() {
  const {
    currencies,
    departments,
    countries,
    userRoles,
    tenderTypes,
  } = useTenderOptions();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bidAlerts, setBidAlerts] = useState(true);
  const [tenderExpiry, setTenderExpiry] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@company.com", role: "Admin", department: "Procurement", status: "active", joinDate: "2025-01-15" },
    { id: 2, name: "Jane Smith", email: "jane.smith@company.com", role: "Procurement Officer", department: "Operations", status: "active", joinDate: "2025-02-01" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@company.com", role: "Viewer", department: "Finance", status: "pending", joinDate: "2026-03-01" },
    { id: 4, name: "Alice Williams", email: "alice.w@company.com", role: "Procurement Officer", department: "IT", status: "withheld", joinDate: "2025-12-10" },
    { id: 5, name: "Carlos Rivera", email: "carlos.r@company.com", role: "Viewer", department: "Administration", status: "active", joinDate: "2025-08-22" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", department: "" });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setTeamMembers([
        ...teamMembers,
        {
          id: teamMembers.length + 1,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department || "Unassigned",
          status: "pending",
          joinDate: "2026-03-11",
        },
      ]);
      setNewUser({ name: "", email: "", role: "", department: "" });
      setAddUserOpen(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setTeamMembers(
      teamMembers.map((m) => {
        if (m.id === id) {
          if (m.status === "active") return { ...m, status: "withheld" };
          if (m.status === "withheld" || m.status === "pending") return { ...m, status: "active" };
        }
        return m;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
      case "withheld":
        return <Badge className="bg-orange-600 text-white">Withheld</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-600 text-white">Admin</Badge>;
      case "Procurement Officer":
        return <Badge className="bg-blue-600 text-white">Procurement Officer</Badge>;
      case "Viewer":
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const recentTenders = [
    { id: "PG-2026-045", title: "IT Hardware Procurement", type: "PG3", status: "Active", bids: 8, created: "2026-03-08" },
    { id: "NRQ-2026-012", title: "Office Furniture Supply", type: "NRQ1", status: "Active", bids: 5, created: "2026-03-05" },
    { id: "PW-2026-003", title: "Building Renovation Works", type: "PW1", status: "Evaluation", bids: 12, created: "2026-02-28" },
    { id: "PPS-2026-007", title: "Consulting Services for ERP", type: "PPS2", status: "Closed", bids: 6, created: "2026-02-15" },
    { id: "PG-2026-038", title: "Medical Equipment Supply", type: "PG1", status: "Active", bids: 15, created: "2026-03-01" },
  ];

  const activityStats = {
    totalTenders: 47,
    activeTenders: 12,
    pendingApprovals: 5,
    totalBids: 186,
    completedContracts: 23,
    avgBidsPerTender: 8.2,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Purchaser Profile"
        description="Manage your organization details, preferences, security, and team"
        actions={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="size-4 mr-2" />
            Save All Changes
          </Button>
        }
      />

      <Tabs defaultValue="organization" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 bg-muted">
            <TabsTrigger value="organization" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Building2 className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Organization</span>
              <span className="sm:hidden">Org</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Settings className="size-3.5 sm:size-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Shield className="size-3.5 sm:size-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <SlidersHorizontal className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Preferences</span>
              <span className="sm:hidden">Prefs</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Activity className="size-3.5 sm:size-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Users className="size-3.5 sm:size-4" />
              Team
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Organization Details */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Primary organization details used across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input defaultValue="GlobalTech Industries Pvt. Ltd." />
                </div>
                <div>
                  <Label>Trading Name</Label>
                  <Input defaultValue="GlobalTech Industries" />
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input defaultValue="REG-2024-GT-00185" />
                </div>
                <div>
                  <Label>Tax ID / VAT Number</Label>
                  <Input defaultValue="TAX-GT-9876543210" />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input defaultValue="Technology & Manufacturing" />
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select defaultValue="large">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                      <SelectItem value="large">Large (251-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Company Description</Label>
                <Textarea
                  rows={3}
                  defaultValue="GlobalTech Industries is a leading multi-sector organization specializing in technology procurement, infrastructure development, and consulting services across government and private sectors."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Address</CardTitle>
              <CardDescription>Official company address for all correspondence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Address Line 1</Label>
                <Input defaultValue="456 Enterprise Boulevard" />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input defaultValue="Tower A, Level 12" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>City</Label>
                  <Input defaultValue="Singapore" />
                </div>
                <div>
                  <Label>State / Province</Label>
                  <Input defaultValue="Central Region" />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input defaultValue="048583" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Select defaultValue="SG">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c: { value: string; label: string }) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
              <CardDescription>Main point of contact for the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Person</Label>
                  <Input defaultValue="Sarah Chen" />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input defaultValue="Chief Procurement Officer" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue="sarah.chen@globaltech.com" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input defaultValue="+65 6789 0123" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                      <SelectItem value="ms">Malay</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select defaultValue="asia-sg">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                      <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                      <SelectItem value="asia-sg">SGT (Singapore Time, UTC+8)</SelectItem>
                      <SelectItem value="asia-ae">GST (Gulf Standard Time, UTC+4)</SelectItem>
                      <SelectItem value="aest">AEST (Australian Eastern Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Number Format</Label>
                  <Select defaultValue="comma-dot">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma-dot">1,000.00 (Comma/Dot)</SelectItem>
                      <SelectItem value="dot-comma">1.000,00 (Dot/Comma)</SelectItem>
                      <SelectItem value="space-comma">1 000,00 (Space/Comma)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Delivery Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Email Notifications</div>
                        <div className="text-xs text-muted-foreground">Receive updates via email</div>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">SMS Notifications</div>
                        <div className="text-xs text-muted-foreground">Get text messages for critical alerts</div>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium">Push Notifications</div>
                        <div className="text-xs text-muted-foreground">Browser push notifications</div>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Bid Alerts</div>
                      <div className="text-xs text-muted-foreground">New bids received on your tenders</div>
                    </div>
                    <Switch checked={bidAlerts} onCheckedChange={setBidAlerts} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Tender Expiry Reminders</div>
                      <div className="text-xs text-muted-foreground">Alerts before tenders close</div>
                    </div>
                    <Switch checked={tenderExpiry} onCheckedChange={setTenderExpiry} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Weekly Digest</div>
                      <div className="text-xs text-muted-foreground">Summary of weekly procurement activity</div>
                    </div>
                    <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    defaultValue="currentpassword"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Password must contain:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="size-5" />
                Two-Factor Authentication (2FA)
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center ${twoFactorEnabled ? "bg-green-100 dark:bg-green-900/50" : "bg-muted"}`}>
                    <Shield className={`size-5 ${twoFactorEnabled ? "text-green-600" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      2FA is {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {twoFactorEnabled
                        ? "Your account is protected with authenticator app"
                        : "Enable 2FA for enhanced security"
                      }
                    </div>
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              {twoFactorEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm font-medium mb-1">Authenticator App</div>
                    <div className="text-xs text-muted-foreground mb-3">Use an authenticator app to generate codes</div>
                    <Badge className="bg-green-600 text-white">Connected</Badge>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm font-medium mb-1">Recovery Codes</div>
                    <div className="text-xs text-muted-foreground mb-3">Backup codes for account recovery</div>
                    <Button variant="outline" size="sm">
                      View Codes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage devices where you're currently logged in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { device: "Chrome on MacOS", location: "Singapore", lastActive: "Now", current: true },
                  { device: "Safari on iPhone 15", location: "Singapore", lastActive: "2 hours ago", current: false },
                  { device: "Firefox on Windows", location: "Kuala Lumpur, MY", lastActive: "1 day ago", current: false },
                ].map((session) => (
                  <div key={session.device} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && <Badge className="bg-green-600 text-white text-xs">Current</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.location} &middot; Last active: {session.lastActive}
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 self-start sm:self-center">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileStack className="size-5" />
                Default Tender Settings
              </CardTitle>
              <CardDescription>Pre-fill defaults when creating new tenders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Tender Type</Label>
                  <Select defaultValue="NRQ1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tenderTypes.map((t: { value: string; label: string }) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Default Department</Label>
                  <Select defaultValue="procurement">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d: { value: string; label: string }) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Currency & Financial Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary Currency</Label>
                  <Select defaultValue="SGD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c: { value: string; label: string }) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Secondary Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c: { value: string; label: string }) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5" />
                Approval Workflow Preferences
              </CardTitle>
              <CardDescription>Configure how approvals work in your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Require Admin Approval for Publishing</div>
                    <div className="text-xs text-muted-foreground">Tenders must be approved by admin before publishing</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Multi-Level Approval</div>
                    <div className="text-xs text-muted-foreground">Require multiple approvals for high-value tenders</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Auto-Approve Low Value Tenders</div>
                    <div className="text-xs text-muted-foreground">Skip approval for tenders below threshold</div>
                  </div>
                  <Switch />
                </div>
              </div>
              <div>
                <Label>Auto-Approval Threshold</Label>
                <Input type="number" defaultValue="10000" placeholder="Amount in primary currency" className="max-w-xs" />
                <p className="text-xs text-muted-foreground mt-1">Tenders below this amount will be auto-approved</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Summary */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Tenders", value: activityStats.totalTenders, icon: FileStack, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
              { label: "Active Tenders", value: activityStats.activeTenders, icon: Activity, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
              { label: "Pending Approvals", value: activityStats.pendingApprovals, icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/30" },
              { label: "Total Bids", value: activityStats.totalBids, icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
              { label: "Completed", value: activityStats.completedContracts, icon: CheckCircle, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
              { label: "Avg Bids/Tender", value: activityStats.avgBidsPerTender, icon: TrendingUp, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/30" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-4 pb-4 px-4">
                    <div className={`size-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                      <Icon className={`size-4 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tenders</CardTitle>
              <CardDescription>Your most recent procurement activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tender ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bids</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTenders.map((tender) => (
                      <TableRow key={tender.id}>
                        <TableCell className="font-mono text-sm font-medium">{tender.id}</TableCell>
                        <TableCell>{tender.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tender.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            tender.status === "Active" ? "bg-green-600 text-white" :
                            tender.status === "Evaluation" ? "bg-blue-600 text-white" :
                            "bg-muted-foreground text-white"
                          }>
                            {tender.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{tender.bids}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{tender.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procurement Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Tender Completion Rate", value: 87, color: "bg-green-600" },
                  { label: "On-Time Award Rate", value: 72, color: "bg-blue-600" },
                  { label: "Vendor Satisfaction", value: 91, color: "bg-purple-600" },
                  { label: "Budget Utilization", value: 68, color: "bg-orange-600" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{metric.label}</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team / Role Information */}
        <TabsContent value="team" className="space-y-6">
          {/* Role Categories Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Role Categories</CardTitle>
              <CardDescription>Your organization uses 3 role categories for team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {userRoles.map((role: { value: string; label: string; permissions: string[] }) => (
                  <div key={role.value} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {role.value === "admin" ? (
                        <Badge className="bg-purple-600 text-white">Admin</Badge>
                      ) : role.value === "procurement-officer" ? (
                        <Badge className="bg-blue-600 text-white">Procurement Officer</Badge>
                      ) : (
                        <Badge variant="outline">Viewer</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.value === "admin" && "Full access to all features. Can manage users, create tenders, and approve/withhold other users."}
                      {role.value === "procurement-officer" && "Can create and manage tenders, evaluate bids, and manage vendor relationships."}
                      {role.value === "viewer" && "Read-only access to view tenders, bids, and reports. Cannot create or modify anything."}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Permissions: {role.permissions.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="text-sm text-muted-foreground">Total Members</div>
                <div className="text-3xl font-bold">{teamMembers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-3xl font-bold text-green-600">{teamMembers.filter(m => m.status === "active").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">{teamMembers.filter(m => m.status === "pending").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="text-sm text-muted-foreground">Withheld</div>
                <div className="text-3xl font-bold text-orange-600">{teamMembers.filter(m => m.status === "withheld").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your organization's team members and their roles</CardDescription>
              </div>
              <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white self-start sm:self-center">
                    <UserPlus className="size-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                    <DialogDescription>Invite a new user to your organization. They will receive an email invitation.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Procurement Officer">Procurement Officer</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select value={newUser.department} onValueChange={(val) => setNewUser({ ...newUser, department: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d: { value: string; label: string }) => (
                            <SelectItem key={d.value} value={d.label}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <UserPlus className="size-4 mr-2" />
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell className="text-sm hidden md:table-cell">{member.department}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{member.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              title="Edit user"
                            >
                              <Edit className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(member.id)}
                              className={
                                member.status === "active"
                                  ? "text-yellow-600 border-yellow-400 hover:bg-yellow-50"
                                  : "text-green-600 border-green-400 hover:bg-green-50"
                              }
                              title={member.status === "active" ? "Withhold" : "Activate"}
                            >
                              {member.status === "active" ? <Shield className="size-3.5" /> : <PlayCircle className="size-3.5" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(member.id)}
                              className="text-red-600 border-red-400 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
                              title="Delete user"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}