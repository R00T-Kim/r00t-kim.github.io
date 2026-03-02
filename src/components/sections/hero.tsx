"use client";

import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Animated gradient orbs */}
      <div className="hero-orbs pointer-events-none absolute inset-0">
        {/* Floating orb 1 — accent blue */}
      <div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] will-change-transform"
          style={{ animation: 'float-orb-1 20s ease-in-out infinite' }}
        />
        {/* Floating orb 2 — accent-secondary green */}
      <div
          className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-accent-secondary/8 blur-[100px] will-change-transform"
          style={{ animation: 'float-orb-2 25s ease-in-out infinite' }}
        />
        {/* Floating orb 3 — subtle accent top-right */}
      <div
          className="absolute right-1/3 top-1/5 h-[300px] w-[300px] rounded-full bg-accent/6 blur-[80px] will-change-transform"
          style={{ animation: 'float-orb-3 18s ease-in-out infinite' }}
        />
        {/* Gradient mesh base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(16,185,129,0.06),transparent)]" />
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Name */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            {t("name")}
          </span>
        </m.h1>

        {/* Title */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-6"
        >
          <span className="font-mono text-lg text-accent sm:text-xl md:text-2xl">
            {t("title")}
          </span>
        </m.div>

        {/* Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {t("subtitle")}
        </m.p>

        {/* CTA Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="hero-cta inline-grid grid-cols-2 gap-4"
        >
          <a
            href="#career-highlights"
            className="rounded-lg border border-border bg-card px-8 py-3 text-center text-base font-medium text-foreground transition-all hover:scale-[1.02] hover:border-accent/40 hover:bg-accent/5"
          >
            {t("cta_resume")}
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-accent px-8 py-3 text-center text-base font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] hover:bg-accent/90"
          >
            {t("cta_contact")}
          </a>
        </m.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-label="Scroll down"
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </m.div>
        </m.div>
      </a>
    </section>
  );
}
