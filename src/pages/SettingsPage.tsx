/**
 * SettingsPage Component
 * 
 * A clean, minimal settings page inspired by Samanvi Dashboard design.
 * Features horizontal tabs, centered content, and simple toggle controls.
 */

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  X, Bell, Shield, Settings2, Save, Eye, EyeOff,
  Palette
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import type { BlogPreview } from "@/types/blog";

interface SettingsPageProps {
  blogs: BlogPreview[];
}

export function SettingsPage({ blogs }: SettingsPageProps) {
  const { open, toggleSidebar } = useSidebar();
  
  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password fields
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    blogUpdates: true,
    sms: false,
    push: true,
    dailyReports: true,
    weeklyReports: false,
  });
  
  // Security settings
  const [security, setSecurity] = useState({
    sessionTimeout: "30",
    passwordExpiry: "90",
  });
  
  // System settings
  const [system, setSystem] = useState({
    theme: "default",
    darkMode: false,
  });

  const handleSaveNotifications = () => {
    console.log("Notifications saved", notifications);
  };

  const handleChangePassword = () => {
    console.log("Password changed");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleSaveSecurity = () => {
    console.log("Security settings saved", security);
  };

  return (
    <>
      <AppSidebar blogs={blogs} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
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
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex-1 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="notifications" className="w-full">
              {/* Custom Tab Navigation - Matching App Aesthetic */}
              <div className="flex justify-center mb-8">
                <TabsList className="h-auto p-1.5 gap-1 bg-muted/40 border rounded-full">
                  <TabsTrigger 
                    value="notifications" 
                    className="px-5 py-2 rounded-full text-sm font-medium data-[state=active]:bg-[hsl(var(--foreground))] data-[state=active]:text-[hsl(var(--background))] data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none hover:text-foreground transition-all duration-200"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="px-5 py-2 rounded-full text-sm font-medium data-[state=active]:bg-[hsl(var(--foreground))] data-[state=active]:text-[hsl(var(--background))] data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none hover:text-foreground transition-all duration-200"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="system" 
                    className="px-5 py-2 rounded-full text-sm font-medium data-[state=active]:bg-[hsl(var(--foreground))] data-[state=active]:text-[hsl(var(--background))] data-[state=active]:shadow-none data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none hover:text-foreground transition-all duration-200"
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    System
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="font-semibold">Notification Preferences</span>
                      <Badge className="text-xs bg-foreground text-background hover:bg-foreground/90">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose how and when you want to receive notifications.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-center font-semibold mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Blog Update Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when new blogs are published</p>
                          </div>
                          <Switch
                            checked={notifications.blogUpdates}
                            onCheckedChange={(checked) => setNotifications({...notifications, blogUpdates: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* SMS Notifications */}
                    <div>
                      <h3 className="text-center font-semibold mb-4">SMS Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Push Notifications */}
                    <div>
                      <h3 className="text-center font-semibold mb-4">Push Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in the browser</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Reports */}
                    <div>
                      <h3 className="text-center font-semibold mb-4">Reports</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Daily Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive daily summary reports</p>
                          </div>
                          <Switch
                            checked={notifications.dailyReports}
                            onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSaveNotifications} className="bg-foreground text-background hover:bg-foreground/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="font-semibold">Security Settings</span>
                      <Badge className="text-xs bg-foreground text-background hover:bg-foreground/90">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage your account security and authentication preferences.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-center font-semibold mb-6">Change Password</h3>
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="space-y-2">
                          <Label className="text-center block">Current Password</Label>
                          <div className="relative">
                            <Input 
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              value={passwords.current}
                              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-center block">New Password</Label>
                          <div className="relative">
                            <Input 
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={passwords.new}
                              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-center block">Confirm New Password</Label>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-center pt-2">
                          <Button onClick={handleChangePassword} className="bg-foreground text-background hover:bg-foreground/90">
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Session Settings */}
                    <div>
                      <h3 className="text-center font-semibold mb-6">Session Settings</h3>
                      <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                        <div className="space-y-2">
                          <Label className="text-center block">Session Timeout (minutes)</Label>
                          <Select 
                            value={security.sessionTimeout} 
                            onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-center block">Password Expiry (days)</Label>
                          <Select 
                            value={security.passwordExpiry} 
                            onValueChange={(value) => setSecurity({...security, passwordExpiry: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-8">
                    <Button onClick={handleSaveSecurity} className="bg-foreground text-background hover:bg-foreground/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system">
                <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <span className="font-semibold">Appearance</span>
                    <p className="text-sm text-muted-foreground mt-2">
                      Customize the look and feel of the application.
                    </p>
                  </div>

                  <div className="space-y-6 max-w-md mx-auto">
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <Label className="text-center block font-semibold">Theme</Label>
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <Select 
                          value={system.theme} 
                          onValueChange={(value) => setSystem({...system, theme: value})}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="colorful">Colorful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="font-medium">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch between light and dark appearance</p>
                      </div>
                      <Switch
                        checked={system.darkMode}
                        onCheckedChange={(checked) => setSystem({...system, darkMode: checked})}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
