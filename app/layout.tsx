import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { dmSans, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Craftr Insights",
  description: "Help us understand what gifts matter to you.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
