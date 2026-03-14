import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Code2, CheckCircle2, XCircle } from "lucide-react";

export default function ScrollbarDemo() {
  // Sample content for demonstration
  const sampleContent = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is sample content item number ${i + 1}. It helps demonstrate the scrolling behavior.`,
  }));

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PageHeader
        title="Scrollbar Comparison Demo"
        description="Compare standard browser scrollbars (with gutter) vs. overlay ScrollArea (zero gutter)"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ═══ LEFT: Standard Scrollbar (with gutter) ═══ */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex-none">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <CardTitle>Standard Browser Scrollbar</CardTitle>
              </div>
              <CardDescription>
                Uses native <code className="px-1.5 py-0.5 bg-muted rounded text-xs">overflow-y-auto</code> - reserves gutter space (~15px)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {/* IMPORTANT: This div has gutter space reserved */}
              <div className="h-full overflow-y-auto border-t">
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                      ⚠️ Gutter Space Reserved
                    </h3>
                    <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                      <li>• Content width reduced by ~15px</li>
                      <li>• Scrollbar always reserves layout space</li>
                      <li>• Common in Chromium browsers (Chrome, Edge)</li>
                    </ul>
                  </div>

                  {sampleContent.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-muted border border-border rounded-lg"
                    >
                      <h4 className="font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══ RIGHT: Overlay ScrollArea (zero gutter) ═══ */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex-none">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <CardTitle>Overlay ScrollArea Component</CardTitle>
              </div>
              <CardDescription>
                Uses <code className="px-1.5 py-0.5 bg-muted rounded text-xs">&lt;ScrollArea&gt;</code> - zero gutter, floats over content
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {/* IMPORTANT: ScrollArea has NO gutter space */}
              <ScrollArea className="h-full border-t">
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      ✅ Zero Gutter Space
                    </h3>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• Content uses full width</li>
                      <li>• Scrollbar floats over content</li>
                      <li>• Only visible on hover/scroll</li>
                      <li>• Works in all browsers</li>
                    </ul>
                  </div>

                  {sampleContent.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-muted border border-border rounded-lg"
                    >
                      <h4 className="font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Code Examples ═══ */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              <CardTitle>Implementation Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Standard scrollbar code */}
            <div>
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Standard (with gutter)
              </h3>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs">
                <code>{`<div className="h-full overflow-y-auto">
  <div className="p-6">
    {/* Your content */}
  </div>
</div>`}</code>
              </pre>
            </div>

            {/* ScrollArea code */}
            <div>
              <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                ScrollArea (zero gutter)
              </h3>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs">
                <code>{`import { ScrollArea } from './components/ui/scroll-area';

<ScrollArea className="h-full">
  <div className="p-6">
    {/* Your content - uses full width! */}
  </div>
</ScrollArea>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}