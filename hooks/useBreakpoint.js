"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS = { mobile: 0, tablet: 768, laptop: 1280, desktop: 1440 };

export default function useBreakpoint() {
  const [bp, setBp] = useState("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < BREAKPOINTS.tablet) setBp("mobile");
      else if (w < BREAKPOINTS.laptop) setBp("tablet");
      else if (w < BREAKPOINTS.desktop) setBp("laptop");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    breakpoint: bp,
    isMobile: bp === "mobile",
    isTablet: bp === "tablet",
    isLaptop: bp === "laptop",
    isDesktop: bp === "desktop",
    isMobileOrTablet: bp === "mobile" || bp === "tablet",
    isLaptopOrDesktop: bp === "laptop" || bp === "desktop",
  };
}
