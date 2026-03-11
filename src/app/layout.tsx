import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { PageNav } from "@/components/PageNav";
import { AudioPlayingProvider } from "@/context/AudioPlayingContext";
import { AudioPlayerOpenProvider } from "@/context/AudioPlayerOpenContext";
import { LayoutWithAudioPlayer } from "@/components/LayoutWithAudioPlayer";

// Heading serif (Playfair as a high-contrast display serif)
const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Garamond-style body text (Cormorant for booklet feel)
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taylor Swift Cassette Experiment",
  description:
    "An experimental comparison of cassette tape types using The Tortured Poets Department album by Taylor Swift.",
  openGraph: {
    title: "Taylor Swift Cassette Experiment",
    description:
      "An experimental comparison of cassette tape types using The Tortured Poets Department album by Taylor Swift.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <AudioPlayingProvider>
          <AudioPlayerOpenProvider>
            <Header />
            <LayoutWithAudioPlayer>{children}</LayoutWithAudioPlayer>
            <PageNav />
          </AudioPlayerOpenProvider>
        </AudioPlayingProvider>
      </body>
    </html>
  );
}
