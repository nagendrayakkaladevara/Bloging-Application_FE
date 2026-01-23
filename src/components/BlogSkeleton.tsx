/**
 * BlogSkeleton Component
 * 
 * Skeleton loader that matches the blog post layout.
 */

import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogSkeleton() {
  const { open, toggleSidebar } = useSidebar();

  return (
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
              <Skeleton className="h-4 w-12" />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Skeleton className="h-4 w-48" />
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          {/* Cover Image Skeleton */}
          <Skeleton className="mb-12 w-full h-64 md:h-[32rem] rounded-xl" />

          {/* Header Skeleton */}
          <header className="mb-12">
            {/* Title Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-4xl mb-4" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-6 w-full max-w-3xl mb-2" />
              <Skeleton className="h-6 w-3/4 max-w-3xl" />
            </div>

            {/* Meta Information Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-10 pb-8 border-b border-border">
              {/* Mobile: Date and ReadTime */}
              <div className="flex flex-wrap items-center gap-3 mb-4 md:hidden">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Desktop: Date, ReadTime, Tags */}
              <div className="hidden md:flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Mobile: Tags */}
              <div className="flex flex-wrap gap-2 md:hidden">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>

            {/* Voting, Favorite, and Links Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-12 pb-8 border-b border-border">
              {/* Mobile: Voting and Favorite */}
              <div className="flex items-center justify-between mb-4 md:hidden">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>

              {/* Desktop: Voting, Favorite, and Links */}
              <div className="hidden md:flex items-center gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>

              {/* Mobile: Links */}
              <div className="flex flex-col gap-2 md:hidden">
                <Skeleton className="h-9 w-full rounded-full" />
                <Skeleton className="h-9 w-full rounded-full" />
              </div>
            </div>
          </header>

          {/* Blog Content Skeleton */}
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Paragraph skeletons */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />

              {/* Heading skeleton */}
              <Skeleton className="h-8 w-3/4 mt-8" />

              {/* More paragraph skeletons */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />

              {/* Code block skeleton */}
              <Skeleton className="h-48 w-full rounded-lg mt-6" />

              {/* More paragraph skeletons */}
              <Skeleton className="h-4 w-full mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />

              {/* Another heading skeleton */}
              <Skeleton className="h-8 w-2/3 mt-8" />

              {/* More paragraph skeletons */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Comments Section Skeleton */}
          <div className="mt-12 pt-8 border-t border-border">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
