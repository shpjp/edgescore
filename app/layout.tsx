import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GithubButton from "@/components/GithubButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EdgeScore — AI Interview Scoring",
  description:
    "Record your interview answers and get an instant EdgeScore. AI-powered transcription, structured feedback, and a real score — so every practice rep counts.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GithubButton />
      </body>
    </html>
  );
}
