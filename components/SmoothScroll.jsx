"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

const SmoothScroll = forwardRef(function SmoothScroll({ children, className, contentClassName }, ref) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const scrollPos = useRef(0);
  const targetPos = useRef(0);
  const rafId = useRef(null);

  useImperativeHandle(ref, () => ({
    resetScroll() {
      scrollPos.current = 0;
      targetPos.current = 0;
      if (contentRef.current) gsap.set(contentRef.current, { y: 0 });
    },
  }));

  useEffect(() => {
    const container = scrollRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const ease = 0.08;

    const updateScroll = () => {
      scrollPos.current += (targetPos.current - scrollPos.current) * ease;

      if (Math.abs(targetPos.current - scrollPos.current) < 0.5) {
        scrollPos.current = targetPos.current;
      }

      gsap.set(content, { y: -scrollPos.current });
      rafId.current = requestAnimationFrame(updateScroll);
    };

    const onWheel = (e) => {
      e.preventDefault();
      const maxScroll = content.scrollHeight - container.clientHeight;
      targetPos.current = Math.max(0, Math.min(targetPos.current + e.deltaY, maxScroll));
    };

    // Touch support
    let touchStart = 0;
    const onTouchStart = (e) => {
      touchStart = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const delta = touchStart - e.touches[0].clientY;
      touchStart = e.touches[0].clientY;
      const maxScroll = content.scrollHeight - container.clientHeight;
      targetPos.current = Math.max(0, Math.min(targetPos.current + delta, maxScroll));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    rafId.current = requestAnimationFrame(updateScroll);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={scrollRef} className={`overflow-hidden ${className || ""}`}>
      <div ref={contentRef} className={`will-change-transform ${contentClassName || ""}`}>
        {children}
      </div>
    </div>
  );
});

export default SmoothScroll;
