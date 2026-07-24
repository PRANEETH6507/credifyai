import type { Metadata } from "next";
import { Sora, Instrument_Serif, Fira_Code } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "600", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

import { VerificationProvider } from "@/context/VerificationContext";

export const metadata: Metadata = {
  title: "CredifyAI | Institutional Trust Engine",
  description: "Real-time AI validation for certificates, credentials, and institutional records.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${instrumentSerif.variable} ${firaCode.variable} antialiased bg-void text-ghost font-sora`}>
        <VerificationProvider>
          {children}
        </VerificationProvider>
      </body>
    </html>
  );
}
