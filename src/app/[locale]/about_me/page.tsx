import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageIntro } from "@/components/ui/page-intro";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { CareerHighlights } from "@/components/sections/career-highlights";
import { Publications } from "@/components/sections/publications";
import { Speaking } from "@/components/sections/speaking";
import { Credentials } from "@/components/sections/credentials";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about_me_page" });
  const name =
    locale === "ko" ? siteConfig.author.name.ko : siteConfig.author.name.en;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/about_me`,
      languages: {
        ko: `${siteConfig.url}/ko/about_me`,
        en: `${siteConfig.url}/en/about_me`,
        "x-default": `${siteConfig.url}/ko/about_me`,
      },
    },
    openGraph: {
      title: `${name} | ${t("title")}`,
      description: t("description"),
      type: "profile",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      url: `${siteConfig.url}/${locale}/about_me`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
    },
  };
}

export default async function AboutMePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about_me_page" });

  return (
    <>
      <Header />
      <main>
        <PageIntro
          command="cat about_me/README.md"
          title={t("heading")}
          description={t("description")}
        >
          <Link
            href={`/${locale}/career`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {t("career_link")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </PageIntro>
        <About />
        <Experience />
        <CareerHighlights />
        <Publications />
        <Speaking />
        <Credentials />
        <Contact className="bg-section-alt" />
      </main>
      <Footer />
      <ScrollToTop />
      <JsonLd />
    </>
  );
}
