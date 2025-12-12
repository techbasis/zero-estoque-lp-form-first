# Configuração RD Station CRM - Documentação

## 🎯 Resumo da Integração

Este documento contém todas as configurações e IDs necessários para a integração com o RD Station CRM.

---

## 📋 Variáveis de Ambiente

```env
RD_STATION_API_KEY=dpyDuCGeFFMKFhWiTaWLHtnnAlAgqsQFDjjo
RD_STATION_CRM_TOKEN=690109d5249811001dbb0f73
RD_STATION_MARKETING_URL=https://api.rd.services/platform/conversions
RD_STATION_CRM_URL=https://crm.rdstation.com/api/v1/deals
RD_STATION_DEAL_STAGE_ID=68dad41cb729e400141e604e
```

---

## 🔄 Stages do Funil (Deal Stages)

| Ordem | Nome                     | ID                         | Nickname |
| ----- | ------------------------ | -------------------------- | -------- |
| 1     | **Lead frio**            | `68dad41cb729e400141e604e` | LF       |
| 2     | Em contato               | `68dad41cb729e400141e604f` | EC       |
| 3     | Agendado Reunião         | `68dad41cb729e400141e6050` | AR       |
| 4     | Enviado Proposta         | `68dad41cb729e400141e6051` | EP       |
| 5     | Assinado                 | `68dad41cb729e400141e6052` | A        |
| 6     | Noshow                   | `68e5547c0b6726001f19db26` | N        |
| 7     | Não respondeu            | `68e554980b6726001f19db54` | NR       |
| 8     | Contrato perdido         | `68e55884a0e4cf00147d0774` | CP       |
| 9     | Lead sem interesse       | `68e68716b9255e0014a27362` | LSI      |
| 10    | Contrato perdido antigos | `68e7ed351f8c930017c442af` | CPA      |
| 11    | Curioso                  | `68e9c0c69454bd0018629903` | C        |

**Funil:** Funil Padrão (ID: `68dad41cb729e400141e604c`)

---

## 📤 Estrutura do Payload (CRM)

```json
{
  "deal": {
    "name": "Nome do Lead - Nome da Empresa",
    "deal_stage_id": "68dad41cb729e400141e604e"
  },
  "contacts": [
    {
      "name": "Nome do Lead",
      "emails": [
        {
          "email": "email@example.com"
        }
      ],
      "phones": [
        {
          "phone": "+55-71-99999-9999"
        }
      ]
    }
  ],
  "organization": {
    "name": "Nome da Empresa"
  }
}
```

**⚠️ IMPORTANTE:** O campo `email` deve estar dentro de um array `emails` como objeto `{"email": "..."}`, não diretamente no contato!

---

## 🔑 Autenticação

A autenticação é feita via **query parameter** na URL:

```
https://crm.rdstation.com/api/v1/deals?token=690109d5249811001dbb0f73
```

**NÃO** usar `Authorization: Bearer` header!

---

## ✅ Endpoints da API

### Criar Deal (POST)

```
POST https://crm.rdstation.com/api/v1/deals?token={TOKEN}
```

### Listar Stages (GET)

```
GET https://crm.rdstation.com/api/v1/deal_stages?token={TOKEN}
```

### Verificar Token (GET)

```
GET https://crm.rdstation.com/api/v1/token/check?token={TOKEN}
```

---

## 🐛 Troubleshooting

### Erro 422 (Unprocessable Entity)

- ✅ Verificar se o `deal_stage_id` é um ID válido (não pode ser texto)
- ✅ Verificar se a estrutura do payload está correta (objeto `deal` envolvendo os dados)
- ✅ Verificar se o token está sendo enviado como query parameter

### Erro 301 (Moved Permanently)

- ✅ Verificar se a URL está correta (usar `crm.rdstation.com`, não `plugcrm.net`)
- ✅ Usar `redirect: 'manual'` no fetch para detectar redirecionamentos

### Erro 401 (Unauthorized)

- ✅ Verificar se o token está correto
- ✅ Verificar se o token não expirou
- ✅ Verificar se o token está sendo enviado na URL

---

## 📚 Documentação Oficial

- [Create Deal](https://developers.rdstation.com/reference/crm-v1-create-deal)
- [Deal Stages](https://developers.rdstation.com/reference/crm-v1-deal-stages)
- [Authentication](https://developers.rdstation.com/reference/crm-v1-token)

---

## 🔄 Fluxo de Integração

1. **Formulário preenchido** → Dados enviados para `/api/rdstation`
2. **RD Station Marketing** → Lead criado com tag "Leads Frios"
3. **RD Station CRM** → Deal criado no stage "Lead frio"
4. **Resposta ao usuário** → Mensagem de sucesso ou erro

---

## ⚙️ Configuração Atual

- ✅ Token validado
- ✅ Stage ID configurado
- ✅ Payload estruturado corretamente
- ✅ Autenticação via query parameter
- ✅ Logs detalhados habilitados

**Última atualização:** 11 de dezembro de 2025
