import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CareerStoryContent } from "@/components/sections/career-story";
import { CareerJsonLd } from "@/components/seo/json-ld";
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

  return {
    title: isKo ? "포트폴리오" : "Portfolio",
    description: isKo
      ? "각 성과의 배경, 역할, 결과와 교훈을 상세히 소개합니다."
      : "Detailed background, role, results and lessons behind each achievement.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/career`,
      languages: {
        ko: `${siteConfig.url}/ko/career`,
        en: `${siteConfig.url}/en/career`,
        "x-default": `${siteConfig.url}/ko/career`,
      },
    },
    openGraph: {
      title: isKo
        ? `${name} | 포트폴리오`
        : `${siteConfig.author.name.en} | Portfolio`,
      description: isKo
        ? "각 성과의 배경, 역할, 결과와 교훈을 상세히 소개합니다."
        : "Detailed background, role, results and lessons behind each achievement.",
      type: "article",
      locale: isKo ? "ko_KR" : "en_US",
      alternateLocale: isKo ? "en_US" : "ko_KR",
      siteName: `${siteConfig.author.name.en} Portfolio`,
    },
    twitter: {
      title: isKo
        ? `${name} | 포트폴리오`
        : `${siteConfig.author.name.en} | Portfolio`,
      description: isKo
        ? "각 성과의 배경, 역할, 결과와 교훈을 상세히 소개합니다."
        : "Detailed background, role, results and lessons behind each achievement.",
    },
  };
}

export default async function CareerPage({
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
        <CareerStoryContent />
      </main>
      <Footer />
      <ScrollToTop />
      <CareerJsonLd locale={locale} />
    </>
  );
}
