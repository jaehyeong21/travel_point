// config/metadata.ts
import { Metadata } from 'next';
import { siteConfig } from '@/config/site-config';

export const metadataLayout: Metadata = {
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.applicationName,
  generator: siteConfig.generator,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: siteConfig.formatDetection,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  openGraph: {
    locale: siteConfig.locale,
    type: "article",
  },
  icons: {
    icon: '/assets/favicons/favicon.ico',
    shortcut: '/assets/favicons/favicon-32x32.png',
    apple: '/assets/favicons/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/assets/favicons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'icon',
        url: '/assets/favicons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        rel: 'icon',
        sizes: '16x16',
        url: '/assets/favicons/favicon-16x16.png',
        type: 'image/png'
      },
      {
        rel: 'apple-touch-icon',
        url: '/assets/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        rel: 'manifest',
        url: '/assets/favicons/site.webmanifest'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
  }
};
