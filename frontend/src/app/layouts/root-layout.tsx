import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { 
  Bell, 
  Calendar as CalendarIcon, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileStack,
  TrendingUp,
  Activity,
  ShieldCheck,
  Award,
  Menu,
  X,
  LogOut,
  User,
  ScrollText,
  HelpCircle,
  BookOpen,
  Shield,
  DollarSign,
  ClipboardCheck,
  UserCheck,
  Crown,
  Building2,
  Package,
  ShoppingCart,
  Star,
  Code2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { cn } from "../components/ui/utils";
import { useAuth } from "../contexts/auth-context";
import { AuthProvider } from "../contexts/auth-context";
import { NotificationProvider } from "../contexts/notification-context";
import { useNotificationContext } from "../contexts/notification-context";
import { useRoles } from "../hooks/use-roles";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { ThemePicker } from "../components/theme-picker";
import { authApi } from "../lib/api/auth.api";
import { env } from "../lib/env";

// ─── Icon resolver: maps icon string from JSON → Lucide component ──────────

const ICON_LOOKUP: Record<string, any> = {
  LayoutDashboard, FileStack, Users, Building2, TrendingUp, Activity,
  ScrollText, CalendarIcon, Calendar: CalendarIcon, FileText, Bell, User,
  HelpCircle, Settings, ShieldCheck, BookOpen, Shield, DollarSign,
  ClipboardCheck, UserCheck, Crown, Package, ShoppingCart, Star, Award, Code2,
};

function resolveIcon(iconName: string) {
  return ICON_LOOKUP[iconName] || FileText;
}

export function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RootLayoutInner />
      </NotificationProvider>
    </AuthProvider>
  );
}

function RootLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeRole, setActiveRole } = useAuth();
  const { unreadCount } = useNotificationContext();
  const {
    getRole,
    getRoleLabel,
    getRoleGroups,
    getNavigation,
    getRoleColors,
  } = useRoles();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Navigation from JSON config
  const navItems = getNavigation(activeRole);
  const currentRoleDef = getRole(activeRole);
  const roleColors = getRoleColors(activeRole);
  const roleGroups = getRoleGroups();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          // Desktop
          "hidden lg:flex",
          sidebarOpen ? "lg:w-64" : "lg:w-20",
          // Mobile overlay
          mobileSidebarOpen && "!flex fixed inset-y-0 left-0 z-50 w-72 shadow-2xl"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="flex items-center gap-2">
              <Award className="size-8 text-sidebar-primary" />
              <span className="font-bold text-xl text-sidebar-foreground">RFQ Portal</span>
            </div>
          )}
          {/* Desktop toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (mobileSidebarOpen) {
                setMobileSidebarOpen(false);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
          >
            {(sidebarOpen || mobileSidebarOpen) ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Active Role + User Badge */}
        {(sidebarOpen || mobileSidebarOpen) && currentRoleDef && (
          <div className="px-4 py-2.5 border-b border-sidebar-border bg-sidebar-accent">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = resolveIcon(currentRoleDef.icon);
                return <Icon className={`size-4 ${roleColors.text}`} />;
              })()}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {currentRoleDef.label} &bull; {user.organisation}
                </p>
              </div>
              <Badge variant="secondary" className={`text-[9px] px-1.5 shrink-0 ${roleColors.badge}`}>
                {currentRoleDef.shortLabel}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation — driven entirely by roles.json */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = resolveIcon(item.icon);
              const isNotifLink = item.path === "/notifications";
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <span className="relative shrink-0">
                      <Icon className="size-5" />
                      {isNotifLink && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </span>
                    {(sidebarOpen || mobileSidebarOpen) && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Role Switcher — reads groups + roles from roles.json */}
        <div className="border-t border-sidebar-border">
          <button
            onClick={() => sidebarOpen && setRoleSwitcherOpen(!roleSwitcherOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sidebar-accent/50 transition-colors",
              !sidebarOpen && "justify-center px-2"
            )}
          >
            <User className="size-5 shrink-0 text-sidebar-primary" />
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Demo: Switch Role</p>
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{getRoleLabel(activeRole)}</p>
                </div>
                <svg
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    roleSwitcherOpen && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {roleSwitcherOpen && (sidebarOpen || mobileSidebarOpen) && (
            <div className="px-2 pb-2 max-h-72 overflow-y-auto">
              {roleGroups.map((group) => (
                <div key={group.key} className="mb-1">
                  <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-2 pb-0.5">
                    {group.label}
                  </p>
                  {group.roleIds.map((roleId) => {
                    const roleDef = getRole(roleId);
                    if (!roleDef) return null;
                    const Icon = resolveIcon(roleDef.icon);
                    const colors = getRoleColors(roleId);
                    const isCurrent = activeRole === roleId;
                    return (
                      <button
                        key={roleId}
                        onClick={() => {
                          setActiveRole(roleId);
                          setRoleSwitcherOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                          isCurrent
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <Icon className={`size-3.5 ${colors.text}`} />
                        <span className="flex-1 text-left truncate">{roleDef.label}</span>
                        {isCurrent && (
                          <div className="size-1.5 rounded-full bg-sidebar-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <div className="border-t border-sidebar-border">
          {/* openDown=false → panel opens upward (safe at bottom of sidebar) */}
          <ThemePicker showLabel={sidebarOpen || mobileSidebarOpen} openDown={false} />
        </div>

        {/* Logout */}
        <div className="border-t border-sidebar-border">
          <button
            onClick={async () => {
              if (!env.USE_MOCK) {
                try { await authApi.signOut(); } catch {}
              }
              navigate("/login");
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
              !(sidebarOpen || mobileSidebarOpen) && "justify-center px-2"
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {(sidebarOpen || mobileSidebarOpen) && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Mobile top bar */}
        <div className="lg:hidden shrink-0 sticky top-0 z-30 h-14 flex items-center gap-3 px-4 bg-card border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Award className="size-6 text-primary" />
            <span className="font-bold text-foreground">RFQ Portal</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Notification bell (mobile) */}
            <Link to="/notifications" className="relative p-2">
              <Bell className="size-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            {/* openDown=true → panel opens downward (we're in the top bar) */}
            <ThemePicker openDown className="rounded-lg" />
          </div>
        </div>
        {/* ✨ TRUE OVERLAY SCROLLBAR - Zero gutter space! */}
        <ScrollArea className="flex-1">
          <Outlet />
        </ScrollArea>
      </main>
    </div>
  );
}