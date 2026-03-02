import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/layout/footer";
import { CareerHighlights } from "@/components/sections/career-highlights";
import { Credentials } from "@/components/sections/credentials";
import { Speaking } from "@/components/sections/speaking";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";

  const name = isKo ? siteConfig.author.name.ko : siteConfig.author.name.en;
  const title = isKo ? siteConfig.author.title.ko : siteConfig.author.title.en;

  return {
    title: {
      absolute: `${name} | ${title}`,
    },
    description: siteConfig.seo.description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        ko: `${siteConfig.url}/ko`,
        en: `${siteConfig.url}/en`,
        "x-default": `${siteConfig.url}/ko`,
      },
    },
    openGraph: {
      title: `${name} | ${title}`,
      description: siteConfig.seo.description,
      type: "profile",
      locale: isKo ? "ko_KR" : "en_US",
      alternateLocale: isKo ? "en_US" : "ko_KR",
      url: `${siteConfig.url}/${locale}`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
    },
    twitter: {
      title: `${name} | ${title}`,
      description: siteConfig.seo.description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <CareerHighlights />
        <Speaking />
        <Credentials />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <JsonLd />
    </>
  );
}
