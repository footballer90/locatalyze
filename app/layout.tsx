import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"; // Added this
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locatalyze.com';

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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How accurate is Locatalyze?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our scoring model is validated against reported outcomes. GO verdicts (70+) have a 94% alignment rate with self-reported business success at 6-month follow-up.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the GO/CAUTION/NO verdict work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scores above 70 = GO (strong opportunity). 45–69 = CAUTION (proceed carefully). Below 45 = NO (avoid this location). Scoring weights: Rent 30%, Profitability 25%, Competition 25%, Demographics 20%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What data sources does Locatalyze use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Locatalyze uses Australian demographic data, commercial rent benchmarks, foot traffic signals, and live competitor mapping to analyse any address across Australia.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a report take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most reports are ready in under 60 seconds. Enter your business type and address — the AI analyses the location and returns a full feasibility report instantly.',
      },
    },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to analyse a business location with Locatalyze',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Enter your business type',
      text: 'Select your business category — café, retail, gym, restaurant, or any other type.',
    },
    {
      '@type': 'HowToStep',
      name: 'Enter the address',
      text: 'Type the Australian address or suburb you want to analyse.',
    },
    {
      '@type': 'HowToStep',
      name: 'Get your report',
      text: 'Receive a GO, CAUTION, or NO verdict with a full feasibility score, competitor map, demographic breakdown, and revenue estimate in under 60 seconds.',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights /> 
      </body>
    </html>
  );
}