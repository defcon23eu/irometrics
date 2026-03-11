import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IRO Metrics · Diagnóstico organizacional",
    template: "%s · IRO Metrics",
  },
  description:
    "Diagnóstico avanzado de dinámica estructural y desgaste de equipos para microempresas tecnológicas. Basado en el Índice de Reynolds Organizacional (IRO).",
  keywords: [
    "burnout",
    "microempresa",
    "diagnóstico organizacional",
    "psicología del trabajo",
    "dinámica organizacional",
  ],
  authors: [{ name: "Raúl Balaguer Moreno" }],
  robots: { index: false, follow: false },
  metadataBase: new URL("https://irometrics.app"),
  openGraph: {
    title: "IRO Metrics · Diagnóstico organizacional",
    description:
      "5 minutos. 12 indicadores. Descubre el régimen de tu organización.",
    type: "website",
    locale: "es_ES",
    url: "https://irometrics.app",
    siteName: "IRO Metrics",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080B10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-bg-base text-text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
