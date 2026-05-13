import type { Metadata } from "next";
import { Geist, Gloria_Hallelujah } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const gloria = Gloria_Hallelujah({
  variable: "--font-gloria",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pokochaj angielski — lekcje online 1:1",
  description:
    "Nauka angielskiego online z empatyczną lektorką. Zajęcia indywidualne i w parach dla dorosłych. Umów bezpłatną konsultację.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${geist.variable} ${gloria.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
