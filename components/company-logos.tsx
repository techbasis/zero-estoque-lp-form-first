'use client'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

const companies = [
  { name: 'Felicar Seminovos', logo: '/logos/felicar-seminovos.png' },
  { name: 'Primecar Multimarcas', logo: '/logos/primecar-multimarcas.png' },
  { name: 'DS Motos', logo: '/logos/ds-motos.jpg' },
  { name: 'RealCar Veículos', logo: '/logos/realcar-veiculos.png' },
  { name: 'TopCar Multimarcas', logo: '/logos/topcar-multimarcas.png' },
  { name: 'GCar Seminovos', logo: '/logos/gcar-seminovos.png' },
  { name: 'Auto Nobre Multimarcas', logo: '/logos/autonobre-multimarcas.png' },
  { name: 'Viva Motos', logo: '/logos/viva-motos.png' },
  { name: 'Rota Motos', logo: '/logos/rota-motos.png' },
  { name: 'Ares Motos', logo: '/logos/ares-motos.png' },
  { name: 'Alta Roda Motos', logo: '/logos/alta-roda-motos.png' },
  { name: 'Iridium Imports', logo: '/logos/iridium-imports.png' },
]

export function CompanyLogos() {
  // NOTE: Some projects end up with multiple embla-carousel versions in the lockfile.
  // That can make the Autoplay plugin types incompatible even though runtime works.
  // We intentionally cast here to keep TS happy without changing behavior.
  const autoplayPlugin = Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  }) as unknown as any

  return (
    <section className="border-t border-white/10 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h2 className="my-6 text-center text-3xl font-bold text-pretty text-white md:text-4xl">
          Lojas de veículos que já confiam na BASIS
        </h2>
      </div>
      <div className="pt-6 sm:pt-10 md:pt-16">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-6xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/6 bg-linear-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/6 bg-linear-to-l from-black to-transparent" />
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin]}
            className="w-full"
          >
            <CarouselContent>
              {companies.map((company) => (
                <CarouselItem
                  key={company.name}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="mx-4 flex shrink-0 items-center justify-center sm:mx-6 md:mx-8">
                    <Image
                      src={company.logo || '/placeholder.svg'}
                      alt={company.name}
                      width={120}
                      height={60}
                      className="h-auto max-w-full rounded-md object-contain transition-transform duration-300 ease-out hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      quality={75}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
