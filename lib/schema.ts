const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://basisaceleradora.com.br'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BASIS Aceleradora',
  alternateName: 'BASIS',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Aceleradora Comercial especializada em lojas de veículos. Metodologia Zera Estoque para aumentar vendas e giro de estoque.',
  sameAs: [
    'https://www.instagram.com/basisaceleradora',
    'https://www.facebook.com/basisaceleradora',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Sales',
    areaServed: 'BR',
    availableLanguage: ['Portuguese'],
  },
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'BASIS Aceleradora',
  image: `${siteUrl}/logo.png`,
  '@id': siteUrl,
  url: siteUrl,
  telephone: process.env.NEXT_PUBLIC_PHONE || '+55-XX-XXXX-XXXX',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressLocality: process.env.NEXT_PUBLIC_CITY || 'São Paulo',
    addressRegion: process.env.NEXT_PUBLIC_STATE || 'SP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: Number(process.env.NEXT_PUBLIC_LATITUDE || 0),
    longitude: Number(process.env.NEXT_PUBLIC_LONGITUDE || 0),
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '23',
  },
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Marketing Automotivo',
  provider: {
    '@type': 'Organization',
    name: 'BASIS Aceleradora',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços de Aceleração Comercial',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Criativos Anti-Curiosos',
          description:
            'Anúncios focados em compradores reais, eliminando curiosos e gerando leads qualificados.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tráfego Focado em Estoque',
          description: 'Gestão de mídia paga direcionada para girar veículos parados no pátio.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Metodologia de Vendas',
          description: 'Treinamento de equipe e estruturação de processo comercial completo.',
        },
      },
    ],
  },
}

export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: siteUrl,
    },
  ],
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como a BASIS pode ajudar minha loja a vender mais carros?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A BASIS utiliza a metodologia Zera Estoque, com três pilares: Criativos Anti-Curiosos que atraem compradores reais, Tráfego focado nos veículos do seu estoque e Metodologia de vendas para seu time fechar mais negócios.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual o diferencial da BASIS em relação a outras agências?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Somos 100% especializados em lojas de veículos, focamos em giro de estoque e lucro real, não em métricas de vaidade como curtidas. Trabalhamos o funil completo: do anúncio ao fechamento da venda.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quais resultados posso esperar trabalhando com a BASIS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nossos clientes obtiveram resultados como +50% de aumento em vendas (TWI Motors), +41% de giro de estoque (Felicar), e vendas em apenas 5 dias após início (Aion Veículos). Resultados variam conforme o esforço e estrutura de cada loja.',
      },
    },
  ],
}
