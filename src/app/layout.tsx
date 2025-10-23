import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ComicGenius - AI Comic Creator',
  description: 'Transform your stories into amazing comics with AI-powered character generation and visual storytelling.',
  keywords: ['comic', 'AI', 'story', 'generator', 'art', 'creative'],
  authors: [{ name: 'ComicGenius Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#A183B8',
  openGraph: {
    title: 'ComicGenius - AI Comic Creator',
    description: 'Transform your stories into amazing comics with AI-powered character generation and visual storytelling.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ComicGenius - AI Comic Creator',
    description: 'Transform your stories into amazing comics with AI-powered character generation and visual storytelling.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#A183B8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ComicGenius" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}