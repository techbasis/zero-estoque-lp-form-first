"use client"

import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"

const companies = [
  { name: "Felicar Seminovos", logo: "/logos/felicar-seminovos.png" },
  { name: "Primecar Multimarcas", logo: "/logos/primecar-multimarcas.png" },
  { name: "DS Motos", logo: "/logos/ds-motos.jpg" },
  { name: "RealCar Veículos", logo: "/logos/realcar-veiculos.png" },
  { name: "TopCar Multimarcas", logo: "/logos/topcar-multimarcas.png" },
  { name: "GCar Seminovos", logo: "/logos/gcar-seminovos.png" },
  { name: "Auto Nobre Multimarcas", logo: "/logos/autonobre-multimarcas.png" },
  { name: "Viva Motos", logo: "/logos/viva-motos.png" },
  { name: "Rota Motos", logo: "/logos/rota-motos.png" },
  { name: "Ares Motos", logo: "/logos/ares-motos.png" },
  { name: "Alta Roda Motos", logo: "/logos/alta-roda-motos.png" },
  { name: "Iridium Imports", logo: "/logos/iridium-imports.png" },
]

export function CompanyLogos() {
  return (
    <section className="py-20 border-t border-white/10">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h2 className="my-6 text-3xl md:text-4xl font-bold text-white text-pretty text-center">
          Empresas que confiam em nosso trabalho
        </h2>
      </div>
      <div className="pt-10 md:pt-16">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-6xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black to-transparent z-10" />
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {companies.map((company) => (
                <CarouselItem key={company.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="mx-8 flex shrink-0 items-center justify-center">
                    <Image
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      width={120}
                      height={60}
                      className="max-w-full h-auto object-contain transition-all duration-500 ease-out hover:scale-105 rounded-lg"
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
