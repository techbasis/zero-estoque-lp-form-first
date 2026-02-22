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
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

// Schema de validação com Zod
const formSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome não pode conter caracteres especiais ou números'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
  instagram: z.string().optional(),
  company: z
    .string()
    .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s]+$/,
      'Nome da empresa não pode conter caracteres especiais (apenas letras, números e espaços)'
    ),
  role: z.string().min(1, 'Selecione um cargo'),
  salesVolume: z.string().min(1, 'Selecione o volume de vendas'),
  marketingBudget: z.string().min(1, 'Selecione o investimento em marketing'),
  // UTM parameters (opcionais)
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
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
    title: 'Anúncios que atraem comprador (não curioso)',
    description:
      'Criativos focados em estoque e oferta. Você recebe leads com intenção real de compra.',
  },
  {
    icon: TrendingUp,
    title: 'Tráfego focado em giro de estoque',
    description:
      'Seu investimento vai para os carros que precisam sair. Segmentação por região e momento de compra.',
  },
  {
    icon: Award,
    title: 'Atendimento com roteiro e follow-up pra fechar',
    description:
      'Processo simples pra transformar lead em visita, proposta e venda. Sem “atender por atender”.',
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
    instagram: '',
    company: '',
    role: '',
    salesVolume: '',
    marketingBudget: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [selectedRole, setSelectedRole] = useState('')
  const [showUnmuteButton, setShowUnmuteButton] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Função para validar campo individual
  const validateField = (fieldName: keyof FormData, value: string | undefined) => {
    try {
      const fieldSchema = formSchema.shape[fieldName]
      fieldSchema.parse(value)
      // Se passou, remove o erro desse campo
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors((prev) => ({
          ...prev,
          [fieldName]: error.errors[0]?.message || 'Erro de validação',
        }))
      }
    }
  }

  // Valida o formulário completo toda vez que formData muda
  useEffect(() => {
    try {
      formSchema.parse(formData)
      setIsFormValid(true)
    } catch (error) {
      setIsFormValid(false)
    }
  }, [formData])

  // Captura UTM parameters da URL quando o componente monta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const utmCampaign = searchParams.get('utm_campaign') || ''
      const utmContent = searchParams.get('utm_content') || ''
      const utmTerm = searchParams.get('utm_term') || ''

      // Atualiza o formData com os UTM params se existirem
      if (utmCampaign || utmContent || utmTerm) {
        setFormData((prev) => ({
          ...prev,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
        }))
      }
    }
  }, [])

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
        toast.error('Por favor, preencha todos os campos obrigatórios corretamente.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      // sanitize phone: remove any non-digit characters and trim
      const sanitizedPhone = (formData.phone || '').replace(/\D/g, '').trim()

      // build payload to send (use sanitized phone)
      const payload = { ...formData, phone: sanitizedPhone }

      const response = await fetch('/api/rdstation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        // Track successful form submission
        gtag.trackFormSubmit('Lead Form - Landing Page')

        // Push to dataLayer for GTM (use sanitized phone)
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'form_submission',
            form_name: 'Lead Form',
            form_type: 'contact',
            user_email: payload.email,
            user_phone: payload.phone,
            user_company: payload.company,
            user_role: payload.role,
            sales_volume: payload.salesVolume,
            marketing_budget: payload.marketingBudget,
            instagram: payload.instagram,
            utm_campaign: payload.utm_campaign,
            utm_content: payload.utm_content,
            utm_term: payload.utm_term,
          })
        }

        setSubmitStatus('success')

        toast.success(
          '✅ Formulário enviado com sucesso! Nossa equipe entrará em contato em breve.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        )

        // Preserve UTM params on reset
        const preservedUtmParams = {
          utm_campaign: formData.utm_campaign,
          utm_content: formData.utm_content,
          utm_term: formData.utm_term,
        }

        // Reset form but keep UTM params
        setFormData({
          name: '',
          email: '',
          phone: '',
          instagram: '',
          company: '',
          role: '',
          salesVolume: '',
          marketingBudget: '',
          ...preservedUtmParams,
        })
        setSelectedRole('')
        setFormErrors({})
      } else {
        setSubmitStatus('error')
        toast.error(`❌ ${result.message || 'Erro ao enviar formulário. Tente novamente.'}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error('[v0] Form submission error:', error)
      setSubmitStatus('error')
      toast.error('❌ Erro ao enviar formulário. Verifique sua conexão e tente novamente.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
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
              quality={85}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
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
                  Carro parado custa caro.
                  <span className="text-blue-500"> Vamos vender.</span>{' '}
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
                  Aceleradora comercial automotiva: anúncios + tráfego + atendimento para tirar
                  carro do pátio e aumentar o seu giro.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="mt-4 grid gap-2 text-sm text-gray-200 sm:mt-5 sm:text-base"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                    <span>Leads com intenção (anti-curiosos)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                    <span>Campanhas focadas nos carros certos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                    <span>Roteiro + follow-up para fechar</span>
                  </div>
                </motion.div>
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
                      QUERO UM DIAGNÓSTICO
                    </Button>
                    <p className="text-center text-xs text-gray-400 sm:text-sm">
                      Fale com um especialista. Sem robô e sem compromisso.
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
                  Estoque girando.
                  <span className="text-blue-500"> Venda todo mês.</span>
                </h2>
                <p className="mt-4 text-base leading-7 text-pretty text-gray-300 sm:mt-6 sm:text-lg sm:leading-8">
                  Somos especialistas em lojas de veículos. O foco é simples:{' '}
                  <span className="font-bold text-blue-500 sm:text-xl">carro vendido</span> — com
                  funil completo e rotina comercial.
                </p>
                <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Funil completo de vendas
                      </span>{' '}
                      Do anúncio ao fechamento: campanha + atendimento + follow-up.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Especialistas em lojas de veículos
                      </span>{' '}
                      Estratégia feita pra estoque, margem e rotina de loja (não é “qualquer
                      nicho”).
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500 sm:h-6 sm:w-6" />
                    <span className="text-sm text-white sm:text-base">
                      <span
                        className="font-bold"
                        style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}
                      >
                        Metodologia Zera Estoque comprovada
                      </span>{' '}
                      Criativos anti-curiosos + tráfego focado + processo de vendas.
                    </span>
                  </div>
                </div>
                <motion.div variants={fadeInUp} className="mt-6 sm:mt-8">
                  <Button
                    onClick={scrollToForm}
                    size="lg"
                    className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
                  >
                    Quero meu diagnóstico
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
                Do anúncio ao fechamento: tudo pensado pra vender mais.
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
                Objetivo: mais carros saindo do pátio todo mês.
              </p>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full bg-blue-600 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] sm:w-auto"
              >
                Quero meu diagnóstico
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
                Quero meu diagnóstico
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
                Receba um plano para girar seu estoque
              </h2>
              <p className="mb-6 text-base text-gray-300 sm:mb-8 sm:text-lg">
                Preencha e fale com um especialista. Vamos te dizer o que ajustar para vender mais.
              </p>
            </div>

            {/* Formulário sempre visível */}
            <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
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
                              const newValue = e.target.value
                              setFormData({ ...formData, name: newValue })
                              validateField('name', newValue)
                            }}
                            onBlur={() => validateField('name', formData.name)}
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
                              const newValue = e.target.value
                              setFormData({ ...formData, email: newValue })
                              validateField('email', newValue)
                            }}
                            onBlur={() => validateField('email', formData.email)}
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
                              const newValue = e.target.value
                              setFormData({ ...formData, phone: newValue })
                              validateField('phone', newValue)
                            }}
                            onBlur={() => validateField('phone', formData.phone)}
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
                            htmlFor="form-field-instagram"
                            className="text-sm font-medium text-white sm:text-base"
                          >
                            Instagram
                          </Label>
                          <Input
                            id="form-field-instagram"
                            placeholder="@instagram_comercial"
                            value={formData.instagram}
                            onChange={(e) => {
                              setFormData({ ...formData, instagram: e.target.value })
                              if (formErrors.instagram) {
                                setFormErrors({ ...formErrors, instagram: undefined })
                              }
                            }}
                            className="h-11 border-white/10 bg-black/50 text-white transition-all placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 sm:h-12"
                          />
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
                              const newValue = e.target.value
                              setFormData({ ...formData, company: newValue })
                              validateField('company', newValue)
                            }}
                            onBlur={() => validateField('company', formData.company)}
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
                                const newValue = e.target.value
                                setSelectedRole(newValue)
                                setFormData({ ...formData, role: newValue })
                                validateField('role', newValue)
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
                          validateField('salesVolume', value)
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
                          validateField('marketingBudget', value)
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
                        disabled={isSubmitting || !isFormValid}
                        className="w-full rounded-xl bg-blue-600 py-5 text-base font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] disabled:cursor-not-allowed disabled:opacity-50 sm:py-6 sm:text-lg"
                      >
                        {isSubmitting
                          ? 'Enviando...'
                          : !isFormValid
                            ? 'Preencha os campos obrigatórios'
                            : 'Quero meu diagnóstico'}
                      </Button>
                      <p className="text-center text-xs text-gray-400 sm:text-sm">
                        Contato direto. Sem robô. Sem spam.
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
                Time automotivo com foco em vendas e ROI
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
                Foco total em resultado no estoque
              </h3>
              <div className="flex flex-col flex-wrap justify-center gap-4 text-sm text-gray-300 sm:flex-row sm:gap-6 sm:text-base lg:gap-8">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                  <span>Equipe especializada</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
                  <span>Atendimento próximo</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
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
                Quero meu diagnóstico
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
