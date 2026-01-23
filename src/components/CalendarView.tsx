/**
 * CalendarView Component
 * 
 * Displays a full calendar with events using react-big-calendar.
 */

import { useState, useMemo, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";
import { getCalendarEvents } from "@/lib/api";
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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch calendar events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const events = await getCalendarEvents();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
        setCalendarEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Convert our events to react-big-calendar format
  const events = useMemo(() => {
    return calendarEvents.map((event) => {
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
  }, [calendarEvents]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    if (onDateSelect) {
      onDateSelect(start);
    }
  };

  const handleSelectEvent = (event: { start: Date; [key: string]: unknown }) => {
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
    return calendarEvents.filter((event) => {
      const eventDateStr = new Date(event.date).toISOString().split("T")[0];
      return eventDateStr === dateStr;
    });
  }, [selectedDate, calendarEvents]);

  // Custom event style
  const eventStyleGetter = (event: { resource?: CalendarEvent; [key: string]: unknown }) => {
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
    <div className="space-y-4 sm:space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            aria-label="Previous"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <h2 className="text-lg sm:text-2xl font-semibold min-w-[150px] sm:min-w-[200px] text-center">
            {format(currentDate, "MMMM yyyy", { locale: enUS })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("month")}
              className={cn(
                "rounded-r-none transition-all duration-200 ease-out text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-9",
                view === "month" 
                  ? "bg-foreground text-background font-semibold" 
                  : "bg-transparent text-foreground font-normal"
              )}
            >
              <span className="hidden sm:inline">Month</span>
              <span className="sm:hidden">M</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("week")}
              className={cn(
                "rounded-none transition-all duration-200 ease-out text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-9",
                view === "week" 
                  ? "bg-foreground text-background font-semibold" 
                  : "bg-transparent text-foreground font-normal"
              )}
            >
              <span className="hidden sm:inline">Week</span>
              <span className="sm:hidden">W</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("day")}
              className={cn(
                "rounded-l-none transition-all duration-200 ease-out text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-9",
                view === "day" 
                  ? "bg-foreground text-background font-semibold" 
                  : "bg-transparent text-foreground font-normal"
              )}
            >
              <span className="hidden sm:inline">Day</span>
              <span className="sm:hidden">D</span>
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday} size="sm" className="text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-4">
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 order-1">
          <div className="h-[400px] sm:h-[500px] md:h-[600px] relative overflow-hidden rounded-lg border bg-card">
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
        <div className="lg:col-span-1 order-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMMM d, yyyy", { locale: enUS })
                  : "Select a date"}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {selectedDateEvents.length > 0
                  ? `${selectedDateEvents.length} blog${selectedDateEvents.length > 1 ? "s" : ""}`
                  : "No blog scheduled"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border",
                        event.color === "blue" && "border-blue-200/50 bg-blue-50/50 [.dark_&]:border-blue-800/50 [.dark_&]:bg-blue-950/50",
                        event.color === "green" && "border-green-200/50 bg-green-50/50 [.dark_&]:border-green-800/50 [.dark_&]:bg-green-950/50",
                        event.color === "purple" && "border-purple-200/50 bg-purple-50/50 [.dark_&]:border-purple-800/50 [.dark_&]:bg-purple-950/50",
                        event.color === "orange" && "border-orange-200/50 bg-orange-50/50 [.dark_&]:border-orange-800/50 [.dark_&]:bg-orange-950/50",
                        !event.color && "border-border bg-muted"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm mb-1 truncate">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mb-1 sm:mb-2 line-clamp-2">
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
                          <Link to={`/blog/${event.blogId}`} className="shrink-0">
                            <Button variant="ghost" size="sm" className="h-6 sm:h-7 px-2 text-xs">
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
              <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 sm:space-y-2">
                {calendarEvents
                  .filter((event) => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return eventDate >= today;
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 p-1.5 sm:p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          event.color === "blue" && "bg-blue-500",
                          event.color === "green" && "bg-green-500",
                          event.color === "purple" && "bg-purple-500",
                          event.color === "orange" && "bg-orange-500",
                          !event.color && "bg-muted-foreground"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {format(new Date(event.date), "MMM d, yyyy", { locale: enUS })}
                          {event.startTime && ` • ${event.startTime}`}
                        </p>
                      </div>
                    </div>
                  ))}
                {calendarEvents.filter((event) => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today;
                }).length === 0 && (
                  <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
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
