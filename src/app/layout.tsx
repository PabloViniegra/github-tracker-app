import type { Metadata, Viewport } from "next";
import { Geist, Anonymous_Pro, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-serif",
  display: "swap",
  subsets: ["latin"],
});

// Viewport configuration for responsive design and mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// ⚠️ IMPORTANTE: Actualiza 'https://github-tracker.app' con tu dominio real antes del deploy
export const metadata: Metadata = {
  metadataBase: new URL('https://github-tracker.app'),
  title: {
    default: "GitHub Activity Tracker - Monitor Your GitHub Projects in Real-Time",
    template: "%s | GitHub Activity Tracker"
  },
  description: "Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events. Built for developers who want complete visibility of their GitHub workflow.",
  keywords: [
    "GitHub tracker",
    "GitHub activity monitor",
    "GitHub notifications",
    "repository tracking",
    "GitHub webhooks",
    "developer tools",
    "GitHub analytics",
    "GitHub dashboard",
    "repository management",
    "GitHub events",
    "real-time notifications",
    "GitHub API"
  ],
  authors: [{ name: "GitHub Activity Tracker Team" }],
  creator: "GitHub Activity Tracker",
  publisher: "GitHub Activity Tracker",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github-tracker.app",
    title: "GitHub Activity Tracker - Monitor Your GitHub Projects",
    description: "Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events.",
    siteName: "GitHub Activity Tracker",
    images: [
      {
        url: "/og-image.png", // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "GitHub Activity Tracker Dashboard Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Activity Tracker - Monitor Your GitHub Projects",
    description: "Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events.",
    images: ["/twitter-image.png"], // Create this image (1200x600px recommended)
    creator: "@github_tracker", // Update with your Twitter handle
  },
  verification: {
    // Add your verification tokens when available
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
  alternates: {
    canonical: "https://github-tracker.app",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GitHub Activity Tracker',
    description: 'Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events.',
    url: 'https://github-tracker.app',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time GitHub activity monitoring',
      'Repository tracking',
      'Webhook notifications',
      'GitHub event streaming',
      'Developer analytics dashboard'
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    author: {
      '@type': 'Organization',
      name: 'GitHub Activity Tracker Team',
      url: 'https://github-tracker.app',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GitHub Activity Tracker',
    url: 'https://github-tracker.app',
    logo: 'https://github-tracker.app/logo.png',
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/github_tracker',
      // 'https://github.com/your-org',
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${anonymousPro.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
