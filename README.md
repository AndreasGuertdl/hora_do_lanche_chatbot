# 🍔 Hora do Lanche - Chatbot de Pedidos

Um site completo de atendimento conversacional em português brasileiro para uma lanchonete. Cliente interage com uma IA amigável que ajuda a escolher lanches e bebidas, realiza a venda e notifica sobre a entrega.

**✨ NOVO (v2.0)**: Integração com **Google Gemini API** para IA real! 🤖

---

## 🎯 O Que é Novo (v2.0)

### 🔥 Gemini API Integration
- ✅ Respostas com IA real do Google Gemini
- ✅ Compreensão natural de linguagem
- ✅ Conversas mais inteligentes e fluidas
- ✅ Use sua própria API Key
- ✅ Dados privados - nada é armazenado no servidor

### 🛡️ Privacidade
- Sua API Key fica apenas no seu navegador
- Sem coleta de dados pessoais
- Sem armazenamento de conversas
- Totalmente open-source

---

## 🚀 Quick Start com Gemini

### 1. Instale as Dependências
```bash
npm install
```

### 2. Inicie o Servidor
```bash
npm start
```
Acesso: [http://localhost:3000](http://localhost:3000)

### 3. Configure API Key
- Clique no ⚙️ (canto superior direito)
- Obtenha sua key em [ai.google.dev](https://ai.google.dev)
- cole em "Chave de API do Gemini"
- Clique "Salvar Chave"
- Pronto! 🎉

📖 **Guia Completo**: [SETUP-GEMINI.md](./SETUP-GEMINI.md)

---

## 📋 Visão Geral do Projeto

### Objetivo
Criar uma plataforma de vendas automatizada via chat onde:
- Cliente interage naturalmente com a IA
- IA recomenda produtos baseado em preferências
- Fluxo completo de venda (seleção → customização → confirmação)
- Notificações em tempo real de status da entrega
- Tudo em português brasileiro coloquial

### Status do Projeto
✅ **FUNCIONALIDADES IMPLEMENTADAS:**
- [x] Interface de chat responsivo
- [x] Sistema de mensagens bidirecional
- [x] Menu JSON com sanduíches e bebidas
- [x] Instruções de IA em JSON
- [x] Lógica básica de recomendação
- [x] Fluxo de pedido completo
- [x] Modal de confirmação
- [x] Simulação de atualizações de entrega

⏳ **EM DESENVOLVIMENTO:**
- [ ] Integração com IA real (OpenAI/Claude API)
- [ ] Sistema de autenticação de usuário
- [ ] Persistência de dados (banco de dados)
- [ ] Métodos de pagamento
- [ ] Histórico de pedidos
- [ ] Validação de endereço de entrega

📅 **PRÓXIMOS PASSOS:**
- [ ] Conectar a um backend real
- [ ] Implementar sistema de delivery tracking
- [ ] Adicionar avaliações e feedback
- [ ] Programa de fidelização/pontos
- [ ] Admin panel para gerenciamento de pedidos

---

## 🎯 Funcionalidades

### 1. **Interface de Chat**
- Design responsivo e moderno
- Animações suaves
- Indicador de digitação da IA
- Scroll automático para última mensagem
- Botões de ações rápidas contextuais

### 2. **Menu Completo**
- **Sanduíches**: 8 opções (burgers, frango, vegetariano, etc.)
- **Bebidas**: 7 opções (refrigerante, suco, café, milkshake, etc.)
- **Extras**: 8 complementos (queijo, bacon, batatas, etc.)
- **Combos**: 3 combos com desconto
- **Tamanhos**: Pequeno, Médio, Grande com preços progressivos

### 3. **IA Conversacional**
- Detecta preferências do cliente (tipo de carne, orçamento, sabor)
- Recomenda produtos personalizados
- Oferece extras e bebidas naturalmente
- Utiliza tom amigável e informal
- Entende variações de linguagem em português

### 4. **Fluxo de Venda**
1. Saudação e boas-vindas
2. Identify preferências (tipo de comida, orçamento)
3. Recomendação personalizada
4. Seleção de item
5. Oferecimento de complementos
6. Oferecimento de bebida
7. Confirmação de pedido
8. Processamento e notificações

### 5. **Notificações de Entrega**
- ✅ Confirmação de pedido
- 🔔 Pedido pronto
- 🚗 Pedido a caminho
- 📍 Chegando em breve
- 🎉 Pedido entregue

---

## 📁 Estrutura de Arquivos

```
hora_do_lanche_chatbot/
├── index.html              # Página principal
├── styles.css              # Estilos da interface
├── data/
│   ├── menu.json           # Menu completo (sanduíches, bebidas, extras)
│   └── ai-instructions.json # Instruções e lógica da IA
├── js/
│   └── chat.js             # Lógica do chatbot
└── README.md               # Este arquivo
```

---

## 🚀 Como Executar

### Requisitos
- Node.js 14+
- npm ou yarn
- Google API Key (opcional, mas recomendado para IA real)

### Com Gemini API (Recomendado)

```bash
# 1. Instale dependências
npm install

# 2. Inicie o servidor
npm start

# 3. Abra navegador
open http://localhost:3000

# 4. Configure API Key nas configurações (⚙️)
```

**📖 Guia Detalhado**: [SETUP-GEMINI.md](./SETUP-GEMINI.md)

### Sem Gemini (Modo Padrão Local)

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Live Server (VS Code)
# Instale extensão "Live Server"
# Clique com botão direito em index.html
# Selecione "Open with Live Server"
```

---

## 🌟 Comparação: Padrão vs Gemini

| Recurso | Padrão | Gemini |
|---|---|---|
| **Tipo de IA** | Pattern Matching | NLP Real (Gemini) |
| **Compreensão** | Básica (keywords) | Avançada |
| **Resposta** | Pré-definidas | Geradas dinamicamente |
| **Contexto** | Limitado | Conversação completa |
| **Recomendações** | Simples | Personalizadas |
| **Idioma** | Português fixo | Português fluido |
| **Requisitos** | Nenhum | Node.js + API Key |
| **Velocidade** | Instantâneo | 1-2 segundos |

---

## 📊 Arquitetura v2.0 (Com Gemini)

```
┌─────────────────────────────────────┐
│     Frontend (HTML/CSS/JS)          │
│  - Chat Interface                   │
│  - Settings Modal                   │
│  - Modo Padrão/Gemini               │
└──────────────┬──────────────────────┘
               │
        HTTP Requisições
               │
               ↓
┌─────────────────────────────────────┐
│   Backend (Express.js)              │
│  - /api/chat (POST)                 │
│  - /api/menu (GET)                  │
│  - /api/instructions (GET)         │
│  - /api/confirm-order (POST)        │
│  - /api/reset (POST)                │
└──────────────┬──────────────────────┘
               │
        Repassar para API
               │
               ↓
        ┌──────────────┐
        │ Google Gemini│
        │   API        │
        └──────────────┘
```

### Opção 1: Executar Localmente

```bash
cd /workspaces/hora_do_lanche_chatbot
npm start
```

### Opção 2: Usar Python

---

## 📊 Estrutura de Dados

### Menu (menu.json)
```json
{
  "menu": {
    "sandwiches": [
      {
        "id": "burger-classico",
        "name": "Burger Clássico",
        "price": 25.00,
        "description": "...",
        "category": "burger",
        "image": "🍔",
        "ingredients": ["carne", "tomate", "alface", "queijo"]
      }
    ],
    "beverages": [...],
    "extras": [...],
    "combos": [...]
  }
}
```

### Instruções da IA (ai-instructions.json)
Contém:
- **systemRole**: Papel e personalidade da IA
- **conversationFlow**: Fluxos de conversa (saudação, recomendação, etc.)
- **recommendation_logic**: Lógica de recomendação por tipo de cliente
- **personalityTraits**: Tom, linguagem, exemplos
- **responseGuidelines**: Regras de respostas
- **orderManagement**: Estrutura de pedidos e estados

---

## 🤖 Lógica de IA

### Análise de Preferências
A IA detecta intenções do cliente através de keywords:

1. **Tipo de Dieta**
   - `vegetariano/vegan`: → Vegetarian options
   - `carne/hamburguer`: → Meat options
   - `frango/crispy`: → Chicken options

2. **Consciência de Budget**
   - `barato/combo/desconto`: → Budget-friendly options
   - `premium/melhor/gostoso`: → Premium options

3. **Estágio de Conversa**
   - Greeting → Preference Gathering → Customizing → Confirmation

### Recomendações Personalizadas
```javascript
if (keywords.includes('vegetariano')) {
  recommend(['vegetariano', 'suco-natural', 'agua-mineral'])
}
```

### Estados da Conversa
- `greeting`: Boas-vindas inicial
- `preference_gathering`: Entender o que o cliente quer
- `customizing`: Adicionar itens, extras, bebidas
- `confirmation`: Revisar pedido antes de confirmar
- `delivery`: Acompanhar entrega

---

## 🎨 Personalização

### Mudar Cordialidade da IA
Editar `data/ai-instructions.json`:
```json
"personalityTraits": {
  "tone": "amigável, entusiasmado, informal",
  "language": "português brasileiro coloquial"
}
```

### Adicionar Novo Item ao Menu
Editar `data/menu.json`:
```json
{
  "id": "novo-lanche",
  "name": "Novo Lanche",
  "price": 30.00,
  "description": "...",
  "category": "burger"
}
```

### Modificar Cores da Interface
Editar `styles.css`:
```css
/* Cores principais */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 🔧 Tecnologias Utilizadas

- **Frontend**
  - HTML5 (estrutura semântica)
  - CSS3 (Grid, Flexbox, Animações)
  - JavaScript Vanilla (sem dependências)

- **Dados**
  - JSON (menu e instruções)
  - LocalStorage (futuro: persistência de carinho)

- **UX**
  - Responsive Design
  - Mobile-first approach
  - Animações fluidas
  - Feedback visual

---

## 🐛 Conhecidas Limitações

1. **IA Básica**: Usa pattern matching em vez de NLP real
2. **Sem Backend**: Tudo é simulado no frontend
3. **Sem Autenticação**: Qualquer um pode fazer pedidos
4. **Sem Pagamento**: Não há integração com sistemas de pagamento
5. **Sem Persistência**: Dados de pedidos não são salvos

---

## 🚀 Próximas Melhorias

### Curto Prazo (1-2 semanas)
- [ ] Integração com OpenAI API para IA real
- [ ] LocalStorage para carrinho persistente
- [ ] Validação de endereço

### Médio Prazo (1 mês)
- [ ] Backend com Node.js/Express
- [ ] Banco de dados (MongoDB/PostgreSQL)
- [ ] Sistema de autenticação
- [ ] Métodos de pagamento (Stripe/PayPal)

### Longo Prazo (2+ meses)
- [ ] Admin dashboard
- [ ] Analytics e insights
- [ ] Programa de fidelização
- [ ] App mobile (React Native)
- [ ] Integração com serviço de delivery

---

## 📱 Responsividade

O design é otimizado para:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

---

## 📞 Suporte e Contribuições

Para reportar bugs ou sugerir melhorias:
1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit suas mudanças: `git commit -m "Add sua-feature"`
4. Push para a branch: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja LICENSE.md para detalhes.

---

## 👨‍💻 Autor

**Andreas Guertdl**
- GitHub: [@AndreasGuertdl](https://github.com/AndreasGuertdl)
- Projeto: Hora do Lanche Chatbot

---

## 📊 Acompanhamento de Funcionalidades

| Funcionalidade | Status | Data | Notas |
|---|---|---|---|
| Interface Base | ✅ Concluído | 2026-04-25 | Chat responsivo |
| Menu JSON | ✅ Concluído | 2026-04-25 | 8 sanduíches, 7 bebidas |
| Instruções IA | ✅ Concluído | 2026-04-25 | Fluxos e recomendações |
| Lógica Chat | ✅ Concluído | 2026-04-25 | Pattern matching básico |
| Confirmação Pedido | ✅ Concluído | 2026-04-25 | Modal interativo |
| Notificações Entrega | ✅ Concluído | 2026-04-25 | Simuladas |
| Backend Real | ⏳ Planejado | TBD | Node.js/Express |
| Pagamento | ⏳ Planejado | TBD | Stripe/PayPal |
| Admin Dashboard | ⏳ Planejado | TBD | Gerenciar pedidos |

---

## 🎉 Changelog

### v1.0.0 - 2026-04-25
- ✨ Release inicial
- 🎨 Interface de chat responsiva
- 🤖 IA com pattern matching
- 📋 Menu com 15+ itens
- 💬 Fluxo conversacional completo
- 📦 Notificações de entrega simuladas

---

**Última atualização**: 2026-04-25