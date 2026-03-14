import { useState, useMemo } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Bell, Check, Trash2, Wifi, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useNotificationContext } from "../../contexts/notification-context";

// ─── Mock fallback (used when notification context returns empty) ────

const MOCK_NOTIFICATIONS = [
  { id: "n1", title: "New bid submitted", message: "ABC Corp submitted a bid on PG-2026-001", time: "5 min ago", read: false, type: "bid" },
  { id: "n2", title: "Deadline reminder", message: "PW-2026-015 closes in 2 days", time: "1 hour ago", read: false, type: "deadline" },
  { id: "n3", title: "Vendor approved", message: "XYZ Construction Ltd has been approved", time: "3 hours ago", read: true, type: "vendor" },
  { id: "n4", title: "Role assignment", message: "You've been assigned as Technical Evaluator for PG-2026-002", time: "1 day ago", read: true, type: "role" },
];

export function Notifications() {
  const {
    notifications: apiNotifications,
    realtimeNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
  } = useNotificationContext();

  // Merge API notifications + realtime (or fallback to mock)
  const notifications = useMemo(() => {
    if (apiNotifications.length > 0) {
      // Map API format to display format
      return apiNotifications.map((n: any) => ({
        id: n.id,
        title: n.title ?? n.type,
        message: n.body ?? n.message ?? "",
        time: n.created_at ? new Date(n.created_at).toLocaleString() : "",
        read: !!n.read_at,
        type: n.type ?? "info",
      }));
    }
    // Fallback to mock
    return MOCK_NOTIFICATIONS;
  }, [apiNotifications]);

  // Also prepend any realtime notifications that haven't been fetched yet
  const realtimeItems = realtimeNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.body,
    time: "Just now",
    read: false,
    type: n.type,
  }));

  const allNotifications = [...realtimeItems, ...notifications];
  const unread = allNotifications.filter(n => !n.read);

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Notifications"
        description="Stay updated with procurement activities"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="size-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="size-4 mr-2" />
              Clear All
            </Button>
          </>
        }
      />

      {/* Realtime connection indicator */}
      {realtimeNotifications.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <Wifi className="size-3" />
          <span>Realtime connected — {realtimeNotifications.length} new</span>
        </div>
      )}

      <Tabs defaultValue="all" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">{allNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="default" className="ml-2">{unread.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {allNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`${notif.read ? "opacity-60" : ""} cursor-pointer transition-opacity`}
              onClick={() => !notif.read && handleMarkRead(notif.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Bell className="size-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      {!notif.read && <div className="size-2 bg-blue-600 rounded-full shrink-0 mt-2" />}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block">{notif.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {allNotifications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="size-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3">
          {unread.map((notif) => (
            <Card
              key={notif.id}
              className="cursor-pointer"
              onClick={() => handleMarkRead(notif.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Bell className="size-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      <div className="size-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block">{notif.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {unread.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Check className="size-12 mx-auto mb-3 opacity-30" />
              <p>All caught up!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
