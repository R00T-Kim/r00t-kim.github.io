import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { LazyMotionProvider } from "@/components/providers/lazy-motion-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { siteConfig } from "@/config/site";
import { jetbrainsMono, koreanMono } from "@/lib/fonts";
import { PageviewCounter } from "@/components/pageview-counter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${koreanMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased font-sans">
        {/* React hoists this into <head>: lets feed readers find the blog's RSS from any page */}
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.author.name.en} blog`} href={siteConfig.social.rss} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundary>
              <LazyMotionProvider>
                {children}
                <PageviewCounter />
              </LazyMotionProvider>
            </ErrorBoundary>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
