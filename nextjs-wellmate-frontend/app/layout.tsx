import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});


export const metadata: Metadata = {
  title: "NutriConsult",
  description: "Personalized Nutrition Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anuphan.variable} font-sans antialiased text-[#3d3522]`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
