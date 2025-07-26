// Bot data
const botsData = {
  "bots": [
    {
      "id": 1,
      "name": "CyberGuard Bot",
      "title": "Cyber Security Assistant",
      "description": "Analyzes and improves your cyber hygiene practices",
      "icon": "assets/shield.png",
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

// Modal elements - will be initialized after DOM loads
let modal, modalBackdrop, modalCloseButton, modalBotIcon, modalBotName, modalMessage, modalContinueButton;

// Bot messages data with PNG icons
const botMessages = {
    1: `CyberGuard Bot activated!

I'm ready to analyze your digital security and help improve your cyber hygiene. I can check your passwords, review your privacy settings, and guide you through securing your online accounts.

What would you like to secure today?`,

    2: `<img src="images/icons/advisor.png" alt="Wise Advisor Bot" class="bot-message-icon"> Wise Advisor Bot here!

I'm ready to provide thoughtful guidance for any life decisions or challenges you're facing. Whether it's career advice, relationship guidance, or personal growth strategies, I'm here to help.

What's on your mind?`,

    3: `<img src="images/icons/empathyicon"> Empathy Bot listening...

I'm here to understand and support you through whatever you're experiencing. I offer a safe space where you can share your feelings without judgment.

Please tell me what's on your heart today.`,

    4: `<img src="images/icons/roast.png" alt="Roast Master Bot" class="bot-message-icon"> Roast Master Bot locked and loaded!

Ready to deliver some witty burns and playful roasts! I'll keep it fun and clever while giving you the comedic reality check you're looking for.

What do you want me to roast?`,

    5: `<img src="images/icons/energy.png" alt="Energy Mirror Bot" class="bot-message-icon"> Energy Mirror Bot syncing to your vibe!

I'll match whatever energy you bring - whether you're excited, chill, frustrated, or anything in between. I adapt to your mood perfectly.

What's your current energy level?`,

    6: `<img src="images/icons/zen.png" alt="Zen Bot" class="bot-message-icon"> Zen Bot in peaceful mode...

I'm here to help you find calm and inner peace. Through guided breathing, mindfulness techniques, and gentle wisdom, we'll work together to center your mind.

Take a deep breath and tell me what's causing you stress.`,

    7: `<img src="images/icons/meme.png" alt="Meme Lord Bot" class="bot-message-icon"> Meme Lord Bot reporting for duty!

Ready to respond with the perfect memes for any situation! Whether you need reaction memes, wholesome content, or something to make you laugh, I've got the perfect meme for every mood.

What's happening that needs meme treatment?`
};


// Function to create a bot car
function createBotCard(bot) {
    const card = document.createElement('div');
    card.className = 'bot-card';
    card.setAttribute('data-bot-id', bot.id);
    
    card.innerHTML = `
        <img src="${bot.icon}" alt="${bot.name}" class="bot-icon">
        <h3 class="bot-name">${bot.name}</h3>
        <p class="bot-title">${bot.title}</p>
        <p class="bot-description">${bot.description}</p>
        <button class="bot-button" data-bot-id="${bot.id}" data-bot-name="${bot.name}">
            Chat with ${bot.name}
        </button>
    `;
    
    return card;
}


// Function to open the modal
function openModal(botId, botName, botIcon, message) {
    if (!modal) {
        console.error('Modal not initialized');
        return;
    }
    
    modalBotIcon.textContent = botIcon;
    modalBotName.textContent = botName;
    modalMessage.textContent = message;
    
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    
    // Focus management for accessibility
    setTimeout(() => {
        modalCloseButton.focus();
    }, 100);
}

// Function to close the modal
function closeModal() {
    if (!modal) return;
    
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// Function to handle keyboard events
function handleKeydown(event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
    }
}

// Function to handle bot button clicks
function handleBotButtonClick(event) {
    const button = event.target;
    const botId = parseInt(button.getAttribute('data-bot-id'));
    const botName = button.getAttribute('data-bot-name');
    
    console.log(`Button clicked for bot: ${botName} (ID: ${botId})`);
    
    // Prevent any default behavior
    event.preventDefault();
    event.stopPropagation();
    
    // Find the bot data
    const bot = botsData.bots.find(b => b.id === botId);
    
    if (!bot) {
        console.error(`Bot not found for ID: ${botId}`);
        return;
    }
    
    const message = botMessages[botId] || `Hello! You've chosen to chat with ${botName}. This is a demo - the actual chat functionality would be implemented here.`;
    
    // Add visual feedback to button
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
    
    // Open modal
    setTimeout(() => {
        openModal(botId, botName, bot.icon, message);
        
        // Reset button appearance
        button.style.transform = '';
        button.style.opacity = '';
    }, 100);
    
    // Log the interaction
    console.log(`User initiated chat with ${botName} (ID: ${botId})`);
}

// Function to initialize modal elements and event listeners
function initializeModal() {
    modal = document.getElementById('botModal');
    modalBackdrop = modal.querySelector('.modal__backdrop');
    modalCloseButton = document.getElementById('modalCloseButton');
    modalBotIcon = document.getElementById('modalBotIcon');
    modalBotName = document.getElementById('modalBotName');
    modalMessage = document.getElementById('modalMessage');
    modalContinueButton = document.getElementById('modalContinueButton');

    if (!modal || !modalBackdrop || !modalCloseButton) {
        console.error('Modal elements not found');
        return;
    }

    // Add event listeners for closing the modal
    modalCloseButton.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    modalContinueButton.addEventListener('click', closeModal);

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', handleKeydown);
    
    console.log('Modal initialized successfully');
}

// Function to render all bot cards
function renderBotCards() {
    const botGrid = document.getElementById('botGrid');
    
    if (!botGrid) {
        console.error('Bot grid element not found');
        return;
    }
    
    botsData.bots.forEach(bot => {
        const botCard = createBotCard(bot);
        botGrid.appendChild(botCard);
    });
    
    // Add click event listeners to all bot buttons after rendering
    const botButtons = document.querySelectorAll('.bot-button');
    console.log(`Found ${botButtons.length} bot buttons`);
    
    botButtons.forEach((button, index) => {
        button.addEventListener('click', handleBotButtonClick);
        console.log(`Event listener added to button ${index + 1}`);
    });
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
    
    // Render bot cards first
    renderBotCards();
    
    // Initialize modal
    initializeModal();
    
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
        if (focusedElement.classList.contains('bot-button') && modal && modal.classList.contains('hidden')) {
            event.preventDefault();
            focusedElement.click();
        }
    }
});

// Legacy function for compatibility
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
    handleBotButtonClick,
    openModal,
    closeModal
};
