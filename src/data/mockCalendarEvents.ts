/**
 * Mock Calendar Events Data
 * 
 * Provides sample calendar events for demonstration.
 */

import type { CalendarEvent } from "@/types/calendar";

// Sample events - in a real app, these would come from an API
export const mockCalendarEvents: CalendarEvent[] = [
  // January 2026
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    description: "New blog post published: A comprehensive guide to building modern web applications",
    date: new Date(2026, 0, 15), // January 15, 2026
    startTime: "10:00",
    endTime: "11:00",
    color: "blue",
    blogId: "getting-started-with-react-and-typescript",
  },
  {
    id: "2",
    title: "Blog Review Meeting",
    description: "Review upcoming blog posts and editorial calendar",
    date: new Date(2026, 0, 18), // January 18, 2026
    startTime: "14:00",
    endTime: "15:30",
    color: "green",
  },
  {
    id: "3",
    title: "Mastering Tailwind CSS",
    description: "New blog post published: Learn how to build beautiful, responsive UIs",
    date: new Date(2026, 0, 20), // January 20, 2026
    startTime: "14:30",
    endTime: "15:30",
    color: "blue",
    blogId: "mastering-tailwind-css",
  },
  {
    id: "4",
    title: "Content Planning Session",
    description: "Plan content strategy for next month",
    date: new Date(2026, 0, 22), // January 22, 2026
    startTime: "09:00",
    endTime: "10:30",
    color: "purple",
  },
  {
    id: "5",
    title: "Building Configuration-Driven UIs",
    description: "New blog post published: Learn how to create flexible, data-driven interfaces",
    date: new Date(2026, 0, 25), // January 25, 2026
    startTime: "09:15",
    endTime: "10:15",
    color: "blue",
    blogId: "building-configuration-driven-uis",
  },
  {
    id: "6",
    title: "Editorial Review",
    description: "Review and edit blog drafts for quality assurance",
    date: new Date(2026, 0, 28), // January 28, 2026
    startTime: "11:00",
    endTime: "12:00",
    color: "orange",
  },
  // February 2026
  {
    id: "7",
    title: "Advanced React Patterns",
    description: "New blog post published: Exploring advanced patterns and techniques",
    date: new Date(2026, 1, 5), // February 5, 2026
    startTime: "10:00",
    endTime: "11:00",
    color: "blue",
  },
  {
    id: "8",
    title: "Blog Performance Optimization",
    description: "New blog post published: Tips for optimizing blog performance",
    date: new Date(2026, 1, 12), // February 12, 2026
    startTime: "13:00",
    endTime: "14:00",
    color: "blue",
  },
  {
    id: "9",
    title: "Monthly Content Review",
    description: "Review content performance and analytics",
    date: new Date(2026, 1, 15), // February 15, 2026
    startTime: "15:00",
    endTime: "16:30",
    color: "green",
  },
  {
    id: "10",
    title: "TypeScript Best Practices",
    description: "New blog post published: Essential TypeScript patterns and practices",
    date: new Date(2026, 1, 20), // February 20, 2026
    startTime: "10:30",
    endTime: "11:30",
    color: "blue",
  },
  // March 2026
  {
    id: "11",
    title: "Modern CSS Techniques",
    description: "New blog post published: Exploring modern CSS features and techniques",
    date: new Date(2026, 2, 3), // March 3, 2026
    startTime: "14:00",
    endTime: "15:00",
    color: "blue",
  },
  {
    id: "12",
    title: "Blog Strategy Meeting",
    description: "Quarterly blog strategy and planning session",
    date: new Date(2026, 2, 10), // March 10, 2026
    startTime: "09:00",
    endTime: "11:00",
    color: "purple",
  },
  {
    id: "13",
    title: "Accessibility in Web Development",
    description: "New blog post published: Building accessible web applications",
    date: new Date(2026, 2, 18), // March 18, 2026
    startTime: "11:00",
    endTime: "12:00",
    color: "blue",
  },
  {
    id: "14",
    title: "Content Workshop",
    description: "Team workshop on content creation and SEO",
    date: new Date(2026, 2, 25), // March 25, 2026
    startTime: "13:00",
    endTime: "16:00",
    color: "orange",
  },
];

/**
 * Get events for a specific date
 */
export function getEventsForDate(date: Date): CalendarEvent[] {
  const dateStr = date.toISOString().split("T")[0];
  return mockCalendarEvents.filter((event) => {
    const eventDateStr = event.date.toISOString().split("T")[0];
    return eventDateStr === dateStr;
  });
}

/**
 * Get all events grouped by date
 */
export function getEventsGroupedByDate(): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  
  mockCalendarEvents.forEach((event) => {
    const dateStr = event.date.toISOString().split("T")[0];
    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, []);
    }
    grouped.get(dateStr)!.push(event);
  });
  
  return grouped;
}

/**
 * Get events for a specific month
 */
export function getEventsForMonth(year: number, month: number): CalendarEvent[] {
  return mockCalendarEvents.filter((event) => {
    return (
      event.date.getFullYear() === year &&
      event.date.getMonth() === month
    );
  });
}

