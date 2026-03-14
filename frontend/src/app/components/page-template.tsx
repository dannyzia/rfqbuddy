import { ReactNode } from "react";
import { PageHeader } from "./page-header";
import { Card, CardContent } from "./ui/card";

interface PageTemplateProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backTo?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function PageTemplate({ title, description, actions, backTo, backLabel, children }: PageTemplateProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-full">
      <PageHeader title={title} description={description} actions={actions} backTo={backTo} backLabel={backLabel} />
      {children || (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Page content will be implemented here
          </CardContent>
        </Card>
      )}
    </div>
  );
}