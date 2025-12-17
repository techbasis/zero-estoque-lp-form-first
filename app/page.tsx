'use client'

import { CompanyLogos } from '@/components/company-logos'
import LeadFilterBanner from '@/components/lead-filter-banner'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Squares } from '@/components/ui/squares-background'
import * as gtag from '@/lib/gtag'
import { motion } from 'framer-motion'
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Facebook,
  Instagram,
  PlusCircle,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  UserCircle,
  Users,
  Volume2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { useRef, useState } from 'react'
import { z } from 'zod'

// Schema de validação com Zod
const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
  company: z.string().min(2, 'Nome da empresa deve ter no mínimo 2 caracteres'),
  role: z.string().min(1, 'Selecione um cargo'),
  salesVolume: z.string().min(1, 'Selecione o volume de vendas'),
  marketingBudget: z.string().min(1, 'Selecione o investimento em marketing'),
})

type FormData = z.infer<typeof formSchema>

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const services = [
  {
    icon: Users,
    title: 'Anúncios que tiram curioso do caminho',
    description:
      'Criamos anúncios falando do carro, da condição e da oportunidade de verdade do jeito que o comprador pensa. O resultado: o curioso passa reto e quem chama sua loja já vem com intenção real de negócio.',
  },
  {
    icon: TrendingUp,
    title: 'Mídia comprada para vender os carros certos',
    description:
      'Seu dinheiro de tráfego vai pros veículos que precisam sair, não pra "aparecer mais". Segmentamos por região, interesse e momento de compra, para encher a agenda do seu time com pessoas interessadas nos carros que estão parados no seu pátio.',
  },
  {
    icon: Award,
    title: 'Time treinado para fechar, não só atender',
    description:
      'Estruturamos roteiro, abordagem e follow-up para o seu vendedor saber exatamente o que falar em cada etapa. Assim, leads viram visitas, visitas viram propostas e propostas viram carros vendidos.',
  },
]

const testimonials = [
  {
    quote:
      'De 12 para 18 carros vendidos por mês em apenas 52 dias. +50% de aumento no volume mensal de vendas com a metodologia Zera Estoque.',
    author: 'TWI MOTORS',
    highlight: '+50% de vendas',
  },
  {
    quote:
      '3 carros vendidos em apenas 5 dias após o início das campanhas. O giro de estoque mais rápido já registrado na loja, com leads de alta intenção de compra.',
    author: 'AION VEÍCULOS',
    highlight: '3 carros em 5 dias',
  },
  {
    quote:
      'Aumento de 41% no giro de estoque em 90 dias. Foco em tirar veículos parados do pátio e acelerar a renovação do estoque.',
    author: 'FELICAR VEÍCULOS',
    highlight: '+41% giro de estoque',
  },
]

const team = [
  {
    id: 1,
    name: 'Lucca Ferreira',
    designation: 'CEO & Fundador',
    image: '/team/lucca-ferreira.jpg',
  },
  { id: 2, name: 'João Dias', designation: 'Estrategista Comercial', image: '/team/joao-dias.png' },
  {
    id: 3,
    name: 'Murillo Augusto',
    designation: 'CTO & Gestor de TI',
    image: '/team/murillo-augusto.jpg',
  },
  { id: 4, name: 'Vinicius Lima', designation: 'Criativo Maker', image: '/team/vinicius-lima.png' },
  { id: 5, name: 'Luna Faria', designation: 'Designer Criativa', image: '/team/luna-faria.png' },
]

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    salesVolume: '',
    marketingBudget: '',
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [selectedRole, setSelectedRole] = useState('')
  const [showUnmuteButton, setShowUnmuteButton] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0 // Restart video from beginning
      videoRef.current.muted = false // Unmute
      videoRef.current.play() // Ensure video plays
      setShowUnmuteButton(false)
    }
  }

  const scrollToForm = () => {
    // Track CTA click
    gtag.trackButtonClick('Scroll to Form CTA')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    setSubmitStatus('idle')

    // Validação com Zod
    try {
      formSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof FormData, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormData] = err.message
          }
        })
        setFormErrors(errors)
        setSubmitStatus('error')
        setSubmitMessage('Por favor, preencha todos os campos obrigatórios corretamente.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/rdstation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Track successful form submission
        gtag.trackFormSubmit('Lead Form - Landing Page')

        // Push to dataLayer for GTM
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'form_submission',
            form_name: 'Lead Form',
            form_type: 'contact',
            user_email: formData.email,
            user_company: formData.company,
            user_role: formData.role,
            sales_volume: formData.salesVolume,
            marketing_budget: formData.marketingBudget,
          })
        }

        setSubmitStatus('success')
        setSubmitMessage(
          'Formulário enviado com sucesso! Nossa equipe entrará em contato em breve.'
        )
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          role: '',
          salesVolume: '',
          marketingBudget: '',
        })
        setSelectedRole('')
        setFormErrors({})
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.message || 'Erro ao enviar formulário. Tente novamente.')
      }
    } catch (error) {
      console.error('[v0] Form submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Erro ao enviar formulário. Verifique sua conexão e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#1a1a1a"
          hoverFillColor="#0a0a0a"
        />
      </div>

      <div className="relative z-10 overflow-x-hidden">
        <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/logo.png"
                  alt="BASIS Aceleradora - Logo da empresa especializada em marketing automotivo e vendas de veículos"
                  width={40}
                  height={40}
                  className="h-7 w-7 sm:h-10 sm:w-10"
                />
                <span className="text-lg font-bold tracking-wide text-white sm:text-2xl">
                  BASIS
                </span>
              </div>
              <Button
                onClick={scrollToForm}
                className="h-8 bg-blue-600 px-3 py-2 text-xs text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] sm:h-10 sm:px-6 sm:text-base"
              >
                Preencher Formulário
              </Button>
            </div>
          </div>
        </header>

        <LeadFilterBanner />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 pt-24 sm:py-20 sm:pt-32 lg:py-32 lg:pt-40">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/super-banner.png"
              alt="Concessionária com carros em estoque - BASIS ajuda a vender mais veículos com marketing automotivo especializado"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.h1
                  variants={fadeInUp}
                  className="mt-8 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-6xl"
                >
                  Carro no pátio não paga boleto,
                  <span className="text-blue-500"> VAMOS VENDER!</span>{' '}
                  <motion.span
                    className="inline-block"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                    whileHover={{
                      y: [0, -15, 0, -10, 0],
                      rotate: [0, 10, -10, 8, -8, 0],
                      transition: {
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    <Rocket className="inline-block h-8 w-8 text-blue-500 sm:h-12 sm:w-12" />
                  </motion.span>{' '}
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="mt-4 text-base leading-7 text-pretty text-gray-300 sm:mt-6 sm:text-lg sm:leading-8"
                >
                  Zere o estoque todo mês com uma metodologia criada só para lojas de veículos. Foco
                  em giro rápido, lucro por carro e fila de compradores prontos para falar com o seu
                  time.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="mt-6 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={scrollToForm}
                      size="lg"
                      className="bg-blue-600 py-3 text-sm text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:py-4 sm:text-base"
                    >
                      QUERO VENDER MAIS CARROS TODO MÊS
                    </Button>
                    <p className="text-center text-xs text-gray-400 sm:text-sm">
                      Você fala direto com um especialista, sem robô e sem compromisso.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Texto à esquerda */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
                  A <span className="text-blue-500">metodologia</span> que transforma estoque parado
                  em carros vendidos todo mês.
                </h2>
                <p className="mt-4 text-base leading-7 text-pretty text-gray-300 sm:mt-6 sm:text-lg sm:leading-8">
                  Não somos agência de marketing. Somos uma Aceleradora Comercial focada em VENDAS
                  REAIS. Enquanto o mercado se perde em likes, branding, nossa metodologia Zera
                  Estoque ataca o seu maior problema:{' '}
                  <span className="font-bold text-blue-500 sm:text-xl">Carro parado no pátio.</span>
                </p>
                <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Funil completo de vendas
                      </span>{' '}
                      Do anúncio ao fechamento: conectamos criativos, tráfego e atendimento para o
                      carro realmente sair do pátio.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Especialistas em lojas de veículos
                      </span>{' '}
                      Estratégias criadas só para o setor automotivo, entendendo estoque, margem e
                      rotina de loja – não para "qualquer nicho".
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Metodologia Zera Estoque comprovada
                      </span>{' '}
                      Pilares de Criativos Anti-Curiosos, Tráfego focado no estoque e treinamento de
                      vendas, gerando leads prontos para comprar todos os meses.
                    </span>
                  </div>
                </div>
                <motion.div variants={fadeInUp} className="mt-6 sm:mt-8">
                  <Button
                    onClick={scrollToForm}
                    size="lg"
                    className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
                  >
                    Saiba Mais
                  </Button>
                </motion.div>
              </motion.div>

              {/* Vídeo à direita + Cards embaixo do vídeo */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="flex flex-col gap-8 sm:gap-12"
              >
                {/* Video explicativo */}
                <motion.div variants={fadeInUp} className="flex justify-center px-8 sm:px-0">
                  <div className="relative aspect-[9/16] w-full max-w-[280px] overflow-visible rounded-lg border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(59,130,246,0.6)] sm:max-w-sm sm:border-4 sm:shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/automotive-marketing-video-thumbnail.jpg"
                      >
                        <source
                          src="https://res.cloudinary.com/due6xbj4h/video/upload/v1760302949/Criativo_ccgx8s.mp4"
                          type="video/mp4"
                        />
                      </video>
                      {showUnmuteButton && (
                        <button
                          onClick={handleUnmute}
                          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 p-4 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 hover:scale-110 hover:bg-red-700 hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] sm:p-6"
                          aria-label="Desmutar vídeo"
                        >
                          <Volume2 className="h-6 w-6 sm:h-8 sm:w-8" />
                        </button>
                      )}
                    </div>
                    <div className="absolute -top-4 -left-4 flex items-center gap-1.5 rounded-full border border-blue-400 bg-black px-2 py-1.5 shadow-lg sm:-top-6 sm:-left-6 sm:gap-2 sm:border-2 sm:px-3 sm:py-2">
                      <Facebook className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                      <Instagram className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                    </div>
                    <div className="absolute -top-4 -right-4 rounded-xl border border-blue-400 bg-black px-2.5 py-1.5 shadow-lg sm:-top-6 sm:-right-6 sm:rounded-2xl sm:border-2 sm:px-4 sm:py-2">
                      <div className="text-base font-bold text-white sm:text-lg">+60%</div>
                      <div className="text-xs font-semibold text-blue-400 sm:text-sm">Vendas</div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 rounded-xl border border-blue-400 bg-black px-2.5 py-1.5 shadow-lg sm:-bottom-6 sm:-left-6 sm:rounded-2xl sm:border-2 sm:px-4 sm:py-2">
                      <div className="text-base font-bold text-white sm:text-lg">+120%</div>
                      <div className="text-xs font-semibold text-blue-400 sm:text-sm">Alcance</div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 rounded-xl border border-blue-400 bg-black px-2.5 py-1.5 shadow-lg sm:-right-6 sm:-bottom-6 sm:rounded-2xl sm:border-2 sm:px-4 sm:py-2">
                      <div className="text-base font-bold text-white sm:text-lg">+85%</div>
                      <div className="text-xs font-semibold text-blue-400 sm:text-sm">
                        Engajamento
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cards de estatísticas embaixo do vídeo */}
                <motion.div
                  variants={staggerContainer}
                  className="mx-8 my-0 grid grid-cols-2 gap-3 sm:mx-[72px] sm:gap-4"
                >
                  {[
                    { value: '23+', label: 'Projetos Automotivos' },
                    { value: '900+', label: 'Veículos vendidos' },
                    { value: '100%', label: 'Foco em ROI' },
                    { value: '5+', label: 'Anos no Mercado' },
                  ].map((stat, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <Card className="group border-white/10 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <CardContent className="p-3 text-center sm:p-4">
                          <div className="text-xl font-bold text-blue-500 sm:text-2xl">
                            {stat.value}
                          </div>
                          <div className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Logo BASIS após toda a seção */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-16"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Image
                  src="/logo.png"
                  alt="BASIS Aceleradora - Especialistas em Marketing Automotivo"
                  width={60}
                  height={60}
                  className="h-12 w-12 sm:h-16 sm:w-16"
                />
                <span className="text-3xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl">
                  BASIS
                </span>
              </div>
              <p className="text-center text-sm text-gray-400 sm:text-base">
                Aceleradora Comercial para Lojas de Veículos
              </p>
            </motion.div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="bg-gradient-to-b from-black via-black/95 to-black py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mx-auto mb-8 max-w-4xl text-center sm:mb-12"
            >
              <div className="mb-3 flex text-left sm:mb-4">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400 sm:px-4 sm:py-2 sm:text-sm">
                  POR QUE SEU MARKETING NÃO FUNCIONOU ANTES?
                </span>
              </div>
              <h2 className="mb-3 text-left text-lg leading-tight font-bold tracking-tight text-white sm:mb-4 sm:text-xl lg:text-3xl">
                <span className="text-blue-500 sm:text-2xl lg:text-4xl">
                  Cansado de promessas vazias?
                </span>{' '}
                <br />
                Veja a diferença entre agências genéricas e uma Aceleradora Comercial especializada
                em automotivo.
              </h2>
              <p className="text-left text-sm leading-relaxed text-gray-300 sm:text-lg">
                Você já investiu em tráfego e não sentiu o resultado no estoque.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>O problema não é o anúncio, é a forma como ele é
                usado dentro da sua operação.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="relative mx-auto max-w-4xl"
            >
              {/* Tabela de Comparação - 2 Colunas */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm sm:rounded-2xl">
                {/* Header */}
                <div className="grid grid-cols-2 border-b border-white/10">
                  <div className="border-r border-red-500/30 bg-gradient-to-br from-red-950/20 to-gray-900/30 p-2.5 text-center sm:p-6">
                    <h3 className="text-xs leading-tight font-semibold text-red-400 sm:text-lg">
                      Agências Comuns
                    </h3>
                    <p className="mt-0.5 text-[10px] text-red-300/60 sm:text-sm">
                      Gestores Genéricos
                    </p>
                  </div>
                  <div className="border-l border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-blue-950/20 p-2.5 text-center sm:p-6">
                    <h3 className="text-xs leading-tight font-semibold text-blue-400 sm:text-lg">
                      BASIS Aceleradora Automotiva
                    </h3>
                    <p className="mt-0.5 text-[10px] text-blue-500/80 sm:text-sm">
                      Comercial Automotiva
                    </p>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="absolute top-[52px] left-1/2 z-10 -translate-x-1/2 rounded-full border-2 border-blue-500 bg-gray-900 px-2.5 py-1 shadow-[0_0_20px_rgba(59,130,246,0.4)] sm:top-[88px] sm:px-4 sm:py-2">
                  <span className="text-xs font-bold text-blue-400 sm:text-base">VS</span>
                </div>

                {/* Linhas de Comparação */}
                {[
                  {
                    icon: X,
                    label: 'Foco',
                    common: 'Curtidas, alcance e "marca aparecendo"',
                    commonMobile: 'Curtidas e alcance',
                    basis: 'Giro rápido de estoque e lucro por veículo',
                    basisMobile: 'Giro de estoque e lucro',
                  },
                  {
                    icon: UserCircle,
                    label: 'Especialização',
                    common: 'Atendem qualquer nicho',
                    commonMobile: 'Qualquer nicho',
                    basis: '100% focada em lojas de veículos',
                    basisMobile: '100% lojas de veículos',
                  },
                  {
                    icon: PlusCircle,
                    label: 'Leads',
                    common: 'Muito volume de curiosos e leads frios',
                    commonMobile: 'Muitos curiosos',
                    basis: 'Leads filtrados, com intenção real de compra (Anti-Curiosos)',
                    basisMobile: 'Leads prontos para comprar',
                  },
                  {
                    icon: Target,
                    label: 'Estratégia',
                    common: 'Campanhas soltas, sem olhar para o time de vendas',
                    commonMobile: 'Campanhas soltas',
                    basis: 'Funil completo: Anúncio → Lead → Atendimento → Venda',
                    basisMobile: 'Funil completo de vendas',
                  },
                  {
                    icon: ClipboardList,
                    label: 'Acompanhamento',
                    common: 'Relatório mensal com gráfico bonito',
                    commonMobile: 'Relatório mensal',
                    basis: 'Reuniões estratégicas focadas em carros vendidos e próximos passos',
                    basisMobile: 'Foco em carros vendidos',
                  },
                  {
                    icon: Shield,
                    label: 'Compromisso',
                    common: 'Promessa de visibilidade',
                    commonMobile: 'Visibilidade',
                    basis: 'Compromisso com giro de estoque e resultado financeiro',
                    basisMobile: 'Resultado financeiro real',
                  },
                ].map((row, index) => {
                  const Icon = row.icon
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-2 border-b border-white/10 last:border-b-0"
                    >
                      {/* Coluna Esquerda - Agências Comuns (Vermelho) */}
                      <div className="flex flex-col items-center justify-center border-r border-red-500/30 bg-gradient-to-br from-red-950/20 to-gray-900/10 p-2.5 text-center sm:p-6">
                        <div className="mb-1.5 flex items-center justify-center gap-1.5 sm:mb-3 sm:gap-3">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-red-400 sm:h-6 sm:w-6" />
                          <span className="text-[10px] leading-tight font-semibold text-red-300 sm:text-base">
                            {row.label}
                          </span>
                        </div>
                        <p className="hidden text-xs leading-relaxed text-gray-400 sm:block sm:text-sm">
                          {row.common}
                        </p>
                        <p className="block text-[10px] leading-tight text-gray-400 sm:hidden">
                          {row.commonMobile}
                        </p>
                      </div>

                      {/* Coluna Direita - Nossa Aceleradora (Verde) */}
                      <div className="flex flex-col items-center justify-center border-l border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-blue-950/10 p-2.5 text-center sm:p-6">
                        <div className="mb-1.5 flex items-center justify-center gap-1.5 sm:mb-3 sm:gap-3">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-green-400 sm:h-6 sm:w-6" />
                          <span className="text-[10px] leading-tight font-semibold text-green-300 sm:text-base">
                            {row.label}
                          </span>
                        </div>
                        <p className="hidden text-xs leading-relaxed font-medium text-white sm:block sm:text-sm">
                          {row.basis}
                        </p>
                        <p className="block text-[10px] leading-tight font-medium text-white sm:hidden">
                          {row.basisMobile}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <motion.div variants={fadeInUp} className="mt-6 text-center sm:mt-12">
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="w-full bg-blue-600 px-4 py-5 text-xs leading-tight text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto sm:px-8 sm:text-sm"
                >
                  <span className="sm:hidden">QUERO RESULTADO REAL</span>
                  <span className="hidden sm:inline">
                    QUERO SAIR DO MUNDO DAS AGÊNCIAS E TER RESULTADO REAL
                  </span>
                </Button>
                <p className="mt-2 px-4 text-[10px] leading-relaxed text-gray-400 sm:mt-3 sm:text-sm">
                  Vamos analisar sua operação e dizer se faz sentido aplicar a metodologia na sua
                  loja.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Como fazemos seu estoque girar na prática
              </h2>
              <p className="mt-3 text-base text-gray-300 sm:mt-4 sm:text-lg">
                Soluções completas para impulsionar suas vendas no mercado automotivo
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-3"
            >
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <motion.div key={service.title} variants={fadeInUp}>
                    <Card className="group h-full border-white/10 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] sm:mb-4 sm:h-12 sm:w-12">
                          <Icon className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-sm text-gray-300 sm:mt-4 sm:text-base">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mt-8 text-center sm:mt-12"
            >
              <p className="mb-6 text-lg font-medium text-gray-300 sm:text-xl">
                Do anúncio ao contrato assinado, tudo é pensado para uma coisa: mais carros saindo
                do pátio todos os meses.
              </p>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
              >
                Saiba Mais
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Company Logos Section */}
        <CompanyLogos />

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mb-10 text-center text-2xl font-bold text-white sm:mb-16 sm:text-3xl"
            >
              Resultados Reais de Clientes Reais
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full border-white/10 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <CardContent className="p-5 sm:p-6">
                      <div className="mb-4 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400 sm:text-sm">
                        {testimonial.highlight}
                      </div>
                      <p className="mb-3 text-sm font-bold text-white sm:text-base">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-300 sm:text-base">{testimonial.quote}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Logo BASIS com CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mt-12 flex flex-col items-center justify-center gap-6 sm:mt-16"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Image
                  src="/logo.png"
                  alt="BASIS Aceleradora - Resultados Comprovados"
                  width={50}
                  height={50}
                  className="h-10 w-10 sm:h-14 sm:w-14"
                />
                <span className="text-2xl font-bold tracking-wide text-white sm:text-3xl lg:text-4xl">
                  BASIS
                </span>
              </div>
              <p className="text-center text-sm text-gray-400 sm:text-base">
                Transformando lojas em máquinas de vendas
              </p>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
              >
                Saiba Mais
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <motion.section
          ref={formRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="py-16 sm:py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-block sm:mb-6">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 sm:px-4 sm:py-2 sm:text-sm">
                  Comece Agora
                </span>
              </div>
              <h2 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl">
                Pronto para crescer?
              </h2>
              <p className="mb-6 text-base text-gray-300 sm:mb-8 sm:text-lg">
                Preencha o formulário e descubra como podemos ajudar você a vender mais
              </p>
            </div>

            {/* Formulário sempre visível */}
            <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
              {submitStatus === 'success' && (
                <div className="mb-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 p-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] sm:mb-6 sm:p-6">
                  <div className="flex items-center gap-2 text-green-400 sm:gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
                    <p className="text-sm font-semibold sm:text-lg">{submitMessage}</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] sm:mb-6 sm:p-6">
                  <p className="text-sm font-semibold text-red-400 sm:text-lg">{submitMessage}</p>
                </div>
              )}

              <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-950/20 via-black/80 to-black/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-xl">
                <CardContent className="p-6 sm:p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-8 text-left sm:space-y-10">
                    {/* Informações Básicas */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        Informações Básicas
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="form-field-name"
                            className="text-sm font-medium text-white sm:text-base"
                          >
                            Nome Completo *
                          </Label>
                          <Input
                            id="form-field-name"
                            placeholder="Digite seu nome completo"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value })
                              if (formErrors.name) {
                                setFormErrors({ ...formErrors, name: undefined })
                              }
                            }}
                            className={`h-11 border-white/10 bg-black/50 text-white transition-all placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-12 ${
                              formErrors.name ? 'border-red-500/50' : ''
                            }`}
                          />
                          {formErrors.name && (
                            <p className="text-xs text-red-400 sm:text-sm">{formErrors.name}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="form-field-email"
                            className="text-sm font-medium text-white sm:text-base"
                          >
                            Email Profissional *
                          </Label>
                          <Input
                            id="form-field-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value })
                              if (formErrors.email) {
                                setFormErrors({ ...formErrors, email: undefined })
                              }
                            }}
                            className={`h-11 border-white/10 bg-black/50 text-white transition-all placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-12 ${
                              formErrors.email ? 'border-red-500/50' : ''
                            }`}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-red-400 sm:text-sm">{formErrors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="form-field-phone"
                            className="text-sm font-medium text-white sm:text-base"
                          >
                            Telefone / WhatsApp *
                          </Label>
                          <Input
                            id="form-field-phone"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value })
                              if (formErrors.phone) {
                                setFormErrors({ ...formErrors, phone: undefined })
                              }
                            }}
                            className={`h-11 border-white/10 bg-black/50 text-white transition-all placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-12 ${
                              formErrors.phone ? 'border-red-500/50' : ''
                            }`}
                          />
                          {formErrors.phone && (
                            <p className="text-xs text-red-400 sm:text-sm">{formErrors.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="form-field-company"
                            className="text-sm font-medium text-white sm:text-base"
                          >
                            Nome da Empresa *
                          </Label>
                          <Input
                            id="form-field-company"
                            placeholder="Nome da sua empresa"
                            value={formData.company}
                            onChange={(e) => {
                              setFormData({ ...formData, company: e.target.value })
                              if (formErrors.company) {
                                setFormErrors({ ...formErrors, company: undefined })
                              }
                            }}
                            className={`h-11 border-white/10 bg-black/50 text-white transition-all placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-12 ${
                              formErrors.company ? 'border-red-500/50' : ''
                            }`}
                          />
                          {formErrors.company && (
                            <p className="text-xs text-red-400 sm:text-sm">{formErrors.company}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Qual seu Cargo */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        Qual seu Cargo? *
                      </h3>
                      <p className="text-sm text-gray-400 sm:text-base">
                        Selecione a opção que melhor descreve sua posição
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        {[
                          { value: 'owner', label: 'Dono / Sócio' },
                          { value: 'manager', label: 'Gerente' },
                          { value: 'employee', label: 'Vendedor contratado' },
                          { value: 'autonomous', label: 'Vendedor Autônomo' },
                        ].map((role) => (
                          <label
                            key={role.value}
                            htmlFor={`form-field-role-${role.value}`}
                            className={`cursor-pointer rounded-xl border-2 p-4 text-left transition-all duration-300 sm:p-6 ${
                              selectedRole === role.value
                                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                                : formErrors.role
                                  ? 'border-red-500/50 bg-black/30 hover:border-red-500/70'
                                  : 'border-white/10 bg-black/30 hover:border-blue-500/50 hover:bg-blue-500/5'
                            }`}
                          >
                            <input
                              type="radio"
                              id={`form-field-role-${role.value}`}
                              name="role"
                              value={role.value}
                              checked={selectedRole === role.value}
                              onChange={(e) => {
                                setSelectedRole(e.target.value)
                                setFormData({ ...formData, role: e.target.value })
                                if (formErrors.role) {
                                  setFormErrors({ ...formErrors, role: undefined })
                                }
                              }}
                              className="sr-only"
                            />
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-base font-semibold sm:text-lg ${
                                  selectedRole === role.value ? 'text-blue-400' : 'text-white'
                                }`}
                              >
                                {role.label}
                              </span>
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${
                                  selectedRole === role.value
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-white/30'
                                }`}
                              >
                                {selectedRole === role.value && (
                                  <div className="h-2 w-2 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {formErrors.role && (
                        <p className="text-xs text-red-400 sm:text-sm">{formErrors.role}</p>
                      )}
                    </div>

                    {/* Quantos carros você vende */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        Quantos carros você vende por mês? *
                      </h3>
                      <p className="text-sm text-gray-400 sm:text-base">
                        Nos ajude a entender o volume de vendas atual
                      </p>
                      <Select
                        value={formData.salesVolume}
                        onValueChange={(value) => {
                          setFormData({ ...formData, salesVolume: value })
                          if (formErrors.salesVolume) {
                            setFormErrors({ ...formErrors, salesVolume: undefined })
                          }
                        }}
                      >
                        <SelectTrigger
                          id="form-field-salesVolume"
                          className={`h-12 border-white/10 bg-black/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-14 ${
                            formErrors.salesVolume ? 'border-red-500/50' : ''
                          }`}
                        >
                          <SelectValue placeholder="Selecione o volume" />
                        </SelectTrigger>
                        <SelectContent className="border-blue-500/20 bg-black backdrop-blur-xl">
                          <SelectItem value="1-5">1 a 5 Carros</SelectItem>
                          <SelectItem value="6-10">6 a 10 carros</SelectItem>
                          <SelectItem value="11-30">11 a 30 Carros</SelectItem>
                          <SelectItem value="31-50">31 a 50 Carros</SelectItem>
                          <SelectItem value="50+">50+ Carros</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.salesVolume && (
                        <p className="text-xs text-red-400 sm:text-sm">{formErrors.salesVolume}</p>
                      )}
                    </div>

                    {/* Investimento em marketing */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        Quanto você investe em marketing hoje? *
                      </h3>
                      <p className="text-sm text-gray-400 sm:text-base">
                        Selecione a faixa de investimento mensal
                      </p>
                      <Select
                        value={formData.marketingBudget}
                        onValueChange={(value) => {
                          setFormData({ ...formData, marketingBudget: value })
                          if (formErrors.marketingBudget) {
                            setFormErrors({ ...formErrors, marketingBudget: undefined })
                          }
                        }}
                      >
                        <SelectTrigger
                          id="form-field-marketingBudget"
                          className={`h-12 border-white/10 bg-black/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-14 ${
                            formErrors.marketingBudget ? 'border-red-500/50' : ''
                          }`}
                        >
                          <SelectValue placeholder="Selecione o investimento" />
                        </SelectTrigger>
                        <SelectContent className="border-blue-500/20 bg-black backdrop-blur-xl">
                          <SelectItem value="500-1000">R$ 500 a R$ 1000</SelectItem>
                          <SelectItem value="1001-3000">R$ 1001 a R$ 3.000</SelectItem>
                          <SelectItem value="3001-10000">R$ 3001 a R$ 10.000</SelectItem>
                          <SelectItem value="10000+">R$ 10.000+</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.marketingBudget && (
                        <p className="text-xs text-red-400 sm:text-sm">
                          {formErrors.marketingBudget}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <Button
                        id="form-field-submit"
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-blue-600 py-5 text-base font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] disabled:cursor-not-allowed disabled:opacity-50 sm:py-6 sm:text-lg"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Formulário e Receber Proposta'}
                      </Button>
                      <p className="text-center text-xs text-gray-400 sm:text-sm">
                        Ao enviar, você concorda em receber contato da nossa equipe
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <section className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-center sm:mb-16"
            >
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Nossa Equipe
              </h2>
              <p className="mt-3 text-base text-gray-300 sm:mt-4 sm:text-lg">
                Conheça os profissionais dedicados que trabalham para transformar seu negócio
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeIn}
              className="mb-8 flex justify-center sm:mb-12"
            >
              <AnimatedTooltip items={team} />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="text-center"
            >
              <h3 className="mb-6 text-xl font-bold text-white sm:mb-8 sm:text-2xl">
                Foco total em resultados reais e mensuráveis
              </h3>
              <div className="flex flex-col flex-wrap justify-center gap-4 text-sm text-gray-300 sm:flex-row sm:gap-6 sm:text-base lg:gap-8">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                  <span>Equipe especializada</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                  <span>Atendimento próximo</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                  <span>Mais de 23 empresas atendidas</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="mt-8 text-center sm:mt-12"
            >
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
              >
                Saiba Mais
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/10 bg-black py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Divider */}

            {/* Copyright e Logo Final */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-center text-sm text-gray-400 sm:text-left">
                © {new Date().getFullYear()} BASIS Aceleradora. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="BASIS" width={24} height={24} className="h-6 w-6" />
                <span className="text-sm font-bold text-gray-400">Feito com 💙 pela BASIS</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
