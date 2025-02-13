import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Nirma Reports | Student Project Documentation Tool",
  description: "Streamline your academic documentation at Nirma University. Generate professional reports for internships, major projects, and daily worksheets with our easy-to-use tool.",
  keywords: [
    "Nirma University",
    "student reports",
    "project documentation",
    "internship reports",
    "daily worksheet",
    "DWS generator",
    "BTech projects",
    "engineering documentation",
    "Nirma Institute of Technology",
    "academic reports",
    "student portal",
    "project management"
  ],
  authors: [{ name: "Nirma University" }],
  creator: "Nirma University Students",
  publisher: "Nirma University",
  category: "Education",
  applicationName: "Nirma Reports",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://reports.nirmauni.ac.in", // Update with actual URL
    title: "Nirma Reports | Student Project Documentation Tool",
    description: "Generate professional academic reports and documentation for Nirma University projects and internships.",
    siteName: "Nirma Reports",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirma Reports | Student Project Documentation Tool",
    description: "Generate professional academic reports and documentation for Nirma University projects and internships.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Nirma Reports",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
  },
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
      </body>
    </html>
  );
}