"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

type GoatCounter = { count?: (vars: { path: string }) => void };

/**
 * Visit counting with GoatCounter (no cookies, so no consent banner). Its script only counts
 * the first page load, and Next swaps pages without reloading, so every path change is sent
 * by hand. Renders nothing until `siteConfig.goatcounter` is set.
 */
export function PageviewCounter() {
  const pathname = usePathname();
  const code = siteConfig.goatcounter;

  useEffect(() => {
    if (!code) return;
    // On the first load the script may not be ready yet; its onLoad below sends that count.
    (window as { goatcounter?: GoatCounter }).goatcounter?.count?.({ path: pathname });
  }, [code, pathname]);

  if (!code) return null;
  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      data-goatcounter-settings='{"no_onload": true}'
      strategy="afterInteractive"
      onLoad={() => (window as { goatcounter?: GoatCounter }).goatcounter?.count?.({ path: window.location.pathname })}
    />
  );
}
