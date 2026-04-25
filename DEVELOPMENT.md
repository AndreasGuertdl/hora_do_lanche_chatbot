# Guia de Desenvolvimento

Este documento fornece informações técnicas para desenvolvedores que querem contribuir ou estender o projeto.

---

## 🛠️ Setup de Desenvolvimento

### Requisitos
- Node.js 14+ (opcional, mas recomendado)
- Git
- Um navegador moderno

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/AndreasGuertdl/hora_do_lanche_chatbot.git
cd hora_do_lanche_chatbot

# Com Python (nenhuma instalação necessária)
python -m http.server 8000

# OU com Node.js
npm install
node server.js

# Abra http://localhost:8000 ou http://localhost:3000
```

---

## 📋 Arquitetura

### Frontend Stack
- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, Animações
- **JavaScript Vanilla**: Sem dependências externas (inicialmente)

### Estrutura de Dados
- **menu.json**: Define produtos, preços, categorias
- **ai-instructions.json**: Define comportamento, fluxos, recomendações

### Fluxo de Dados

```
User Input
    ↓
handleUserSubmit()
    ↓
processUserInput()
    ├─ analyzeUserMessage() → detecta preferências
    ├─ generateAIResponse() → cria resposta
    └─ updateQuickActions() → atualiza botões rápidos
    ↓
addMessage() → renderiza no chat
    ↓
conversationState atualizado
```

---

## 🔧 Modificando o Comportamento da IA

### 1. Adicionar Novo Padrão de Recomendação

**Arquivo**: `data/ai-instructions.json`

```json
{
  "new_category": {
    "keywords": ["palavra1", "palavra2", "palavra3"],
    "suggestions": ["item-id-1", "item-id-2"],
    "message": "Recomendação com emoji 🎉"
  }
}
```

**Arquivo**: `js/chat.js`

```javascript
// Em checkForRecommendation()
if (includes(userMessage, logic.new_category.keywords)) {
  return logic.new_category.message;
}
```

### 2. Adicionar Novo Estágio de Conversa

**Arquivo**: `js/chat.js`

```javascript
// Em conversationState
conversationState.stage = 'new_stage';

// Em generateAIResponse()
if (conversationState.stage === 'new_stage') {
  return handleNewStage(userMessage);
}

// Implementar handler
function handleNewStage(message) {
  // Sua lógica aqui
  return response;
}
```

---

## 🎨 Customizando a Interface

### Alterar Cores Primárias

**Arquivo**: `styles.css`

```css
/* Procure por */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* E substitua com suas cores */
background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%);
```

### Adicionar Classes de Tema

**Arquivo**: `styles.css`

```css
/* Tema escuro */
body.dark-mode {
  background: #1a1a1a;
  color: #fff;
}

.dark-mode .message-content {
  background: #333;
}
```

**Arquivo**: `js/chat.js`

```javascript
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
```

---

## 📊 Estrutura do Menu JSON

### Adicionar Novo Sanduíche

```json
{
  "id": "novo-sandwich",
  "name": "Nome do Sanduíche",
  "description": "Descrição completa",
  "price": 25.00,
  "category": "burger|frango|sanduiche|vegetariano",
  "image": "🍔",
  "ingredients": ["carne", "tomate", "alface"],
  "allergens": ["gluten", "lactose"]
}
```

### Adicionar Nova Bebida com Tamanhos

```json
{
  "id": "nova-bebida",
  "name": "Nova Bebida",
  "description": "Descrição",
  "price": 10.00,
  "category": "bebida",
  "image": "🥤",
  "sizes": ["pequeno", "médio", "grande"],
  "sizePrices": {
    "pequeno": 8.00,
    "médio": 10.00,
    "grande": 12.00
  },
  "flavors": ["sabor1", "sabor2"]
}
```

---

## 🐛 Debug e Troubleshooting

### Ativar Debug Mode

**Arquivo**: `js/chat.js` (adicione no topo)

```javascript
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}
```

### Inspecionar Estado da Conversa

No console do navegador (F12):

```javascript
// Ver estado atual
console.log(conversationState);
console.log(currentOrder);
console.log(menuData);

// Simular mensagem de usuário
processUserInput('oi');

// Limpar chat
document.getElementById('chatMessages').innerHTML = '';
```

### Checar JSON

```javascript
// Validar menu
console.log(menuData.menu.sandwiches);

// Validar instruções
console.log(aiInstructions.aiInstructions.conversationFlow);
```

---

## ✅ Testing Checklist

Antes de submeter um PR, verifique:

### Frontend
- [ ] Layout responsivo em 480px, 768px, 1024px, 1920px
- [ ] Sem console errors ou warnings
- [ ] Animações suaves
- [ ] Inputs funcionam corretamente
- [ ] Modal abre e fecha

### Lógica de IA
- [ ] Detecta preferências corretamente
- [ ] Respostas fazem sentido
- [ ] Fluxo de pedido completo
- [ ] Notificações aparecem

### Performance
- [ ] Página carrega em < 2s
- [ ] Sem memory leaks
- [ ] Chat scroll suave
- [ ] Mensagens renderizam rapidamente

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
/* até 480px */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop pequeno */
@media (min-width: 1024px) { }

/* Desktop grande */
@media (min-width: 1440px) { }
```

---

## 🔌 Preparando para APIs Reais

### Estrutura para Integração OpenAI

```javascript
async function getAIResponse(userMessage) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        context: conversationState,
        order: currentOrder
      })
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Erro API:', error);
    return 'Desculpa, tive um problema. Pode repetir?';
  }
}
```

### Estrutura para Backend Node.js

```javascript
// server.js
app.post('/api/chat', async (req, res) => {
  const { message, context, order } = req.body;
  
  // Processar com OpenAI
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: aiInstructions.systemRole },
      { role: 'user', content: message }
    ]
  });
  
  res.json({ response: aiResponse.choices[0].message.content });
});
```

---

## 📝 Logging e Monitoring

### Adicionar Logging

```javascript
function logEvent(event, data) {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    data,
    userAgent: navigator.userAgent
  };
  
  console.log('[LOG]', log);
  // Enviar para backend para analysis
}

// Usar em pontos importantes
logEvent('user_message', { text: userMessage });
logEvent('ai_response', { text: response });
logEvent('order_confirmed', currentOrder);
```

---

## 🚀 Performance Tips

### Otimizações Implementadas
- ✅ CSS com Flexbox (sem tabelas)
- ✅ Animações com CSS (não JS)
- ✅ Lazy loading de dados
- ✅ Sem dependências pesadas

### Melhorias Futuras
- [ ] Service Workers para offline
- [ ] IndexedDB para cache
- [ ] Code splitting para JS
- [ ] Image optimization

---

## 📚 Recursos Adicionais

### Documentação
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

### Ferramentas Úteis
- **DevTools**: F12 no navegador
- **Lighthouse**: DevTools → Lighthouse
- **JSON Validator**: [JSONLint](https://jsonlint.com/)
- **CSS Validator**: [W3C Validator](https://jigsaw.w3.org/css-validator/)

---

## 👥 Colaboração

### Code Reviews
- Pelo menos 1 aprovação antes de merge
- Descreva mudanças principais
- Referencie issues/PRs relacionados

### Commits
```
fix: Corrige bug X
feat: Adiciona feature Y
docs: Atualiza documentação
style: Formata código
refactor: Melhora estrutura
perf: Otimiza performance
test: Adiciona testes
```

---

## 📞 Suporte

- Abra uma issue no GitHub
- Descreva problema/feature com detalhe
- Inclua screenshots/video se possível
- Mencione seu ambiente

---

**Última atualização**: 2026-04-25
