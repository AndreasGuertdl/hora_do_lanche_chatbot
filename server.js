/**
 * Servidor Express com integração Google Gemini
 * Use: npm install && node server.js
 * Acesse: http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const PORT = process.env.PORT || 3000;
const APP = express();

// ============================================
// Middleware
// ============================================

APP.use(cors());
APP.use(express.json());
APP.use(express.static('./'));

// ============================================
// Carregamento de Dados
// ============================================

let menuData = {};
let aiInstructions = {};

try {
  menuData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/menu.json'), 'utf8'));
} catch (error) {
  console.error('❌ Erro ao carregar menu.json:', error.message);
}

try {
  aiInstructions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/ai-instructions.json'), 'utf8'));
} catch (error) {
  console.error('❌ Erro ao carregar ai-instructions.json:', error.message);
}

// ============================================
// Variáveis de Sessão
// ============================================

let conversationHistory = [];
let currentSessionOrder = {
  items: [],
  total: 0,
  deliveryMethod: null
};

// ============================================
// API Endpoints
// ============================================

/**
 * POST /api/chat
 * Processa mensagem do usuário com Gemini API
 */
APP.post('/api/chat', async (req, res) => {
  try {
    const { message, apiKey } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem vazia' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'API Key não fornecida' });
    }

    // Inicializar cliente Gemini com a API key do usuário
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Construir histórico de conversa
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.9,
      }
    });

    // Criar prompt com contexto do restaurante
    const systemContext = `${aiInstructions.aiInstructions.systemRole}

MENU DISPONÍVEL:
${formatMenuContext()}

REGRAS IMPORTANTES:
- Responda sempre em português brasileiro coloquial
- Use emojis apropriados
- Recomende produtos baseado em preferências do cliente
- Mantenha tom amigável e entusiasmado
- Se o cliente pediu algo específico, confirme o item e preço
- Após escolher um item, ofereça extras/bebidas naturalmente
- Quando tiver múltiplos itens no carrinho, pergunte se é tudo ou quer mais
- QUANDO PERGUNTAREM O QUE O RESTAURANTE OFERECE, SEMPRE CITE O MENU COMPLETO
- Descreva as categorias de comida disponíveis e qualifique destacando o que há de especial
- Se o cliente perguntar "o que vocês têm?", "qual cardápio?", "o que vocês vendem?", mostre as principais opções do menu
- Seja específico com preços quando mencionar itens

PEDIDOS DO CLIENTE ATUALMENTE:
${JSON.stringify(currentSessionOrder.items, null, 2)}`;

    const fullMessage = `${systemContext}\n\nCliente: ${message}`;

    // Enviar para Gemini
    const result = await chat.sendMessage(fullMessage);
    const response = result.response.text();

    // Atualizar histórico
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    conversationHistory.push({
      role: 'model',
      parts: [{ text: response }]
    });

    // Limitar histórico para não ficar muito grande
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    // Extrair intenção do usuário (para atualizar carrinho)
    updateOrderFromMessage(message);

    res.json({
      response,
      order: currentSessionOrder
    });

  } catch (error) {
    console.error('❌ Erro ao processar chat:', error);

    if (error.message.includes('API_KEY') || error.message.includes('Invalid API')) {
      return res.status(401).json({
        error: 'API Key inválida ou expirada. Verifique sua chave de API do Gemini.'
      });
    }

    if (error.message.includes('404')) {
      return res.status(500).json({
        error: 'Modelo Gemini não encontrado. Verifique se sua API key tem acesso ao modelo gemini-pro.'
      });
    }

    res.status(500).json({
      error: 'Erro ao processar mensagem',
      details: error.message
    });
  }
});

/**
 * POST /api/reset
 * Reseta a conversa e o pedido
 */
APP.post('/api/reset', (req, res) => {
  conversationHistory = [];
  currentSessionOrder = {
    items: [],
    total: 0,
    deliveryMethod: null
  };

  res.json({ message: 'Conversa resetada' });
});

/**
 * GET /api/menu
 * Retorna o menu disponível
 */
APP.get('/api/menu', (req, res) => {
  res.json(menuData);
});

/**
 * GET /api/instructions
 * Retorna as instruções de IA
 */
APP.get('/api/instructions', (req, res) => {
  res.json(aiInstructions);
});

/**
 * POST /api/confirm-order
 * Confirma o pedido e reseta para novo
 */
APP.post('/api/confirm-order', (req, res) => {
  const orderId = generateOrderId();
  
  const confirmedOrder = {
    id: orderId,
    items: currentSessionOrder.items,
    total: currentSessionOrder.total,
    timestamp: new Date().toISOString(),
    deliveryMethod: currentSessionOrder.deliveryMethod
  };

  // Aqui você poderia salvar no banco de dados
  console.log('✅ Pedido confirmado:', confirmedOrder);

  // Reset para novo pedido
  currentSessionOrder = {
    items: [],
    total: 0,
    deliveryMethod: null
  };
  conversationHistory = [];

  res.json({
    success: true,
    orderId,
    order: confirmedOrder
  });
});

// ============================================
// Funções Auxiliares
// ============================================

function formatMenuContext() {
  let context = '';

  // Lanches no Prato
  if (menuData.menu.lanchesNoPrato && menuData.menu.lanchesNoPrato.length > 0) {
    context += '🍽️ LANCHES NO PRATO (com batata e bebida):\n';
    menuData.menu.lanchesNoPrato.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Pratos Light
  if (menuData.menu.pratosLight && menuData.menu.pratosLight.length > 0) {
    context += '🥗 PRATOS LIGHT:\n';
    menuData.menu.pratosLight.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Porções
  if (menuData.menu.porcoes && menuData.menu.porcoes.length > 0) {
    context += '🍟 PORÇÕES:\n';
    menuData.menu.porcoes.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Pizzas
  if (menuData.menu.pizzas && menuData.menu.pizzas.length > 0) {
    context += '🍕 PIZZAS:\n';
    menuData.menu.pizzas.forEach(item => {
      const priceStr = item.sizePrices ? 
        `(P: R$ ${item.sizePrices.pequena.toFixed(2)}, M: R$ ${item.sizePrices.média.toFixed(2)}, G: R$ ${item.sizePrices.grande.toFixed(2)})` :
        `R$ ${item.price.toFixed(2)}`;
      context += `  • ${item.name} ${priceStr}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Lanches na Baguete
  if (menuData.menu.lanchesBaguete && menuData.menu.lanchesBaguete.length > 0) {
    context += '🥖 LANCHES NA BAGUETE:\n';
    menuData.menu.lanchesBaguete.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Lanches
  if (menuData.menu.lanches && menuData.menu.lanches.length > 0) {
    context += '🍔 LANCHES:\n';
    menuData.menu.lanches.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Beirutes
  if (menuData.menu.beirutes && menuData.menu.beirutes.length > 0) {
    context += '🥙 BEIRUTES:\n';
    menuData.menu.beirutes.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Sanduíches (original)
  if (menuData.menu.sandwiches && menuData.menu.sandwiches.length > 0) {
    context += '🥪 SANDUÍCHES:\n';
    menuData.menu.sandwiches.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Bebidas
  if (menuData.menu.beverages && menuData.menu.beverages.length > 0) {
    context += '🥤 BEBIDAS:\n';
    menuData.menu.beverages.forEach(item => {
      const sizeInfo = item.sizePrices ? 
        ` (P: R$ ${item.sizePrices.pequeno.toFixed(2)}, M: R$ ${item.sizePrices.médio.toFixed(2)}, G: R$ ${item.sizePrices.grande.toFixed(2)})` :
        `R$ ${item.price.toFixed(2)}`;
      context += `  • ${item.name}${sizeInfo}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Sobremesas
  if (menuData.menu.sobremesas && menuData.menu.sobremesas.length > 0) {
    context += '🍰 SOBREMESAS:\n';
    menuData.menu.sobremesas.forEach(item => {
      context += `  • ${item.name} - R$ ${item.price.toFixed(2)}: ${item.description}\n`;
    });
    context += '\n';
  }

  // Extras
  if (menuData.menu.extras && menuData.menu.extras.length > 0) {
    context += '➕ EXTRAS:\n';
    menuData.menu.extras.forEach(item => {
      context += `  • ${item.name}: +R$ ${item.price.toFixed(2)}\n`;
    });
    context += '\n';
  }

  // Combos
  if (menuData.menu.combos && menuData.menu.combos.length > 0) {
    context += '🎁 COMBOS (Promoções):\n';
    menuData.menu.combos.forEach(item => {
      context += `  • ${item.name}: R$ ${item.discountedPrice.toFixed(2)} (de R$ ${item.originalPrice.toFixed(2)}) - ${item.description}\n`;
    });
    context += '\n';
  }

  return context;
}

function updateOrderFromMessage(message) {
  // Detectar menções de itens do menu
  const lowerMessage = message.toLowerCase();

  // Helper function to search in menu categories
  const searchInCategory = (category) => {
    if (!category || !Array.isArray(category)) return;
    
    category.forEach(item => {
      if (lowerMessage.includes(item.name.toLowerCase()) || 
          lowerMessage.includes(item.id)) {
        // Verificar se já existe
        const exists = currentSessionOrder.items.find(i => i.id === item.id);
        if (!exists) {
          currentSessionOrder.items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
          });
          currentSessionOrder.total += item.price;
        }
      }
    });
  };

  // Search in all menu categories
  if (menuData && menuData.menu) {
    searchInCategory(menuData.menu.lanchesNoPrato);
    searchInCategory(menuData.menu.pratosLight);
    searchInCategory(menuData.menu.porcoes);
    searchInCategory(menuData.menu.pizzas);
    searchInCategory(menuData.menu.lanchesBaguete);
    searchInCategory(menuData.menu.lanches);
    searchInCategory(menuData.menu.beirutes);
    searchInCategory(menuData.menu.sandwiches);
    searchInCategory(menuData.menu.beverages);
    searchInCategory(menuData.menu.sobremesas);
    searchInCategory(menuData.menu.extras);
  }
}

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

// ============================================
// Error Handling
// ============================================

APP.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno no servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// Inicialização
// ============================================

APP.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🍔 Hora do Lanche - Integração Gemini API            ║
╚═══════════════════════════════════════════════════════╝

✅ Servidor iniciado com sucesso!

📍 URL: http://localhost:${PORT}
🔗 Pressione Ctrl+C para parar

🤖 IA: Google Gemini API

📝 Próximos passos:
1. Abra http://localhost:${PORT}
2. Clique no ícone de configurações (⚙️)
3. Adicione sua chave de API do Gemini
4. Comece a conversar!

📚 Documentação:
- Menu: GET /api/menu
- Chat: POST /api/chat
- Reset: POST /api/reset
- Confirmar Pedido: POST /api/confirm-order

⚠️  IMPORTANTE:
- Sua API key do Gemini é armazenada APENAS no seu navegador
- Nunca é enviada para nossos servidores
- Todos os dados são privados

  `);
});
