import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhichQuiz",
  description: "Najdi kvíz z různých webů podle nálady, nebo si vytvoř vlastní.",
  openGraph: {
    title: "WhichQuiz",
    description: "Najdi kvíz z různých webů podle nálady, nebo si vytvoř vlastní.",
    siteName: "WhichQuiz",
  },
  twitter: {
    card: "summary",
    title: "WhichQuiz",
    description: "Najdi kvíz z různých webů podle nálady, nebo si vytvoř vlastní.",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
