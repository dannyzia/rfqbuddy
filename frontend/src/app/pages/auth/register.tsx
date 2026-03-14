import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Award, Building2, Truck, ArrowRight, CheckCircle, Shield,
  FileStack, Users, Globe, ChevronRight, Info,
} from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"procuring_entity" | "vendor" | null>(null);

  return (
    <Card className="shadow-lg max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <Award className="size-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose your account type to get started with RFQ Portal
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Procuring Entity Option */}
        <button
          onClick={() => setSelected("procuring_entity")}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
            selected === "procuring_entity"
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400 shadow-sm"
              : "border-border hover:border-border/80 hover:bg-muted"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
              selected === "procuring_entity"
                ? "bg-indigo-100 dark:bg-indigo-900/40"
                : "bg-muted"
            }`}>
              <Building2 className={`size-7 ${
                selected === "procuring_entity"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground"
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Procuring Entity</h3>
                {selected === "procuring_entity" && (
                  <CheckCircle className="size-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Government bodies, corporations, and organisations that issue tenders and manage procurement.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  <FileStack className="size-2.5 mr-1" />Create Tenders
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Users className="size-2.5 mr-1" />Manage Team
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Shield className="size-2.5 mr-1" />Evaluate Bids
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Globe className="size-2.5 mr-1" />14 Tender Types
                </Badge>
              </div>
            </div>
          </div>

          {selected === "procuring_entity" && (
            <div className="mt-4 pt-3 border-t border-indigo-200 dark:border-indigo-800">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Government (PG/PW/PPS series) &amp; Non-Government (NRQ series)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Up to 14 segments per tender with custom workflow</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">JSON-driven RBAC with custom role creation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">First user becomes PE Admin automatically</span>
                </div>
              </div>
            </div>
          )}
        </button>

        {/* Vendor Option */}
        <button
          onClick={() => setSelected("vendor")}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
            selected === "vendor"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-400 shadow-sm"
              : "border-border hover:border-border/80 hover:bg-muted"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
              selected === "vendor"
                ? "bg-emerald-100 dark:bg-emerald-900/40"
                : "bg-muted"
            }`}>
              <Truck className={`size-7 ${
                selected === "vendor"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">Vendor / Supplier</h3>
                {selected === "vendor" && (
                  <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Suppliers, contractors, and service providers who respond to tenders and submit bids.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  <FileStack className="size-2.5 mr-1" />Browse RFQs
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Users className="size-2.5 mr-1" />Sales Team
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Shield className="size-2.5 mr-1" />Submit Bids
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Globe className="size-2.5 mr-1" />Multi-Category
                </Badge>
              </div>
            </div>
          </div>

          {selected === "vendor" && (
            <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Enlistment in multiple procurement categories</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Automated bid tracking and notifications</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Team management with Admin, Sales Exec, Sales Manager roles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">First user becomes Vendor Admin automatically</span>
                </div>
              </div>
            </div>
          )}
        </button>

        {/* Info Notice */}
        <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Info className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            The first person to register an organisation becomes the <strong>Admin</strong> with full access.
            Additional team members are invited by the Admin after registration.
            All accounts require platform approval before activation.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full"
          size="lg"
          disabled={!selected}
          onClick={() => {
            if (selected === "procuring_entity") navigate("/register/procuring-entity");
            else if (selected === "vendor") navigate("/register/vendor");
          }}
        >
          {selected === "procuring_entity" ? (
            <>
              Register as Procuring Entity
              <ArrowRight className="size-4 ml-2" />
            </>
          ) : selected === "vendor" ? (
            <>
              Register as Vendor
              <ArrowRight className="size-4 ml-2" />
            </>
          ) : (
            "Select Account Type to Continue"
          )}
        </Button>

        {/* Sign-in link */}
        <div className="text-center text-sm text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}