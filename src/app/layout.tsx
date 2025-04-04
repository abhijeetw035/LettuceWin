import { Providers } from './providers';
import type { Metadata } from 'next';
import { Inter, Outfit, Space_Grotesk } from 'next/font/google';
import GradientBg from "@/components/gradient_bg/page";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer/page";
import './globals.css';

// Primary font for body text
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Heading font 
export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// Accent font for numbers and technical elements
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "MockMaster | AI Interview Practice",
  description: "Prepare for job interviews with AI-powered mock interviews, personalized feedback, and interview performance scoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
        >
          <Navbar />
          <GradientBg />
        <Providers>{children}</Providers>
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}