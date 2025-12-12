# Google Tag Manager - Guia de Configuração

## ✅ Status da Implementação

### Configuração Técnica: COMPLETA

- ✅ GTM Container ID: `GTM-MCQ5KLGJ`
- ✅ Script instalado no `<head>` (carregamento assíncrono)
- ✅ Fallback `<noscript>` instalado no `<body>`
- ✅ Variável de ambiente configurada: `NEXT_PUBLIC_GTM_ID`
- ✅ Tracking de eventos implementado no código
- ✅ DataLayer configurado com tipos TypeScript

---

## 📊 Eventos Configurados

### 1. **Cliques nos CTAs**

- **Evento:** `button_click`
- **Categoria:** `Engagement`
- **Label:** `Scroll to Form CTA`
- **Trigger:** Quando usuário clica em qualquer botão "Preencher Formulário"

### 2. **Envio do Formulário**

- **Evento personalizado:** `form_submission`
- **Dados capturados:**
  ```javascript
  {
    event: 'form_submission',
    form_name: 'Lead Form',
    form_type: 'contact',
    user_email: 'email@example.com',
    user_company: 'Nome da Empresa',
    user_role: 'owner|manager|employee|autonomous',
    sales_volume: '1-5|6-10|11-30|31-50|50+',
    marketing_budget: '500-1000|1001-3000|3001-10000|10000+'
  }
  ```

### 3. **Função gtag legacy**

- **Evento:** `form_submit`
- **Categoria:** `Lead Generation`
- **Label:** `Lead Form - Landing Page`

---

## 🎯 Configuração Necessária no GTM (Interface Web)

### Passo 1: Criar Variáveis do DataLayer

No GTM, vá em **Variáveis → Nova → Variável de Camada de Dados**:

1. **user_email**
   - Nome: `DL - User Email`
   - Nome da Variável: `user_email`

2. **user_company**
   - Nome: `DL - User Company`
   - Nome da Variável: `user_company`

3. **user_role**
   - Nome: `DL - User Role`
   - Nome da Variável: `user_role`

4. **sales_volume**
   - Nome: `DL - Sales Volume`
   - Nome da Variável: `sales_volume`

5. **marketing_budget**
   - Nome: `DL - Marketing Budget`
   - Nome da Variável: `marketing_budget`

### Passo 2: Criar Acionadores (Triggers)

1. **Trigger: Envio de Formulário**
   - Tipo: `Evento Personalizado`
   - Nome do Evento: `form_submission`
   - Nome do Trigger: `Form - Lead Submission`

2. **Trigger: Clique em CTA**
   - Tipo: `Evento Personalizado`
   - Nome do Evento: `button_click`
   - Nome do Trigger: `Button - CTA Click`

### Passo 3: Criar Tags

#### Tag 1: Google Analytics - Lead Form Submission

```
Tipo: Google Analytics: GA4 Event
Nome: GA4 - Lead Form Submit
ID de Medição: [SEU G-XXXXXXX]

Parâmetros do Evento:
- form_name: {{DL - form_name}}
- user_company: {{DL - User Company}}
- user_role: {{DL - User Role}}
- sales_volume: {{DL - Sales Volume}}
- marketing_budget: {{DL - Marketing Budget}}

Acionamento: Form - Lead Submission
```

#### Tag 2: Facebook Pixel - Lead (Opcional)

```
Tipo: Facebook Pixel
Nome: FB - Lead Event
ID do Pixel: [SEU PIXEL ID]
Evento: Lead

Parâmetros:
- content_name: Lead Form Submission
- value: {{DL - Marketing Budget}}

Acionamento: Form - Lead Submission
```

#### Tag 3: Google Ads Conversion (Opcional)

```
Tipo: Google Ads Conversion Tracking
Nome: Google Ads - Lead Conversion
ID de Conversão: [SEU ID]
Label de Conversão: [SEU LABEL]

Acionamento: Form - Lead Submission
```

---

## 🧪 Como Testar

### 1. Modo Preview do GTM

1. Acesse seu container no GTM
2. Clique em **Visualizar** (Preview)
3. Digite a URL do site: `http://localhost:3001` ou `https://basisaceleradora.com.br`
4. Navegue pelo site e clique nos CTAs
5. Preencha e envie o formulário
6. Verifique no painel de debug se os eventos foram disparados

### 2. Google Tag Assistant

1. Instale a extensão [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Acesse o site
3. Clique no ícone da extensão
4. Verifique se o GTM está presente e funcionando

### 3. Console do Navegador

```javascript
// Verificar se GTM está carregado
console.log(window.dataLayer)

// Ver todos os eventos
window.dataLayer.forEach((item) => console.log(item))
```

---

## 📈 Eventos Disponíveis para Rastreamento

### Já Implementados:

- ✅ Clique em botões CTA
- ✅ Envio de formulário com dados do lead

### Sugestões para Implementar Futuramente:

- 📺 Clique no vídeo (play/pause/unmute)
- 📜 Scroll depth (25%, 50%, 75%, 100%)
- ⏱️ Tempo na página
- 🖱️ Clique em logos de clientes
- 📱 Clique em telefone/WhatsApp
- 📧 Clique em email

---

## 🔗 Integrações Recomendadas

### Google Analytics 4 (GA4)

- Eventos personalizados de lead
- Métricas de engajamento
- Funil de conversão

### Facebook Pixel

- Evento de Lead
- Público personalizado de conversão
- Otimização de campanhas

### Google Ads

- Conversões de lead
- Remarketing
- Otimização de lances

### LinkedIn Insight Tag

- Conversões B2B
- Público matched

---

## 📝 Checklist de Produção

Antes de ir para produção, verifique:

- [ ] GTM container publicado e ativo
- [ ] Todas as variáveis do DataLayer criadas
- [ ] Triggers configurados corretamente
- [ ] Tags de conversão ativas (GA4, Ads, Facebook)
- [ ] Modo Preview testado e funcionando
- [ ] Eventos aparecendo no DebugView do GA4
- [ ] Política de privacidade atualizada com cookies do GTM
- [ ] Consentimento de cookies implementado (LGPD)

---

## 🚨 Resolução de Problemas

### GTM não está carregando

1. Verifique se o ID está correto no `.env`
2. Confirme que a variável está com o prefixo `NEXT_PUBLIC_`
3. Reinicie o servidor Next.js após mudar o `.env`

### Eventos não aparecem no GTM

1. Abra o console e procure por erros
2. Verifique se `window.dataLayer` existe
3. Confirme que o evento está sendo disparado no código

### Conversões não rastreiam no Google Ads

1. Verifique se a tag de conversão está ativa no GTM
2. Confirme que o ID e Label de conversão estão corretos
3. Aguarde até 24h para aparecer no Google Ads

---

## 📚 Recursos Úteis

- [Documentação GTM](https://support.google.com/tagmanager)
- [DataLayer Reference](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GTM Best Practices](https://developers.google.com/tag-platform/tag-manager/web)

---

**Última atualização:** 11 de dezembro de 2025
**Status:** ✅ Implementação Completa - Pronto para configurar no painel do GTM
