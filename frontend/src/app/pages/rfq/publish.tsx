import { useNavigate } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

export function PublishRfq() {
  const navigate = useNavigate();

  return (
    <PageTemplate
      title="Publish RFQ"
      description="Final confirmation before publishing"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="size-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Important Notice</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Once published, the tender cannot be deleted</li>
                  <li>Invited vendors will be notified immediately</li>
                  <li>The submission timeline will start</li>
                  <li>Changes after publishing require addendum process</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className="size-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">All Checks Passed</h3>
                <p className="text-sm text-muted-foreground">Your tender is ready to be published</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Go Back
              </Button>
              <Button onClick={() => navigate("/tenders/PG-2026-001")} className="flex-1">
                Confirm & Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}