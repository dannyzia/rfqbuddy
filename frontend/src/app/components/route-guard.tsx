import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../contexts/auth-context";
import { useRoles } from "../hooks/use-roles";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Badge } from "./ui/badge";

interface RouteGuardProps {
  /** Role IDs that CAN access this route (from roles.json) */
  allowedRoles: string[];
  /** If true, also check that user is tagged on this tender */
  requireTenderAssignment?: boolean;
  /** The evaluation stage this page handles (matches evaluationStage in roles.json) */
  evaluationStage?: string;
  children: ReactNode;
}

export function RouteGuard({
  allowedRoles,
  requireTenderAssignment = false,
  evaluationStage,
  children,
}: RouteGuardProps) {
  const { activeRole, isTaggedOnTender, tenderTags } = useAuth();
  const { getRoleLabel, getRoleColors, getRole, getTenderVisibility } = useRoles();
  const { id: tenderId } = useParams();
  const navigate = useNavigate();

  const visibility = getTenderVisibility(activeRole);
  const roleColors = getRoleColors(activeRole);

  // Check basic role access
  const hasRoleAccess = allowedRoles.includes(activeRole) || visibility === "all";

  // Check tender tagging — user must be tagged on the specific tender
  let hasTenderAccess = true;
  if (requireTenderAssignment && tenderId) {
    hasTenderAccess = isTaggedOnTender(tenderId);
  }

  // Check evaluation stage access
  let hasEvalAccess = true;
  if (evaluationStage && tenderId) {
    const roleDef = getRole(activeRole);
    if (roleDef?.evaluationStage === evaluationStage) {
      hasEvalAccess = isTaggedOnTender(tenderId);
    } else if (visibility !== "all" && activeRole !== "procurer" && activeRole !== "pe_admin" && activeRole !== "procurement_head") {
      hasEvalAccess = false;
    }
  }

  const isAllowed = hasRoleAccess && hasTenderAccess && hasEvalAccess;

  if (!isAllowed) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="size-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Access Restricted</h2>
            <p className="text-sm text-muted-foreground">
              Your current role{" "}
              <Badge variant="secondary" className={`${roleColors.badge} mx-1`}>
                {getRoleLabel(activeRole)}
              </Badge>{" "}
              does not have permission to access this page.
            </p>

            {!hasRoleAccess && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">
                  <Lock className="size-3 inline mr-1" />
                  This page requires one of the following roles:
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {allowedRoles.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {getRoleLabel(role)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hasRoleAccess && !hasTenderAccess && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You are not tagged on tender <strong>{tenderId}</strong>.
                  The Procurer or Procuring Entity Admin must tag you via the Approval Workflow configuration.
                </p>
              </div>
            )}

            {hasRoleAccess && hasTenderAccess && !hasEvalAccess && evaluationStage && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Your role does not cover the <strong>{evaluationStage}</strong> evaluation stage,
                  or you are not tagged as the evaluator for this tender.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="size-4 mr-2" />Go Back
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-4">
              PRD §7.1 — Roles defined in /src/app/config/roles.json. Use the Role Switcher to test.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}