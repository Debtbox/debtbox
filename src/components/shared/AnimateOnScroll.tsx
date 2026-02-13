import { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  /** Optional delay before animation starts (ms) */
  delay?: number;
  /** Stagger animation for direct children */
  stagger?: boolean;
  /** Custom class for the wrapper */
  className?: string;
}

export const AnimateOnScroll = ({
  children,
  delay = 0,
  stagger = false,
  className = '',
}: AnimateOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setIsInView(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`landing-animate ${isInView ? 'animate-in' : ''} ${stagger ? 'animate-stagger' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
};
