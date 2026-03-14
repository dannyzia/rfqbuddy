import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import rolesConfig from "../config/roles.json";

// ─── Types ──────────────────────────────────────────────────────────────────

export type PlatformRole = string; // Driven by roles.json — no hardcoded union

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  organisation: string;
  avatarInitials: string;
  entityType: string; // "procuring_entity" | "vendor" | "platform"
}

export interface TenderTag {
  tenderId: string;
  role: string;       // What role this user holds on THIS specific tender
  taggedBy: string;   // Who tagged them (usually the Procurer or PE Admin)
  taggedAt: string;   // When they were tagged
}

export interface AuthContextType {
  user: UserInfo;
  activeRole: string;
  setActiveRole: (role: string) => void;
  tenderTags: TenderTag[];         // Tenders this user is tagged on
  isTaggedOnTender: (tenderId: string) => boolean;
  getTagForTender: (tenderId: string) => TenderTag | undefined;
  getTaggedTenderIds: () => string[];
}

// ─── Mock Users — one per role (demo only) ──────────────────────────────────

const MOCK_USERS: Record<string, UserInfo> = {
  pe_admin: {
    id: "u-admin-01",
    name: "Shamim Ahmed",
    email: "shamim@mof.gov.bd",
    designation: "IT Manager",
    department: "IT & Systems",
    organisation: "Ministry of Finance",
    avatarInitials: "SA",
    entityType: "procuring_entity",
  },
  procurer: {
    id: "u-proc-01",
    name: "Nasir Uddin",
    email: "nasir.uddin@mof.gov.bd",
    designation: "Senior Procurement Officer",
    department: "Procurement",
    organisation: "Ministry of Finance",
    avatarInitials: "NU",
    entityType: "procuring_entity",
  },
  procurement_head: {
    id: "u-ph-01",
    name: "Kamal Uddin",
    email: "kamal.uddin@mof.gov.bd",
    designation: "Head of Procurement",
    department: "Procurement",
    organisation: "Ministry of Finance",
    avatarInitials: "KU",
    entityType: "procuring_entity",
  },
  prequal_evaluator: {
    id: "u-pq-01",
    name: "Nusrat Jahan",
    email: "nusrat.j@mof.gov.bd",
    designation: "Deputy Procurement Officer",
    department: "Procurement",
    organisation: "Ministry of Finance",
    avatarInitials: "NJ",
    entityType: "procuring_entity",
  },
  tech_evaluator: {
    id: "u-te-01",
    name: "Fatima Begum",
    email: "fatima.begum@mof.gov.bd",
    designation: "Senior Technical Analyst",
    department: "Engineering",
    organisation: "Ministry of Finance",
    avatarInitials: "FB",
    entityType: "procuring_entity",
  },
  commercial_evaluator: {
    id: "u-ce-01",
    name: "Anika Sultana",
    email: "anika.s@mof.gov.bd",
    designation: "Commercial Analyst",
    department: "Finance",
    organisation: "Ministry of Finance",
    avatarInitials: "AS",
    entityType: "procuring_entity",
  },
  auditor: {
    id: "u-aud-01",
    name: "Imran Chowdhury",
    email: "imran.c@mof.gov.bd",
    designation: "Internal Auditor",
    department: "Audit & Compliance",
    organisation: "Ministry of Finance",
    avatarInitials: "IC",
    entityType: "procuring_entity",
  },
  vendor_admin: {
    id: "v-adm-01",
    name: "Rahim Khan",
    email: "rahim@rahman-ent.com.bd",
    designation: "General Manager",
    department: "Administration",
    organisation: "Rahman Enterprises Ltd.",
    avatarInitials: "RK",
    entityType: "vendor",
  },
  sales_executive: {
    id: "v-se-01",
    name: "Tanvir Hossain",
    email: "tanvir@rahman-ent.com.bd",
    designation: "Sales Executive",
    department: "Sales",
    organisation: "Rahman Enterprises Ltd.",
    avatarInitials: "TH",
    entityType: "vendor",
  },
  sales_manager: {
    id: "v-sm-01",
    name: "Farhan Islam",
    email: "farhan@rahman-ent.com.bd",
    designation: "Sales Manager",
    department: "Sales",
    organisation: "Rahman Enterprises Ltd.",
    avatarInitials: "FI",
    entityType: "vendor",
  },
  super_admin: {
    id: "sa-001",
    name: "System Admin",
    email: "admin@rfqportal.gov.bd",
    designation: "Platform Administrator",
    department: "Platform Operations",
    organisation: "RFQ Portal",
    avatarInitials: "SA",
    entityType: "platform",
  },
};

// ─── Mock Tender Tags — each user ONLY sees tenders they're tagged on ───────
// In production: fetched from DB based on logged-in user's ID.
// The Procurer (or PE Admin) tags users when configuring the Approval Workflow.

const MOCK_TENDER_TAGS: Record<string, TenderTag[]> = {
  // PE Admin sees all org tenders (org_all visibility from JSON)
  pe_admin: [
    { tenderId: "PG-2026-001", role: "pe_admin", taggedBy: "system", taggedAt: "2026-01-05" },
    { tenderId: "PW-2026-015", role: "pe_admin", taggedBy: "system", taggedAt: "2026-01-10" },
    { tenderId: "PPS-2026-008", role: "pe_admin", taggedBy: "system", taggedAt: "2026-01-12" },
    { tenderId: "PG-2026-003", role: "pe_admin", taggedBy: "system", taggedAt: "2026-01-15" },
    { tenderId: "PG-2026-004", role: "pe_admin", taggedBy: "system", taggedAt: "2026-01-18" },
    { tenderId: "PW-2026-012", role: "pe_admin", taggedBy: "system", taggedAt: "2026-02-01" },
    { tenderId: "NRQ1-2026-022", role: "pe_admin", taggedBy: "system", taggedAt: "2026-02-05" },
    { tenderId: "RFP-2026-005", role: "pe_admin", taggedBy: "system", taggedAt: "2026-02-10" },
  ],

  // Procurer — created these tenders, auto-tagged
  procurer: [
    { tenderId: "PG-2026-001", role: "procurer", taggedBy: "self", taggedAt: "2026-01-05" },
    { tenderId: "PW-2026-015", role: "procurer", taggedBy: "self", taggedAt: "2026-01-10" },
    { tenderId: "PPS-2026-008", role: "procurer", taggedBy: "self", taggedAt: "2026-01-12" },
    { tenderId: "PG-2026-003", role: "procurer", taggedBy: "self", taggedAt: "2026-01-15" },
    { tenderId: "PG-2026-004", role: "procurer", taggedBy: "self", taggedAt: "2026-01-18" },
    { tenderId: "PW-2026-012", role: "procurer", taggedBy: "self", taggedAt: "2026-02-01" },
  ],

  // Procurement Head — tagged by Procurer via Approval Workflow Config
  procurement_head: [
    { tenderId: "PG-2026-001", role: "procurement_head", taggedBy: "u-proc-01", taggedAt: "2026-01-06" },
    { tenderId: "PW-2026-015", role: "procurement_head", taggedBy: "u-proc-01", taggedAt: "2026-01-11" },
    { tenderId: "PG-2026-003", role: "procurement_head", taggedBy: "u-proc-01", taggedAt: "2026-01-16" },
    { tenderId: "PW-2026-012", role: "procurement_head", taggedBy: "u-proc-01", taggedAt: "2026-02-02" },
    { tenderId: "NRQ1-2026-022", role: "procurement_head", taggedBy: "u-proc-01", taggedAt: "2026-02-06" },
  ],

  // PreQual Evaluator — only tagged on 2 tenders
  prequal_evaluator: [
    { tenderId: "PG-2026-003", role: "prequal_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-01-16" },
    { tenderId: "PW-2026-015", role: "prequal_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-01-11" },
  ],

  // Tech Evaluator — tagged on 3 tenders
  tech_evaluator: [
    { tenderId: "PG-2026-003", role: "tech_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-01-16" },
    { tenderId: "PG-2026-001", role: "tech_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-01-06" },
    { tenderId: "PW-2026-012", role: "tech_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-02-02" },
  ],

  // Commercial Evaluator — tagged on 2 tenders
  commercial_evaluator: [
    { tenderId: "PG-2026-003", role: "commercial_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-01-16" },
    { tenderId: "RFP-2026-005", role: "commercial_evaluator", taggedBy: "u-proc-01", taggedAt: "2026-02-11" },
  ],

  // Auditor — tagged on 2 tenders
  auditor: [
    { tenderId: "PW-2026-012", role: "auditor", taggedBy: "u-proc-01", taggedAt: "2026-02-02" },
    { tenderId: "PG-2026-001", role: "auditor", taggedBy: "u-proc-01", taggedAt: "2026-01-06" },
  ],

  // Vendor Admin — tagged on tenders where their org was invited/bid
  vendor_admin: [
    { tenderId: "PG-2026-001", role: "vendor_admin", taggedBy: "system", taggedAt: "2026-01-08" },
    { tenderId: "PW-2026-015", role: "vendor_admin", taggedBy: "system", taggedAt: "2026-01-12" },
    { tenderId: "PG-2026-003", role: "vendor_admin", taggedBy: "system", taggedAt: "2026-01-18" },
  ],

  // Sales Executive — tagged on specific tenders he's preparing bids for
  sales_executive: [
    { tenderId: "PG-2026-001", role: "sales_executive", taggedBy: "v-sm-01", taggedAt: "2026-01-09" },
    { tenderId: "PW-2026-015", role: "sales_executive", taggedBy: "v-sm-01", taggedAt: "2026-01-13" },
  ],

  // Sales Manager — oversees all vendor bids
  sales_manager: [
    { tenderId: "PG-2026-001", role: "sales_manager", taggedBy: "v-adm-01", taggedAt: "2026-01-08" },
    { tenderId: "PW-2026-015", role: "sales_manager", taggedBy: "v-adm-01", taggedAt: "2026-01-12" },
    { tenderId: "PG-2026-003", role: "sales_manager", taggedBy: "v-adm-01", taggedAt: "2026-01-18" },
  ],

  // Super Admin — sees everything (visibility: "all" in roles.json)
  super_admin: [],
};

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<string>(() => {
    const saved = localStorage.getItem("activeRole");
    // Validate saved role exists in roles.json
    if (saved && rolesConfig.roles.some((r: any) => r.id === saved)) return saved;
    return "procurer";
  });

  const user = MOCK_USERS[activeRole] || MOCK_USERS.procurer;
  const tenderTags = MOCK_TENDER_TAGS[activeRole] || [];

  const setActiveRole = useCallback((role: string) => {
    setActiveRoleState(role);
    localStorage.setItem("activeRole", role);
  }, []);

  const isTaggedOnTender = useCallback(
    (tenderId: string): boolean => {
      // Super Admin sees all
      const roleDef = rolesConfig.roles.find((r: any) => r.id === activeRole) as any;
      if (roleDef?.tenderVisibility === "all") return true;
      return tenderTags.some((t) => t.tenderId === tenderId);
    },
    [activeRole, tenderTags]
  );

  const getTagForTender = useCallback(
    (tenderId: string): TenderTag | undefined => {
      return tenderTags.find((t) => t.tenderId === tenderId);
    },
    [tenderTags]
  );

  const getTaggedTenderIds = useCallback((): string[] => {
    const roleDef = rolesConfig.roles.find((r: any) => r.id === activeRole) as any;
    if (roleDef?.tenderVisibility === "all") return []; // empty means "all" for Super Admin
    return tenderTags.map((t) => t.tenderId);
  }, [activeRole, tenderTags]);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        tenderTags,
        isTaggedOnTender,
        getTagForTender,
        getTaggedTenderIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
