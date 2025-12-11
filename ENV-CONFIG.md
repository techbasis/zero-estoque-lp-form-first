# ✅ Atualização: Variáveis de Ambiente Configuradas

## 🎯 Resumo

Todos os valores fixos foram substituídos por variáveis de ambiente, tornando o sistema mais flexível e seguro.

---

## 📝 Arquivos Atualizados

### 1. **`lib/schema.ts`**

Agora usa variáveis de ambiente para:

- ✅ `NEXT_PUBLIC_SITE_URL` - URL base do site
- ✅ `NEXT_PUBLIC_PHONE` - Telefone da empresa
- ✅ `NEXT_PUBLIC_CITY` - Cidade
- ✅ `NEXT_PUBLIC_STATE` - Estado

### 2. **`app/layout.tsx`**

Agora usa variáveis de ambiente para:

- ✅ `NEXT_PUBLIC_SITE_URL` - metadataBase e Open Graph URL
- ✅ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - Código de verificação do Google

### 3. **`app/sitemap.ts`**

Agora usa:

- ✅ `NEXT_PUBLIC_SITE_URL` - URL base no sitemap

### 4. **`app/robots.ts`** (NOVO - criado dinamicamente)

Substituí o `public/robots.txt` estático por um arquivo TypeScript dinâmico que usa:

- ✅ `NEXT_PUBLIC_SITE_URL` - URL do sitemap

### 5. **`app/api/rdstation/route.ts`**

Agora usa variáveis de ambiente para:

- ✅ `RD_STATION_API_KEY` - Chave da API do RD Station Marketing
- ✅ `RD_STATION_CRM_TOKEN` - Token do CRM/PlugCRM
- ✅ `RD_STATION_MARKETING_URL` - URL base da API Marketing
- ✅ `RD_STATION_CRM_URL` - URL base da API CRM

---

## 🔧 Variáveis de Ambiente Disponíveis

### No arquivo `.env` e `.env.example`:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=seu-codigo-aqui

# RD Station Marketing & CRM
RD_STATION_API_KEY=sua-api-key-aqui
RD_STATION_CRM_TOKEN=seu-crm-token-aqui
RD_STATION_MARKETING_URL=https://api.rd.services/platform/conversions
RD_STATION_CRM_URL=https://plugcrm.net/api/v1/deals

# Base URL do site (para SEO)
NEXT_PUBLIC_SITE_URL=https://basisaceleradora.com.br

# Informações da Empresa (para Schema.org)
NEXT_PUBLIC_PHONE=+55-XX-XXXX-XXXX
NEXT_PUBLIC_CITY=Salvador
NEXT_PUBLIC_STATE=BA
NEXT_PUBLIC_LATITUDE=-23.550520
NEXT_PUBLIC_LONGITUDE=-46.633308

# Facebook Pixel (opcional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=


```

---

## ✅ Benefícios

1. **Flexibilidade**: Fácil mudança de configurações sem alterar código
2. **Segurança**: Dados sensíveis não ficam hardcoded
3. **Ambientes**: Diferentes configs para dev/staging/prod
4. **Manutenção**: Centralização de configurações

---

## 📋 Próximos Passos

1. Atualize o arquivo `.env` com os valores reais:
   - Telefone da empresa
   - Cidade e estado corretos
   - Coordenadas GPS reais (use Google Maps)
   - Código de verificação do Google Search Console

2. Para desenvolvimento local, crie um `.env.local`:

   ```bash
   cp .env .env.local
   ```

3. No Vercel/hosting, adicione as variáveis no painel de configuração

---

## 🧪 Testando

Para verificar se as variáveis estão funcionando:

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

Acesse:

- `/sitemap.xml` - deve mostrar a URL correta
- `/robots.txt` - deve mostrar a URL do sitemap correta

---

**✅ Todas as configurações agora são gerenciadas por variáveis de ambiente!**

_Atualizado em: 11 de dezembro de 2025_
