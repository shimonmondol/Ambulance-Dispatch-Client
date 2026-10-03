import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ambulance Dispatch - Fast Response, Better Care",
  description:
    "24/7 emergency ambulance dispatch, non-emergency medical transport, and real-time patient care services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} min-h-screen bg-white text-slate-800 antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}