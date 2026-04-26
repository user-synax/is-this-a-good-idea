import type { Metadata } from "next";
import { Geist, Geist_Mono, Bangers } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Is This A Good Idea? - Get Brutally Honest Startup Verdicts",
  description: "Submit your startup or product idea and get a brutally honest AI-powered verdict. See if your idea is dead on arrival, needs work, actually viable, or ready to send it. Join our hall of fame and hall of shame.",
  keywords: ["startup ideas", "idea validator", "AI verdict", "startup feedback", "product ideas", "business ideas", "idea critic", "startup advice"],
  authors: [{ name: "Is This A Good Idea" }],
  openGraph: {
    title: "Is This A Good Idea? - Get Brutally Honest Startup Verdicts",
    description: "Submit your startup or product idea and get a brutally honest AI-powered verdict.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This A Good Idea? - Get Brutally Honest Startup Verdicts",
    description: "Submit your startup or product idea and get a brutally honest AI-powered verdict.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
