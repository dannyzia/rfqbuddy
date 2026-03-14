import rolesConfig from "../config/roles.json";

// ─── Types derived from roles.json ──────────────────────────────────────────

export interface RolePermissions {
  canCreateTender: boolean;
  canEditTender: boolean;
  canDeleteTender: boolean;
  canPublishTender: boolean;
  canWithholdTender: boolean;
  canConfigureWorkflow: boolean;
  canAssignRoles: boolean;
  canManageOrgUsers: boolean;
  canViewAllOrgTenders: boolean;
  canEvaluate: boolean;
  canApprove: boolean;
  canBid: boolean;
  canViewVendorPortal: boolean;
}

export interface NavItem {
  name: string;
  path: string;
  icon: string;
}

export interface RoleDef {
  id: string;
  label: string;
  shortLabel: string;
  entityType: string;
  icon: string;
  color: string;
  description: string;
  permissions: RolePermissions;
  navigation: NavItem[];
  tenderColumns: string[];
  tenderVisibility: "all" | "org_all" | "tagged_only";
  evaluationStage?: string;
  pendingStageKey?: string;
  evaluationPath?: string;
}

export interface RoleGroup {
  key: string;
  label: string;
  roleIds: string[];
}

// ─── Parsed Config ──────────────────────────────────────────────────────────

const ROLES: RoleDef[] = rolesConfig.roles as RoleDef[];
const ROLE_MAP = new Map<string, RoleDef>(ROLES.map((r) => [r.id, r]));
const ROLE_GROUPS: RoleGroup[] = rolesConfig.role_groups as RoleGroup[];
const STAGE_MAP = rolesConfig.workflow_stage_mapping as Record<string, { stageKey: string; evalPath: string }>;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useRoles() {
  const getAllRoles = (): RoleDef[] => ROLES;

  const getRole = (roleId: string): RoleDef | undefined => ROLE_MAP.get(roleId);

  const getRoleLabel = (roleId: string): string => ROLE_MAP.get(roleId)?.label || roleId;

  const getRoleGroups = (): RoleGroup[] => ROLE_GROUPS;

  const getRolesForEntity = (entityType: string): RoleDef[] =>
    ROLES.filter((r) => r.entityType === entityType);

  const getPermissions = (roleId: string): RolePermissions | null =>
    ROLE_MAP.get(roleId)?.permissions || null;

  const getNavigation = (roleId: string): NavItem[] =>
    ROLE_MAP.get(roleId)?.navigation || [];

  const getTenderColumns = (roleId: string): string[] =>
    ROLE_MAP.get(roleId)?.tenderColumns || ["reference", "title", "status", "actions"];

  const getTenderVisibility = (roleId: string): "all" | "org_all" | "tagged_only" =>
    ROLE_MAP.get(roleId)?.tenderVisibility || "tagged_only";

  const isEvaluatorRole = (roleId: string): boolean =>
    !!ROLE_MAP.get(roleId)?.evaluationStage;

  const isVendorRole = (roleId: string): boolean =>
    ROLE_MAP.get(roleId)?.entityType === "vendor";

  const isProcuringEntityRole = (roleId: string): boolean =>
    ROLE_MAP.get(roleId)?.entityType === "procuring_entity";

  const isPlatformRole = (roleId: string): boolean =>
    ROLE_MAP.get(roleId)?.entityType === "platform";

  const getStageMapping = (roleId: string) => STAGE_MAP[roleId] || null;

  const getEvaluatorRoles = (): RoleDef[] =>
    ROLES.filter((r) => !!r.evaluationStage);

  // Color class helpers based on the "color" field in JSON
  const COLOR_MAP: Record<string, { bg: string; text: string; badge: string }> = {
    blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
    purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    teal: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
    green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    red: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    gray: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  };

  const getRoleColors = (roleId: string) => {
    const color = ROLE_MAP.get(roleId)?.color || "gray";
    return COLOR_MAP[color] || COLOR_MAP.gray;
  };

  return {
    getAllRoles,
    getRole,
    getRoleLabel,
    getRoleGroups,
    getRolesForEntity,
    getPermissions,
    getNavigation,
    getTenderColumns,
    getTenderVisibility,
    isEvaluatorRole,
    isVendorRole,
    isProcuringEntityRole,
    isPlatformRole,
    getStageMapping,
    getEvaluatorRoles,
    getRoleColors,
  };
}
