"use client";
import React, { useState, useEffect } from "react";
/** @jsxImportSource react */
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import ThemeToggle from "../ui/ThemeToggle";
import { Menu } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/category",
    label: "Kategori",
  },
  {
    href: "/tools",
    label: "Tools",
  },
  {
    href: "/api",
    label: "API",
  },
  {
    href: "/about-us",
    label: "About",
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", scrolled ? "border-b bg-background/60 backdrop-blur-md" : "bg-transparent")}>
      <div className="container flex h-20 mx-auto items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
          <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className={cn("text-base font-medium transition-colors hover:text-orange-500", pathname === route.href ? "text-orange-500" : "text-muted-foreground")}>
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" className="bg-transparent " asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 px-4">
                {routes.map((route) => (
                  <Link key={route.href} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-orange-500", pathname === route.href ? "text-orange-500" : "text-muted-foreground")}>
                    {route.label}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-3">
                  <Button variant="outline" className="bg-transparent text-orange-500 border-orange-500 hover:text-white hover:bg-orange-500" asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
