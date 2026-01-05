import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeName = "default" | "twitter" | "vercel" | "clude" | "amber-minimal" | "neo-brutalism" | "mono";
type ColorMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  resolvedColorMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme immediately before React renders to prevent flash
if (typeof window !== "undefined") {
  const storedThemeName = localStorage.getItem("themeName") as ThemeName | null;
  const storedColorMode = localStorage.getItem("colorMode") as ColorMode | null;
  
  const themeName = storedThemeName || "default";
  const colorMode = storedColorMode || "system";
  
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove("default", "twitter", "vercel", "clude", "amber-minimal", "neo-brutalism", "mono", "light", "dark");
  
  // Add theme name class
  root.classList.add(themeName);
  
  // Add color mode class
  if (colorMode === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(colorMode);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("themeName") as ThemeName | null;
      return stored || "default";
    }
    return "default";
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("colorMode") as ColorMode | null;
      return stored || "system";
    }
    return "system";
  });

  const getSystemColorMode = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [resolvedColorMode, setResolvedColorMode] = useState<"light" | "dark">(() => {
    if (colorMode === "system") {
      return getSystemColorMode();
    }
    return colorMode;
  });

  // Apply theme name and color mode on mount and when they change
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("default", "twitter", "vercel", "clude", "amber-minimal", "neo-brutalism", "mono", "light", "dark");
    
    // Add theme name class
    root.classList.add(themeName);
    
    // Add color mode class
    if (colorMode === "system") {
      const systemTheme = getSystemColorMode();
      root.classList.add(systemTheme);
      setResolvedColorMode(systemTheme);
    } else {
      root.classList.add(colorMode);
      setResolvedColorMode(colorMode);
    }
  }, [themeName, colorMode]);

  // Listen for system color mode changes
  useEffect(() => {
    if (colorMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const newMode = e.matches ? "dark" : "light";
      root.classList.add(newMode);
      setResolvedColorMode(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [colorMode]);

  const setThemeName = (newTheme: ThemeName) => {
    setThemeNameState(newTheme);
    localStorage.setItem("themeName", newTheme);
  };

  const setColorMode = (newMode: ColorMode) => {
    setColorModeState(newMode);
    localStorage.setItem("colorMode", newMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeName, 
      setThemeName, 
      colorMode, 
      setColorMode, 
      resolvedColorMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
