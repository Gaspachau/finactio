"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 42000, decimals: 0, thousands: true, suffix: "", label: "Apprenants actifs" },
  { target: 120, decimals: 0, thousands: false, suffix: "+", label: "Leçons disponibles" },
  { target: 4.9, decimals: 1, thousands: false, suffix: "★", label: "Note moyenne" },
  { target: 8, decimals: 0, thousands: false, suffix: " min", label: "Par leçon en moyenne" },
];

function formatValue(n: number, decimals: number, thousands: boolean): string {
  if (thousands) return n.toLocaleString("fr-FR");
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toString();
}

function CountUp({
  target,
  decimals,
  thousands,
  suffix,
  started,
}: {
  target: number;
  decimals: number;
  thousands: boolean;
  suffix: string;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out: fast at start, slow at end
      const progress = 1 - Math.pow(1 - step / steps, 3);
      const current = target * progress;
      setCount(current);

      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span>
      {formatValue(count, decimals, thousands)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#1F2937] border-y border-[#111827]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#059669] mb-2 tabular-nums"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              <CountUp
                target={stat.target}
                decimals={stat.decimals}
                thousands={stat.thousands}
                suffix={stat.suffix}
                started={started}
              />
            </p>
            <p className="text-[#6B7280] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
