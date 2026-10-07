export interface Certification {
  name: string;
  nameEn: string;
  date: string;
  issuer: string;
  issuerEn: string;
  url?: string;
  highlight?: boolean;
  category: "security" | "kubernetes" | "general";
}

export interface Award {
  title: string;
  titleEn: string;
  issuer: string;
  issuerEn: string;
  date: string;
  description?: string;
  descriptionEn?: string;
  url?: string;
  highlight?: boolean;
}

export const certifications: Certification[] = [];

export const awards: Award[] = [
  {
    title: "Pwn2Own Ireland 2026 / Win",
    titleEn: "Pwn2Own Ireland 2026 / Win",
    issuer: "Zero Day Initiative",
    issuerEn: "Zero Day Initiative",
    date: "2026.10",
    description:
      "Out of Bounds 소속으로 Smart Home 부문에 참가했습니다. 취약점 5개를 이용해 Philips Hue Bridge Pro 익스플로잇 시연에 성공했습니다. 상금 $12,000과 Master of Pwn 2.5점을 받았습니다.",
    descriptionEn:
      "Competed in the Smart Home category as part of Out of Bounds. We successfully demonstrated a Philips Hue Bridge Pro exploit using five vulnerabilities. Our entry earned $12,000 and 2.5 Master of Pwn points.",
    url: "https://www.thezdi.com/blog/2026/10/6/pwn2own-ireland-2026-day-one-results",
    highlight: true,
  },
  {
    title: "SPACE WAR @ ARIES (AI) CTF All Solved 7위",
    titleEn: "SPACE WAR @ ARIES (AI) CTF All Solved 7th Place",
    issuer: "HSPACE",
    issuerEn: "HSPACE",
    date: "2026.03",
    highlight: true,
  },
  {
    title: "AutoHack 2025 COSS 협의회 의장상",
    titleEn: "AutoHack 2025 COSS Council Chair Award",
    issuer: "국민대학교 미래자동차사업단",
    issuerEn: "Kookmin University Future Automotive Division",
    date: "2025.11",
    highlight: true,
  },
];
