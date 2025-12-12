// Type definitions for Google Tag Manager dataLayer
export {}

declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>
    gtag: (...args: any[]) => void
  }
}
