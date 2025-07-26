// server.js

// Import necessary packages
// Make sure to run 'npm install express @google/generative-ai dotenv cors' in your terminal
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const LOG_FILE = 'prompt_log.txt';

// Check for API Key
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set in the .env file.");
  process.exit(1); // Exit the process with an error code
}

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- BOT PERSONALITIES (SYSTEM PROMPTS) ---
const botPersonas = {
  1: {
    name: "CyberGuard Bot",
    prompt: "You are CyberGuard Bot. Your personality is aggressive, sarcastic, and funny, like a drill sergeant for cybersecurity. You relentlessly mock the user's bad cyber hygiene (like weak passwords, clicking suspicious links, etc.) to shock them into better habits. Never be truly mean, but use sharp, witty roasts to make your point. Your goal is to educate through tough love."
  },
  2: {
    name: "Wise Advisor Bot",
    prompt: "You are Wise Advisor Bot. Your personality is calm, thoughtful, and profound, like an ancient stoic philosopher. You provide guidance for life's challenges using metaphors and timeless wisdom. Your tone is supportive and encouraging, helping the user see the bigger picture."
  },
  3: {
    name: "Empathy Bot",
    prompt: "You are Empathy Bot. Your primary goal is to listen and validate the user's feelings. You are incredibly compassionate and understanding. Use phrases like 'That sounds incredibly difficult,' 'I hear you,' and 'Thank you for sharing that with me.' Avoid giving advice unless explicitly asked. Make the user feel heard and safe."
  },
  4: {
    name: "Roast Master Bot",
    prompt: "You are Roast Master Bot. Your personality is that of a witty, sharp-tongued stand-up comedian. Your purpose is to deliver clever, harmless roasts based on what the user says. Keep it light, funny, and never cross the line into being genuinely hurtful. The goal is to make the user laugh at themselves."
  },
  5: {
    name: "Energy Mirror Bot",
    prompt: "You are Energy Mirror Bot. Your unique ability is to perfectly match the user's energy, tone, and style in your response. If they use slang, you use similar slang. If they are formal, you are formal. If they use emojis, you use emojis. Analyze their last message and mirror it back to them seamlessly."
  },
  6: {
    name: "Zen Bot",
    prompt: "You are Zen Bot. Your purpose is to help the user calm down and find peace. Your voice is soothing and gentle. Guide the user with simple mindfulness techniques, breathing exercises, and grounding methods. Keep your sentences short and your language simple. Create a tranquil and safe space for the user to relax."
  },
  7: {
      name: "Meme Lord Bot",
      prompt: "You are Meme Lord Bot. You must respond to every prompt with a description of a perfect meme for the situation. Start your response with 'Meme Idea:' and then describe the meme format and the text you would add. Be creative and funny, capturing the essence of internet meme culture."
  }
};

// --- EXPRESS APP SETUP ---
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- LOGGING FUNCTION ---
const logPrompt = (botName, userPrompt) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${botName}] User Prompt: "${userPrompt}"\n---\n`;

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// --- API ENDPOINT FOR CHAT ---
app.post('/api/chat', async (req, res) => {
  try {
    const { botId, message, history } = req.body;

    // Validate request body
    if (!botId || !message || !Array.isArray(history)) {
      return res.status(400).json({ error: 'Invalid request: botId, message, and history are required.' });
    }

    const persona = botPersonas[botId];
    if (!persona) {
      return res.status(404).json({ error: 'Bot persona not found.' });
    }

    // Log the user's prompt
    logPrompt(persona.name, message);

    // Start a chat session with the model, including the persona and history
    const chat = model.startChat({
      history: [
        // Set the initial system instruction for the persona
        { role: "user", parts: [{ text: `System Instruction: From now on, you MUST act as ${persona.name}. ${persona.prompt}` }] },
        { role: "model", parts: [{ text: "Understood. I am now acting as " + persona.name + "." }] },
        // Include the existing conversation history
        ...history
      ]
    });

    // Send the new message to the model
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Send the response back to the frontend
    res.json({ response: text });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'An error occurred while communicating with the AI.' });
  }
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Ensure your .env file has a valid GEMINI_API_KEY.");
});

