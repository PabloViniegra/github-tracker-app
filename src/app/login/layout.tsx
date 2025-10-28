import type { Metadata } from "next";

// ⚠️ IMPORTANTE: Actualiza 'https://github-tracker.app' con tu dominio real antes del deploy
export const metadata: Metadata = {
  title: "Sign In - GitHub Activity Tracker",
  description: "Sign in to GitHub Activity Tracker with your GitHub account. Monitor repositories, track activity, and receive real-time webhook notifications for all your projects.",
  openGraph: {
    title: "Sign In to GitHub Activity Tracker",
    description: "Sign in with GitHub to start tracking your repositories and activity in real-time.",
    url: "https://github-tracker.app/login",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In to GitHub Activity Tracker",
    description: "Sign in with GitHub to start tracking your repositories and activity in real-time.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://github-tracker.app/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD for Login Page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sign In - GitHub Activity Tracker',
    description: 'Sign in to GitHub Activity Tracker with your GitHub account',
    url: 'https://github-tracker.app/login',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://github-tracker.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sign In',
          item: 'https://github-tracker.app/login',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
