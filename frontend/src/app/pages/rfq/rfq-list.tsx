import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Plus, Search, Eye, Shield, XCircle, Layers, ChevronDown, Building2, FileText,
  ClipboardCheck, Lightbulb, Trash2, Settings, ArrowRight, Play, CheckCircle2,
  AlertTriangle, Filter, Download, RefreshCw, Pencil, AlertCircle, ChevronLeft,
  ChevronRight, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { useSavedPresets } from "../../hooks/use-saved-presets";
import { useAuth } from "../../contexts/auth-context";
import { useRoles } from "../../hooks/use-roles";
import { usePageConfig } from "../../hooks/use-page-config";
import type { ServerQueryParams } from "../../hooks/use-page-config";
import { interpolate, type TenderItemConfig, type RfqPageConfig } from "../../config/rfq-page-config";

// ─── Icon resolver — maps config icon strings to Lucide components ──────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "eye": Eye, "shield": Shield, "x-circle": XCircle, "building-2": Building2,
  "file-text": FileText, "clipboard-check": ClipboardCheck, "lightbulb": Lightbulb,
  "settings": Settings, "arrow-right": ArrowRight, "play": Play,
  "check-circle-2": CheckCircle2, "alert-triangle": AlertTriangle, "filter": Filter,
  "download": Download, "refresh-cw": RefreshCw, "pencil": Pencil,
  "alert-circle": AlertCircle, "layers": Layers, "plus": Plus, "trash-2": Trash2,
  "search": Search, "chevron-down": ChevronDown,
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

// ─── URL search-param helpers ───────────────────────────────────────────────
// Read typed values from URLSearchParams with sane defaults

function readParam(sp: URLSearchParams, key: string, fallback: string): string {
  return sp.get(key) || fallback;
}
function readNumParam(sp: URLSearchParams, key: string, fallback: number): number {
  const v = sp.get(key);
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RfqList() {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ─── URL-persisted state (replaces individual useState calls) ──────
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery    = readParam(searchParams, "q", "");
  const statusFilter   = readParam(searchParams, "status", "all");
  const typeFilter     = readParam(searchParams, "type", "all");
  const sortColumn     = searchParams.get("sort") || null;
  const sortDirection  = (readParam(searchParams, "dir", "asc") as "asc" | "desc");
  const currentPage    = readNumParam(searchParams, "page", 1);
  const pageSize       = readNumParam(searchParams, "size", 10);

  // Helper: merge params into URL (removes defaults to keep URL clean)
  const updateParams = useCallback((patch: Record<string, string | number | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "" || v === "all" || (k === "page" && v === 1) || (k === "size" && v === 10) || (k === "dir" && v === "asc")) {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const navigate = useNavigate();
  const { presets: savedPresets, deletePreset } = useSavedPresets();
  const { activeRole, user, tenderTags } = useAuth();
  const {
    getRoleLabel, getPermissions, getTenderColumns,
    getTenderVisibility, isEvaluatorRole, isVendorRole, getStageMapping,
    getRoleColors,
  } = useRoles();

  // ─── Server query params (forwarded to hook for API-readiness) ────
  const serverParams: ServerQueryParams = useMemo(() => ({
    sort: sortColumn,
    dir: sortDirection,
    page: currentPage,
    size: pageSize,
    q: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  }), [sortColumn, sortDirection, currentPage, pageSize, searchQuery, statusFilter, typeFilter]);

  // ─── Config from "API" ──────────────────────────────────────────────
  const { config, isLoading, isError, errorMessage, retry, apiQueryString } = usePageConfig(serverParams);

  const permissions = getPermissions(activeRole);
  const visibility = getTenderVisibility(activeRole);
  const roleColors = getRoleColors(activeRole);
  const roleLabel = getRoleLabel(activeRole);

  // ─── Template context for interpolation ─────────────────────────────
  const tplCtx = useMemo(() => ({
    roleLabel,
    organisation: user.organisation,
    count: "0", // updated below
  }), [roleLabel, user.organisation]);

  // ─── Filter tenders ─────────────────────────────────────────────────

  const filteredTenders = useMemo(() => {
    if (!config) return [];
    let tenders = config.tenders;

    if (isVendorRole(activeRole)) return [];

    if (visibility === "tagged_only") {
      const taggedIds = new Set(tenderTags.map((t) => t.tenderId));
      tenders = tenders.filter((t) => taggedIds.has(t.id));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tenders = tenders.filter(
        (t) => t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") tenders = tenders.filter((t) => t.status === statusFilter);
    if (typeFilter !== "all") tenders = tenders.filter((t) => t.type === typeFilter);

    return tenders;
  }, [config, activeRole, searchQuery, statusFilter, typeFilter, visibility, tenderTags, isVendorRole]);

  // ─── Sorting (config-driven: only columns with sortable=true) ─────

  const sortedTenders = useMemo(() => {
    if (!sortColumn || !config) return filteredTenders;
    const colDef = config.columns.find((c) => c.id === sortColumn);
    if (!colDef?.sortable || !colDef.sortKey) return filteredTenders;

    const key = colDef.sortKey as keyof TenderItemConfig;
    return [...filteredTenders].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp: number;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDirection === "desc" ? -cmp : cmp;
    });
  }, [filteredTenders, sortColumn, sortDirection, config]);

  // ─── Sort handler ─────────────────────────────────────────────────

  const handleSort = useCallback((colId: string) => {
    if (!config) return;
    const colDef = config.columns.find((c) => c.id === colId);
    if (!colDef?.sortable) return;
    if (sortColumn === colId) {
      // Toggle direction, or clear on third click
      if (sortDirection === "asc") {
        updateParams({ dir: "desc", page: 1 });
      } else {
        updateParams({ sort: null, dir: null, page: 1 });
      }
    } else {
      updateParams({ sort: colId, dir: "asc", page: 1 });
    }
  }, [config, sortColumn, sortDirection, updateParams]);

  // ─── Mobile sort handler (combined column+direction select) ───────

  const sortableColumns = useMemo(() => {
    if (!config) return [];
    return config.columns.filter((c) => c.sortable && c.sortKey);
  }, [config]);

  const mobileSortValue = sortColumn
    ? `${sortColumn}:${sortDirection}`
    : "";

  const handleMobileSort = useCallback((value: string) => {
    if (!value) {
      updateParams({ sort: null, dir: null, page: 1 });
    } else {
      const [col, dir] = value.split(":");
      updateParams({ sort: col, dir: dir || "asc", page: 1 });
    }
  }, [updateParams]);

  // ─── Pagination ─────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(sortedTenders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTenders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedTenders.slice(start, start + pageSize);
  }, [sortedTenders, safePage, pageSize]);

  // Reset page on filter change
  const handleStatusFilter = (v: string) => { updateParams({ status: v, page: 1 }); };
  const handleTypeFilter = (v: string) => { updateParams({ type: v, page: 1 }); };
  const handleSearch = (v: string) => { updateParams({ q: v, page: 1 }); };

  // ─── Selection ──────────────────────────────────────────────────────

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedTenders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedTenders.map((t) => t.id)));
    }
  }, [paginatedTenders, selectedIds.size]);

  // ─── Columns from roles.json (keep RBAC) ───────────────────────────

  const roleColumns = getTenderColumns(activeRole) as string[];
  const showBulkSelect = permissions?.canDeleteTender || permissions?.canWithholdTender || permissions?.canViewAllOrgTenders;

  // ─── LOADING STATE ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`skel-row-${i}`} className="flex gap-4 mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── ERROR STATE ────────────────────��─────────────────────────────

  if (isError || !config) {
    const errCfg = config?.errorState;
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
              <AlertCircle className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {errCfg?.title ?? "Failed to load tenders"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {errorMessage ?? errCfg?.description ?? "Something went wrong."}
            </p>
            <Button onClick={retry} variant="outline">
              <RefreshCw className="size-4 mr-2" />
              {errCfg?.retryLabel ?? "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Page title / description (from config) ───────────────────────

  const ctx = { ...tplCtx, count: String(filteredTenders.length) };

  const pageTitle = config.page.titleTemplates[activeRole]
    ? interpolate(config.page.titleTemplates[activeRole], ctx)
    : config.page.defaultTitle;

  const pageDescription = config.page.descriptionTemplates[activeRole]
    ? interpolate(config.page.descriptionTemplates[activeRole], ctx)
    : interpolate(config.page.defaultDescription, ctx);

  // ─── Badge renderers (from config) ────────────────────────────────

  const renderStatusBadge = (status: string) => {
    const cfg = config.statusBadges[status];
    if (!cfg) return <Badge variant="outline">{status}</Badge>;
    if (cfg.variant === "secondary") return <Badge variant="secondary">{cfg.label}</Badge>;
    if (cfg.variant === "solid") return <Badge className={cfg.className}>{cfg.label}</Badge>;
    return <Badge variant="outline">{cfg.label}</Badge>;
  };

  const renderStageBadge = (stage: string) => {
    const cfg = config.stageBadges[stage];
    if (!cfg) return <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">{stage}</Badge>;
    return <Badge variant="secondary" className={`text-[10px] ${cfg.className}`}>{cfg.label}</Badge>;
  };

  // ─── Row actions (config-driven) ──────────────────────────────────

  const renderActions = (tender: TenderItemConfig) => {
    const stageMap = getStageMapping(activeRole);
    const actions: JSX.Element[] = [];

    for (const action of config.rowActions) {
      // Role check
      if (!action.roles.includes("all") && !action.roles.includes(activeRole)) continue;
      // Permission check
      if (action.requiredPermission && !(permissions as any)?.[action.requiredPermission]) continue;

      // Condition check
      let show = false;
      switch (action.condition) {
        case "always": show = true; break;
        case "draft": show = tender.status === "Draft"; break;
        case "active": show = tender.status === "Active"; break;
        case "withheld": show = tender.status === "Withheld"; break;
        case "pendingMyStage": show = !!(stageMap && tender.currentStage === stageMap.stageKey); break;
        case "pendingApproval": show = tender.currentStage === "pending_approval"; break;
      }
      if (!show) continue;

      const link = action.linkTemplate
        ? action.linkTemplate.replace("{{id}}", tender.id)
        : undefined;

      const btn = (
        <Button
          key={action.id}
          variant={action.variant === "default" ? "default" : action.variant as any}
          size="sm"
          className={action.className}
          onClick={
            action.confirmTemplate
              ? () => { if (confirm(interpolate(action.confirmTemplate!, { id: tender.id }))) alert(`Action: ${action.id} on ${tender.id}`); }
              : !link ? () => alert(`Action: ${action.id} on ${tender.id}`) : undefined
          }
        >
          <DynIcon name={action.icon} className="size-3 mr-1" />
          {action.label}
        </Button>
      );

      if (link && !action.confirmTemplate) {
        actions.push(<Link key={action.id} to={link}>{btn}</Link>);
      } else {
        actions.push(btn);
      }
    }

    return <div className="flex justify-end gap-1 flex-wrap">{actions}</div>;
  };

  // ─── Cell renderer ────────────────────────────────────────────────

  const renderCell = (tender: TenderItemConfig, colId: string) => {
    switch (colId) {
      case "select":
        return (
          <Checkbox
            checked={selectedIds.has(tender.id)}
            onCheckedChange={() => toggleSelect(tender.id)}
            aria-label={`Select ${tender.id}`}
          />
        );
      case "reference":
        return <Link to={`/tenders/${tender.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium font-mono text-xs">{tender.id}</Link>;
      case "title":
        return <span className="text-sm">{tender.title}</span>;
      case "type":
        return <Badge variant="outline">{tender.type}</Badge>;
      case "status":
        return renderStatusBadge(tender.status);
      case "stage":
        return renderStageBadge(tender.currentStage);
      case "deadline":
        return <span className="text-sm">{tender.deadline}</span>;
      case "bids":
        return <span className="text-sm text-center">{tender.bids}</span>;
      case "value":
        return <span className="text-sm font-medium">{tender.estimatedValue}</span>;
      case "recommendedVendor":
        return tender.recommendedVendor
          ? <span className="text-sm text-green-600 dark:text-green-400">{tender.recommendedVendor}</span>
          : <span className="text-xs text-muted-foreground">&mdash;</span>;
      case "actions":
        return renderActions(tender);
      default:
        return null;
    }
  };

  // ─── Mobile Card (config-driven) ──────────────────────────────────

  const renderMobileCard = (tender: TenderItemConfig) => {
    const stageMap = getStageMapping(activeRole);
    const isPendingMyAction = stageMap && tender.currentStage === stageMap.stageKey;
    const isPendingApproval = activeRole === "procurement_head" && tender.currentStage === "pending_approval";

    return (
      <div
        key={tender.id}
        className={`p-3 border rounded-lg space-y-2.5 ${
          isPendingMyAction || isPendingApproval
            ? "border-indigo-300 bg-indigo-50/50 dark:border-indigo-700 dark:bg-indigo-900/10"
            : "border-border bg-card"
        }`}
      >
        {/* Row 1: Checkbox + Reference + Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {showBulkSelect && (
              <Checkbox
                checked={selectedIds.has(tender.id)}
                onCheckedChange={() => toggleSelect(tender.id)}
                aria-label={`Select ${tender.id}`}
              />
            )}
            <Link to={`/tenders/${tender.id}`} className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              {tender.id}
            </Link>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {renderStatusBadge(tender.status)}
          </div>
        </div>

        {/* Row 2: Title */}
        <p className="text-sm font-medium text-foreground leading-tight">{tender.title}</p>

        {/* Row 3: Type + Stage */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">{tender.type}</Badge>
          {renderStageBadge(tender.currentStage)}
        </div>

        {/* Row 4: Deadline + Bids + Value (from config columns) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted rounded p-1.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {config.columns.find((c) => c.id === "deadline")?.header ?? "Deadline"}
            </p>
            <p className="text-[11px] font-medium leading-tight">{tender.deadline}</p>
          </div>
          <div className="bg-muted rounded p-1.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {config.columns.find((c) => c.id === "bids")?.header ?? "Bids"}
            </p>
            <p className="text-sm font-bold">{tender.bids}</p>
          </div>
          <div className="bg-muted rounded p-1.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              {config.columns.find((c) => c.id === "value")?.header ?? "Value"}
            </p>
            <p className="text-[10px] font-medium leading-tight truncate">{tender.estimatedValue}</p>
          </div>
        </div>

        {/* Row 5: Recommended vendor */}
        {tender.recommendedVendor && (
          <p className="text-[11px] text-green-600 dark:text-green-400">
            &#10003; {config.columns.find((c) => c.id === "recommendedVendor")?.header ?? "Recommended"}: {tender.recommendedVendor}
          </p>
        )}

        {/* Row 6: Actions */}
        <div className="pt-1 border-t border-border">
          {renderActions(tender)}
        </div>
      </div>
    );
  };

  // ─── Vendor redirect (config-driven) ──────────────────────────────

  if (isVendorRole(activeRole)) {
    const vr = config.vendorRedirect;
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full ${vr.iconBg} flex items-center justify-center mx-auto`}>
              <DynIcon name={vr.icon} className={`size-8 ${vr.iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{vr.title}</h2>
            <p className="text-sm text-muted-foreground">
              {interpolate(vr.description, { roleLabel })}
            </p>
            <Button onClick={() => navigate(vr.ctaPath)}>
              <ArrowRight className="size-4 mr-2" />{vr.ctaLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Stat card values ─────────────────────────────────────────────

  const stageMap = getStageMapping(activeRole);
  const statValues: Record<string, number> = {
    total: filteredTenders.length,
    pendingAction: filteredTenders.filter((t) => stageMap && t.currentStage === stageMap.stageKey).length,
    completed: filteredTenders.filter((t) => t.currentStage === "completed").length,
  };

  // Build visible columns: merge role columns + optional select column
  const visibleColumns = showBulkSelect
    ? ["select", ...roleColumns]
    : roleColumns;

  const pendingApprovalCount = filteredTenders.filter((t) => t.currentStage === "pending_approval").length;

  // ─── RENDER ───────────────────────────────────────────────────────

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className={`text-[10px] sm:text-xs ${roleColors.badge}`}>
              {roleLabel}
            </Badge>

            {permissions?.canCreateTender && (
              <Link to="/tenders/create" className="w-full sm:w-auto order-last sm:order-none">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Layers className="size-4 mr-2" />
                  <span className="hidden xs:inline">Custom Tender Builder</span>
                  <span className="xs:hidden">Builder</span>
                </Button>
              </Link>
            )}

            {permissions?.canCreateTender && (
              <div className="relative flex-1 sm:flex-none">
                <Button onClick={() => setShowNewMenu(!showNewMenu)} className="w-full sm:w-auto">
                  <Plus className="size-4 mr-2" />New Tender<ChevronDown className="size-4 ml-2" />
                </Button>
                {showNewMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNewMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-muted border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {config.createMenu.dropdownTitle}
                        </p>
                      </div>
                      <div className="p-2">
                        {config.createMenu.groups.map((group) => (
                          <div key={group.key}>
                            <p className={`text-[10px] font-semibold ${group.labelColor} uppercase tracking-wider px-3 pt-2 pb-1`}>
                              {group.label}
                            </p>
                            {config.createMenu.items
                              .filter((item) => item.group === group.key && item.visible)
                              .map((item) => (
                                <Link key={item.id} to={item.path} onClick={() => setShowNewMenu(false)}>
                                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                      <DynIcon name={item.icon} className={`size-4 ${item.iconColor}`} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{item.label}</p>
                                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        ))}

                        {savedPresets.length > 0 && (
                          <>
                            <div className="my-2 border-t border-border" />
                            <p className={`text-[10px] font-semibold ${config.createMenu.presetsGroup.labelColor} uppercase tracking-wider px-3 pt-1 pb-1`}>
                              {config.createMenu.presetsGroup.label}
                            </p>
                            {savedPresets.map((preset) => (
                              <div
                                key={preset.id}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                                onClick={() => { setShowNewMenu(false); navigate(`/tenders/create?preset=${preset.id}`); }}
                              >
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                  <Settings className="size-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{preset.name}</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {preset.tenderType} &bull; {preset.enabledSections.length} sections
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                >
                                  <Trash2 className="size-3 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        }
      />

      {/* ─── Evaluator Stat Cards (from config) ─────────────────────── */}
      {isEvaluatorRole(activeRole) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {config.statCards.map((card) => (
            <Card key={card.id} className={card.id === "completed" ? "sm:col-span-2 lg:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <DynIcon name={card.icon} className={`size-4 sm:size-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-foreground">{statValues[card.valueKey] ?? 0}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Pending Approval Banner (config-driven) ────────────────── */}
      {activeRole === "procurement_head" && pendingApprovalCount > 0 && (
        <div className={`mb-6 p-3 sm:p-4 ${config.approvalBanner.bgClass} border ${config.approvalBanner.borderClass} rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3`}>
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${config.approvalBanner.iconBg} flex items-center justify-center shrink-0`}>
              <DynIcon name={config.approvalBanner.icon} className={`size-4 sm:size-5 ${config.approvalBanner.iconColor}`} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-indigo-900 dark:text-indigo-200">
                {interpolate(config.approvalBanner.titleTemplate, { count: String(pendingApprovalCount) })}
              </p>
              <p className="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400">
                {config.approvalBanner.subtitle}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => handleStatusFilter(config.approvalBanner.ctaFilterValue)}
          >
            {config.approvalBanner.ctaLabel}
          </Button>
        </div>
      )}

      {/* ─── Bulk Actions Bar (admin/pe_admin only) ─────────────────── */}
      {selectedIds.size > 0 && showBulkSelect && (
        <div className="mb-4 p-3 bg-muted border border-border rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Badge variant="secondary" className="text-xs">
              {interpolate(config.uiStrings.bulkSelectedTemplate, { count: String(selectedIds.size) })}
            </Badge>
            <button
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => setSelectedIds(new Set())}
            >
              {config.uiStrings.deselectAll}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.bulkActions.map((action) => {
              if (action.requiredPermission && !(permissions as any)?.[action.requiredPermission]) return null;
              return (
                <Button
                  key={action.id}
                  variant={action.variant as any}
                  size="sm"
                  className={action.className}
                  onClick={() => {
                    const msg = action.confirmMessage
                      ? interpolate(action.confirmMessage, { count: String(selectedIds.size) })
                      : "";
                    if (!msg || confirm(msg)) {
                      alert(`${action.label}: ${Array.from(selectedIds).join(", ")}`);
                      setSelectedIds(new Set());
                    }
                  }}
                >
                  <DynIcon name={action.icon} className="size-3 mr-1" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Main Card ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-3 sm:p-4 md:p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={config.uiStrings.searchPlaceholder}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2">
              <select
                className="flex-1 md:w-auto border border-border rounded-lg px-3 sm:px-4 py-2 text-sm bg-card text-foreground"
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                {config.filters.statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                className="flex-1 md:w-auto border border-border rounded-lg px-3 sm:px-4 py-2 text-sm bg-card text-foreground"
                value={typeFilter}
                onChange={(e) => handleTypeFilter(e.target.value)}
              >
                {config.filters.typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ─── EMPTY STATE ──────────────────────────────────────── */}
          {filteredTenders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <DynIcon name={config.emptyState.icon} className="size-12 text-muted-foreground mx-auto" />
              <h3 className="text-foreground font-medium">{config.emptyState.title}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {isEvaluatorRole(activeRole)
                  ? config.emptyState.evaluatorDescription
                  : config.emptyState.description}
              </p>
              {permissions?.[config.emptyState.ctaVisible as keyof typeof permissions] && (
                <Link to={config.emptyState.ctaPath}>
                  <Button className="mt-2">
                    <Plus className="size-4 mr-2" />{config.emptyState.ctaLabel}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ─── Mobile sort dropdown (md:hidden only) ────────── */}
              {sortableColumns.length > 0 && (
                <div className="md:hidden mb-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
                    <select
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground"
                      value={mobileSortValue}
                      onChange={(e) => handleMobileSort(e.target.value)}
                    >
                      <option value="">{config.uiStrings.mobileSortNone}</option>
                      {sortableColumns.map((col) => (
                        <optgroup key={col.id} label={col.header}>
                          <option value={`${col.id}:asc`}>
                            {col.header}{config.uiStrings.mobileSortAscSuffix}
                          </option>
                          <option value={`${col.id}:desc`}>
                            {col.header}{config.uiStrings.mobileSortDescSuffix}
                          </option>
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ─── Mobile card view ─────────────────────────────── */}
              <div className="md:hidden space-y-2.5">
                {paginatedTenders.map((tender) => renderMobileCard(tender))}
              </div>

              {/* ─── Desktop table view ───────────────────────────── */}
              <div className="hidden md:block overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {visibleColumns.map((colId) => {
                          const colDef = config.columns.find((c) => c.id === colId);
                          if (colId === "select") {
                            return (
                              <TableHead key="select" className="w-10">
                                <Checkbox
                                  checked={paginatedTenders.length > 0 && selectedIds.size === paginatedTenders.length}
                                  onCheckedChange={toggleSelectAll}
                                  aria-label={config.uiStrings.selectAll}
                                />
                              </TableHead>
                            );
                          }
                          return (
                            <TableHead
                              key={colId}
                              className={`${colDef?.align === "right" ? "text-right" : colDef?.align === "center" ? "text-center" : ""} ${colDef?.sortable ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                              onClick={colDef?.sortable ? () => handleSort(colId) : undefined}
                            >
                              <span className="inline-flex items-center gap-1">
                                {colDef?.header ?? colId}
                                {colDef?.sortable && (
                                  sortColumn === colId
                                    ? sortDirection === "asc"
                                      ? <ArrowUp className="size-3 text-primary" />
                                      : <ArrowDown className="size-3 text-primary" />
                                    : <ArrowUpDown className="size-3 text-muted-foreground opacity-50" />
                                )}
                              </span>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTenders.map((tender) => {
                        const sm = getStageMapping(activeRole);
                        const isPendingMyAction = sm && tender.currentStage === sm.stageKey;
                        const isPendingApproval = activeRole === "procurement_head" && tender.currentStage === "pending_approval";

                        return (
                          <TableRow
                            key={tender.id}
                            className={`${
                              (isPendingMyAction || isPendingApproval) ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                            } ${selectedIds.has(tender.id) ? "bg-primary/5" : ""}`}
                          >
                            {visibleColumns.map((colId) => {
                              const colDef = config.columns.find((c) => c.id === colId);
                              return (
                                <TableCell
                                  key={colId}
                                  className={colDef?.align === "right" ? "text-right" : colDef?.align === "center" ? "text-center" : ""}
                                >
                                  {renderCell(tender, colId)}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}

          {/* ─── Pagination ──────────────────────────────────────── */}
          {config.pagination.enabled && filteredTenders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {config.pagination.labels.showing}{" "}
                  {Math.min((safePage - 1) * pageSize + 1, filteredTenders.length)}
                  &ndash;
                  {Math.min(safePage * pageSize, filteredTenders.length)}
                  {" "}{config.pagination.labels.of} {filteredTenders.length}
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <select
                  className="hidden sm:inline border border-border rounded px-2 py-1 text-xs bg-card text-foreground"
                  value={pageSize}
                  onChange={(e) => { updateParams({ size: Number(e.target.value), page: 1 }); }}
                >
                  {config.pagination.pageSizeOptions.map((s) => (
                    <option key={s} value={s}>{s} {config.pagination.labels.perPage}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => updateParams({ page: Math.max(1, safePage - 1) })}
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline ml-1">{config.pagination.labels.previous}</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | string)[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    typeof p === "string" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={`page-${p}`}
                        variant={p === safePage ? "default" : "outline"}
                        size="sm"
                        className="min-w-[32px]"
                        onClick={() => updateParams({ page: p })}
                      >
                        {p}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => updateParams({ page: Math.min(totalPages, safePage + 1) })}
                >
                  <span className="hidden sm:inline mr-1">{config.pagination.labels.next}</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Footer ──────────────────────────────────────────── */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {interpolate(config.uiStrings.footerShowingTemplate, { count: String(filteredTenders.length) })}
              {visibility === "all" && config.uiStrings.superAdminSuffix}
              {visibility === "org_all" && config.uiStrings.peAdminSuffix}
            </span>
            <span>{interpolate(config.uiStrings.footerRoleTemplate, { roleLabel })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}