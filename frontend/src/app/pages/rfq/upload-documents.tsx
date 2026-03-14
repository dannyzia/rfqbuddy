import { PageTemplate } from "../../components/page-template";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Upload, FileText, Trash2 } from "lucide-react";

export function UploadDocuments() {
  return (
    <PageTemplate
      title="Upload Tender Documents"
      description="Attach specification files and supporting documents"
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <Upload className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-muted-foreground">Max file size: 50MB</p>
            <Button className="mt-4">Choose Files</Button>
          </div>

          <div className="space-y-2">
            {["Specifications.pdf", "Technical Drawings.dwg"].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-blue-600" />
                  <span>{file}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}