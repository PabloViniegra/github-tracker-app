import type { Metadata } from "next";
import { Geist, Anonymous_Pro, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export const metadata: Metadata = {
  title: "GitHub Activity Tracker",
  description: "Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${anonymousPro.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
