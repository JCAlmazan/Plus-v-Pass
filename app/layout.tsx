import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Game Library Comparison - PS Plus vs Xbox Game Pass",
  description: "Compare PlayStation Plus and Xbox Game Pass game libraries side by side",
  keywords: "PlayStation Plus, Xbox Game Pass, game comparison, gaming, subscription services",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="game-comparison-theme"
        >
          <div className="min-h-screen bg-background text-foreground">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
