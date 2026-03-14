import { useParams } from "react-router";
import { PageTemplate } from "../../components/page-template";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Award, Clock, Star } from "lucide-react";

export function VendorPerformance() {
  const { id } = useParams();

  const history = [
    { tender: "PG-2025-045", status: "Awarded", deliveryDate: "On Time", rating: 5 },
    { tender: "PW-2025-032", status: "Awarded", deliveryDate: "2 days late", rating: 4 },
    { tender: "PG-2025-021", status: "Not Awarded", deliveryDate: "-", rating: 0 },
    { tender: "PPS-2025-018", status: "Awarded", deliveryDate: "On Time", rating: 5 },
  ];

  return (
    <PageTemplate
      title="Vendor Performance History"
      description="Track vendor's past tender participation and performance"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Participations</div>
            <div className="text-3xl font-bold mt-1">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="text-3xl font-bold mt-1">50%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Avg Rating</div>
            <div className="text-3xl font-bold mt-1 flex items-center gap-2">
              4.7 <Star className="size-5 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tender History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Award className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.tender}</div>
                    <div className="text-sm text-muted-foreground">{item.deliveryDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="size-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  )}
                  <Badge variant={item.status === "Awarded" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}