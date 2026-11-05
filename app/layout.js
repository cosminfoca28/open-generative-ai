import './globals.css';
import { Inter } from "next/font/google";
import { headers } from 'next/headers';
import { getLocaleConfig } from '@/lib/locales';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#09090b' };

export const metadata = {
  applicationName: 'AI Media Studio',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'AI Studio', statusBarStyle: 'black-translucent' },
  icons: { icon: '/mobile-studio-icon.svg' },
  title: 'Open Generative AI — Free AI Image & Video Studio',
  description: 'Generate AI images and videos using 200+ models — Flux, Midjourney, Kling, Veo, Seedance and more.',
};

export default async function RootLayout({ children }) {
  // Locale is derived from the URL path by middleware.js and passed
  // through as a plain response header — the root layout is shared by
  // every locale's route tree, so it can't take a `locale` prop directly.
  const headerList = await headers();
  const { htmlLang } = getLocaleConfig(headerList.get('x-locale'));

  return (
    <html lang={htmlLang}>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
