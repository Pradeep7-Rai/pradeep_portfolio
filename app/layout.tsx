import type { Metadata } from 'next'
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: 'Pradeep Rai | QA Engineer & SDET',
  description: 'Portfolio of Pradeep Rai — QA Engineer & SDET. Automation testing, Selenium, API testing, and quality-focused development.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${plusJakarta.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
