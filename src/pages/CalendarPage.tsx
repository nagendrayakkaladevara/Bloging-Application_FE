/**
 * CalendarPage Component
 * 
 * Displays a full calendar view with events for scheduling and viewing blog posts.
 */

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { CalendarView } from "@/components/CalendarView";
import type { BlogPreview } from "@/types/blog";

interface CalendarPageProps {
  blogs: BlogPreview[];
}

export function CalendarPage({ blogs }: CalendarPageProps) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <>
      <AppSidebar blogs={blogs} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {!open ? (
            <SidebarTrigger className="-ml-1" aria-label="Open sidebar" />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 -ml-1"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
            <CalendarView />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

