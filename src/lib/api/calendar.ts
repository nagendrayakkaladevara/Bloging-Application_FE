/**
 * Calendar API
 * 
 * API functions for calendar event operations.
 */

import { apiClient } from "../api-client";
import type { CalendarEvent } from "@/types/calendar";
import { transformCalendarEvent } from "./transformers";
import type { ApiCalendarEventsResponse } from "./types";

/**
 * Get all calendar events
 */
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await apiClient.get<ApiCalendarEventsResponse>("/calendar/events");
    return response.events.map(transformCalendarEvent);
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return [];
  }
}
