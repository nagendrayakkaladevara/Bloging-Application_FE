/**
 * SettingsPage Component
 * 
 * A clean, minimal settings page inspired by Samanvi Dashboard design.
 * Features horizontal tabs, centered content, and simple toggle controls.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  X, Bell, Settings2, Save,
  Palette
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import type { BlogPreview } from "@/types/blog";

interface SettingsPageProps {
  blogs: BlogPreview[];
}

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
    transition: {
      duration: 0.4,
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

export function SettingsPage({ blogs }: SettingsPageProps) {
  const { open, toggleSidebar } = useSidebar();
  const { themeName, setThemeName, colorMode, setColorMode, resolvedColorMode } = useTheme();
  const [activeTab, setActiveTab] = useState("notifications");
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    blogUpdates: true,
    sms: false,
    push: true,
    dailyReports: true,
    weeklyReports: false,
  });

  const handleSaveNotifications = () => {
    console.log("Notifications saved", notifications);
  };

  return (
    <>
      <AppSidebar blogs={blogs} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4 bg-background">
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
            className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-sm">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <motion.div
          className="flex-1 bg-muted/30"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
            {/* Page Title */}
            <motion.div className="text-center mb-6 sm:mb-8" variants={itemVariants}>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
            </motion.div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Custom Tab Navigation - Matching App Aesthetic */}
              <motion.div className="flex justify-center mb-6 sm:mb-8" variants={itemVariants}>
                <TabsList className="h-auto p-1 sm:p-1.5 gap-1 bg-muted/40 border rounded-full flex-wrap">
                  <TabsTrigger 
                    value="notifications" 
                    className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none hover:text-foreground transition-all duration-200"
                  >
                    <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <span className="sm:hidden">Notify</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="system" 
                    className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none hover:text-foreground transition-all duration-200"
                  >
                    <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    System
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {/* Notifications Tab */}
              <AnimatePresence mode="wait">
                {activeTab === "notifications" && (
                  <TabsContent value="notifications" asChild>
                    <motion.div
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="bg-background rounded-xl border shadow-sm p-4 sm:p-6 md:p-8">
                        {/* Section Header */}
                        <motion.div className="text-center mb-6 sm:mb-8" variants={itemVariants}>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
                            <span className="text-base sm:text-lg font-semibold">Notification Preferences</span>
                            <Badge className="text-xs bg-foreground text-background hover:bg-foreground/90">Coming Soon</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Choose how and when you want to receive notifications.
                          </p>
                        </motion.div>

                        <motion.div className="space-y-6 sm:space-y-8" variants={containerVariants}>
                          {/* Email Notifications */}
                          <motion.div variants={itemVariants}>
                            <h3 className="text-center text-sm sm:text-base font-semibold mb-3 sm:mb-4">Email Notifications</h3>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Label className="text-sm sm:text-base font-medium">Email Notifications</Label>
                                  <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch
                                  checked={notifications.email}
                                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                                />
                              </div>
                              <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Label className="text-sm sm:text-base font-medium">Blog Update Alerts</Label>
                                  <p className="text-xs sm:text-sm text-muted-foreground">Get notified when new blogs are published</p>
                                </div>
                                <Switch
                                  checked={notifications.blogUpdates}
                                  onCheckedChange={(checked) => setNotifications({...notifications, blogUpdates: checked})}
                                />
                              </div>
                            </div>
                          </motion.div>

                          <Separator />

                          {/* SMS Notifications */}
                          <motion.div variants={itemVariants}>
                            <h3 className="text-center text-sm sm:text-base font-semibold mb-3 sm:mb-4">SMS Notifications</h3>
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <Label className="text-sm sm:text-base font-medium">SMS Notifications</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications via SMS</p>
                              </div>
                              <Switch
                                checked={notifications.sms}
                                onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                              />
                            </div>
                          </motion.div>

                          <Separator />

                          {/* Push Notifications */}
                          <motion.div variants={itemVariants}>
                            <h3 className="text-center text-sm sm:text-base font-semibold mb-3 sm:mb-4">Push Notifications</h3>
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <Label className="text-sm sm:text-base font-medium">Push Notifications</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground">Receive push notifications in the browser</p>
                              </div>
                              <Switch
                                checked={notifications.push}
                                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                              />
                            </div>
                          </motion.div>

                          <Separator />

                          {/* Reports */}
                          <motion.div variants={itemVariants}>
                            <h3 className="text-center text-sm sm:text-base font-semibold mb-3 sm:mb-4">Reports</h3>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Label className="text-sm sm:text-base font-medium">Daily Reports</Label>
                                  <p className="text-xs sm:text-sm text-muted-foreground">Receive daily summary reports</p>
                                </div>
                                <Switch
                                  checked={notifications.dailyReports}
                                  onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                                />
                              </div>
                              <div className="flex items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Label className="text-sm sm:text-base font-medium">Weekly Reports</Label>
                                  <p className="text-xs sm:text-sm text-muted-foreground">Receive weekly summary reports</p>
                                </div>
                                <Switch
                                  checked={notifications.weeklyReports}
                                  onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                                />
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Save Button */}
                        <motion.div className="flex justify-end mt-6 sm:mt-8" variants={itemVariants}>
                          <Button variant="default" onClick={handleSaveNotifications}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Preferences
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>

              {/* System Tab */}
              <AnimatePresence mode="wait">
                {activeTab === "system" && (
                  <TabsContent value="system" asChild>
                    <motion.div
                      variants={tabContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="bg-background rounded-xl border shadow-sm p-4 sm:p-6 md:p-8">
                        {/* Section Header */}
                        <motion.div className="text-center mb-6 sm:mb-8" variants={itemVariants}>
                          <span className="text-base sm:text-lg font-semibold">Appearance</span>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                            Customize the look and feel of the application.
                          </p>
                        </motion.div>

                        <motion.div className="space-y-4 sm:space-y-6 max-w-md mx-auto" variants={containerVariants}>
                          {/* Theme Name Selection */}
                          <motion.div className="space-y-2" variants={itemVariants}>
                            <Label className="text-center block text-sm sm:text-base font-semibold">Theme</Label>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                              <Select 
                                value={themeName} 
                                onValueChange={(value) => setThemeName(value as "default" | "twitter" | "vercel" | "clude" | "amber-minimal" | "neo-brutalism" | "mono")}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default</SelectItem>
                                  <SelectItem value="twitter">Twitter</SelectItem>
                                  <SelectItem value="vercel">Vercel</SelectItem>
                                  <SelectItem value="clude">Clude</SelectItem>
                                  <SelectItem value="amber-minimal">Amber Minimal</SelectItem>
                                  <SelectItem value="neo-brutalism">Neo Brutalism</SelectItem>
                                  <SelectItem value="mono">Mono</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          {/* Color Mode Selection */}
                          <motion.div className="space-y-2" variants={itemVariants}>
                            <Label className="text-center block text-sm sm:text-base font-semibold">Color Mode</Label>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                              <Select 
                                value={colorMode} 
                                onValueChange={(value) => setColorMode(value as "light" | "dark" | "system")}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground text-center mt-1">
                              Current: {resolvedColorMode === "dark" ? "Dark" : "Light"} {colorMode === "system" && "(System)"}
                            </p>
                          </motion.div>

                          {/* Dark Mode Toggle (Quick Switch) */}
                          <motion.div className="flex items-center justify-between gap-2 sm:gap-4 py-2" variants={itemVariants}>
                            <div className="flex-1 min-w-0">
                              <Label className="text-sm sm:text-base font-medium">Dark Mode</Label>
                              <p className="text-xs sm:text-sm text-muted-foreground">Quick toggle between light and dark</p>
                            </div>
                            <Switch
                              checked={resolvedColorMode === "dark"}
                              onCheckedChange={(checked) => setColorMode(checked ? "dark" : "light")}
                            />
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      </SidebarInset>
    </>
  );
}
