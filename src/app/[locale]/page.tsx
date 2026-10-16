import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hub } from "@/components/home/hub";
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
  const isKo = locale === "ko";

  return {
    title: {
      absolute: siteConfig.seo.defaultTitle,
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
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.description,
      type: "profile",
      locale: isKo ? "ko_KR" : "en_US",
      alternateLocale: isKo ? "en_US" : "ko_KR",
      url: `${siteConfig.url}/${locale}`,
      siteName: `${siteConfig.author.name.en} Portfolio`,
    },
    twitter: {
      card: "summary",
      site: "@gn0sis__",
      creator: "@gn0sis__",
      title: siteConfig.seo.defaultTitle,
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
        <Hub />
      </main>
      <Footer />
      <ScrollToTop />
      <JsonLd />
    </>
  );
}
