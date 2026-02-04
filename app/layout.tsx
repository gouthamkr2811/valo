import type { Metadata } from "next";
import { Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Will You Be My Valentine? ❤️",
  description: "A special Valentine's Day surprise filled with love, romance, and heartfelt moments",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Will You Be My Valentine? ❤️",
    description: "A special Valentine's Day surprise filled with love, romance, and heartfelt moments",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Valentine's Day - Share the Love",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Will You Be My Valentine? ❤️",
    description: "A special Valentine's Day surprise filled with love, romance, and heartfelt moments",
    images: ['/og-image.png'],
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
        className={`${poppins.variable} ${dancingScript.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
