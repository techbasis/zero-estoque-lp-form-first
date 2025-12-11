import { NextResponse } from 'next/server'

// Types
interface FormData {
  name: string
  email: string
  phone: string
  company: string
  role: string
  salesVolume: string
  marketingBudget: string
}

interface RDStationConfig {
  apiKey: string
  crmToken: string
  marketingUrl: string
  crmUrl: string
}

interface ApiResponse {
  success: boolean
  message: string
  marketingSuccess?: boolean
  crmSuccess?: boolean
  crmError?: string
}

// Helpers
function validateEnvironmentVariables(): RDStationConfig | null {
  const config = {
    apiKey: process.env.RD_STATION_API_KEY,
    crmToken: process.env.RD_STATION_CRM_TOKEN,
    marketingUrl: process.env.RD_STATION_MARKETING_URL,
    crmUrl: process.env.RD_STATION_CRM_URL,
  }

  if (!config.apiKey || !config.crmToken || !config.marketingUrl || !config.crmUrl) {
    console.error('[BASIS] ❌ Credenciais incompletas:', {
      hasApiKey: !!config.apiKey,
      hasCrmToken: !!config.crmToken,
      hasMarketingUrl: !!config.marketingUrl,
      hasCrmUrl: !!config.crmUrl,
    })
    return null
  }

  return config as RDStationConfig
}

function buildMarketingPayload(formData: FormData) {
  return {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload: {
      conversion_identifier: 'landing-page-basis-formulario',
      email: formData.email,
      name: formData.name,
      mobile_phone: formData.phone,
      tags: ['Leads Frios'],
      cf_company: formData.company,
      cf_role: formData.role,
      cf_sales_volume: formData.salesVolume,
      cf_marketing_budget: formData.marketingBudget,
    },
  }
}

function buildCRMPayload(formData: FormData) {
  return {
    name: `${formData.name} - ${formData.company}`,
    deal_stage_id: 'Lead frio',
    contacts: [
      {
        name: formData.name,
        email: formData.email,
        phones: [{ phone: formData.phone }],
      },
    ],
    organization: {
      name: formData.company,
    },
    custom_fields: {
      cargo: formData.role,
      volume_vendas: formData.salesVolume,
      orcamento_marketing: formData.marketingBudget,
    },
  }
}

async function sendToRDStationMarketing(
  url: string,
  apiKey: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const marketingUrl = `${url}?api_key=${apiKey}`
    const payload = buildMarketingPayload(formData)

    console.log('[BASIS] 📤 Enviando para RD Station Marketing...')

    const response = await fetch(marketingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
    })

    const responseText = await response.text()
    console.log('[BASIS] Marketing Status:', response.status)

    if (!response.ok) {
      console.error('[BASIS] ❌ Erro Marketing:', responseText)
      let errorMessage = 'Erro ao enviar para RD Station Marketing'

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.errors?.[0]?.error_message || errorData.message || errorMessage
      } catch {
        errorMessage = responseText || errorMessage
      }

      return { success: false, error: errorMessage }
    }

    console.log('[BASIS] ✅ Marketing enviado com sucesso!')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no Marketing'
    console.error('[BASIS] ❌ Exceção Marketing:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

async function sendToRDStationCRM(
  url: string,
  token: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = buildCRMPayload(formData)

    console.log('[BASIS] 📤 Enviando para RD Station CRM...')
    console.log('[BASIS] CRM URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      redirect: 'manual', // Não seguir redirecionamentos
      signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
    })

    console.log('[BASIS] CRM Status:', response.status)

    // Detectar redirecionamentos
    if (response.status >= 300 && response.status < 400) {
      const redirectLocation = response.headers.get('location')
      console.error('[BASIS] ❌ CRM redirecionamento detectado:', redirectLocation)
      return {
        success: false,
        error: `URL inválida - redirecionamento para: ${redirectLocation}`,
      }
    }

    const responseText = await response.text()

    if (!response.ok) {
      console.error('[BASIS] ❌ Erro CRM:', responseText)
      let errorMessage = 'Erro ao criar deal no CRM'

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.errors?.[0]?.error_message || errorData.message || errorMessage
      } catch {
        errorMessage = responseText || errorMessage
      }

      return { success: false, error: errorMessage }
    }

    console.log('[BASIS] ✅ CRM enviado com sucesso!')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no CRM'
    console.error('[BASIS] ❌ Exceção CRM:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Main Handler
export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse e valida dados do formulário
    const formData: FormData = await request.json()
    console.log('[BASIS] 📥 Formulário recebido:', { email: formData.email, name: formData.name })

    // Valida variáveis de ambiente
    const config = validateEnvironmentVariables()
    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: 'Configuração do servidor incompleta. Entre em contato com o suporte.',
        },
        { status: 500 }
      )
    }

    // Envia para RD Station Marketing (crítico)
    const marketingResult = await sendToRDStationMarketing(
      config.marketingUrl,
      config.apiKey,
      formData
    )

    if (!marketingResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao enviar lead: ${marketingResult.error}`,
        },
        { status: 500 }
      )
    }

    // Envia para RD Station CRM (não-crítico)
    const crmResult = await sendToRDStationCRM(config.crmUrl, config.crmToken, formData)

    if (!crmResult.success) {
      // Marketing funcionou, mas CRM falhou - ainda é um sucesso parcial
      console.warn('[BASIS] ⚠️ CRM falhou, mas Marketing funcionou')
      return NextResponse.json({
        success: true,
        message: 'Lead enviado com sucesso! (Aviso: CRM não sincronizado)',
        marketingSuccess: true,
        crmSuccess: false,
        crmError: crmResult.error,
      })
    }

    // Sucesso completo
    console.log('[BASIS] 🎉 Lead enviado com sucesso para Marketing e CRM!')
    return NextResponse.json({
      success: true,
      message: 'Lead enviado com sucesso para RD Station!',
      marketingSuccess: true,
      crmSuccess: true,
    })
  } catch (error) {
    console.error('[BASIS] ❌ ERRO FATAL:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

    return NextResponse.json(
      {
        success: false,
        message: `Erro ao processar solicitação: ${errorMessage}`,
      },
      { status: 500 }
    )
  }
}
