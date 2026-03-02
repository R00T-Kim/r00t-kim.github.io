"use client";

import { useEffect, useRef, useCallback } from "react";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";

interface MobileDrawerProps {
  navKeys: readonly string[];
  onClose: () => void;
  onNavigate: (key: string) => void;
}

export function MobileDrawer({
  navKeys,
  onClose,
  onNavigate,
}: MobileDrawerProps) {
  const t = useTranslations("nav");
  const navRef = useRef<HTMLElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    const timer = setTimeout(() => {
      const firstBtn = navRef.current?.querySelector<HTMLButtonElement>("button");
      firstBtn?.focus();
    }, 100);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      clearTimeout(timer);
    };
  }, [handleEscape]);

  return (
    <>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      <m.nav
        ref={navRef}
        aria-label="Mobile navigation"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-card border-l border-border p-6 pt-20 shadow-xl md:hidden"
      >
        <div className="flex flex-col gap-1">
          {navKeys.map((key, i) => (
            <m.button
              key={key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigate(key)}
              className="rounded-lg px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
            >
              {t(key)}
            </m.button>
          ))}
        </div>
      </m.nav>
    </>
  );
}
