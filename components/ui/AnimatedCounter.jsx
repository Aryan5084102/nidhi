"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedCounter({ value, className = "" }) {
  const spanRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!spanRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const raw = String(value);

    // Extract prefix (non-numeric start like ₹)
    const prefixMatch = raw.match(/^([^\d]*)/);
    const prefix = prefixMatch ? prefixMatch[1] : "";

    // Extract suffix (non-numeric end like %, M, Cr, K)
    const suffixMatch = raw.match(/([^\d,.]*)$/);
    const suffix = suffixMatch ? suffixMatch[1] : "";

    // Extract numeric part
    const numericStr = raw.replace(prefix, "").replace(suffix, "").replace(/,/g, "");
    const targetNum = parseFloat(numericStr);

    if (isNaN(targetNum)) {
      spanRef.current.textContent = raw;
      return;
    }

    // Determine decimal places
    const decimalPlaces = numericStr.includes(".") ? numericStr.split(".")[1].length : 0;

    // Check if original had commas
    const useCommas = raw.includes(",");

    const obj = { val: 0 };

    gsap.to(obj, {
      val: targetNum,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        let formatted = obj.val.toFixed(decimalPlaces);
        if (useCommas) {
          const parts = formatted.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          formatted = parts.join(".");
        }
        if (spanRef.current) {
          spanRef.current.textContent = prefix + formatted + suffix;
        }
      },
    });

    return () => gsap.killTweensOf(obj);
  }, [value]);

  return <span ref={spanRef} className={className}>{value}</span>;
}
