/**
 * HelpPage Component
 * 
 * A clean, modern help page that matches the product's minimal aesthetic.
 * Features FAQ, Getting Started, and Contact sections.
 */

import * as React from "react";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail,
  ArrowRight,
  Search,
  FileText,
  Sparkles,
  Calendar,
  Settings2,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import type { BlogPreview } from "@/types/blog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface HelpPageProps {
  blogs: BlogPreview[];
}

const faqItems = [
  {
    question: "How do I search for blogs?",
    answer: "You can use the search bar in the sidebar or press Ctrl+K (Cmd+K on Mac) to quickly focus the search. Type keywords to find relevant blog posts.",
  },
  {
    question: "How do I add blogs to favorites?",
    answer: "Click on any blog post to open it, then use the favorite button to save it to your favorites list. You can access your favorites from the sidebar.",
  },
  {
    question: "Can I customize my reading experience?",
    answer: "Yes! Visit the Settings page to customize notifications, security preferences, and system settings according to your needs.",
  },
  {
    question: "How do I use the calendar feature?",
    answer: "The calendar helps you track blog publication dates and events. Navigate to the Calendar page from the sidebar to view and manage your schedule.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. Your data is stored locally in your browser and is never shared with third parties. Visit Settings to configure security options.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach out to us via email at support@blogplatform.com or use the contact form below. We typically respond within 24 hours.",
  },
];

const quickLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: BookOpen,
    url: "#getting-started",
  },
  {
    title: "Search Guide",
    description: "Master the search functionality",
    icon: Search,
    url: "#search",
  },
  {
    title: "Blog Management",
    description: "Organize and manage your blogs",
    icon: FileText,
    url: "#blogs",
  },
  {
    title: "Calendar Features",
    description: "Use the calendar to track events",
    icon: Calendar,
    url: "/calendar",
  },
  {
    title: "Settings & Preferences",
    description: "Customize your experience",
    icon: Settings2,
    url: "/settings",
  },
  {
    title: "AI Features",
    description: "Coming soon: AI-powered assistance",
    icon: Sparkles,
    url: "#",
    badge: "Coming Soon",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -2,
  },
};

export function HelpPage({ blogs }: HelpPageProps) {
  const { open } = useSidebar();
  const [openFaq, setOpenFaq] = React.useState<string | null>(null);

  return (
    <>
      <AppSidebar blogs={blogs} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4 bg-background">
          {!open ? (
            <SidebarTrigger className="-ml-1" aria-label="Open sidebar" />
          ) : null}
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-sm">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">Help</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <motion.div
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <motion.div className="flex flex-col gap-2" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-md border bg-background shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <HelpCircle className="h-5 w-5" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Help Center</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Find answers to common questions and learn how to use the platform
                </p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Links</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                          <motion.div
                            className="flex h-8 w-8 items-center justify-center rounded-md border bg-background shrink-0"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <link.icon className="h-4 w-4" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm sm:text-base break-words">{link.title}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-1 break-words">
                              {link.description}
                            </CardDescription>
                          </div>
                        </div>
                        {link.badge && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {link.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    {link.url.startsWith("/") ? (
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <Button variant="ghost" size="sm" asChild className="w-full text-xs sm:text-sm">
                          <Link to={link.url}>
                            Learn More <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    ) : (
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm" disabled={link.url === "#"}>
                          Learn More <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator />

          {/* FAQ Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Collapsible
                    open={openFaq === `faq-${index}`}
                    onOpenChange={(isOpen) => setOpenFaq(isOpen ? `faq-${index}` : null)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors p-4 sm:p-6">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-sm sm:text-base font-medium text-left flex-1 min-w-0 break-words">
                              {item.question}
                            </CardTitle>
                            <motion.div
                              className="shrink-0"
                              animate={{
                                rotate: openFaq === `faq-${index}` ? 90 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: openFaq === `faq-${index}` ? 1 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                              {item.answer}
                            </p>
                          </CardContent>
                        </motion.div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator />

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Still Need Help?</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Get in Touch</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Can't find what you're looking for? We're here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full text-xs sm:text-sm" asChild>
                        <a href="mailto:support@blogplatform.com">
                          <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Email Support
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full text-xs sm:text-sm">
                        <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Live Chat</span>
                        <span className="sm:hidden">Chat</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Coming Soon
                        </Badge>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </SidebarInset>
    </>
  );
}

