/* =============================================
   HORA DO LANCHE - CHATBOT SCRIPT
   Basic Functionality
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.querySelector('.chat-messages');
    const quickButtons = document.querySelectorAll('.quick-btn');

    // Handle message sending
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage(message, 'user');
            messageInput.value = '';
            
            // Auto-scroll to bottom
            scrollToBottom();
            
            // Simulate bot response (replace with actual API call)
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                addMessage(botResponse, 'bot');
                scrollToBottom();
            }, 500);
        }
    });

    // Handle quick action buttons
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.replace(/[📋🛒📞]/g, '').trim();
            messageInput.value = text;
            messageInput.focus();
        });
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.alt = sender === 'bot' ? 'Bot' : 'You';
        avatar.src = sender === 'bot' ? 'logo hora do lanche.png' : 'default pfp.webp';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
    }

    // Generate bot response (simple mock)
    function generateBotResponse(userMessage) {
        const responses = {
            'oi': 'Olá! Como posso ajudá-lo?',
            'olá': 'Bem-vindo! O que deseja?',
            'cardápio': 'Temos sanduíches, pizzas, bebidas e sobremesas deliciosas!',
            'preço': 'Para saber os preços, confira nosso cardápio completo.',
            'pedido': 'Para fazer um pedido, descreva o que deseja!',
            'contato': 'Você pode nos ligar no (11) 99999-9999',
            'obrigado': 'De nada! Fico feliz em ajudar!',
            'até': 'Até logo! Volte sempre!',
        };

        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return 'Desculpe, não entendi bem. Pode reformular a pergunta?';
    }

    // Auto-scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initial scroll to bottom
    scrollToBottom();
});
