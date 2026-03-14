import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="size-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="size-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
