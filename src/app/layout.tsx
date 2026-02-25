import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/lib/site-config'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono-val',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.title} — ${siteConfig.tagline}`,
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased`}>
        {/* Prevent flash of wrong theme on reload */}
        {/* Career mode is default; only go to player mode if explicitly stored as 'false' */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('profileMode')!=='false')document.documentElement.dataset.career='true'}catch(e){}` }} />
        {children}
      </body>
    </html>
  )
}
