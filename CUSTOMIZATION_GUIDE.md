# 🍔 Hora do Lanche - Chatbot UI

A simple, versatile, and easily customizable restaurant chatbot interface with warm colors (red and wine red).

## 📁 File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # Styling with CSS variables for easy customization
├── script.js       # Basic chatbot functionality
└── README.md       # Documentation
```

## 🎨 Color Customization

All colors are defined as CSS variables in `styles.css`. Modify them in the `:root` section:

```css
:root {
    /* Primary Colors */
    --primary-red: #DC143C;      /* Crimson Red */
    --dark-red: #8B0000;         /* Dark Red */
    --wine-red: #722F37;         /* Wine Red */
    --accent-wine: #954353;      /* Accent Wine */
    
    /* Neutral Colors */
    --bg-cream: #FFF8F3;         /* Cream Background */
    --bg-light: #FAE8DC;         /* Light Background */
    --text-dark: #3E2723;        /* Dark Text */
    --text-light: #FFFFFF;       /* Light Text */
}
```

## 🔧 How to Customize

### Change Primary Color Scheme
Replace the color values in the `:root` section:

```css
--primary-red: #your-color;
--wine-red: #your-color;
```

### Adjust Spacing
Modify spacing variables (all sizes in pixels):

```css
--spacing-md: 16px;
--spacing-lg: 24px;
```

### Change Border Radius
Adjust roundness of elements:

```css
--radius-md: 8px;
--radius-lg: 16px;
```

## 🚀 Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Warm Color Palette** - Professional red and wine red tones  
✅ **Easy to Modify** - CSS variables for quick customization  
✅ **Smooth Animations** - Elegant transitions and message animations  
✅ **Quick Action Buttons** - Pre-defined options for users  
✅ **Auto-scrolling** - Messages automatically scroll into view  
✅ **Dark Mode Support** - Includes dark mode media query  

## 🎯 Usage

1. Open `index.html` in your browser
2. Type messages in the input field
3. Click "Enviar" or press Enter to send
4. Click quick action buttons for suggested actions

## 🔗 Integration

### Connect to a Backend API

In `script.js`, replace the `generateBotResponse()` function with an API call:

```javascript
async function sendMessageToAPI(message) {
    const response = await fetch('your-api-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    });
    return await response.json();
}
```

## 📱 Responsive Breakpoints

- **Desktop**: Full UI with all elements
- **Tablet (600px)**: Optimized spacing
- **Mobile (400px)**: Compact view, send button becomes arrow icon

## 🎨 Dark Mode

The UI automatically adapts to system dark mode preference. Customize dark mode colors in the `@media (prefers-color-scheme: dark)` section.

## 💡 Tips for Modification

1. **Add Custom Fonts**: Import Google Fonts in `index.html`
2. **Change Animation Speed**: Modify `--transition: 0.3s`
3. **Add More Button**: Duplicate `.quick-btn` elements
4. **Extend Messages**: Add more response patterns in `script.js`

---

**Created for: Hora do Lanche Restaurant**  
*Simple. Versatile. Beautiful.*
