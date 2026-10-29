"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HubShell } from "@/components/home/hub-shell";
import { siteConfig } from "@/config/site";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";

/** The 404 body: the failed `cd` to the missing path, an `ls` of the site, and the live prompt. */
export function NotFoundSession() {
  // The missing path is only known in the browser; the exported HTML renders it empty.
  const path = useSyncExternalStore(
    () => () => {},
    () => decodeURIComponent(window.location.pathname),
    () => ""
  );
  const locale = path.startsWith("/en") ? "en" : "ko";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const dirs = siteConfig.nav.map((item) => ({ name: item.key, href: `/${locale}${item.href}` }));
  const name = siteConfig.author.name[locale];
  const prompt = (
    <>
      <span className="user">{siteConfig.author.alias}@kim</span>
      <span className="text-muted-foreground">:~ # </span>
    </>
  );

  return (
    <NextIntlClientProvider locale={locale} messages={locale === "en" ? en : ko} timeZone="Asia/Seoul">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 md:pt-36 md:pb-32 lg:px-8">
        <div className="space-y-7 font-mono text-sm md:space-y-9">
          <div>
            <p className="prompt">
              {prompt}
              <span className="cmd">cd {path}</span>
            </p>
            <h1 className="mt-2 break-all text-muted-foreground">
              cd: {path}: No such file or directory
            </h1>
          </div>
          <div>
            <p className="prompt">
              {prompt}
              <span className="cmd">ls</span>
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-12 lg:gap-x-16">
              {dirs.map((dir) => (
                <li key={dir.name}>
                  <Link
                    href={dir.href}
                    className="inline-block text-[clamp(36px,5vw,56px)] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
                  >
                    {dir.name}
                    <span className="text-accent">/</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <HubShell dirs={dirs} name={name} />
        </div>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
