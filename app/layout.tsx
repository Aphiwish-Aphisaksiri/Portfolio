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
  title: "Aphiwish Aphisaksiri — Software Engineer",
  description:
    "Full-stack Software Engineer focused on AI-integrated applications. Based in Bangkok, Thailand.",
  icons: {
    icon: "/icons/logo.svg",
  },
  openGraph: {
    title: "Aphiwish Aphisaksiri",
    description: "Software Engineer · Bangkok, Thailand",
    url: "https://aphiwish.com",
    siteName: "Aphiwish Aphisaksiri",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/* Devicon CDN for colored tech stack icons */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
