import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "Mutabaah Online - Learning Management System",
  description:
    "Professional Learning Management System for Tahfidz Al-Qur'an Institutions. Manage student evaluations, track attendance, and generate official reports.",
  keywords: ["tahfidz", "lms", "education", "evaluation", "mutabaah", "quran"],
  authors: [{ name: "Mutabaah Online" }],
  creator: "Mutabaah Online",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mutabaah.vercel.app",
    siteName: "Mutabaah Online",
    title: "Mutabaah Online - Learning Management System",
    description: "Professional Learning Management System for Tahfidz Institutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mutabaah Online",
    description: "Professional Learning Management System for Tahfidz Institutions",
  },

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
