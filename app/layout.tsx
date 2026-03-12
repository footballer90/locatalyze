import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dm = DM_Sans({ subsets: ['latin'], weight: ['400','500','600','700','800','900'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Locatalyze — AI Location Feasibility for Australian Businesses',
    template: '%s | Locatalyze',
  },
  description:
    'Analyse any Australian address and get a complete financial feasibility report in 30 seconds. GO, CAUTION or NO verdict backed by live data.',
  keywords: ['location analysis', 'business feasibility', 'cafe location', 'restaurant location', 'Australian business'],
  authors: [{ name: 'Locatalyze' }],
  creator: 'Locatalyze',
  openGraph: {
    type:        'website',
    locale:      'en_AU',
    url:         SITE_URL,
    siteName:    'Locatalyze',
    title:       'Locatalyze — AI Location Feasibility for Australian Businesses',
    description: 'Know if a location will make you money before you sign the lease.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Locatalyze' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Locatalyze — AI Location Feasibility',
    description: 'Know if a location will make you money before you sign the lease.',
    images:      [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
