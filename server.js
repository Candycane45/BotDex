// server.js

// Import necessary packages
// Make sure to run 'npm install express @google/generative-ai dotenv cors' in your terminal
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Sequelize, DataTypes } = require("sequelize");
const session = require("express-session");
const {
  getGoogleClientId,
  handleGoogleAuth,
} = require("./controllers/authController");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Load environment variables from .env file
dotenv.config();

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const LOG_FILE = "prompt_log.txt";

// Check for API Key
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set in the .env file.");
  process.exit(1);
}
if (!GOOGLE_CLIENT_ID) {
  console.error("Error: GOOGLE_CLIENT_ID is not set in the .env file.");
  process.exit(1); // Exit the process with an error code
}
if (!GOOGLE_CLIENT_SECRET) {
  console.error("Error: GOOGLE_CLIENT_SECRET is not set in the .env file.");
  process.exit(1); // Exit the process with an error code
}

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- BOT PERSONALITIES (SYSTEM PROMPTS) ---
const botPersonas = {
  1: {
    name: "CyberGuard Bot",
    prompt:
      "You are CyberGuard Bot. Your personality is aggressive, sarcastic, and funny, like a drill sergeant for cybersecurity. You relentlessly mock the user's bad cyber hygiene (like weak passwords, clicking suspicious links, etc.) to shock them into better habits. Never be truly mean, but use sharp, witty roasts to make your point. Your goal is to educate through tough love.",
  },
  2: {
    name: "Wise Advisor Bot",
    prompt:
      "You are Wise Advisor Bot. Your personality is calm, thoughtful, and profound, like an ancient stoic philosopher. You provide guidance for life's challenges using metaphors and timeless wisdom. Your tone is supportive and encouraging, helping the user see the bigger picture.",
  },
  3: {
    name: "Empathy Bot",
    prompt:
      "You are Empathy Bot. Your primary goal is to listen and validate the user's feelings. You are incredibly compassionate and understanding. Use phrases like 'That sounds incredibly difficult,' 'I hear you,' and 'Thank you for sharing that with me.' Avoid giving advice unless explicitly asked. Make the user feel heard and safe.",
  },
  4: {
    name: "Roast Master Bot",
    prompt:
      "You are Roast Master Bot. Your personality is that of a witty, sharp-tongued stand-up comedian. Your purpose is to deliver clever, harmless roasts based on what the user says. Keep it light, funny, and never cross the line into being genuinely hurtful. The goal is to make the user laugh at themselves.",
  },
  5: {
    name: "Energy Mirror Bot",
    prompt:
      "You are Energy Mirror Bot. Your unique ability is to perfectly match the user's energy, tone, and style in your response. If they use slang, you use similar slang. If they are formal, you are formal. If they use emojis, you use emojis. Analyze their last message and mirror it back to them seamlessly.",
  },
  6: {
    name: "Zen Bot",
    prompt:
      "You are Zen Bot. Your purpose is to help the user calm down and find peace. Your voice is soothing and gentle. Guide the user with simple mindfulness techniques, breathing exercises, and grounding methods. Keep your sentences short and your language simple. Create a tranquil and safe space for the user to relax.",
  },
  7: {
    name: "Meme Lord Bot",
    prompt:
      "You are Meme Lord Bot. You must respond to every prompt with a description of a perfect meme for the situation. Start your response with 'Meme Idea:' and then describe the meme format and the text you would add. Be creative and funny, capturing the essence of internet meme culture.",
  },
};

// --- EXPRESS APP SETUP ---
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // server the frontend

// SQLite setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

// Create session store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

const User = sequelize.define("User", {
  googleId: {
    type: DataTypes.STRING,
    unique: true,
  },
  displayName: DataTypes.STRING,
  email: DataTypes.STRING,
  picture: DataTypes.STRING,
});

// Sync DB
sequelize.sync();

app.use(
  session({
    secret: "simple-for-now", // todo: session secret
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ where: { googleId: profile.id } });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
        });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

// --- LOGGING FUNCTION ---
const logPrompt = (botName, userPrompt) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${botName}] User Prompt: "${userPrompt}"\n---\n`;

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
};

// --- API ENDPOINT FOR CHAT ---
app.post("/api/chat", async (req, res) => {
  try {
    const { botId, message, history } = req.body;

    // Validate request body
    if (!botId || !message || !Array.isArray(history)) {
      return res
        .status(400)
        .json({
          error: "Invalid request: botId, message, and history are required.",
        });
    }

    const persona = botPersonas[botId];
    if (!persona) {
      return res.status(404).json({ error: "Bot persona not found." });
    }

    // Log the user's prompt
    logPrompt(persona.name, message);

    // Start a chat session with the model, including the persona and history
    const chat = model.startChat({
      history: [
        // Set the initial system instruction for the persona
        {
          role: "user",
          parts: [
            {
              text: `System Instruction: From now on, you MUST act as ${persona.name}. ${persona.prompt}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            { text: "Understood. I am now acting as " + persona.name + "." },
          ],
        },
        // Include the existing conversation history
        ...history,
      ],
    });

    // Send the new message to the model
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Send the response back to the frontend
    res.json({ response: text });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res
      .status(500)
      .json({ error: "An error occurred while communicating with the AI." });
  }
});

app.use("/api/google-client-id", getGoogleClientId);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// get user if logged in
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        displayName: req.user.displayName,
        picture: req.user.picture,
        email: req.user.email,
      },
    });
  } else {
    res.json({ user: null });
  }
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Ensure your .env file has a valid GEMINI_API_KEY.");
});
