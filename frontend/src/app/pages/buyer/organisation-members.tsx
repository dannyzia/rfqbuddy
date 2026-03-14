import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, Mail, Trash2 } from "lucide-react";

export function OrganisationMembers() {
  const members = [
    { name: "John Smith", email: "john@example.com", role: "Tenant Admin", status: "Active", lastLogin: "2 hours ago" },
    { name: "Sarah Johnson", email: "sarah@example.com", role: "Procurement Head", status: "Active", lastLogin: "1 day ago" },
    { name: "Mike Wilson", email: "mike@example.com", role: "Technical Evaluator", status: "Active", lastLogin: "3 days ago" },
    { name: "Emily Brown", email: "emily@example.com", role: "Commercial Evaluator", status: "Invited", lastLogin: "Never" },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Organisation Members"
        description="Manage team members and their roles"
        actions={
          <Button>
            <Plus className="size-4 mr-2" />
            Add Member
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0 sm:p-6">
          <div className="md:hidden flex flex-col gap-3 p-4">
            {members.map((member, i) => (
              <Card key={i} className="overflow-hidden border shadow-sm">
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t mt-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                    <select className="border rounded px-2 py-1 text-sm w-full bg-transparent">
                      <option>{member.role}</option>
                      <option>Tenant Admin</option>
                      <option>Procurement Head</option>
                      <option>Technical Evaluator</option>
                      <option>Commercial Evaluator</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t mt-1 text-sm">
                    <div className="text-muted-foreground">
                      Last login: <span className="text-foreground font-medium">{member.lastLogin}</span>
                    </div>
                    <div className="flex gap-2">
                      {member.status === "Invited" && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="size-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>{member.role}</option>
                      <option>Tenant Admin</option>
                      <option>Procurement Head</option>
                      <option>Technical Evaluator</option>
                      <option>Commercial Evaluator</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {member.status === "Invited" && (
                        <Button variant="ghost" size="sm">
                          <Mail className="size-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="size-4 text-red-600" />
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
    </div>
  );
}