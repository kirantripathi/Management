import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight:['400','500','600','700'],
  variable:'--font-poppins' 
});

export const metadata: Metadata = {
  title: "Evently",
  description: "Platform for Event Management",
  icons:{
    icon:'/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={poppins.variable}>{children}</body>
      <Toaster visibleToasts={1} position="top-right" richColors />
    </html>
    </ClerkProvider>
  );
}
