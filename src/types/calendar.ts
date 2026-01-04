/**
 * Calendar Event Types
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string; // Format: "HH:mm"
  endTime?: string; // Format: "HH:mm"
  color?: string; // Color for event badge
  blogId?: string; // Optional link to a blog post
}

export interface CalendarEventGroup {
  date: string; // Format: "YYYY-MM-DD"
  events: CalendarEvent[];
}

