import { Outlet, Link } from "react-router";
import { Award } from "lucide-react";
import { ThemePicker } from "../components/theme-picker";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Award className="size-8 text-primary" />
            <span className="font-bold text-xl text-foreground">RFQ Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemePicker openDown className="rounded-lg" />
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} RFQ Portal. All rights reserved.</p>
        <div className="mt-1 flex justify-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}

/**
 * Wide variant for multi-step registration forms (buyer/vendor)
 */
export function AuthLayoutWide() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Award className="size-8 text-primary" />
            <span className="font-bold text-xl text-foreground">RFQ Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemePicker openDown className="rounded-lg" />
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Content — wider max-width for multi-step forms */}
      <main className="flex-1 px-4 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} RFQ Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
