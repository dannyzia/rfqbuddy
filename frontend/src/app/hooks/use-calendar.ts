// Calendar hook — aggregates tender deadlines, openings, milestones, contract ends

import { useApiQuery } from '../lib/use-api';
import { calendarApi } from '../lib/api/calendar.api';
import type { CalendarEvent } from '../lib/api-types';

export function useCalendarEvents(start: string, end: string) {
  return useApiQuery<CalendarEvent[]>(
    () => calendarApi.getEvents(start, end),
    [start, end],
    { enabled: !!start && !!end },
  );
}
