import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import { Badge } from "../../components/ui/badge";
import {
  Download, Clock, FileStack, Users, Landmark, AlertTriangle, Filter,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { calendarApi } from "../../lib/api/calendar.api";
import type { CalendarEvent } from "../../lib/api-types";

// ─── Event type config ──────────────────────────────────────────

type EventType = CalendarEvent["type"];

const EVENT_TYPE_META: Record<EventType, { label: string; color: string; dotColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  deadline:     { label: "Bid Deadline",   color: "text-red-600 dark:text-red-400",       dotColor: "bg-red-500",    icon: Clock },
  opening:      { label: "Bid Opening",    color: "text-blue-600 dark:text-blue-400",     dotColor: "bg-blue-500",   icon: Users },
  milestone:    { label: "Milestone",      color: "text-purple-600 dark:text-purple-400", dotColor: "bg-purple-500", icon: FileStack },
  contract_end: { label: "Contract End",   color: "text-green-600 dark:text-green-400",   dotColor: "bg-green-500",  icon: Landmark },
};

// ─── Mock fallback ──────────────────────────────────────────────

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "t-v01", title: "Bid Submission — Office Supplies",           date: "2026-03-14T23:59:00Z", type: "deadline" },
  { id: "t-v02", title: "Pre-bid Conference — Road Rehabilitation",   date: "2026-03-15T10:00:00Z", type: "opening" },
  { id: "t-v03", title: "Technical Evaluation Scheduled",             date: "2026-03-18T14:00:00Z", type: "milestone" },
  { id: "t-v04", title: "Contract Signing — IT Equipment",            date: "2026-03-20T09:00:00Z", type: "contract_end" },
  { id: "t-v05", title: "Bid Submission — Medical Supplies",          date: "2026-03-25T23:59:00Z", type: "deadline" },
  { id: "t-v06", title: "Pre-bid Q&A — School Furniture",             date: "2026-03-28T11:00:00Z", type: "opening" },
  { id: "t-v07", title: "Contract Milestone — Phase 2 Delivery",      date: "2026-04-02T12:00:00Z", type: "milestone" },
  { id: "t-v08", title: "Bid Submission — Security Services",         date: "2026-04-05T23:59:00Z", type: "deadline" },
];

// ─── Helpers ────────────────────────────────────────────────────

function toDate(iso: string) { return new Date(iso); }

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDaysUntil(d: Date) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(d); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Component ──────────────────────────────────────────────────

export function VendorCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  // 3-month window
  const { rangeStart, rangeEnd } = useMemo(() => {
    const now = new Date();
    const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return { rangeStart: s.toISOString().slice(0, 10), rangeEnd: e.toISOString().slice(0, 10) };
  }, []);

  const { data: events } = useApiOrMock(
    () => calendarApi.getEvents(rangeStart, rangeEnd),
    MOCK_EVENTS,
    [rangeStart, rangeEnd],
  );

  // Filter
  const filteredEvents = useMemo(() => {
    if (filterType === "all") return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  // Dates with events
  const eventDates = useMemo(() => {
    const set = new Set<string>();
    filteredEvents.forEach(e => set.add(toDate(e.date).toDateString()));
    return set;
  }, [filteredEvents]);

  // Events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!date) return [];
    return filteredEvents.filter(e => isSameDay(toDate(e.date), date));
  }, [date, filteredEvents]);

  // Upcoming (next 30 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() + 30);
    return filteredEvents
      .filter(e => { const d = toDate(e.date); return d >= now && d <= cutoff; })
      .sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());
  }, [filteredEvents]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const next7 = new Date(now); next7.setDate(next7.getDate() + 7);
    const next30 = new Date(now); next30.setDate(next30.getDate() + 30);
    return {
      urgentDeadlines: events.filter(e => e.type === "deadline" && toDate(e.date) >= now && toDate(e.date) <= next7).length,
      openingsNext30: events.filter(e => e.type === "opening" && toDate(e.date) >= now && toDate(e.date) <= next30).length,
      totalThisMonth: events.filter(e => {
        const d = toDate(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    };
  }, [events]);

  const renderEventCard = (event: CalendarEvent) => {
    const meta = EVENT_TYPE_META[event.type];
    const Icon = meta.icon;
    const daysUntil = getDaysUntil(toDate(event.date));
    const isUrgent = event.type === "deadline" && daysUntil <= 3 && daysUntil >= 0;

    return (
      <div
        key={`${event.type}-${event.id}`}
        className={`p-3 border rounded-lg transition-colors ${
          isUrgent
            ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
            : "border-border bg-card hover:bg-muted/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 rounded-lg ${isUrgent ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"}`}>
            <Icon className={`size-4 ${isUrgent ? "text-red-600 dark:text-red-400" : meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm text-foreground truncate">{event.title}</h4>
              {isUrgent && (
                <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0 shrink-0">URGENT</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{formatEventDate(event.date)} &bull; {formatEventTime(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="outline" className={`text-[10px] ${meta.color}`}>
                <span className={`inline-block size-1.5 rounded-full ${meta.dotColor} mr-1`} />
                {meta.label}
              </Badge>
              {daysUntil >= 0 && (
                <span className={`text-[10px] ${daysUntil <= 2 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                  {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days away`}
                </span>
              )}
              {daysUntil < 0 && (
                <span className="text-[10px] text-muted-foreground">{Math.abs(daysUntil)} days ago</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Calendar / Deadlines"
        description="Track bid deadlines, openings, milestones, and contract dates"
        actions={
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            <span className="hidden sm:inline">Export to iCal</span>
            <span className="sm:hidden">Export</span>
          </Button>
        }
      />

      {/* ─── Stat Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4 sm:size-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl text-foreground">{stats.urgentDeadlines}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Deadlines (7d)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Users className="size-4 sm:size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl text-foreground">{stats.openingsNext30}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Openings (30d)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <FileStack className="size-4 sm:size-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl text-foreground">{stats.totalThisMonth}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Filter Bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <Filter className="size-3.5 text-muted-foreground shrink-0" />
        <button
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
            filterType === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setFilterType("all")}
        >
          All Events
        </button>
        {(Object.entries(EVENT_TYPE_META) as [EventType, typeof EVENT_TYPE_META[EventType]][]).map(([type, meta]) => (
          <button
            key={type}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterType === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilterType(type)}
          >
            <span className={`inline-block size-1.5 rounded-full ${filterType === type ? "bg-primary-foreground" : meta.dotColor}`} />
            {meta.label}
          </button>
        ))}
      </div>

      {/* ─── Main Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardContent className="p-3 sm:p-6">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
              modifiers={{
                hasEvent: (d: Date) => eventDates.has(d.toDateString()),
              }}
              modifiersClassNames={{
                hasEvent: "font-bold underline underline-offset-4 decoration-primary decoration-2",
              }}
            />

            {/* Selected date events */}
            {date && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm text-foreground mb-3">
                  Events on {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h4>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No events scheduled for this date
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map(renderEventCard)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <h3 className="text-foreground mb-4">
              Upcoming Events
              <span className="ml-2 text-xs text-muted-foreground">
                (next 30 days)
              </span>
            </h3>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {upcomingEvents.map(renderEventCard)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
