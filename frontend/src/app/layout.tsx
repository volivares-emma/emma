import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/session-provider'
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
  title: "EMMA - Employee Management Monitoring & Administration",
  description: "Plataforma para gestión y monitoreo de empleados. Solución integral para RRHH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Toaster
            theme="light"
            position="top-right"
            richColors
            toastOptions={{
              className: "text-[#035AA6] bg-white border border-[#11B4D9]/20 shadow-md",
              descriptionClassName: "text-[#07598C] text-sm",
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
