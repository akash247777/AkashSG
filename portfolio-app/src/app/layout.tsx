import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash — AI Software Developer",
  description:
    "Personal portfolio of Akash, an AI Software Developer bridging design and engineering through intelligent software development.",
  keywords: ["AI Developer", "Software Engineer", "Portfolio", "Next.js", "React"],
  authors: [{ name: "Akash" }],
  openGraph: {
    title: "Akash — AI Software Developer",
    description: "Bridging design and engineering through intelligent software.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
