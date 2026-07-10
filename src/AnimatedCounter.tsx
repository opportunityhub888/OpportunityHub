import { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({ value, duration = 1500 }: { value: number | string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof value !== 'number') {
      setDisplayValue(0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayValue(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  if (typeof value !== 'number') {
    return <span ref={ref}>{value}</span>;
  }

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}
