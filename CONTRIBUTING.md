# Contribuindo para Hora do Lanche

Obrigado por seu interesse em contribuir! Este documento fornece diretrizes e instruções para colaborar com este projeto.

## 📋 Como Começar

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/hora_do_lanche_chatbot.git
   ```

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/sua-feature
   ```

3. **Faça suas mudanças**
   - Desenvolva sua funcionalidade
   - Mantenha o código limpo e bem documentado

4. **Commit suas mudanças**
   ```bash
   git commit -m "feat: Descrição clara da mudança"
   ```

5. **Push para a branch**
   ```bash
   git push origin feature/sua-feature
   ```

6. **Abra um Pull Request**
   - Descreva suas mudanças
   - Referencie issues relacionadas

---

## 🎨 Padrões de Código

### JavaScript
- Use `const` por padrão, `let` apenas quando necessário
- Nomes descritivos: `getUserPreferences()` não `getUP()`
- Adicione comentários para lógica complexa
- Use arrow functions `() => {}` quando apropriado

```javascript
// ✅ BOM
const processUserInput = (message) => {
  const lowerMessage = message.toLowerCase();
  return analyzePreferences(lowerMessage);
};

// ❌ EVITAR
function processUserInput(msg) {
  return analyzePreferences(msg.toLowerCase());
}
```

### HTML
- Semântica apropriada: `<button>`, `<nav>`, `<main>`, etc.
- Atributos bem estruturados
- Indentação consistente (2 espaços)

### CSS
- Use classes ao invés de IDs para estilos
- Organize por seção com comentários
- Mobile-first approach

---

## 📝 Tipos de Contribuição

### 🐛 Reportar Bugs
1. Verifique se já não existe issue similar
2. Descreva o comportamento esperado vs observado
3. Forneça steps para reproduzir
4. Inclua screenshots se relevante

**Título**: `Bug: Descrição breve`
**Descrição**:
```
## Descrição
O que acontece de errado?

## Steps para Reproduzir
1. Faça isso
2. Depois isso
3. Observe o erro

## Comportamento Esperado
O que deveria acontecer?

## Screenshots
[se aplicável]

## Ambiente
- Browser: [ex: Chrome 90]
- OS: [ex: Windows 10]
```

### ✨ Sugerir Melhorias
**Título**: `Feature: Descrição da feature`
**Descrição**:
```
## Descrição
Que problema isso resolve?

## Solução Proposta
Como deveria funcionar?

## Exemplos
[código ou mockup se relevante]

## Contexto Adicional
Informações relevantes?
```

### 🔧 Melhorias de Código
- Refatorações que melhoram performance
- Melhor estrutura e organização
- Documentação adicional
- Testes

---

## 💡 Ideias de Features para Contribuir

### Curto Prazo
- [ ] Temas escuro/claro
- [ ] Mais emojis e animações
- [ ] Suporte a mais idiomas
- [ ] Validação de campos
- [ ] Manutenção de histórico de chat

### Médio Prazo
- [ ] Integração com IA real
- [ ] Sistema de rating/feedback
- [ ] Filtro de produtos
- [ ] Carrinho persistente
- [ ] Testes unitários

### Longo Prazo
- [ ] Backend completo
- [ ] Dashboard admin
- [ ] Analytics
- [ ] App mobile

---

## 🧪 Testando Localmente

```bash
# Clone e instale
git clone [repo_url]
cd hora_do_lanche_chatbot
npm install

# Rode o servidor
npm start
# Acesse http://localhost:8000
```

### Checklist antes de fazer PR

- [ ] Código limpo e sem erros de lógica
- [ ] Funciona em desktop, tablet e mobile
- [ ] Sem console errors ou warnings
- [ ] Atualizado com as últimas mudanças da main
- [ ] Comentários adicionados onde necessário
- [ ] README atualizado se relevante
- [ ] Commits com mensagens descritivas

---

## 📚 Estrutura do Projeto

```
hora_do_lanche_chatbot/
├── index.html              ← Página principal (estrutura)
├── styles.css              ← Estilos (CSS)
├── data/
│   ├── menu.json          ← Cardápio (dados)
│   └── ai-instructions.json ← Lógica IA (comportamento)
├── js/
│   └── chat.js            ← Lógica do chat (JavaScript)
├── CONTRIBUTING.md        ← Este arquivo
├── README.md              ← Documentação principal
└── package.json           ← Dependências do projeto
```

---

## 🚀 Workflow de Desenvolvimento

1. **Branch da main**: `git checkout -b feature/xyz`
2. **Faça suas mudanças**: Edite os arquivos
3. **Teste localmente**: `npm start`
4. **Commit gradual**: Pequenos commits com mensagens claras
5. **Push**: `git push origin feature/xyz`
6. **PR**: Descreva o que foi feito

---

## 📞 Comunicação

- **Issues**: Para bugs e features
- **Discussions**: Para ideias e perguntas
- **Pull Requests**: Para submeter código

---

## ✅ Checklist de Review

Antes de mergear um PR, verificamos:

- ✅ Código segue padrões do projeto
- ✅ Sem breaking changes desnecessárias
- ✅ Funcionalidade comprovada
- ✅ Sem console errors
- ✅ Mobile/desktop responsive
- ✅ Documentado adequadamente

---

## 🎓 Recursos Úteis

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [CSS Tricks](https://css-tricks.com/)
- [Git Documentation](https://git-scm.com/doc)

---

## 📜 Código de Conduta

- Seja respeitoso com todos
- Abra feedback construtivo
- Dê crédito quando apropriado
- Reporte comportamento inapropriado

---

Obrigado por contribuir! 🎉
