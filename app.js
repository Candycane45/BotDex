// Bot data
const botsData = {
  "bots": [
    {
      "id": 1,
      "name": "CyberGuard Bot",
      "title": "Cyber Security Assistant",
      "description": "Analyzes and improves your cyber hygiene practices",
      "icon": "🛡️",
      "color": "#e74c3c"
    },
    {
      "id": 2,
      "name": "Wise Advisor Bot", 
      "title": "Life Guidance Counselor",
      "description": "Provides thoughtful advice and guidance for life decisions",
      "icon": "🦉",
      "color": "#3498db"
    },
    {
      "id": 3,
      "name": "Empathy Bot",
      "title": "Compassionate Listener", 
      "description": "Listens to your problems with understanding and compassion",
      "icon": "💙",
      "color": "#9b59b6"
    },
    {
      "id": 4,
      "name": "Roast Master Bot",
      "title": "Witty Roast Specialist",
      "description": "Listens to you and delivers clever roasts in return",
      "icon": "🔥",
      "color": "#e67e22"
    },
    {
      "id": 5,
      "name": "Energy Mirror Bot",
      "title": "Vibe Synchronizer",
      "description": "Matches and amplifies your current energy level perfectly",
      "icon": "⚡",
      "color": "#f39c12"
    },
    {
      "id": 6,
      "name": "Zen Bot",
      "title": "Meditation & Calm Guide",
      "description": "Helps you find calm, inner peace, and mindfulness",
      "icon": "🧘",
      "color": "#27ae60"
    },
    {
      "id": 7,
      "name": "Meme Lord Bot",
      "title": "Professional Meme Curator", 
      "description": "Responds to everything with perfectly matched memes",
      "icon": "😂",
      "color": "#8e44ad"
    }
  ]
};

// Function to create a bot card
function createBotCard(bot) {
    const card = document.createElement('div');
    card.className = 'bot-card';
    card.setAttribute('data-bot-id', bot.id);
    
    card.innerHTML = `
        <span class="bot-icon">${bot.icon}</span>
        <h3 class="bot-name">${bot.name}</h3>
        <p class="bot-title">${bot.title}</p>
        <p class="bot-description">${bot.description}</p>
        <button class="bot-button" data-bot-id="${bot.id}" data-bot-name="${bot.name}">
            Chat with ${bot.name}
        </button>
    `;
    
    return card;
}

// Function to render all bot cards
function renderBotCards() {
    const botGrid = document.getElementById('botGrid');
    
    botsData.bots.forEach(bot => {
        const botCard = createBotCard(bot);
        botGrid.appendChild(botCard);
    });
    
    // Add click event listeners to all bot buttons after rendering
    const botButtons = document.querySelectorAll('.bot-button');
    botButtons.forEach(button => {
        button.addEventListener('click', handleBotButtonClick);
    });
}

// Function to handle bot button clicks
function handleBotButtonClick(event) {
    const button = event.target;
    const botId = parseInt(button.getAttribute('data-bot-id'));
    const botName = button.getAttribute('data-bot-name');
    
    // Prevent any default behavior
    event.preventDefault();
    event.stopPropagation();
    
    // Get bot-specific messages
    const botMessages = {
        1: "🛡️ CyberGuard Bot activated!\n\nI'm ready to analyze your digital security and help improve your cyber hygiene. I can check your passwords, review your privacy settings, and guide you through securing your online accounts.\n\nWhat would you like to secure today?",
        2: "🦉 Wise Advisor Bot here!\n\nI'm ready to provide thoughtful guidance for any life decisions or challenges you're facing. Whether it's career advice, relationship guidance, or personal growth strategies, I'm here to help.\n\nWhat's on your mind?",
        3: "💙 Empathy Bot listening...\n\nI'm here to understand and support you through whatever you're experiencing. I offer a safe space where you can share your feelings without judgment.\n\nPlease tell me what's on your heart today.",
        4: "🔥 Roast Master Bot locked and loaded!\n\nReady to deliver some witty burns and playful roasts! I'll keep it fun and clever while giving you the comedic reality check you're looking for.\n\nWhat do you want me to roast?",
        5: "⚡ Energy Mirror Bot syncing to your vibe!\n\nI'll match whatever energy you bring - whether you're excited, chill, frustrated, or anything in between. I adapt to your mood perfectly.\n\nWhat's your current energy level?",
        6: "🧘 Zen Bot in peaceful mode...\n\nI'm here to help you find calm and inner peace. Through guided breathing, mindfulness techniques, and gentle wisdom, we'll work together to center your mind.\n\nTake a deep breath and tell me what's causing you stress.",
        7: "😂 Meme Lord Bot reporting for duty!\n\nReady to respond with the perfect memes for any situation! Whether you need reaction memes, wholesome content, or something to make you laugh, I've got the perfect meme for every mood.\n\nWhat's happening that needs meme treatment?"
    };
    
    const message = botMessages[botId] || `Hello! You've chosen to chat with ${botName}. This is a demo - the actual chat functionality would be implemented here.`;
    
    // Add visual feedback to button
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
    
    // Show alert with bot-specific message
    setTimeout(() => {
        alert(message);
        
        // Reset button appearance
        button.style.transform = '';
        button.style.opacity = '';
    }, 100);
    
    // Log the interaction
    console.log(`User initiated chat with ${botName} (ID: ${botId})`);
}

// Function to add hover effects and interactions
function addInteractiveEffects() {
    const botCards = document.querySelectorAll('.bot-card');
    
    botCards.forEach(card => {
        // Add mouse enter effect
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-4px)';
            }
        });
        
        // Add mouse leave effect
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Bot Companion Dashboard...');
    
    renderBotCards();
    
    // Add interactive effects after cards are rendered
    setTimeout(() => {
        addInteractiveEffects();
        console.log('Interactive effects added');
    }, 100);
    
    console.log('Bot Companion Dashboard initialized successfully!');
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('bot-button')) {
            event.preventDefault();
            focusedElement.click();
        }
    }
});

// Legacy function for compatibility (though we now use event listeners)
function startChatWithBot(botName, botId) {
    const button = document.querySelector(`[data-bot-id="${botId}"]`);
    if (button) {
        button.click();
    }
}

// Export functions for potential future use
window.botDashboard = {
    startChatWithBot,
    renderBotCards,
    botsData,
    handleBotButtonClick
};