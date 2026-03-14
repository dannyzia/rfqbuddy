import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Award, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { authApi } from "../../lib/api/auth.api";
import { env } from "../../lib/env";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    if (env.USE_MOCK) {
      // Mock login — simulate a small delay then navigate
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 800);
      return;
    }

    try {
      await authApi.signIn(email, password);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message ?? "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Award className="size-9 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your RFQ Portal account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@organisation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm cursor-pointer text-foreground">
                Remember me
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="size-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          {/* Login error message */}
          {loginError && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive text-center">{loginError}</p>
            </div>
          )}

          {/* Demo quick-access hint */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-[11px] text-amber-700 dark:text-amber-300 text-center">
              <strong>Demo Mode:</strong> Enter any email &amp; password to access the platform.
              Use the role switcher in the sidebar to preview all 11 roles.
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-1">
            Need an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}