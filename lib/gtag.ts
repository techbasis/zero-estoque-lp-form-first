// Google Analytics / Tag Manager Configuration
// Adicione este arquivo para facilitar futuras integrações

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Página visualizada
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Evento personalizado
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos para o site
export const trackFormSubmit = (formName: string) => {
  event({
    action: 'form_submit',
    category: 'Lead Generation',
    label: formName,
  })
}

export const trackButtonClick = (buttonName: string) => {
  event({
    action: 'button_click',
    category: 'Engagement',
    label: buttonName,
  })
}

export const trackVideoPlay = (videoName: string) => {
  event({
    action: 'video_play',
    category: 'Media',
    label: videoName,
  })
}

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}
