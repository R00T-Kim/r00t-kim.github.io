import { JetBrains_Mono, Nanum_Gothic_Coding } from "next/font/google";

// Shared by the locale layout and the root 404 page, which builds its own <html>.
export const koreanMono = Nanum_Gothic_Coding({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-korean-mono",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
