// Bot data
let conversationHistory = [];

const botsData = {
  bots: [
    {
      id: 1,
      name: "CyberGuard Bot",
      title: "Cyber Security Assistant",
      description: "Analyzes and improves your cyber hygiene practices",
      icon: "assets/shield.png",
      color: "#e74c3c",
    },
    {
      id: 2,
      name: "Wise Advisor Bot",
      title: "Life Guidance Counselor",
      description: "Provides thoughtful advice and guidance for life decisions",
      icon: "assets/wise-owl.png",
      color: "#3498db",
    },
    {
      id: 3,
      name: "Empathy Bot",
      title: "Compassionate Listener",
      description: "Listens to your problems with understanding and compassion",
      icon: "assets/empathy-bot.png",
      color: "#9b59b6",
    },
    {
      id: 4,
      name: "Roast Master Bot",
      title: "Witty Roast Specialist",
      description: "Listens to you and delivers clever roasts in return",
      icon: "assets/roast-master.png",
      color: "#e67e22",
    },
    {
      id: 5,
      name: "Energy Mirror Bot",
      title: "Vibe Synchronizer",
      description: "Matches and amplifies your current energy level perfectly",
      icon: "assets/bolt.png",
      color: "#f39c12",
    },
    {
      id: 6,
      name: "Zen Bot",
      title: "Meditation & Calm Guide",
      description: "Helps you find calm, inner peace, and mindfulness",
      icon: "assets/zen.png",
      color: "#27ae60",
    },
    {
      id: 7,
      name: "Meme Lord Bot",
      title: "Professional Meme Curator",
      description: "Responds to everything with perfectly matched memes",
      icon: "assets/meme-lord.png",
      color: "#8e44ad",
    },
  ],
};

// Modal elements - will be initialized after DOM loads
let modal,
  modalBackdrop,
  modalCloseButton,
  modalBotIcon,
  modalBotName,
  modalMessage,
  modalContinueButton;

// Bot messages data with PNG icons
const botMessages = {
  1: `CyberGuard Bot activated!

I'm ready to analyze your digital security and help improve your cyber hygiene. I can check your passwords, review your privacy settings, and guide you through securing your online accounts.

What would you like to secure today?`,

  2: `Wise Advisor Bot here!

I'm ready to provide thoughtful guidance for any life decisions or challenges you're facing. Whether it's career advice, relationship guidance, or personal growth strategies, I'm here to help.

What's on your mind?`,

  3: `Empathy Bot listening...

I'm here to understand and support you through whatever you're experiencing. I offer a safe space where you can share your feelings without judgment.

Please tell me what's on your heart today.`,

  4: `Roast Master Bot locked and loaded!

Ready to deliver some witty burns and playful roasts! I'll keep it fun and clever while giving you the comedic reality check you're looking for.

What do you want me to roast?`,

  5: `Energy Mirror Bot syncing to your vibe!

I'll match whatever energy you bring - whether you're excited, chill, frustrated, or anything in between. I adapt to your mood perfectly.

What's your current energy level?`,

  6: `Zen Bot in peaceful mode...

I'm here to help you find calm and inner peace. Through guided breathing, mindfulness techniques, and gentle wisdom, we'll work together to center your mind.

Take a deep breath and tell me what's causing you stress.`,

  7: `Meme Lord Bot reporting for duty!

Ready to respond with the perfect memes for any situation! Whether you need reaction memes, wholesome content, or something to make you laugh, I've got the perfect meme for every mood.

What's happening that needs meme treatment?`,
};

// Function to create a bot car
function createBotCard(bot) {
  const card = document.createElement("div");
  card.className = "bot-card";
  card.setAttribute("data-bot-id", bot.id);

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

// Function to open the modal - Updated to accept bot color
function openModal(botId, botName, botIcon, message, botColor) {
  if (!modal) {
    console.error("Modal not initialized");
    return;
  }

  // Set the bot's color as CSS custom properties on the modal
  modal.style.setProperty("--current-bot-color", botColor);
  modal.style.setProperty("--current-bot-color-light", botColor + "20");
  modal.style.setProperty("--current-bot-color-lighter", botColor + "15");

  modalBotIcon.innerHTML = `<img src="${botIcon}" alt="${botName}" class="bot-modal-icon" />`;
  modalBotName.textContent = botName;
  modalMessage.textContent = message;

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  setTimeout(() => {
    modalCloseButton.focus();
  }, 100);

  // ✅ Redirect to chat page when user clicks Continue
  modalContinueButton.onclick = function () {
    window.location.href = `/chat.html?botid=${botId}`;
  };
}

// Function to close the modal
function closeModal() {
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

// Function to handle keyboard events
function handleKeydown(event) {
  if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    closeModal();
  }
}

// Function to handle bot button clicks - Updated to pass bot color
function handleBotButtonClick(event) {
  const button = event.target;
  const botId = parseInt(button.getAttribute("data-bot-id"));
  const botName = button.getAttribute("data-bot-name");

  console.log(`Button clicked for bot: ${botName} (ID: ${botId})`);

  // Prevent any default behavior
  event.preventDefault();
  event.stopPropagation();

  // Find the bot data
  const bot = botsData.bots.find((b) => b.id === botId);

  if (!bot) {
    console.error(`Bot not found for ID: ${botId}`);
    return;
  }

  const message =
    botMessages[botId] ||
    `Hello! You've chosen to chat with ${botName}. This is a demo - the actual chat functionality would be implemented here.`;

  // Add visual feedback to button
  button.style.transform = "scale(0.95)";
  button.style.opacity = "0.8";

  // Open modal with bot's color - UPDATED LINE
  setTimeout(() => {
    openModal(botId, botName, bot.icon, message, bot.color);

    // Reset button appearance
    button.style.transform = "";
    button.style.opacity = "";
  }, 100);

  // Log the interaction
  console.log(`User initiated chat with ${botName} (ID: ${botId})`);
}

// Function to initialize modal elements and event listeners
function initializeModal() {
  modal = document.getElementById("botModal");
  modalBackdrop = modal.querySelector(".modal__backdrop");
  modalCloseButton = document.getElementById("modalCloseButton");
  modalBotIcon = document.getElementById("modalBotIcon");
  modalBotName = document.getElementById("modalBotName");
  modalMessage = document.getElementById("modalMessage");
  modalContinueButton = document.getElementById("modalContinueButton");

  if (!modal || !modalBackdrop || !modalCloseButton) {
    console.error("Modal elements not found");
    return;
  }

  // Add event listeners for closing the modal
  modalCloseButton.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  modalContinueButton.addEventListener("click", closeModal);

  // Add keyboard event listener for Escape key
  document.addEventListener("keydown", handleKeydown);

  console.log("Modal initialized successfully");
}

// Function to render all bot cards
function renderBotCards() {
  const botGrid = document.getElementById("botGrid");

  if (!botGrid) {
    console.error("Bot grid element not found");
    return;
  }

  botsData.bots.forEach((bot) => {
    const botCard = createBotCard(bot);
    botGrid.appendChild(botCard);
  });

  // Add click event listeners to all bot buttons after rendering
  const botButtons = document.querySelectorAll(".bot-button");
  console.log(`Found ${botButtons.length} bot buttons`);

  botButtons.forEach((button, index) => {
    button.addEventListener("click", handleBotButtonClick);
    console.log(`Event listener added to button ${index + 1}`);
  });
}

// Function to add hover effects and interactions
function addInteractiveEffects() {
  const botCards = document.querySelectorAll(".bot-card");

  botCards.forEach((card) => {
    // Add mouse enter effect
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(-4px)";
      }
    });

    // Add mouse leave effect
    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(0)";
      }
    });
  });
}

// Add keyboard navigation support
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    const focusedElement = document.activeElement;
    if (
      focusedElement.classList.contains("bot-button") &&
      modal &&
      modal.classList.contains("hidden")
    ) {
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
  closeModal,
};
let botData;
let _botId;

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  const queryParams = new URLSearchParams(window.location.search);
  const botId = queryParams.get("botid");

  if (path.includes("chat.html") && !botId) {
    window.location.replace("\\");
  }

  // Check if we are on the chat page and a botId is present
  if (path.includes("chat.html") && botId) {
    const bot = botsData.bots.find((b) => b.id === parseInt(botId));
    if (bot) {
      botData = bot;
      _botId = botId;
      const botChatButton = document.getElementById("sendChat");
      botChatButton.addEventListener("click", sendChat);
    } else {
      // Redirect to homepage if botId is invalid
      window.location.href = "/index.html";
    }
  } else if (path === "/" || path.includes("index.html")) {
    // Otherwise, render the homepage content
    renderBotCards();
    addInteractiveEffects();
    initializeModal();

    setTimeout(() => {
      addInteractiveEffects();
      console.log("Interactive effects added");
    }, 100);
  }
});

async function sendChat() {
  const chatInput = document.getElementById("userInput");
  const userMessage = chatInput.value.trim();

  if (userMessage === "") return;
  console.log("User: ", userMessage);

  // todo: add to the ui user message
  displayMessage("user", userMessage);
  conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });
  // Clear input field
  chatInput.value = "";

  // Get bot's response
  const botResponse = await sendMessageToBot(_botId, userMessage);

  // Display bot's message and add to history
  // todo: add to the ui bot message
  displayMessage("bot", botResponse);
  conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });
  console.log("BOT: ", botResponse);
}

// Function to display a message in the chat history
function displayMessage(sender, message, iconUrl = null) {
  const chatMessages = document.getElementById("chatMessages");

  //   const chatHistory = document.getElementById("chatHistory");
  //   const messageContainer = document.createElement("div");
  //   messageContainer.classList.add("chat-message-container");
  //   messageContainer.classList.add(
  //     sender === "user" ? "user-message" : "bot-message"
  //   );

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = text;
    messageDiv.setAttribute("tabindex", "0");
    chatMessages.appendChild(messageDiv);

    // Animate with GSAP
    gsap.from(messageDiv, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: "power2.out",
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  //   if (sender === "bot" && iconUrl) {
  if (sender === "bot") {
    addMessage(message, "bot");

    // const botIcon = document.createElement("img");
    // botIcon.src = iconUrl;
    // botIcon.alt = "Bot Icon";
    // botIcon.classList.add("message-icon");
    // messageContainer.appendChild(botIcon);
  } else {
    addMessage(message, "user");
  }

  //   const messageElement = document.createElement("div");
  //   messageElement.classList.add("chat-message");
  //   messageElement.textContent = message;
  //   messageContainer.appendChild(messageElement);

  //   chatHistory.appendChild(messageContainer);
  //   chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
}

// Function to send message to the bot and get a response
async function sendMessageToBot(botId, message) {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botId: botId,
        message: message,
        history: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();
    return data.response; // Return the bot's text response
  } catch (error) {
    console.error("Error sending message:", error);
    return "Sorry, I am having trouble connecting to the AI. Please try again later.";
  }
}
