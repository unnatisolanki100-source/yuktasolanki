import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface CalligraphyTypewriterProps {
  text: string;
  className?: string;
  startDelayMs?: number;
  charIntervalMs?: number;
  triggerOnView?: boolean;
  showCursor?: boolean;
}

export function CalligraphyTypewriter({
  text,
  className = '',
  startDelayMs = 200,
  charIntervalMs = 95,
  triggerOnView = false,
  showCursor = true,
}: CalligraphyTypewriterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.35 });
  const shouldStart = triggerOnView ? inView : true;

  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const [visibleCount, setVisibleCount] = useState(() =>
    prefersReducedMotion ? text.length : 0
  );
  const [cursorHidden, setCursorHidden] = useState(() => prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(text.length);
      setCursorHidden(true);
      return;
    }

    if (!shouldStart) return;

    setVisibleCount(0);
    setCursorHidden(false);

    let intervalId: number | undefined;
    let finishTimerId: number | undefined;

    const startTimerId = window.setTimeout(() => {
      let current = 1;
      setVisibleCount(1);

      intervalId = window.setInterval(() => {
        current += 1;
        if (current >= text.length) {
          setVisibleCount(text.length);
          if (intervalId !== undefined) {
            window.clearInterval(intervalId);
          }
          finishTimerId = window.setTimeout(() => {
            setCursorHidden(true);
          }, 420);
        } else {
          setVisibleCount(current);
        }
      }, charIntervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimerId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (finishTimerId !== undefined) window.clearTimeout(finishTimerId);
    };
  }, [text, shouldStart, startDelayMs, charIntervalMs, prefersReducedMotion]);

  const typedText = text.slice(0, visibleCount);
  const isCursorVisible = showCursor && shouldStart && !cursorHidden && visibleCount > 0;

  return (
    <span
      ref={containerRef}
      className={`font-hindi-calligraphy relative inline-block whitespace-nowrap ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible select-none pointer-events-none">
        {text}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0 whitespace-nowrap">
        {typedText}
        {isCursorVisible && (
          <span className="inline-block w-[2px] h-[0.72em] bg-current align-baseline ml-0.5 animate-pulse opacity-85" />
        )}
      </span>
    </span>
  );
}
