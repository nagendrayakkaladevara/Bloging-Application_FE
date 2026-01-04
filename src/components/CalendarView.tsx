/**
 * CalendarView Component
 * 
 * Displays a full calendar with events using react-big-calendar.
 */

import { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";
import { mockCalendarEvents } from "@/data/mockCalendarEvents";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

// Configure the localizer with moment
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
}

export function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("month");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Convert our events to react-big-calendar format
  const events = useMemo(() => {
    return mockCalendarEvents.map((event) => {
      const startDate = new Date(event.date);
      if (event.startTime) {
        const [hours, minutes] = event.startTime.split(":").map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      } else {
        startDate.setHours(0, 0, 0, 0);
      }

      const endDate = new Date(startDate);
      if (event.endTime) {
        const [hours, minutes] = event.endTime.split(":").map(Number);
        endDate.setHours(hours, minutes, 0, 0);
      } else {
        endDate.setHours(23, 59, 59, 999);
      }

      return {
        id: event.id,
        title: event.title,
        start: startDate,
        end: endDate,
        resource: event, // Store original event data
      };
    });
  }, []);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    if (onDateSelect) {
      onDateSelect(start);
    }
  };

  const handleSelectEvent = (event: any) => {
    setSelectedDate(event.start);
    if (onDateSelect) {
      onDateSelect(event.start);
    }
  };

  const goToPrevious = () => {
    if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (view === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (view === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (view === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return mockCalendarEvents.filter((event) => {
      const eventDateStr = event.date.toISOString().split("T")[0];
      return eventDateStr === dateStr;
    });
  }, [selectedDate]);

  // Custom event style
  const eventStyleGetter = (event: any) => {
    const originalEvent = event.resource as CalendarEvent;
    const color = originalEvent?.color || "blue";
    
    const colorMap: Record<string, { backgroundColor: string; borderColor: string }> = {
      blue: { backgroundColor: "#3b82f6", borderColor: "#2563eb" },
      green: { backgroundColor: "#10b981", borderColor: "#059669" },
      purple: { backgroundColor: "#8b5cf6", borderColor: "#7c3aed" },
      orange: { backgroundColor: "#f97316", borderColor: "#ea580c" },
    };

    const colors = colorMap[color] || colorMap.blue;

    return {
      style: {
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: "2px",
        borderRadius: "4px",
        color: "white",
        padding: "2px 4px",
      },
    };
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold min-w-[200px] text-center">
            {format(currentDate, "MMMM yyyy", { locale: enUS })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("month")}
              className="rounded-r-none transition-all duration-200 ease-out"
              style={view === "month" ? {
                backgroundColor: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                fontWeight: 600
              } : {
                backgroundColor: "transparent",
                color: "hsl(var(--foreground))",
                fontWeight: 400
              }}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("week")}
              className="rounded-none transition-all duration-200 ease-out"
              style={view === "week" ? {
                backgroundColor: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                fontWeight: 600
              } : {
                backgroundColor: "transparent",
                color: "hsl(var(--foreground))",
                fontWeight: 400
              }}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("day")}
              className="rounded-l-none transition-all duration-200 ease-out"
              style={view === "day" ? {
                backgroundColor: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                fontWeight: 600
              } : {
                backgroundColor: "transparent",
                color: "hsl(var(--foreground))",
                fontWeight: 400
              }}
            >
              Day
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div style={{ height: "600px" }} className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ height: "100%" }}
              >
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  view={view}
                  onView={setView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  eventPropGetter={eventStyleGetter}
                popup
                toolbar={false}
                formats={{
                  dayFormat: "EEE",
                  dayHeaderFormat: "EEEE",
                  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, "MMM d", { locale: enUS })} - ${format(end, "MMM d, yyyy", { locale: enUS })}`,
                  monthHeaderFormat: "MMMM yyyy",
                  timeGutterFormat: "HH:mm",
                  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
                    `${format(start, "HH:mm", { locale: enUS })} - ${format(end, "HH:mm", { locale: enUS })}`,
                }}
              />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Events Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy", { locale: enUS })
                  : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length > 0
                  ? `${selectedDateEvents.length} blog${selectedDateEvents.length > 1 ? "s" : ""}`
                  : "No blog scheduled"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        event.color === "blue" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
                        event.color === "green" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
                        event.color === "purple" && "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950",
                        event.color === "orange" && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
                        !event.color && "border-border bg-muted"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {event.description}
                            </p>
                          )}
                          {event.startTime && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {event.startTime}
                                {event.endTime && ` - ${event.endTime}`}
                              </span>
                            </div>
                          )}
                        </div>
                        {event.blogId && (
                          <Link to={`/blog/${event.blogId}`}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No blog for this date</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockCalendarEvents
                  .filter((event) => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return eventDate >= today;
                  })
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          event.color === "blue" && "bg-blue-500",
                          event.color === "green" && "bg-green-500",
                          event.color === "purple" && "bg-purple-500",
                          event.color === "orange" && "bg-orange-500",
                          !event.color && "bg-muted-foreground"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.date, "MMM d, yyyy", { locale: enUS })}
                          {event.startTime && ` • ${event.startTime}`}
                        </p>
                      </div>
                    </div>
                  ))}
                {mockCalendarEvents.filter((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today;
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming blogs
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
