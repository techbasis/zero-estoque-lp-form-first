import { NextResponse } from 'next/server'

// Interface para os dados do formulário recebidos pelo frontend
interface FormData {
  name: string
  email: string
  phone: string
  instagram?: string
  company: string
  role: string
  salesVolume: string
  marketingBudget: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

// Interface para a resposta da API
interface ApiResponse {
  success: boolean
  message: string
  error?: string
}

/**
 * Envia os dados do formulário para o webhook do n8n
 */
async function sendToN8nWebhook(formData: FormData): Promise<ApiResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL não configurada no ambiente')
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    console.log('📤 Webhook n8n - Status:', response.status)
    console.log('📤 Webhook n8n - URL:', webhookUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Webhook retornou erro:', errorText)
      throw new Error(`Webhook retornou status ${response.status}: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('✅ Resposta do n8n:', responseData)

    return {
      success: true,
      message: 'Dados enviados com sucesso para o n8n',
    }
  } catch (error) {
    console.error('❌ Erro ao enviar para n8n webhook:', error)
    throw error
  }
}

/**
 * POST /api/rdstation
 * Recebe os dados do formulário e envia para o webhook do n8n
 */
export async function POST(request: Request) {
  try {
    // Valida se a URL do webhook está configurada
    if (!process.env.N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL não configurada')
      return NextResponse.json(
        {
          success: false,
          message: 'Configuração do webhook não encontrada',
          error: 'N8N_WEBHOOK_URL não configurada no ambiente',
        } as ApiResponse,
        { status: 500 }
      )
    }

    // Parse do body da requisição
    const body: FormData = await request.json()

    console.log('📥 Dados recebidos do formulário:', JSON.stringify(body, null, 2))

    // Validação básica dos campos obrigatórios
    if (!body.name || !body.email || !body.phone || !body.company || !body.role) {
      console.error('❌ Validação falhou - campos obrigatórios faltando')
      return NextResponse.json(
        {
          success: false,
          message: 'Campos obrigatórios não preenchidos',
          error: 'name, email, phone, company e role são obrigatórios',
        } as ApiResponse,
        { status: 400 }
      )
    }

    // Envia para o webhook do n8n
    const result = await sendToN8nWebhook(body)

    console.log('✅ Formulário enviado com sucesso para n8n')

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('❌ Erro no processamento da requisição:', error)
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar requisição',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      } as ApiResponse,
      { status: 500 }
    )
  }
}
