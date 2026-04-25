// ============================================
// Variáveis Globais e Estado
// ============================================

let currentOrder = {
  items: [],
  total: 0,
  deliveryMethod: null,
  customerInfo: {}
};

let conversationState = {
  stage: 'greeting',
  lastAction: null,
  preferences: {
    dietType: null,
    budget: null,
    taste: null
  }
};

let apiKey = null;
let menuData = {};
let aiInstructions = {};
let useGeminiAPI = false;

// ============================================
// Inicialização do LocalStorage
// ============================================

function initializeAPIKey() {
  const stored = localStorage.getItem('gemini_api_key');
  if (stored) {
    apiKey = stored;
    document.getElementById('apiKeyInput').value = '*'.repeat(Math.min(stored.length, 50));
    useGeminiAPI = true;
    updateConnectionStatus('Conectado ✅');
  } else {
    updateConnectionStatus('Desconectado ❌');
  }
}

// ============================================
// Carregamento de Dados JSON
// ============================================

async function loadMenuData() {
  try {
    const response = await fetch('data/menu.json');
    menuData = await response.json();
  } catch (error) {
    console.error('Erro ao carregar menu:', error);
    menuData = { menu: {} };
  }
}

async function loadAIInstructions() {
  try {
    const response = await fetch('data/ai-instructions.json');
    aiInstructions = await response.json();
  } catch (error) {
    console.error('Erro ao carregar instruções da IA:', error);
    aiInstructions = { aiInstructions: {} };
  }
}

// ============================================
// Gerenciamento de Mensagens do Chat
// ============================================

function addMessage(text, isUser = false, type = 'text') {
  const chatMessages = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (type === 'typing') {
    contentDiv.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  } else {
    contentDiv.textContent = text;
  }
  
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  
  // Auto-scroll para a última mensagem
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function showTypingIndicator() {
  addMessage('', false, 'typing');
}

function removeTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const lastMessage = chatMessages.lastChild;
  if (lastMessage && lastMessage.querySelector('.typing-indicator')) {
    lastMessage.remove();
  }
}

// ============================================
// Processamento de Resposta da IA
// ============================================

async function getGeminiResponse(userMessage) {
  try {
    updateConnectionStatus('⏳ Conectando...');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        apiKey: apiKey
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao conectar com Gemini');
    }

    updateConnectionStatus('Conectado ✅');
    return data.response;

  } catch (error) {
    console.error('Erro Gemini:', error);
    updateConnectionStatus('Desconectado ❌');
    
    // Fallback para resposta padrão
    return handleLocalFallback(userMessage);
  }
}

// ============================================
// Fallback para Padrão Matching Local
// ============================================

function handleLocalFallback(userMessage) {
  const lowerMessage = userMessage.toLowerCase().trim();

  // Análise básica de intenção e preferências
  analyzeUserMessage(lowerMessage);

  // Gerar resposta apropriada
  return generateLocalResponse(lowerMessage);
}

function generateLocalResponse(userMessage) {
  // Respostas de saudação
  if (conversationState.stage === 'greeting' && includes(userMessage, ['oi', 'olá', 'opa', 'e ai', 'tudo bem'])) {
    conversationState.stage = 'preference_gathering';
    return randomElement(aiInstructions.aiInstructions.conversationFlow.greeting.responses);
  }

  // Se é a primeira mensagem real após saudação
  if (conversationState.stage === 'preference_gathering' && currentOrder.items.length === 0) {
    return promptForPreference(userMessage);
  }

  // Análise de recomendações
  let recommendation = checkForRecommendation(userMessage);
  if (recommendation) {
    return recommendation;
  }

  // Se o usuário mencionou um item específico
  let itemMatch = findMenuItem(userMessage);
  if (itemMatch) {
    return handleItemSelection(itemMatch);
  }

  // Mensagem padrão se não compreendeu
  return randomElement(aiInstructions.aiInstructions.conversationFlow.error_handling.didnt_understand);
}

async function processUserInput(userMessage) {
  let response;

  if (useGeminiAPI && apiKey) {
    // Usar Gemini API
    response = await getGeminiResponse(userMessage);
  } else {
    // Usar fallback local
    const lowerMessage = userMessage.toLowerCase().trim();
    analyzeUserMessage(lowerMessage);
    response = generateLocalResponse(lowerMessage);
  }
  
  // Mostrar resposta do bot
  setTimeout(() => {
    removeTypingIndicator();
    addMessage(response, false);
    updateQuickActions(conversationState.stage);
  }, 800);
}

function analyzeUserMessage(message) {
  // Detectar preferências de dieta
  if (includes(message, ['vegetariano', 'vegan', 'vegano', 'leve', 'saudável', 'sem carne'])) {
    conversationState.preferences.dietType = 'vegetarian';
  } else if (includes(message, ['carne', 'hamburguer', 'carnudo', 'suculento', 'duplo', 'bacon'])) {
    conversationState.preferences.dietType = 'meat';
  } else if (includes(message, ['frango', 'crispy', 'empanado', 'crocante'])) {
    conversationState.preferences.dietType = 'chicken';
  }

  // Detectar consciência de orçamento
  if (includes(message, ['barato', 'econômico', 'mínimo', 'combo', 'desconto', 'em conta'])) {
    conversationState.preferences.budget = 'low';
  } else if (includes(message, ['não importa', 'padrão', 'médio', 'normal'])) {
    conversationState.preferences.budget = 'medium';
  } else if (includes(message, ['premium', 'melhor', 'gostoso', 'luxo', 'especial', 'completo'])) {
    conversationState.preferences.budget = 'high';
  }

  // Atualizar stage da conversa
  if (includes(message, ['oi', 'olá', 'opa', 'tudo bem', 'e ai'])) {
    conversationState.stage = 'greeting';
  } else if (conversationState.stage === 'greeting') {
    conversationState.stage = 'preference_gathering';
  }
}

function promptForPreference(userMessage) {
  const pref = conversationState.preferences;
  
  if (pref.dietType === 'vegetarian') {
    return aiInstructions.aiInstructions.conversationFlow.recommendation_logic.health_conscious.message;
  } else if (pref.dietType === 'meat') {
    return aiInstructions.aiInstructions.conversationFlow.recommendation_logic.meat_lover.message;
  } else if (pref.dietType === 'chicken') {
    return aiInstructions.aiInstructions.conversationFlow.recommendation_logic.chicken_preference.message;
  } else if (pref.budget === 'low') {
    return aiInstructions.aiInstructions.conversationFlow.recommendation_logic.budget_conscious.message;
  } else if (pref.budget === 'high') {
    return aiInstructions.aiInstructions.conversationFlow.recommendation_logic.premium_customer.message;
  }
  
  // Resposta padrão
  return aiInstructions.aiInstructions.conversationFlow.ask_preference.messages[0];
}

function checkForRecommendation(userMessage) {
  const logic = aiInstructions.aiInstructions.conversationFlow.recommendation_logic;
  
  if (includes(userMessage, logic.health_conscious.keywords)) {
    return logic.health_conscious.message;
  }
  if (includes(userMessage, logic.meat_lover.keywords)) {
    return logic.meat_lover.message;
  }
  if (includes(userMessage, logic.chicken_preference.keywords)) {
    return logic.chicken_preference.message;
  }
  if (includes(userMessage, logic.budget_conscious.keywords)) {
    return logic.budget_conscious.message;
  }
  if (includes(userMessage, logic.premium_customer.keywords)) {
    return logic.premium_customer.message;
  }
  
  return null;
}

function findMenuItem(userMessage) {
  // Procurar em sanduíches
  for (const item of menuData.menu.sandwiches) {
    if (userMessage.includes(item.id) || 
        userMessage.includes(item.name.toLowerCase()) ||
        userMessage.includes(item.name.toLowerCase().split(' ')[0])) {
      return item;
    }
  }
  
  // Procurar em bebidas
  for (const item of menuData.menu.beverages) {
    if (userMessage.includes(item.id) || 
        userMessage.includes(item.name.toLowerCase())) {
      return item;
    }
  }
  
  return null;
}

function handleItemSelection(item) {
  // Adicionar item ao pedido
  currentOrder.items.push({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1
  });

  currentOrder.total += item.price;
  
  conversationState.stage = 'customizing';

  const response = `✅ Ótimo! Você escolheu: **${item.name}** (R$ ${item.price.toFixed(2)})\n\n`;
  const nextQuestion = randomElement([
    "Quer adicionar algum extra? 🎉",
    "Que tal adicionar algo especial? 🍗",
    "Vai querer algo mais com isso? 🥓"
  ]);
  
  return response + nextQuestion;
}

// ============================================
// Atualização de Ações Rápidas
// ============================================

function updateQuickActions(stage) {
  const quickActionsContainer = document.getElementById('quickActions');
  quickActionsContainer.innerHTML = '';

  let actions = [];

  if (stage === 'greeting' || stage === 'preference_gathering') {
    actions = [
      { text: '🍔 Burger', action: 'burger' },
      { text: '🍗 Frango', action: 'chicken' },
      { text: '🥪 Tradicional', action: 'traditional' },
      { text: '🥬 Vegetariano', action: 'vegetarian' }
    ];
  } else if (stage === 'customizing') {
    actions = [
      { text: '🍟 Batata', action: 'add_extra' },
      { text: '🥓 Bacon', action: 'add_bacon' },
      { text: '🥤 Bebida', action: 'add_drink' },
      { text: '✅ Confirmar', action: 'confirm' }
    ];
  }

  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.textContent = action.text;
    btn.onclick = () => handleQuickAction(action.action);
    quickActionsContainer.appendChild(btn);
  });
}

function handleQuickAction(action) {
  let message = '';
  
  switch (action) {
    case 'burger':
      message = 'burger';
      break;
    case 'chicken':
      message = 'frango';
      break;
    case 'traditional':
      message = 'misto quente';
      break;
    case 'vegetarian':
      message = 'vegetariano';
      break;
    case 'add_extra':
      message = 'quero adicionar batata';
      break;
    case 'add_bacon':
      message = 'bacon extra';
      break;
    case 'add_drink':
      message = 'preciso de uma bebida';
      break;
    case 'confirm':
      processOrder();
      return;
  }

  document.getElementById('messageInput').value = message;
  handleUserSubmit(message);
}

// ============================================
// Confirmação de Pedido
// ============================================

function showOrderConfirmation() {
  const modal = document.getElementById('orderModal');
  const orderSummary = document.getElementById('orderSummary');
  
  if (!modal || !orderSummary) {
    console.warn('Order modal or summary element not found');
    return;
  }
  
  let summaryHTML = '';
  let total = 0;

  currentOrder.items.forEach(item => {
    summaryHTML += `
      <div class="order-item">
        <span>${item.name} (${item.quantity}x)</span>
        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    total += item.price * item.quantity;
  });

  summaryHTML += `
    <div class="order-total">
      <span>Total:</span>
      <span>R$ ${total.toFixed(2)}</span>
    </div>
  `;

  orderSummary.innerHTML = summaryHTML;
  modal.classList.remove('hidden');
}

function closeModal() {
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    orderModal.classList.add('hidden');
  }
}

// ============================================
// Gerenciamento de Formulário
// ============================================

function handleUserSubmit(userMessage) {
  if (!userMessage.trim()) return;

  // Adicionar mensagem do usuário
  addMessage(userMessage, true);
  document.getElementById('messageInput').value = '';

  // Mostrar indicador de digitação
  showTypingIndicator();

  // Processar input do usuário
  processUserInput(userMessage);
}

// ============================================
// Processamento de Pedido
// ============================================

function processOrder() {
  closeModal();
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    
    const orderId = generateOrderId();
    const message = `✅ Pedido confirmado com sucesso! 🎉\n\n**Número do Pedido: #${orderId}**\n\nSeu lanche está sendo preparado!\n👨‍🍳 Tempo estimado: 20-30 minutos\n\nSeu pedido sairá em breve. Fique atento às atualizações!`;
    
    addMessage(message, false);
    
    // Simular atualizações de entrega
    simulateDeliveryUpdates(orderId);
  }, 1000);
}

function generateOrderId() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

function simulateDeliveryUpdates(orderId) {
  const updates = [
    { delay: 3000, message: `🔔 Pedido **#${orderId}** está pronto! Saindo para entrega agora! 🚗` },
    { delay: 8000, message: `🚗 Seu pedido está a caminho! ⏱️ Tempo estimado: 15-20 minutos` },
    { delay: 13000, message: `📍 Já estou bem perto! Chegando em alguns minutos! 👀` },
    { delay: 18000, message: `🎉 Chegou! Seu pedido **#${orderId}** está aqui! Bom apetite! 😋` }
  ];

  updates.forEach(update => {
    setTimeout(() => {
      addMessage(update.message, false);
    }, update.delay);
  });

  // Mensagem final
  setTimeout(() => {
    const finalMessage = "✨ Obrigado pela sua compra! Esperamos que tenha sido delicioso! 😊\n\n👍 Deixe seu feedback e ganhe pontos!\n🎁 Próximas compras com desconto!";
    addMessage(finalMessage, false);
  }, 20000);
}

// ============================================
// Funções Utilitárias
// ============================================

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function includes(text, keywords) {
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

// ============================================
// Gerenciamento Modal de Configurações
// ============================================

function openSettingsModal() {
  document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function saveAPIKey() {
  const input = document.getElementById('apiKeyInput');
  const key = input.value.trim();

  if (!key) {
    alert('❌ Por favor, cole sua chave de API do Gemini');
    return;
  }

  if (key.length < 20) {
    alert('❌ A chave de API parece muito curta');
    return;
  }

  // Verificar se é apenas asteriscos (não alterou a chave existente)
  if (/^\*+$/.test(key)) {
    alert('✅ API Key mantida');
    return;
  }

  // Salvar no localStorage
  localStorage.setItem('gemini_api_key', key);
  apiKey = key;
  useGeminiAPI = true;

  updateConnectionStatus('Conectado ✅');
  
  // Limpar input e mostrar masked
  input.type = 'password';
  input.value = '*'.repeat(Math.min(key.length, 50));

  alert('✅ API Key salva com sucesso!');

  // Mensagem no chat
  setTimeout(() => {
    addMessage('🎉 API Key configurada! Agora você pode conversar com mais inteligência!', false);
  }, 500);
}

async function testConnection() {
  if (!apiKey) {
    updateConnectionStatus('Desconectado ❌');
    alert('❌ Nenhuma API Key configurada');
    return;
  }

  updateConnectionStatus('⏳ Testando...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Teste de conexão',
        apiKey: apiKey
      })
    });

    if (response.ok) {
      updateConnectionStatus('Conectado ✅');
      alert('✅ Conexão com Gemini API bem-sucedida!');
      addMessage('🎉 Conexão com IA estabelecida com sucesso!', false);
    } else {
      const data = await response.json();
      updateConnectionStatus('Erro na conexão ❌');
      alert(`❌ Erro: ${data.error}`);
    }
  } catch (error) {
    updateConnectionStatus('Desconectado ❌');
    alert(`❌ Erro de conexão: ${error.message}`);
  }
}

// ============================================
// Inicialização
// ============================================

function updateConnectionStatus(status) {
  const statusSpan = document.getElementById('connectionStatus');
  if (statusSpan) {
    statusSpan.textContent = `Status: ${status}`;
    statusSpan.style.color = status.includes('Conectado') ? '#4CAF50' : '#FF9800';
  }
}

async function initialize() {
  await loadMenuData();
  await loadAIInstructions();
  initializeAPIKey();

  // Mensagem de boas-vindas
  const welcomeMessage = "🍔 Bem-vindo à Hora do Lanche! Que tal começarmos?";
  addMessage(welcomeMessage, false);
  
  updateQuickActions('greeting');
}

// ============================================
// Event Listeners
// ============================================

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('messageInput').value;
  handleUserSubmit(message);
});

// Botão de configurações
document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);

// Botões do modal de configurações
document.getElementById('closeSettings').addEventListener('click', closeSettingsModal);
document.getElementById('saveSettings').addEventListener('click', saveAPIKey);
document.getElementById('testConnection').addEventListener('click', testConnection);

// Modal de pedido (if it exists - now removed/disabled)
// const closeBtn = document.querySelector('.close');
// if (closeBtn) {
//   closeBtn.addEventListener('click', closeModal);
// }

// const confirmOrderBtn = document.getElementById('confirmOrder');
// if (confirmOrderBtn) {
//   confirmOrderBtn.addEventListener('click', () => {
//     closeModal();
//     processOrder();
//   });
// }

// const cancelOrderBtn = document.getElementById('cancelOrder');
// if (cancelOrderBtn) {
//   cancelOrderBtn.addEventListener('click', closeModal);
// }

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initialize);

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
  const settingsModal = document.getElementById('settingsModal');
  
  if (settingsModal && event.target === settingsModal) {
    settingsModal.classList.add('hidden');
  }
});
