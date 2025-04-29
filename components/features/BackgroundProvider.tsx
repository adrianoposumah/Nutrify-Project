"use client";
import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const BackgroundProvider = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const backgroundImage = theme === "dark" ? "/darkbg1.png" : "/Background1.png";
  return <Image src={backgroundImage} alt="Jumbotron" fill className="object-cover object-center select-none pointer-events-none" priority />;
};

export default BackgroundProvider;
