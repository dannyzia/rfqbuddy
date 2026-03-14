import { api } from '../api-client';
import type { CalendarEvent } from '../api-types';

export const calendarApi = {
  getEvents(start: string, end: string) {
    return api.get<CalendarEvent[]>('/api/calendar', { start, end });
  },
};
