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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Is Your Location Worth It? Café, Restaurant & Retail Analysis — Locatalyze',
    template: '%s | Locatalyze',
  },
  description:
    'Enter any Australian address and find out if it can support your café, restaurant or retail store. Competitor map, rent-to-revenue check, demographics and a GO/CAUTION/NO verdict — free to start.',
  keywords: ['café location analysis Australia', 'best suburb to open a café', 'restaurant location check', 'commercial rent analysis', 'open a café Sydney Melbourne Brisbane Perth', 'business location feasibility'],
  authors: [{ name: 'Locatalyze', url: SITE_URL }],
  creator: 'Locatalyze',
  openGraph: {
    type:        'website',
    locale:      'en_AU',
    url:         SITE_URL,
    siteName:    'Locatalyze',
    title:       'Is Your Location Worth It? Café & Restaurant Analysis — Locatalyze',
    description: 'Know if a location will make you money before you sign the lease. Free for Australian addresses.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Is Your Location Worth It? — Locatalyze',
    description: 'Know if a location will make you money before you sign the lease.',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: '8EJWIqNz5W5mTGu4yf1xq4JUiZiJ982RJVB6wPlHLfE',
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
        text: 'Most reports are ready in about 90 seconds. Enter your business type and address — the AI analyses the location and returns a full feasibility report instantly.',
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
      text: 'Receive a GO, CAUTION, or NO verdict with a full feasibility score, competitor map, demographic breakdown, and revenue estimate in about 90 seconds.',
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
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4GWEH0M5WE"/>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4GWEH0M5WE');
        `}}/>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        {/* PostHog */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture calculateEventProperties register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group reset get_distinct_id alias set_config startSessionRecording stopSessionRecording opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('phc_wYJnh5uK4kDmzGsdmUnuMvaNunr8fzy3etx3sKJsXoWd', {
            api_host: 'https://us.i.posthog.com',
            defaults: '2026-01-30',
            person_profiles: 'identified_only',
          });
        `}}/>
        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wbf9ovqwcu");
        `}}/>
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