"use client";
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full mr-2" aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      )}
    </>
  );
};

export default ThemeToggle;
