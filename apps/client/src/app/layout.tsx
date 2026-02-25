import type { Metadata } from "next";
import { Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { TerminologyProvider } from "@/lib/providers/terminology-provider";
import { ClerkProvider } from "@clerk/nextjs";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Care | AI-Powered Infrastructure Maintenance",
  description: "Intelligent campus issue reporting, AI prioritization, and real-time maintenance tracking for universities and institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        <body
          className={`${roboto.variable} ${spaceGrotesk.variable} antialiased selection:bg-primary/30 selection:text-primary-foreground`}
        >
          <AuthProvider>
            <TerminologyProvider>
              <div className="relative min-h-screen">
                {children}
              </div>
            </TerminologyProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
