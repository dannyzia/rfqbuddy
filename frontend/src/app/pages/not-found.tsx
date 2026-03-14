import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-muted-foreground/30 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button>
              <Home className="size-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}