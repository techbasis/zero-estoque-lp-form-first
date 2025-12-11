"use client"

import AutoScroll from "embla-carousel-auto-scroll"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

interface Logo {
  id: string
  description: string
  image: string
  className?: string
}

interface Logos3Props {
  heading?: string
  logos?: Logo[]
  className?: string
}

const Logos3 = ({
  heading = "Empresas que confiam em nosso trabalho",
  logos = [
    {
      id: "felicar",
      description: "Felicar Seminovos",
      image: "/logos/felicar-seminovos.png",
      className: "h-16 w-auto",
    },
    {
      id: "primecar",
      description: "Primecar Multimarcas",
      image: "/logos/primecar-multimarcas.png",
      className: "h-16 w-auto",
    },
    {
      id: "ds-motos",
      description: "DS Motos",
      image: "/logos/ds-motos.jpg",
      className: "h-16 w-auto",
    },
    {
      id: "gcar",
      description: "GCar Seminovos",
      image: "/logos/gcar-seminovos.png",
      className: "h-16 w-auto",
    },
    {
      id: "alta-roda",
      description: "Alta Roda Motos",
      image: "/logos/alta-roda-motos.png",
      className: "h-16 w-auto",
    },
    {
      id: "iridium",
      description: "Iridium Imports",
      image: "/logos/iridium-imports.png",
      className: "h-16 w-auto",
    },
    {
      id: "ares",
      description: "Ares Motos",
      image: "/logos/ares-motos.png",
      className: "h-16 w-auto",
    },
    {
      id: "autonobre",
      description: "Autonobre Multimarcas",
      image: "/logos/autonobre-multimarcas.png",
      className: "h-16 w-auto",
    },
    {
      id: "rota-motos",
      description: "Rota Motos",
      image: "/logos/rota-motos.png",
      className: "h-16 w-auto",
    },
    {
      id: "viva-motos",
      description: "Viva Motos",
      image: "/logos/viva-motos.png",
      className: "h-16 w-auto",
    },
    {
      id: "realcar",
      description: "RealCar Veículos",
      image: "/logos/realcar-veiculos.png",
      className: "h-16 w-auto",
    },
    {
      id: "topcar",
      description: "TopCar Multimarcas",
      image: "/logos/topcar-multimarcas.png",
      className: "h-16 w-auto",
    },
  ],
}: Logos3Props) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container flex flex-col items-center text-center">
        <h2 className="mb-12 text-3xl font-bold text-white lg:text-4xl">{heading}</h2>
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true })]}>
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <img src={logo.image || "/placeholder.svg"} alt={logo.description} className={logo.className} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export { Logos3 }
