import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
} from '@/lib/schema'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type React from 'react'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BASIS - Aceleradora Comercial para Lojas de Veículos | Venda Mais Carros Todo Mês',
    template: '%s | BASIS Aceleradora',
  },
  description:
    'Transforme estoque parado em carros vendidos com a metodologia Zera Estoque. Especialistas em marketing automotivo com foco em giro rápido, leads qualificados e aumento de vendas para concessionárias e lojas de seminovos.',
  keywords: [
    'marketing automotivo',
    'vender carros',
    'gestão de concessionárias',
    'marketing para lojas de veículos',
    'giro de estoque',
    'leads automotivos',
    'vendas de carros',
    'seminovos',
    'tráfego pago automotivo',
    'acelerar vendas de veículos',
    'metodologia zera estoque',
    'criativos anti-curiosos',
  ],
  authors: [{ name: 'BASIS Aceleradora' }],
  creator: 'BASIS Aceleradora',
  publisher: 'BASIS Aceleradora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://basisaceleradora.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BASIS - Aceleradora Comercial para Lojas de Veículos',
    description:
      'Carro no pátio não paga boleto. Vamos vender! Metodologia especializada em giro de estoque e aumento de vendas para o mercado automotivo.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://basisaceleradora.com.br',
    siteName: 'BASIS Aceleradora',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/images/super-banner.png',
        width: 1200,
        height: 630,
        alt: 'BASIS - Aceleradora Comercial Automotiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BASIS - Aceleradora Comercial para Lojas de Veículos',
    description: 'Transforme estoque parado em carros vendidos com a metodologia Zera Estoque.',
    images: ['/images/super-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Tag Manager */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}
        <meta
          name="google-site-verification"
          content="4jKcr_PKRSEBdryewoKfWVgvOMSCAaVzAGP1qNG2Jks"
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        {children}
        <Analytics />
      </body>
    </html>
  )
}
