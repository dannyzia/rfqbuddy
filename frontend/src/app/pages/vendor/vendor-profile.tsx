import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import {
  Save,
  Upload,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  PlayCircle,
  Building2,
  Phone,
  FileText,
  CreditCard,
} from "lucide-react";

export function VendorProfileEdit() {
  const [addUserOpen, setAddUserOpen] = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Smith", email: "john.smith@abc.com", role: "Account Manager", status: "active", joinDate: "2024-06-15" },
    { id: 2, name: "Emily Davis", email: "emily.d@abc.com", role: "Sales Representative", status: "active", joinDate: "2024-08-01" },
    { id: 3, name: "Mike Chen", email: "mike.c@abc.com", role: "Bid Coordinator", status: "active", joinDate: "2025-01-10" },
    { id: 4, name: "Sarah Johnson", email: "sarah.j@abc.com", role: "Viewer", status: "pending", joinDate: "2026-02-20" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  const vendorRoles = [
    { value: "Account Manager", label: "Account Manager", description: "Full access. Manage bids, team, and company profile." },
    { value: "Sales Representative", label: "Sales Representative", description: "Submit bids, respond to RFQs, and manage documents." },
    { value: "Bid Coordinator", label: "Bid Coordinator", description: "Prepare and coordinate bid submissions." },
    { value: "Viewer", label: "Viewer", description: "Read-only access to view available RFQs and bid status." },
  ];

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      setTeamMembers([
        ...teamMembers,
        {
          id: teamMembers.length + 1,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: "pending",
          joinDate: "2026-03-11",
        },
      ]);
      setNewUser({ name: "", email: "", role: "" });
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
      case "Account Manager":
        return <Badge className="bg-purple-600 text-white">Account Manager</Badge>;
      case "Sales Representative":
        return <Badge className="bg-blue-600 text-white">Sales Rep</Badge>;
      case "Bid Coordinator":
        return <Badge className="bg-teal-600 text-white">Bid Coordinator</Badge>;
      case "Viewer":
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Vendor Profile"
        description="Update your company information, documents, and manage your team"
        actions={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="company" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 bg-muted">
            <TabsTrigger value="company" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Building2 className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Company Info</span>
              <span className="sm:hidden">Company</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Phone className="size-3.5 sm:size-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <FileText className="size-3.5 sm:size-4" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="banking" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <CreditCard className="size-3.5 sm:size-4" />
              Banking
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Users className="size-3.5 sm:size-4" />
              Team
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input defaultValue="ABC Suppliers Ltd." />
                </div>
                <div>
                  <Label>Registration Number</Label>
                  <Input defaultValue="REG-12345678" />
                </div>
                <div>
                  <Label>Tax ID / VAT Number</Label>
                  <Input defaultValue="TAX-87654321" />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input defaultValue="Manufacturing" />
                </div>
              </div>
              <div>
                <Label>Company Description</Label>
                <Textarea rows={4} defaultValue="Leading supplier of industrial equipment and materials..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Year Established</Label>
                  <Input defaultValue="1995" />
                </div>
                <div>
                  <Label>Number of Employees</Label>
                  <Input defaultValue="150-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary Contact Name</Label>
                  <Input defaultValue="John Smith" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" defaultValue="john.smith@abc.com" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input defaultValue="+1 234 567 8900" />
                </div>
                <div>
                  <Label>Alternative Phone</Label>
                  <Input defaultValue="+1 234 567 8901" />
                </div>
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input defaultValue="123 Business Street" />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input defaultValue="Suite 400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input defaultValue="New York" />
                </div>
                <div>
                  <Label>State/Province</Label>
                  <Input defaultValue="NY" />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input defaultValue="10001" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Business Registration Certificate", status: "Uploaded", date: "2024-01-15" },
                { name: "Tax Clearance Certificate", status: "Uploaded", date: "2024-02-20" },
                { name: "Insurance Certificate", status: "Pending", date: null },
                { name: "Bank Reference Letter", status: "Uploaded", date: "2024-01-10" },
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.status === "Uploaded" && `Uploaded on ${doc.date}`}
                      {doc.status === "Pending" && "Not yet uploaded"}
                    </div>
                  </div>
                  <Button variant={doc.status === "Pending" ? "default" : "outline"} size="sm" className="self-start sm:self-center">
                    <Upload className="size-4 mr-2" />
                    {doc.status === "Pending" ? "Upload" : "Replace"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input defaultValue="Global Bank" />
                </div>
                <div>
                  <Label>Branch</Label>
                  <Input defaultValue="Main Street Branch" />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input defaultValue="********1234" />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input defaultValue="ABC Suppliers Ltd." />
                </div>
                <div>
                  <Label>SWIFT/BIC Code</Label>
                  <Input defaultValue="GLBBUS33XXX" />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input defaultValue="USD" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Vendor Role Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Team Roles</CardTitle>
              <CardDescription>Role categories available for your vendor team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {vendorRoles.map((role) => (
                  <div key={role.value} className="border rounded-lg p-4">
                    <div className="mb-2">{getRoleBadge(role.value)}</div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
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
                <CardDescription>Manage your vendor team members and their access levels</CardDescription>
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
                    <DialogDescription>Invite a new user to your vendor team. They will receive an email invitation.</DialogDescription>
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
                          {vendorRoles.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
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
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{member.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className=""
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
                                  ? "text-yellow-600 border-yellow-400 hover:bg-yellow-50 dark:border-yellow-700 dark:hover:bg-yellow-900/30"
                                  : "text-green-600 border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/30"
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