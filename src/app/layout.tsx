import type { Metadata } from "next";
import { Kalnia_Glaze } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const kalniaGlaze = Kalnia_Glaze({
  variable: "--font-kalnia-glaze",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salon La Puca",
  description: "Generated by Grupo #6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-slate-300">
      <body suppressHydrationWarning
        className={`${kalniaGlaze.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
