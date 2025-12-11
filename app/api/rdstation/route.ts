import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    const RD_STATION_API_KEY = process.env.RD_STATION_API_KEY
    const RD_STATION_CRM_TOKEN = process.env.RD_STATION_CRM_TOKEN
    const RD_STATION_MARKETING_BASE_URL = process.env.RD_STATION_MARKETING_URL
    const RD_STATION_CRM_URL = process.env.RD_STATION_CRM_URL

    if (
      !RD_STATION_API_KEY ||
      !RD_STATION_CRM_TOKEN ||
      !RD_STATION_MARKETING_BASE_URL ||
      !RD_STATION_CRM_URL
    ) {
      console.error('[v0] Missing RD Station credentials')
      return NextResponse.json(
        { success: false, message: 'Configuração de RD Station incompleta' },
        { status: 500 }
      )
    }

    const RD_STATION_MARKETING_URL = `${RD_STATION_MARKETING_BASE_URL}?api_key=${RD_STATION_API_KEY}`

    // Marketing conversion payload
    const marketingPayload = {
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

    const crmPayload = {
      name: `${formData.name} - ${formData.company}`,
      deal_stage_id: 'Lead frio',
      contacts: [
        {
          name: formData.name,
          email: formData.email,
          phones: [
            {
              phone: formData.phone,
            },
          ],
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

    console.log(
      '[v0] Sending data to RD Station Marketing:',
      JSON.stringify(marketingPayload, null, 2)
    )

    // Send to RD Station Marketing
    const marketingResponse = await fetch(RD_STATION_MARKETING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marketingPayload),
    })

    const marketingResponseText = await marketingResponse.text()
    console.log('[v0] RD Station Marketing response status:', marketingResponse.status)
    console.log('[v0] RD Station Marketing response body:', marketingResponseText)

    if (!marketingResponse.ok) {
      console.error('[v0] RD Station Marketing API error - Status:', marketingResponse.status)
      console.error('[v0] RD Station Marketing API error - Body:', marketingResponseText)

      let errorMessage = 'Erro ao enviar para RD Station Marketing'
      try {
        const errorData = JSON.parse(marketingResponseText)
        errorMessage = errorData.errors?.[0]?.error_message || errorData.message || errorMessage
      } catch (e) {
        errorMessage = marketingResponseText || errorMessage
      }

      return NextResponse.json(
        { success: false, message: `Erro Marketing: ${errorMessage}` },
        { status: marketingResponse.status }
      )
    }

    console.log('[v0] Sending data to RD Station CRM:', JSON.stringify(crmPayload, null, 2))

    const crmResponse = await fetch(RD_STATION_CRM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RD_STATION_CRM_TOKEN}`,
      },
      body: JSON.stringify(crmPayload),
    })

    const crmResponseText = await crmResponse.text()
    console.log('[v0] RD Station CRM response status:', crmResponse.status)
    console.log('[v0] RD Station CRM response body:', crmResponseText)

    if (!crmResponse.ok) {
      console.error('[v0] RD Station CRM API error - Status:', crmResponse.status)
      console.error('[v0] RD Station CRM API error - Body:', crmResponseText)

      let errorMessage = 'Erro ao criar deal no CRM'
      try {
        const errorData = JSON.parse(crmResponseText)
        errorMessage = errorData.errors?.[0]?.error_message || errorData.message || errorMessage
      } catch (e) {
        errorMessage = crmResponseText || errorMessage
      }

      // Don't fail the whole request if CRM fails, just log it
      console.error('[v0] CRM integration failed but Marketing succeeded:', errorMessage)
      return NextResponse.json({
        success: true,
        message:
          'Lead enviado para Marketing. Erro ao criar deal no CRM. Verifique o token e stage ID.',
      })
    }

    console.log('[v0] Both Marketing and CRM integrations successful')

    return NextResponse.json({
      success: true,
      message: 'Lead enviado com sucesso para RD Station Marketing e CRM!',
    })
  } catch (error) {
    console.error('[v0] Error sending to RD Station:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { success: false, message: `Erro ao enviar formulário: ${errorMessage}` },
      { status: 500 }
    )
  }
}
