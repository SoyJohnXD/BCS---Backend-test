import type { Metadata } from "next";
import { Outfit, Inter, Lora } from "next/font/google";
import { BANK_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: BANK_NAME,
  description: BRAND_TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
