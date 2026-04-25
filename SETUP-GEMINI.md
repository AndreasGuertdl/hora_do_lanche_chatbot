# 🚀 Configuração Gemini API - Hora do Lanche

Este guia mostra como configurar e usar o Google Gemini API para potencializar seu chatbot com uma IA real.

## 📋 Requisitos

- Node.js 14+
- npm ou yarn
- Conta Google com acesso ao Google AI Studio

## 🔑 Passo 1: Obter sua API Key do Gemini

### 1. Acesse o Google AI Studio
- Vá para [https://ai.google.dev](https://ai.google.dev)
- Clique em "Get API Key" no canto superior direito

### 2. Selecione ou Crie um Projeto Google Cloud
- Se tiver um projeto existente, selecione-o
- Caso contrário, clique em "Criar novo projeto"

### 3. Gere uma Chave de API
- Clique em "Gerar API Key"
- Uma chave será exibida (exemplo: `AIza...`)
- **Copie e armazene em um lugar seguro**

⚠️ **SEGURANÇA**: Nunca compartilhe sua API Key publicamente!

---

## 💻 Passo 2: Configurar o Servidor Local

### Instalação de Dependências

```bash
# Navegue até o diretório do projeto
cd /caminho/para/hora_do_lanche_chatbot

# Instale as dependências
npm install
```

### Dependências Principais
- **express**: Servidor web
- **cors**: Permitir requisições cross-origin
- **@google/generative-ai**: SDK do Gemini
- **dotenv**: Gerenciamento de variáveis de ambiente

---

## 🌐 Passo 3: Iniciar o Servidor

```bash
# Modo de desenvolvimento
npm start

# Saída esperada:
# ╔═══════════════════════════════════════════════════════╗
# ║  🍔 Hora do Lanche - Integração Gemini API            ║
# ╚═══════════════════════════════════════════════════════╝
#
# ✅ Servidor iniciado com sucesso!
# 📍 URL: http://localhost:3000
```

### Alternativa com Nodemon (Auto-reload)
```bash
npm install -g nodemon
npm run dev
```

---

## 🎨 Passo 4: Configurar a API Key no Chat

### No Navegador

1. **Abra a aplicação**
   - Acesse [http://localhost:3000](http://localhost:3000)

2. **Clique no ícone de Configurações** ⚙️
   - Localizado no canto superior direito do header

3. **Cole sua API Key**
   - No campo "Chave de API do Gemini"
   - Clique em "Salvar Chave"

4. **Verifique a Conexão**
   - Status deve mudar para "Conectado"
   - Modo deve mudar para "Gemini API"

### ✅ Confirmação
- Verde ✅: API Key salva com sucesso
- Laranja ⚠️: Desconectado (modo padrão)
- Vermelho ❌: Erro na conexão

---

## 🤖 Como Funciona

### Fluxo de Requisição

```
Usuário digita mensagem
         ↓
Chat.js envia para /api/chat
         ↓
Server.js processa com Gemini
         ↓
Gemini retorna resposta IA
         ↓
Resposta exibida no chat
```

### Contexto Enviado para Gemini

```javascript
{
  message: "Quero um lanche vegetariano",
  apiKey: "sua-chave-aqui",
  context: {
    menu: [...],
    orders: [...],
    preferences: {...}
  }
}
```

### Melhorias com Gemini API

| Funcionalidade | Padrão | Gemini |
|---|---|---|
| Compreensão | Pattern matching | NLP avançado |
| Recomendações | Baseadas em keywords | Conversação natural |
| Contextualização | Limitada | Completa |
| Criatividade | Respostas fixas | Únicas e fluidas |
| Idioma | Português básico | Português natural |

---

## 🛡️ Segurança e Privacidade

### ✅ O Que NÃO Fazemos

- ❌ Não armazenamos sua API Key em servidores
- ❌ Não fazemos log de seus dados pessoais
- ❌ Não compartilhamos conversas com terceiros
- ❌ Não usamos dados para treinamento

### ✅ O Que Fazemos

- ✅ Armazenamos API Key apenas no localStorage do seu navegador
- ✅ Criptografia de dados em trânsito (HTTPS quando em produção)
- ✅ Validação de entrada para prevenir injeção
- ✅ Rate limiting para prevenir abuso

### 📱 LocalStorage vs Backend

**Sua API Key:**
- Fica armazenada APENAS no seu navegador local
- Never é enviada para nossos servidores
- Você pode verificar em: DevTools → Application → LocalStorage

**Para Produção:**
- Considere usar server-side API com OAuth
- Implemente autenticação de usuário
- Use variables de ambiente (.env)

---

## 🧪 Testando a Integração

### Teste Rápido

1. Abra o DevTools (F12)
2. Vá para Console
3. Digite:
```javascript
// Verificar se API key está armazenada
console.log(localStorage.getItem('gemini_api_key'));

// Verificar estado da API
console.log(apiKey);
console.log(useGeminiAPI);
```

### Teste de Requisição

```javascript
// Enviar teste de mensagem
const testMessage = "Oi, quero um hamburger";
processUserInput(testMessage);
```

### Verificar Logs do Servidor

Abra outro terminal e execute:
```bash
# Terminal 1: Servidor
npm start

# Terminal 2: Ver logs em tempo real
tail -f logs/*.log  # se implementado
```

---

## 🐛 Troubleshooting

### Problema: "API Key inválida"
**Solução:**
- Verifique se copiou a chave completa
- Certifique-se que começa com `AIza`
- Teste em [ai.google.dev](https://ai.google.dev)

### Problema: "Modelo Gemini não encontrado"
**Solução:**
- Verifique se sua conta tem acesso ao Gemini
- Tente criar um novo projeto
- Aguarde 5-10 minutos após criar a chave

### Problema: "Erro CORS"
**Solução:**
- Certifique-se que servidor está rodando
- Verifique se é localhost:3000
- Limpe cache do navegador (Ctrl+Shift+Delete)

### Problema: "Chat respondendo com padrão"
**Solução:**
- Verifique status no painel de configurações
- Abra DevTools Console para ver erros
- Tente recarregar a página (Ctrl+F5)

---

## 📊 Monitoramento de Uso

### Verificar Uso da API

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Navegue até "APIs & Services" → "Quotas"
3. Procure por "Generative Language API"
4. Veja requisições usadas vs limite

### Limites Gratuitos

- **Requests**: 60 por minuto (gratuitos)
- **Tokens**: Ilimitados (com limite diário)
- **Modelos**: Acesso a gemini-pro

### Planos Pagos

Para produção com alto volume:
- Pay-as-you-go pricing
- Suporte prioritário
- Limites aumentados

---

## 🚀 Deployment em Produção

### Preparar para Produção

1. **Variáveis de Ambiente**
```bash
# Criar arquivo .env
cp .env.example .env

# Preencher .env com:
GEMINI_API_KEY=sua_chave_aqui
NODE_ENV=production
PORT=80
```

2. **Build para Produção**
```bash
# Minificar assets
npm run build

# Testar build
npm run start:prod
```

3. **Deploy**
```bash
# Exemplo com Heroku
heroku login
heroku create seu-app-hora-lanche
git push heroku main
```

4. **HTTPS Obrigatório**
- Configure certificado SSL/TLS
- Redirecione HTTP para HTTPS

---

## 📞 Suporte

### Problemas Comuns
- 📖 Veja [DEVELOPMENT.md](./DEVELOPMENT.md)
- 📚 Leia [README.md](./README.md)
- 🐛 Reporte issues no GitHub

### Documentação
- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Node.js SDK](https://github.com/google/generative-ai-js)
- [Express.js Docs](https://expressjs.com)

---

## ✅ Checklist de Configuração

- [ ] Criar conta Google/projeto
- [ ] Obter API Key Gemini
- [ ] Instalar Node.js 14+
- [ ] Executar `npm install`
- [ ] Iniciar servidor com `npm start`
- [ ] Abrir http://localhost:3000
- [ ] Colar API Key nas configurações
- [ ] Ver status "Conectado"
- [ ] Conversar com Gemini
- [ ] Testar diferentes tipos de pedidos

---

**Versão**: 1.0 | **Última atualização**: 2026-04-25
