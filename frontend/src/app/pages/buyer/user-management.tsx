import { useState, useMemo, useCallback } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Search, UserPlus, CheckCircle, Shield, Trash2, PlayCircle, Settings,
  Plus, Edit, Copy, Lock, Unlock, Eye, EyeOff, ChevronDown, ChevronUp,
  Users, ShieldCheck, Crown, FileText, ClipboardCheck, DollarSign,
  UserCheck, Building2, LayoutDashboard, FileStack, TrendingUp, Activity,
  ScrollText, Calendar, Bell, HelpCircle, BookOpen, User, X, Save,
  AlertTriangle, Info, ArrowRight, ToggleLeft, ToggleRight, GripVertical,
  Tag, Layers, Mail, Send, Clock, RefreshCw,
} from "lucide-react";
import { useAuth } from "../../contexts/auth-context";
import { useRoles, type RoleDef, type RolePermissions, type NavItem } from "../../hooks/use-roles";

// ─── Icon resolver ──────────────────────────────────────────────────────────

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, FileStack, Users, Building2, TrendingUp, Activity,
  ScrollText, Calendar, FileText, Bell, User, HelpCircle, Settings,
  ShieldCheck, BookOpen, Shield, DollarSign, ClipboardCheck, UserCheck, Crown, Eye,
};

function resolveIcon(name: string) {
  return ICON_MAP[name] || FileText;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "pending" | "withheld";
  joinDate: string;
  lastActive: string;
  tenderCount: number;
}

interface CustomRole {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;
  isSystem: boolean;      // true = from roles.json, cannot delete
  isCustom: boolean;      // true = created by PE Admin
  entityType: string;
  permissions: RolePermissions;
  navigation: NavItem[];
  tenderColumns: string[];
  tenderVisibility: "org_all" | "tagged_only";
  createdBy?: string;
  createdAt?: string;
}

// ─── All available permission keys with labels ──────────────────────────────

const PERMISSION_DEFS: { key: keyof RolePermissions; label: string; group: string; description: string }[] = [
  { key: "canCreateTender", label: "Create Tenders", group: "Tender Lifecycle", description: "Can create new tenders/RFQs" },
  { key: "canEditTender", label: "Edit Tenders", group: "Tender Lifecycle", description: "Can edit draft tenders" },
  { key: "canDeleteTender", label: "Delete Tenders", group: "Tender Lifecycle", description: "Can delete draft tenders" },
  { key: "canPublishTender", label: "Publish Tenders", group: "Tender Lifecycle", description: "Can publish tenders for bidding" },
  { key: "canWithholdTender", label: "Withhold Tenders", group: "Tender Lifecycle", description: "Can temporarily suspend tenders" },
  { key: "canConfigureWorkflow", label: "Configure Workflow", group: "Workflow", description: "Can set up approval workflow stages and assign evaluators" },
  { key: "canAssignRoles", label: "Assign Roles", group: "Administration", description: "Can assign roles to other organisation members" },
  { key: "canManageOrgUsers", label: "Manage Users", group: "Administration", description: "Can add, approve, withhold, and remove users" },
  { key: "canViewAllOrgTenders", label: "View All Org Tenders", group: "Visibility", description: "Can see all tenders within the organisation regardless of tagging" },
  { key: "canEvaluate", label: "Evaluate Bids", group: "Evaluation", description: "Can score and evaluate vendor bids" },
  { key: "canApprove", label: "Approve Awards", group: "Evaluation", description: "Can make final award/reject decisions" },
  { key: "canBid", label: "Submit Bids", group: "Vendor", description: "Can submit bids on tenders (vendor-side)" },
  { key: "canViewVendorPortal", label: "Access Vendor Portal", group: "Vendor", description: "Can access the vendor portal and RFQ listings" },
];

const PERMISSION_GROUPS = ["Tender Lifecycle", "Workflow", "Administration", "Visibility", "Evaluation"];

// ─── Page-level action mapping: which permissions belong to which menu page ─

type PageAction = { key: keyof RolePermissions; label: string; description: string };

const PE_PAGE_ACTIONS: Record<string, PageAction[]> = {
  "/dashboard": [],
  "/tenders": [
    { key: "canCreateTender", label: "Create Tenders", description: "Can create new tenders/RFQs" },
    { key: "canEditTender", label: "Edit Tenders", description: "Can edit draft tenders" },
    { key: "canDeleteTender", label: "Delete Tenders", description: "Can delete draft tenders" },
    { key: "canPublishTender", label: "Publish Tenders", description: "Can publish tenders for bidding" },
    { key: "canWithholdTender", label: "Withhold Tenders", description: "Can temporarily suspend tenders" },
    { key: "canConfigureWorkflow", label: "Configure Workflow", description: "Can set up approval workflow stages and assign evaluators" },
  ],
  "/user-management": [
    { key: "canManageOrgUsers", label: "Add & Remove Users", description: "Can add, approve, withhold, and remove users" },
    { key: "canAssignRoles", label: "Assign Roles", description: "Can assign roles to other organisation members" },
  ],
  "/vendors": [],
  "/analytics": [],
  "/activity-logs": [],
  "/calendar": [],
  "/vendor-dashboard/calendar": [],
  "/reports": [],
  "/notifications": [],
  "/how-to-use": [],
  "/vendor-dashboard/how-to-use": [],
  "/profile": [],
  "/support/my-tickets": [],
};

const VENDOR_PAGE_ACTIONS: Record<string, PageAction[]> = {
  "/vendor-dashboard": [],
  "/rfqs": [
    { key: "canBid", label: "Submit Bids", description: "Can submit bids on tenders" },
    { key: "canViewVendorPortal", label: "Browse RFQ Listings", description: "Can access the vendor portal and RFQ listings" },
  ],
  "/vendor-bids": [],
  "/vendor-users": [
    { key: "canManageOrgUsers", label: "Add & Remove Users", description: "Can add, approve, withhold, and remove users" },
    { key: "canAssignRoles", label: "Assign Roles", description: "Can assign roles to other team members" },
  ],
  "/vendor-profile": [],
  "/vendor-activity-logs": [],
  "/notifications": [],
  "/support/my-tickets": [],
};

const APPROVAL_PERMISSIONS: PageAction[] = [
  { key: "canEvaluate", label: "Evaluate Bids", description: "Can score and evaluate vendor bids during the evaluation stage" },
  { key: "canApprove", label: "Approve Awards", description: "Can make final award/reject decisions on evaluated tenders" },
  { key: "canViewAllOrgTenders", label: "View All Org Tenders", description: "Can see all tenders within the organisation regardless of tagging" },
];

// ─── All available navigation items for PE roles ────────────────────────────

const ALL_PE_NAV_ITEMS: (NavItem & { description: string })[] = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", description: "Organisation overview and stats" },
  { name: "Tenders", path: "/tenders", icon: "FileStack", description: "View and manage tenders/RFQs" },
  { name: "User Management", path: "/user-management", icon: "Users", description: "Manage org users and roles" },
  { name: "Vendors", path: "/vendors", icon: "Building2", description: "Browse enlisted vendors" },
  { name: "Analytics", path: "/analytics", icon: "TrendingUp", description: "Procurement analytics and insights" },
  { name: "Activity Logs", path: "/activity-logs", icon: "ScrollText", description: "Audit trail and activity history" },
  { name: "Calendar", path: "/calendar", icon: "Calendar", description: "Tender deadlines and events" },
  { name: "Reports", path: "/reports", icon: "FileText", description: "Generate and view procurement reports" },
  { name: "Notifications", path: "/notifications", icon: "Bell", description: "Alerts and notification center" },
  { name: "Profile / Settings", path: "/profile", icon: "Settings", description: "Organisation profile and settings" },
  { name: "Support", path: "/support/my-tickets", icon: "HelpCircle", description: "Help desk and support tickets" },
  { name: "How to Use", path: "/how-to-use", icon: "BookOpen", description: "Platform usage guide and documentation" },
];

const ALL_VENDOR_NAV_ITEMS: (NavItem & { description: string })[] = [
  { name: "Dashboard", path: "/vendor-dashboard", icon: "LayoutDashboard", description: "Vendor overview and stats" },
  { name: "Available RFQs", path: "/rfqs", icon: "FileStack", description: "Browse and bid on tenders" },
  { name: "My Bids", path: "/vendor-bids", icon: "FileText", description: "Track submitted bids" },
  { name: "User Management", path: "/vendor-users", icon: "Users", description: "Manage vendor team members" },
  { name: "Company Profile", path: "/vendor-profile", icon: "Building2", description: "Company details and enlistment" },
  { name: "Calendar", path: "/vendor-dashboard/calendar", icon: "Calendar", description: "Bid deadlines and events" },
  { name: "Activity Logs", path: "/vendor-activity-logs", icon: "ScrollText", description: "Bid and submission activity" },
  { name: "Notifications", path: "/notifications", icon: "Bell", description: "Alerts and notifications" },
  { name: "Support", path: "/support/my-tickets", icon: "HelpCircle", description: "Help desk" },
  { name: "How to Use", path: "/vendor-dashboard/how-to-use", icon: "BookOpen", description: "Vendor platform usage guide" },
];

// ─── Available tender columns ───────────────────────────────────────────────

const ALL_TENDER_COLUMNS: { id: string; label: string }[] = [
  { id: "reference", label: "Reference No." },
  { id: "title", label: "Title" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "stage", label: "Workflow Stage" },
  { id: "deadline", label: "Deadline" },
  { id: "bids", label: "No. of Bids" },
  { id: "value", label: "Estimated Value" },
  { id: "recommendedVendor", label: "Recommended Vendor" },
  { id: "actions", label: "Actions" },
];

// ─── Available colors for roles ─────────────────────────────────────────────

const ROLE_COLORS = [
  { id: "blue", label: "Blue", bg: "bg-blue-100", text: "text-blue-700" },
  { id: "indigo", label: "Indigo", bg: "bg-indigo-100", text: "text-indigo-700" },
  { id: "purple", label: "Purple", bg: "bg-purple-100", text: "text-purple-700" },
  { id: "teal", label: "Teal", bg: "bg-teal-100", text: "text-teal-700" },
  { id: "green", label: "Green", bg: "bg-green-100", text: "text-green-700" },
  { id: "amber", label: "Amber", bg: "bg-amber-100", text: "text-amber-700" },
  { id: "red", label: "Red", bg: "bg-red-100", text: "text-red-700" },
  { id: "cyan", label: "Cyan", bg: "bg-cyan-100", text: "text-cyan-700" },
  { id: "emerald", label: "Emerald", bg: "bg-emerald-100", text: "text-emerald-700" },
  { id: "orange", label: "Orange", bg: "bg-orange-100", text: "text-orange-700" },
  { id: "pink", label: "Pink", bg: "bg-pink-100", text: "text-pink-700" },
  { id: "rose", label: "Rose", bg: "bg-rose-100", text: "text-rose-700" },
];

// ─── Available icons for roles ──────────────────────────────────────────────

const ROLE_ICONS = [
  { id: "Shield", label: "Shield", Icon: Shield },
  { id: "Settings", label: "Settings", Icon: Settings },
  { id: "FileText", label: "Document", Icon: FileText },
  { id: "DollarSign", label: "Dollar", Icon: DollarSign },
  { id: "ClipboardCheck", label: "Clipboard", Icon: ClipboardCheck },
  { id: "UserCheck", label: "User Check", Icon: UserCheck },
  { id: "Crown", label: "Crown", Icon: Crown },
  { id: "Eye", label: "Eye", Icon: Eye },
  { id: "Users", label: "Users", Icon: Users },
  { id: "Building2", label: "Building", Icon: Building2 },
  { id: "ShieldCheck", label: "Shield Check", Icon: ShieldCheck },
  { id: "BookOpen", label: "Book", Icon: BookOpen },
];

// ─── Mock org users ─────────────────────────────────────────────────────────

const INITIAL_USERS: OrgUser[] = [
  { id: "u-admin-01", name: "Shamim Ahmed", email: "shamim@mof.gov.bd", role: "pe_admin", department: "IT & Systems", status: "active", joinDate: "2025-01-05", lastActive: "Today", tenderCount: 0 },
  { id: "u-proc-01", name: "Nasir Uddin", email: "nasir.uddin@mof.gov.bd", role: "procurer", department: "Procurement", status: "active", joinDate: "2025-01-10", lastActive: "Today", tenderCount: 6 },
  { id: "u-ph-01", name: "Kamal Uddin", email: "kamal.uddin@mof.gov.bd", role: "procurement_head", department: "Procurement", status: "active", joinDate: "2025-01-10", lastActive: "Yesterday", tenderCount: 5 },
  { id: "u-pq-01", name: "Nusrat Jahan", email: "nusrat.j@mof.gov.bd", role: "prequal_evaluator", department: "Procurement", status: "active", joinDate: "2025-02-01", lastActive: "Mar 10", tenderCount: 2 },
  { id: "u-te-01", name: "Fatima Begum", email: "fatima.begum@mof.gov.bd", role: "tech_evaluator", department: "Engineering", status: "active", joinDate: "2025-02-01", lastActive: "Today", tenderCount: 3 },
  { id: "u-ce-01", name: "Anika Sultana", email: "anika.s@mof.gov.bd", role: "commercial_evaluator", department: "Finance", status: "active", joinDate: "2025-03-01", lastActive: "Mar 9", tenderCount: 2 },
  { id: "u-aud-01", name: "Imran Chowdhury", email: "imran.c@mof.gov.bd", role: "auditor", department: "Audit & Compliance", status: "active", joinDate: "2025-03-15", lastActive: "Mar 11", tenderCount: 2 },
  { id: "u-new-01", name: "Sadia Rahman", email: "sadia.r@mof.gov.bd", role: "procurer", department: "Procurement", status: "pending", joinDate: "2026-03-10", lastActive: "Never", tenderCount: 0 },
  { id: "u-held-01", name: "Rafiq Hasan", email: "rafiq.h@mof.gov.bd", role: "tech_evaluator", department: "Engineering", status: "withheld", joinDate: "2025-06-01", lastActive: "Jan 15", tenderCount: 0 },
];

// ─── Default permissions factory ────────────────────────────────────────────

function emptyPermissions(): RolePermissions {
  return {
    canCreateTender: false, canEditTender: false, canDeleteTender: false,
    canPublishTender: false, canWithholdTender: false, canConfigureWorkflow: false,
    canAssignRoles: false, canManageOrgUsers: false, canViewAllOrgTenders: false,
    canEvaluate: false, canApprove: false, canBid: false, canViewVendorPortal: false,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function PurchaserUserManagement() {
  const { user: authUser, activeRole } = useAuth();
  const { getAllRoles, getRole, getRoleLabel, getRoleColors, isVendorRole, isProcuringEntityRole } = useRoles();

  const isVendorAdmin = activeRole === "vendor_admin";
  const entityType = isVendorAdmin ? "vendor" : "procuring_entity";

  // ─── State ────────────────────────────────────────────────────────
  const [users, setUsers] = useState<OrgUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "withheld">("all");
  const [activeTab, setActiveTab] = useState("users");

  // Role editor state
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [expandedSystemRole, setExpandedSystemRole] = useState<string | null>(null);

  // Add User modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: "", email: "", role: "", department: "" });
  const [inviteSentEmail, setInviteSentEmail] = useState<string | null>(null);

  // Assign role modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<OrgUser | null>(null);

  // Expanded menu items in role editor
  const [expandedEditorMenus, setExpandedEditorMenus] = useState<Set<string>>(new Set());

  // ─── Derived ──────────────────────────────────────────────────────

  const systemRoles = useMemo(() => {
    return getAllRoles()
      .filter((r) => r.entityType === entityType)
      .map((r) => ({
        ...r,
        isSystem: true,
        isCustom: false,
        tenderVisibility: r.tenderVisibility as "org_all" | "tagged_only",
      })) as CustomRole[];
  }, [getAllRoles, entityType]);

  const allRoles = useMemo(() => [...systemRoles, ...customRoles], [systemRoles, customRoles]);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((u) => u.status === statusFilter);
    return result;
  }, [users, searchQuery, statusFilter]);

  // ─── Handlers ─────────────────────────────────────────────────────

  const handleToggleUserStatus = useCallback(
    (userId: string, newStatus: "active" | "withheld") => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    },
    []
  );

  const handleDeleteUser = useCallback((userId: string) => {
    if (confirm("Are you sure you want to remove this user from your organisation?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  }, []);

  const handleAddUser = useCallback(() => {
    if (!addUserForm.name || !addUserForm.email || !addUserForm.role) return;
    const newUser: OrgUser = {
      id: `u-new-${Date.now()}`,
      name: addUserForm.name,
      email: addUserForm.email,
      role: addUserForm.role,
      department: addUserForm.department || "Unassigned",
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      tenderCount: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    // Show invitation sent confirmation
    setInviteSentEmail(addUserForm.email);
    setAddUserForm({ name: "", email: "", role: "", department: "" });
  }, [addUserForm]);

  const handleResendInvite = useCallback((userEmail: string) => {
    setInviteSentEmail(userEmail);
    // Auto-dismiss after 4 seconds
    setTimeout(() => setInviteSentEmail(null), 4000);
  }, []);

  const handleChangeUserRole = useCallback((userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setShowAssignModal(false);
    setAssignTarget(null);
  }, []);

  // ─── Custom Role Handlers ─────────────────────────────────────────

  const handleNewRole = useCallback(() => {
    const navItems = entityType === "vendor" ? ALL_VENDOR_NAV_ITEMS : ALL_PE_NAV_ITEMS;
    const newRole: CustomRole = {
      id: `custom_${Date.now()}`,
      label: "",
      shortLabel: "",
      description: "",
      icon: "FileText",
      color: "blue",
      isSystem: false,
      isCustom: true,
      entityType,
      permissions: emptyPermissions(),
      navigation: [navItems[0], navItems[navItems.length - 2]], // Dashboard + Notifications by default
      tenderColumns: ["reference", "title", "type", "status", "actions"],
      tenderVisibility: "tagged_only",
      createdBy: authUser.name,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEditingRole(newRole);
    setShowRoleEditor(true);
    setExpandedEditorMenus(new Set());
  }, [entityType, authUser.name]);

  const handleEditRole = useCallback((role: CustomRole) => {
    setEditingRole({ ...role });
    setShowRoleEditor(true);
    setExpandedEditorMenus(new Set());
  }, []);

  const handleDuplicateRole = useCallback(
    (role: CustomRole) => {
      const dup: CustomRole = {
        ...role,
        id: `custom_${Date.now()}`,
        label: `${role.label} (Copy)`,
        shortLabel: role.shortLabel + "C",
        isSystem: false,
        isCustom: true,
        createdBy: authUser.name,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setEditingRole(dup);
      setShowRoleEditor(true);
      setExpandedEditorMenus(new Set());
    },
    [authUser.name]
  );

  const handleSaveRole = useCallback(() => {
    if (!editingRole || !editingRole.label || !editingRole.shortLabel) return;
    setCustomRoles((prev) => {
      const exists = prev.findIndex((r) => r.id === editingRole.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = editingRole;
        return updated;
      }
      return [...prev, editingRole];
    });
    setShowRoleEditor(false);
    setEditingRole(null);
  }, [editingRole]);

  const handleDeleteRole = useCallback((roleId: string) => {
    const usersWithRole = users.filter((u) => u.role === roleId);
    if (usersWithRole.length > 0) {
      alert(`Cannot delete this role — ${usersWithRole.length} user(s) are assigned to it. Reassign them first.`);
      return;
    }
    if (confirm("Delete this custom role? This cannot be undone.")) {
      setCustomRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  }, [users]);

  // ─── Helpers ──────────────────────────────────────────────────────

  const getRoleBadgeForUser = (roleId: string) => {
    const role = allRoles.find((r) => r.id === roleId);
    if (!role) return <Badge variant="outline">{roleId}</Badge>;
    const colors = getRoleColors(roleId);
    return <Badge variant="secondary" className={`text-xs ${colors.badge}`}>{role.label}</Badge>;
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-600">Active</Badge>;
      case "pending": return <Badge className="bg-yellow-600"><Clock className="size-3 mr-1 inline" />Invite Pending</Badge>;
      case "withheld": return <Badge className="bg-orange-600">Withheld</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const navItemsForEntityType = entityType === "vendor" ? ALL_VENDOR_NAV_ITEMS : ALL_PE_NAV_ITEMS;

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title={isVendorAdmin ? "Vendor Team Management" : "User & Role Management"}
        description={
          isVendorAdmin
            ? `Manage your vendor team members, create custom roles, and control access for ${authUser.organisation}`
            : `Manage users, create custom roles, and configure granular permissions for ${authUser.organisation}`
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleNewRole}>
              <Shield className="size-4 mr-1.5" />
              <span className="hidden sm:inline">New Custom Role</span>
              <span className="sm:hidden">New Role</span>
            </Button>
            <Button size="sm" onClick={() => { setShowAddUserModal(true); setInviteSentEmail(null); }}>
              <UserPlus className="size-4 mr-1.5" />Invite User
            </Button>
          </div>
        }
      />

      {/* Entity Type Banner */}
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
        <Info className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          You are managing roles for <strong>{entityType === "vendor" ? "Vendor" : "Procuring Entity"}</strong>: {authUser.organisation}.
          System roles from <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-[10px]">roles.json</code> cannot be deleted but can be duplicated and customised.
          Custom roles you create are stored per-organisation.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 mb-6">
          <TabsList className="w-max min-w-full">
            <TabsTrigger value="users" className="gap-1.5 shrink-0">
              <Users className="size-4" />
              <span>Users</span>
              <span className="opacity-60">({users.length})</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5 shrink-0">
              <Shield className="size-4" />
              <span className="hidden sm:inline">Roles & Permissions</span>
              <span className="sm:hidden">Roles</span>
              <span className="opacity-60">({allRoles.length})</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-1.5 shrink-0">
              <Tag className="size-4" />
              <span className="hidden sm:inline">Tender Assignments</span>
              <span className="sm:hidden">Assignments</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 1: USERS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="users">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Users</div>
                <div className="text-3xl font-bold mt-1">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-3xl font-bold mt-1 text-green-600">
                  {users.filter((u) => u.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Pending Invites</div>
                <div className="text-3xl font-bold mt-1 text-yellow-600">
                  {users.filter((u) => u.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Withheld</div>
                <div className="text-3xl font-bold mt-1 text-orange-600">
                  {users.filter((u) => u.status === "withheld").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search by name, email, or department..." className="pl-10"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <select className="border rounded-lg px-3 py-2 text-sm bg-card border-border text-foreground"
                  value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="withheld">Withheld</option>
                </select>
              </div>

              <div className="border rounded-lg border-border">
                {/* Mobile card view */}
                <div className="md:hidden divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        {getUserStatusBadge(u.status)}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                        <button onClick={() => { setAssignTarget(u); setShowAssignModal(true); }}
                          className="hover:opacity-80 transition-opacity" title="Click to change role">
                          {getRoleBadgeForUser(u.role)}
                        </button>
                        <span>· {u.department}</span>
                        <span>· {u.tenderCount} tender(s)</span>
                        <span>· {u.lastActive}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {u.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-600 h-7 text-xs px-2"
                              onClick={() => handleResendInvite(u.email)}>
                              <RefreshCw className="size-3 mr-1" />Resend
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 h-7 text-xs px-2"
                              onClick={() => handleToggleUserStatus(u.id, "active")}>
                              <CheckCircle className="size-3 mr-1" />Activate
                            </Button>
                            <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 h-7 text-xs px-2"
                              onClick={() => handleToggleUserStatus(u.id, "withheld")}>
                              <Shield className="size-3 mr-1" />Withhold
                            </Button>
                          </>
                        )}
                        {u.status === "active" && (
                          <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 h-7 text-xs px-2"
                            onClick={() => handleToggleUserStatus(u.id, "withheld")}>
                            <Shield className="size-3 mr-1" />Withhold
                          </Button>
                        )}
                        {u.status === "withheld" && (
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600 h-7 text-xs px-2"
                            onClick={() => handleToggleUserStatus(u.id, "active")}>
                            <PlayCircle className="size-3 mr-1" />Activate
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 h-7 w-7 p-0"
                          onClick={() => handleDeleteUser(u.id)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">No users match your search.</div>
                  )}
                </div>
                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Tenders</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                          <TableCell>
                            <button onClick={() => { setAssignTarget(u); setShowAssignModal(true); }}
                              className="hover:opacity-80 transition-opacity" title="Click to change role">
                              {getRoleBadgeForUser(u.role)}
                            </button>
                          </TableCell>
                          <TableCell className="text-sm">{u.department}</TableCell>
                          <TableCell>
                            <span className="text-sm">{u.tenderCount}</span>
                          </TableCell>
                          <TableCell>{getUserStatusBadge(u.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{u.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {u.status === "pending" && (
                                <>
                                  <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-600"
                                    onClick={() => handleResendInvite(u.email)}
                                    title="Resend password setup email">
                                    <RefreshCw className="size-4 mr-1" />Resend Invite
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-600"
                                    onClick={() => handleToggleUserStatus(u.id, "active")}
                                    title="Manually mark as active (skip invitation)">
                                    <CheckCircle className="size-4 mr-1" />Activate
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600"
                                    onClick={() => handleToggleUserStatus(u.id, "withheld")}>
                                    <Shield className="size-4 mr-1" />Withhold
                                  </Button>
                                </>
                              )}
                              {u.status === "active" && (
                                <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600"
                                  onClick={() => handleToggleUserStatus(u.id, "withheld")}>
                                  <Shield className="size-4 mr-1" />Withhold
                                </Button>
                              )}
                              {u.status === "withheld" && (
                                <Button size="sm" variant="outline" className="text-green-600 border-green-600"
                                  onClick={() => handleToggleUserStatus(u.id, "active")}>
                                  <PlayCircle className="size-4 mr-1" />Activate
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600"
                                onClick={() => handleDeleteUser(u.id)}>
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No users match your search.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 2: ROLES & PERMISSIONS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="roles">
          <div className="space-y-4">
            {/* System Roles */}
            <div className="mb-2">
              <h3 className="font-semibold">System Roles</h3>
              <p className="text-xs text-muted-foreground">
                Pre-defined in roles.json. Cannot be deleted — duplicate to customise.
              </p>
            </div>

            {systemRoles.map((role) => {
              const Icon = resolveIcon(role.icon);
              const colors = getRoleColors(role.id);
              const isExpanded = expandedSystemRole === role.id;
              const usersWithRole = users.filter((u) => u.role === role.id).length;

              return (
                <Card key={role.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedSystemRole(isExpanded ? null : role.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      <Icon className={`size-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{role.label}</p>
                        <Badge variant="outline" className="text-[10px]">
                          <Lock className="size-2.5 mr-1" />System
                        </Badge>
                        {usersWithRole > 0 && (
                          <Badge variant="secondary" className="text-[10px]">{usersWithRole} user(s)</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDuplicateRole(role); }}
                        title="Duplicate as custom role">
                        <Copy className="size-4" />
                      </Button>
                      {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-muted space-y-4">
                      {/* Permissions */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PERMISSION_DEFS.filter((p) => p.group !== "Vendor").map((p) => (
                            <Badge key={p.key} variant={role.permissions[p.key] ? "default" : "outline"}
                              className={`text-[10px] ${role.permissions[p.key] ? "bg-green-600" : "text-muted-foreground"}`}>
                              {role.permissions[p.key] ? <CheckCircle className="size-2.5 mr-1" /> : <X className="size-2.5 mr-1" />}
                              {p.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Navigation */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu Items</p>
                        <div className="flex flex-wrap gap-1.5">
                          {role.navigation.map((nav) => (
                            <Badge key={nav.path} variant="secondary" className="text-[10px]">
                              {nav.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tender Columns */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visible Tender Columns</p>
                        <div className="flex flex-wrap gap-1.5">
                          {role.tenderColumns.map((col) => (
                            <Badge key={col} variant="outline" className="text-[10px]">
                              {ALL_TENDER_COLUMNS.find((c) => c.id === col)?.label || col}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Visibility */}
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tender Visibility:</p>
                        <Badge variant="secondary" className={`text-[10px] ${
                          role.tenderVisibility === "org_all"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {role.tenderVisibility === "org_all" ? "All Org Tenders" : "Tagged Only"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Custom Roles */}
            <div className="flex items-start justify-between gap-3 mt-8 mb-2">
              <div>
                <h3 className="font-semibold">Custom Roles</h3>
                <p className="text-xs text-muted-foreground">
                  Created by your organisation. Full control — edit, delete, and assign.
                </p>
              </div>
              <Button size="sm" className="shrink-0" onClick={handleNewRole}>
                <Plus className="size-4 mr-1.5" />
                <span className="hidden sm:inline">Create Custom Role</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>

            {customRoles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Shield className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    No custom roles yet. System roles cover the standard procurement workflow.
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Create custom roles for unique needs like "Junior Procurer", "Department Head", "Observer", etc.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button size="sm" onClick={handleNewRole}>
                      <Plus className="size-4 mr-2" />Create from Scratch
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => systemRoles.length > 0 && handleDuplicateRole(systemRoles[1])}>
                      <Copy className="size-4 mr-2" />Duplicate a System Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              customRoles.map((role) => {
                const Icon = resolveIcon(role.icon);
                const colorDef = ROLE_COLORS.find((c) => c.id === role.color);
                const usersWithRole = users.filter((u) => u.role === role.id).length;

                return (
                  <Card key={role.id} className="overflow-hidden border-dashed">
                    <div className="flex items-center gap-4 p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorDef?.bg || "bg-muted"}`}>
                        <Icon className={`size-5 ${colorDef?.text || "text-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{role.label}</p>
                          <Badge variant="outline" className="text-[10px] border-dashed">
                            <Unlock className="size-2.5 mr-1" />Custom
                          </Badge>
                          {usersWithRole > 0 && (
                            <Badge variant="secondary" className="text-[10px]">{usersWithRole} user(s)</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Created by {role.createdBy} on {role.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)} title="Edit role">
                          <Edit className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDuplicateRole(role)} title="Duplicate role">
                          <Copy className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteRole(role.id)}
                          className="text-red-500 hover:text-red-600" title="Delete role">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick view of permissions */}
                    <div className="border-t border-border px-4 py-2 bg-muted">
                      <div className="flex flex-wrap gap-1.5">
                        {PERMISSION_DEFS.filter((p) => role.permissions[p.key] && p.group !== "Vendor").map((p) => (
                          <Badge key={p.key} className="text-[10px] bg-green-600">
                            <CheckCircle className="size-2.5 mr-1" />{p.label}
                          </Badge>
                        ))}
                        <Badge variant="secondary" className="text-[10px]">
                          {role.navigation.length} menu items
                        </Badge>
                        <Badge variant="secondary" className={`text-[10px] ${
                          role.tenderVisibility === "org_all"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {role.tenderVisibility === "org_all" ? "All Org Tenders" : "Tagged Only"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB 3: TENDER ASSIGNMENTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="assignments">
          <Card className="mb-6">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Tag className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Tender-Level Tagging</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Every user only sees tenders they are explicitly tagged on. Tagging happens automatically when:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>A <strong>Procurer</strong> creates a tender → auto-tagged as creator</li>
                    <li>A <strong>Procurer</strong> configures the Approval Workflow → each assigned evaluator gets tagged</li>
                    <li>The <strong>PE Admin</strong> manually adds a user to a tender from this page</li>
                    <li><strong>Vendors</strong> are tagged when they are added to a tender or submit a bid</li>
                  </ul>
                </div>
              </div>

              {/* Assignment Matrix */}
              <div className="border rounded-lg border-border">
                {/* Mobile card view */}
                <div className="md:hidden divide-y divide-border">
                  {users.filter((u) => u.status === "active").map((u) => {
                    const roleDef = allRoles.find((r) => r.id === u.role);
                    const visibility = roleDef?.tenderVisibility || "tagged_only";
                    return (
                      <div key={u.id} className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{u.name}</p>
                            <p className="text-[11px] text-muted-foreground">{u.department}</p>
                          </div>
                          <Badge variant="secondary" className={`text-[10px] shrink-0 ${
                            visibility === "org_all"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            {visibility === "org_all" ? "All Org" : "Tagged Only"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getRoleBadgeForUser(u.role)}
                            <span className="text-xs text-muted-foreground">
                              {u.tenderCount > 0 ? `${u.tenderCount} tender(s)` : "No tenders"}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2 shrink-0">
                            <Tag className="size-3 mr-1" />Tags
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="w-48">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Tagged Tenders</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.filter((u) => u.status === "active").map((u) => {
                        const roleDef = allRoles.find((r) => r.id === u.role);
                        const visibility = roleDef?.tenderVisibility || "tagged_only";
                        return (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{u.name}</p>
                                <p className="text-[11px] text-muted-foreground">{u.department}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadgeForUser(u.role)}</TableCell>
                            <TableCell>
                              {u.tenderCount > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{u.tenderCount}</span>
                                  <span className="text-xs text-muted-foreground">tender(s)</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">None assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`text-[10px] ${
                                visibility === "org_all"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}>
                                {visibility === "org_all" ? "All Org Tenders" : "Tagged Only"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline">
                                <Tag className="size-3 mr-1" />Manage Tags
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="size-4" />
                <AlertDescription className="text-xs">
                  <strong>Important:</strong> The primary way to tag users on tenders is through the{" "}
                  <strong>Approval Workflow Configuration</strong> during tender creation. This page provides
                  an overview and allows the PE Admin to make ad-hoc adjustments when needed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ROLE EDITOR MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showRoleEditor && editingRole && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 bg-black/50 overflow-y-auto">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-3xl mx-4 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  ROLE_COLORS.find((c) => c.id === editingRole.color)?.bg || "bg-muted"
                }`}>
                  {(() => {
                    const Icon = resolveIcon(editingRole.icon);
                    return <Icon className={`size-5 ${ROLE_COLORS.find((c) => c.id === editingRole.color)?.text || "text-foreground"}`} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingRole.isCustom && customRoles.some((r) => r.id === editingRole.id)
                      ? "Edit Custom Role"
                      : "Create Custom Role"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Define permissions, menu access, and visible data for this role
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setShowRoleEditor(false); setEditingRole(null); }}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Role Name *</Label>
                    <Input placeholder="e.g., Junior Procurer" value={editingRole.label}
                      onChange={(e) => setEditingRole({ ...editingRole, label: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Short Label *</Label>
                    <Input placeholder="e.g., JP" maxLength={5} value={editingRole.shortLabel}
                      onChange={(e) => setEditingRole({ ...editingRole, shortLabel: e.target.value.toUpperCase() })} className="mt-1" />
                    <p className="text-[10px] text-muted-foreground mt-0.5">Max 5 chars. Shown in sidebar badge.</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input placeholder="Brief description of this role's responsibilities" value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })} className="mt-1" />
                </div>

                {/* Icon & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {ROLE_ICONS.map((ic) => {
                        const IconComp = ic.Icon;
                        return (
                          <button key={ic.id}
                            onClick={() => setEditingRole({ ...editingRole, icon: ic.id })}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                              editingRole.icon === ic.id
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                                : "border-border hover:bg-muted"
                            }`}>
                            <IconComp className={`size-4 ${editingRole.icon === ic.id ? "text-indigo-600" : "text-muted-foreground"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {ROLE_COLORS.map((col) => (
                        <button key={col.id}
                          onClick={() => setEditingRole({ ...editingRole, color: col.id })}
                          className={`w-8 h-8 rounded-lg ${col.bg} border-2 transition-colors ${
                            editingRole.color === col.id ? "border-gray-800 dark:border-white" : "border-transparent"
                          }`}
                          title={col.label}>
                          {editingRole.color === col.id && (
                            <CheckCircle className={`size-4 ${col.text} mx-auto`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items & Page Permissions (unified) */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Menu Items & Page Permissions
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Toggle menu items to control sidebar access. Expand items to configure what this role can do on each page.
                  </p>
                </div>
                <div className="border rounded-lg border-border divide-y divide-border">
                  {navItemsForEntityType.map((nav) => {
                    const Icon = resolveIcon(nav.icon);
                    const isEnabled = editingRole.navigation.some((n) => n.path === nav.path);
                    const pageActionsMap = entityType === "vendor" ? VENDOR_PAGE_ACTIONS : PE_PAGE_ACTIONS;
                    const pageActions = pageActionsMap[nav.path] || [];
                    const hasActions = pageActions.length > 0;
                    const isExpanded = expandedEditorMenus.has(nav.path);
                    const enabledActionCount = hasActions ? pageActions.filter((a) => editingRole.permissions[a.key]).length : 0;

                    return (
                      <div key={nav.path}>
                        {/* Menu item row */}
                        <div className={`flex items-center gap-3 p-3 transition-colors ${
                          isEnabled ? "bg-card" : "bg-muted/50"
                        }`}>
                          <button
                            onClick={() => {
                              const newNav = isEnabled
                                ? editingRole.navigation.filter((n) => n.path !== nav.path)
                                : [...editingRole.navigation, { name: nav.name, path: nav.path, icon: nav.icon }];
                              // If disabling, also turn off all page-level permissions
                              let newPerms = { ...editingRole.permissions };
                              if (isEnabled && hasActions) {
                                pageActions.forEach((a) => { newPerms[a.key] = false; });
                              }
                              setEditingRole({ ...editingRole, navigation: newNav, permissions: newPerms });
                              // Collapse if disabling
                              if (isEnabled) {
                                setExpandedEditorMenus((prev) => {
                                  const next = new Set(prev);
                                  next.delete(nav.path);
                                  return next;
                                });
                              }
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                              isEnabled
                                ? "bg-indigo-600 text-white"
                                : "bg-muted text-transparent hover:bg-muted/80"
                            }`}>
                            <CheckCircle className="size-3" />
                          </button>
                          <Icon className={`size-4 shrink-0 ${isEnabled ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${isEnabled ? "" : "text-muted-foreground"}`}>{nav.name}</p>
                            <p className="text-[10px] text-muted-foreground">{nav.description}</p>
                          </div>
                          {isEnabled && hasActions && (
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                              {enabledActionCount}/{pageActions.length} actions
                            </Badge>
                          )}
                          {hasActions && isEnabled && (
                            <button
                              onClick={() => {
                                setExpandedEditorMenus((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(nav.path)) next.delete(nav.path);
                                  else next.add(nav.path);
                                  return next;
                                });
                              }}
                              className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                              title="Configure page actions">
                              {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                            </button>
                          )}
                          {!hasActions && (
                            <span className="text-[10px] text-muted-foreground/50 shrink-0">View only</span>
                          )}
                        </div>

                        {/* Expanded page actions */}
                        {isExpanded && isEnabled && (hasActions || nav.path === "/tenders" || nav.path === "/rfqs") && (
                          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-t border-indigo-100 dark:border-indigo-900/30">
                            {/* Page-level actions */}
                            {hasActions && (
                              <div className="px-4 pt-3 pb-2">
                                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                                  Actions on {nav.name}
                                </p>
                                <div className="space-y-1.5">
                                  {pageActions.map((action) => (
                                    <label key={action.key} className="flex items-center gap-3 cursor-pointer group">
                                      <button
                                        onClick={() =>
                                          setEditingRole({
                                            ...editingRole,
                                            permissions: { ...editingRole.permissions, [action.key]: !editingRole.permissions[action.key] },
                                          })
                                        }
                                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                          editingRole.permissions[action.key]
                                            ? "bg-green-600 text-white"
                                            : "bg-muted text-transparent group-hover:bg-muted/80"
                                        }`}>
                                        <CheckCircle className="size-2.5" />
                                      </button>
                                      <div className="flex-1">
                                        <p className="text-xs">{action.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{action.description}</p>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                                {/* Select/Deselect all for this page */}
                                <div className="flex gap-2 mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/30">
                                  <button onClick={() => {
                                    const newPerms = { ...editingRole.permissions };
                                    pageActions.forEach((a) => { newPerms[a.key] = true; });
                                    setEditingRole({ ...editingRole, permissions: newPerms });
                                  }} className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Select all
                                  </button>
                                  <span className="text-[10px] text-gray-300">|</span>
                                  <button onClick={() => {
                                    const newPerms = { ...editingRole.permissions };
                                    pageActions.forEach((a) => { newPerms[a.key] = false; });
                                    setEditingRole({ ...editingRole, permissions: newPerms });
                                  }} className="text-[10px] text-muted-foreground hover:underline">
                                    Deselect all
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Evaluation & Approval — nested under Tenders */}
                            {(nav.path === "/tenders" || nav.path === "/rfqs") && entityType !== "vendor" && (
                              <div className="px-4 py-3 border-t border-indigo-100 dark:border-indigo-900/30">
                                <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                                  Evaluation & Approval
                                </p>
                                <div className="space-y-1.5">
                                  {APPROVAL_PERMISSIONS.map((perm) => (
                                    <label key={perm.key} className="flex items-center gap-3 cursor-pointer group">
                                      <button
                                        onClick={() =>
                                          setEditingRole({
                                            ...editingRole,
                                            permissions: { ...editingRole.permissions, [perm.key]: !editingRole.permissions[perm.key] },
                                          })
                                        }
                                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                          editingRole.permissions[perm.key]
                                            ? "bg-green-600 text-white"
                                            : "bg-muted text-transparent group-hover:bg-muted/80"
                                        }`}>
                                        <CheckCircle className="size-2.5" />
                                      </button>
                                      <div className="flex-1">
                                        <p className="text-xs">{perm.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{perm.description}</p>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Visible Tender Columns — nested under Tenders */}
                            {(nav.path === "/tenders" || nav.path === "/rfqs") && (
                              <div className="px-4 py-3 border-t border-indigo-100 dark:border-indigo-900/30">
                                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                                  Visible Tender Columns
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {ALL_TENDER_COLUMNS.map((col) => {
                                    const isColEnabled = editingRole.tenderColumns.includes(col.id);
                                    return (
                                      <button key={col.id}
                                        onClick={() => {
                                          const newCols = isColEnabled
                                            ? editingRole.tenderColumns.filter((c) => c !== col.id)
                                            : [...editingRole.tenderColumns, col.id];
                                          setEditingRole({ ...editingRole, tenderColumns: newCols });
                                        }}
                                        className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                                          isColEnabled
                                            ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300"
                                            : "bg-card border-border text-muted-foreground hover:border-border/80"
                                        }`}>
                                        {isColEnabled ? <Eye className="size-3 inline mr-1" /> : <EyeOff className="size-3 inline mr-1" />}
                                        {col.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Tender Visibility — nested under Tenders */}
                            {(nav.path === "/tenders" || nav.path === "/rfqs") && (
                              <div className="px-4 py-3 border-t border-indigo-100 dark:border-indigo-900/30">
                                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                                  Tender Visibility Level
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <button
                                    onClick={() => setEditingRole({ ...editingRole, tenderVisibility: "tagged_only" })}
                                    className={`p-3 rounded-lg border text-left transition-colors ${
                                      editingRole.tenderVisibility === "tagged_only"
                                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600"
                                        : "border-border hover:bg-muted"
                                    }`}>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <Tag className="size-3.5 text-amber-600" />
                                      <p className="text-xs font-medium">Tagged Only</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                      Sees ONLY tenders they are tagged on. Recommended for most roles.
                                    </p>
                                  </button>
                                  <button
                                    onClick={() => setEditingRole({ ...editingRole, tenderVisibility: "org_all" })}
                                    className={`p-3 rounded-lg border text-left transition-colors ${
                                      editingRole.tenderVisibility === "org_all"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
                                        : "border-border hover:bg-muted"
                                    }`}>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <Layers className="size-3.5 text-blue-600" />
                                      <p className="text-xs font-medium">All Org Tenders</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                      Sees all tenders in the organisation. Use for Admin or oversight roles.
                                    </p>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 border-t border-border bg-muted rounded-b-xl">
              <div className="text-xs text-muted-foreground">
                {editingRole.navigation.length} menu items &bull;{" "}
                {PERMISSION_DEFS.filter((p) => editingRole.permissions[p.key]).length} permissions &bull;{" "}
                {editingRole.tenderColumns.length} columns
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => { setShowRoleEditor(false); setEditingRole(null); }}>
                  Cancel
                </Button>
                <Button className="flex-1 sm:flex-none" onClick={handleSaveRole}
                  disabled={!editingRole.label || !editingRole.shortLabel}>
                  <Save className="size-4 mr-2" />Save Role
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ADD USER MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="size-5 text-indigo-600" />Invite User
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setShowAddUserModal(false); setInviteSentEmail(null); }}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Invitation sent success state */}
              {inviteSentEmail ? (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Mail className="size-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Invitation Sent!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      A password setup link has been emailed to:
                    </p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">{inviteSentEmail}</p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-left">
                    <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1">What happens next?</p>
                    <ol className="text-[11px] text-amber-600 dark:text-amber-300/80 space-y-1 list-decimal list-inside">
                      <li>User receives the email with a secure link</li>
                      <li>They click the link to set their password</li>
                      <li>Once password is set, their status changes to <span className="font-semibold">Active</span></li>
                      <li>They can then log in and access their assigned role</li>
                    </ol>
                  </div>

                  <Alert>
                    <Clock className="size-4" />
                    <AlertDescription className="text-xs">
                      The link expires in <span className="font-semibold">72 hours</span>. If it expires, you can resend the invitation from the users table.
                      The user remains in <span className="font-semibold">Pending</span> status until they set their password.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2 justify-center pt-2">
                    <Button variant="outline" onClick={() => { setInviteSentEmail(null); }}>
                      <UserPlus className="size-4 mr-2" />Invite Another
                    </Button>
                    <Button onClick={() => { setShowAddUserModal(false); setInviteSentEmail(null); }}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                    <Mail className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                      An invitation email with a password setup link will be sent to the user. They will set their own password when they accept.
                    </p>
                  </div>

                  <div>
                    <Label>Full Name *</Label>
                    <Input placeholder="e.g., Tanvir Rahman" value={addUserForm.name}
                      onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Email Address *</Label>
                    <Input type="email" placeholder="e.g., tanvir@company.com" value={addUserForm.email}
                      onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })} className="mt-1" />
                    <p className="text-[10px] text-muted-foreground mt-1">The invitation link will be sent to this email address</p>
                  </div>
                  <div>
                    <Label>Assign Role *</Label>
                    <select className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-foreground"
                      value={addUserForm.role} onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}>
                      <option value="">Select a role...</option>
                      <optgroup label="System Roles">
                        {systemRoles.map((r) => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </optgroup>
                      {customRoles.length > 0 && (
                        <optgroup label="Custom Roles">
                          {customRoles.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input placeholder="e.g., Engineering" value={addUserForm.department}
                      onChange={(e) => setAddUserForm({ ...addUserForm, department: e.target.value })} className="mt-1" />
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">
                      The user will be added with <span className="font-semibold">Pending</span> status. Once they accept the
                      invitation and set their password, their status will automatically change to <span className="font-semibold">Active</span>.
                      They will only see tenders they are tagged on (unless their role grants org-wide access).
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} disabled={!addUserForm.name || !addUserForm.email || !addUserForm.role}>
                      <Send className="size-4 mr-2" />Send Invitation
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CHANGE ROLE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Resend invite toast */}
      {inviteSentEmail && !showAddUserModal && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-card border border-green-200 dark:border-green-800 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Mail className="size-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Invitation Resent</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Password setup link sent to {inviteSentEmail}
              </p>
            </div>
            <button onClick={() => setInviteSentEmail(null)} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {showAssignModal && assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5 text-indigo-600" />Change Role
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setShowAssignModal(false); setAssignTarget(null); }}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{assignTarget.name}</p>
                <p className="text-xs text-muted-foreground">{assignTarget.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Current role:</span>
                  {getRoleBadgeForUser(assignTarget.role)}
                </div>
              </div>

              <div>
                <Label>New Role</Label>
                <div className="space-y-1.5 mt-2 max-h-64 overflow-y-auto">
                  {allRoles.map((role) => {
                    const Icon = resolveIcon(role.icon);
                    const colors = getRoleColors(role.id);
                    const colorDef = ROLE_COLORS.find((c) => c.id === role.color);
                    const isCurrent = assignTarget.role === role.id;

                    return (
                      <button key={role.id}
                        onClick={() => handleChangeUserRole(assignTarget.id, role.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                          isCurrent
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-border hover:bg-muted"
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorDef?.bg || colors.bg}`}>
                          <Icon className={`size-4 ${colorDef?.text || colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{role.label}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{role.description}</p>
                        </div>
                        {role.isSystem ? (
                          <Badge variant="outline" className="text-[9px] shrink-0"><Lock className="size-2 mr-0.5" />System</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] border-dashed shrink-0">Custom</Badge>
                        )}
                        {isCurrent && <div className="size-2 rounded-full bg-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Alert>
                <AlertTriangle className="size-4" />
                <AlertDescription className="text-xs">
                  Changing a user's role immediately updates their sidebar menu, permissions, and tender visibility.
                  Their existing tender tags will remain — they won't lose access to tenders already assigned to them.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
