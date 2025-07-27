const { OAuth2Client } = require("google-auth-library");
const { config } = require("dotenv");
config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// GET /api/google-client-id
exports.getGoogleClientId = (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.json({ clientId: CLIENT_ID });
};

// POST /api/auth/google
exports.handleGoogleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    res.json({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  } catch (err) {
    console.error("Google token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};
