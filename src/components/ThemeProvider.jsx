"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply CSS variables to root element
    const root = document.documentElement;
    
    root.style.setProperty("--theme-color", theme.themeColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    
    // Update favicon
    if (theme.favicon) {
      let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = theme.favicon;
      if (!document.querySelector("link[rel*='icon']")) {
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }
  }, [theme]);

  return <>{children}</>;
}



