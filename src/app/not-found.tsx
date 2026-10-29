import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import { NotFoundSession } from "@/components/not-found-session";
import { PageviewCounter } from "@/components/pageview-counter";
import { jetbrainsMono, koreanMono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

/**
 * Exported as out/404.html, which GitHub Pages serves for any missing path. The root
 * layout passes children through, so this page builds its own <html>; the locale is read
 * from the URL on the client.
 */
export default function NotFound() {
  return (
    <html lang="ko" suppressHydrationWarning className={`${jetbrainsMono.variable} ${koreanMono.variable}`}>
      <body className="bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NotFoundSession />
          <PageviewCounter />
        </ThemeProvider>
      </body>
    </html>
  );
}
