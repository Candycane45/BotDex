# Bot Companion Dashboard

**Bot Companion Dashboard** is a full-stack web application that allows users to interact with a variety of AI-powered chatbots, each with a unique personality and purpose. The project demonstrates a modern web development architecture, separating the user interface (frontend) from the AI logic and API management (backend).

## Features

* **Multiple AI Personalities**: Users can choose from 7 different AI bots, including a cybersecurity advisor, an empathetic listener, a witty roaster, and more.
* **Dynamic Chat Interface**: A clean, responsive, and real-time chat UI is dynamically generated when a user selects a bot.
* **Context-Aware Conversations**: The application maintains conversation history for each session, allowing for coherent, context-aware responses from the AI.
* **Secure API Key Management**: The backend uses environment variables (`.env` file) to securely manage the Gemini API key, keeping it out of the frontend code.
* **Prompt Logging**: All prompts sent to the AI by users are logged into a `prompt_log.txt` file on the server for monitoring and future analysis.
* **Separated Frontend/Backend**: A robust architecture where the frontend (HTML/CSS/JS) is completely decoupled from the backend (Node.js), which is best practice for modern web applications.

## Tech Stack

* **Frontend**:
    * HTML5
    * CSS3 (with custom properties for theming)
    * JavaScript (ES6+)
* **Backend**:
    * **Node.js**: JavaScript runtime environment.
    * **Express.js**: Web framework for creating the API server.
    * **@google/generative-ai**: Official Google client library for the Gemini API.
    * **dotenv**: For managing environment variables (API keys).
    * **cors**: To enable secure communication between the frontend and backend.
* **AI Model**:
    * Google Gemini 1.5 Flash

---

## Setup and Installation

To run this project locally, you will need Node.js, npm, and Visual Studio Code installed.

**1. Clone the Repository / Download the Files**
   Ensure all project files (`index.html`, `style.css`, `app.js`, `server.js`, `package.json`) are in the same directory.

**2. Create the Environment File**
   In the root of the project directory, create a new file named `.env`. This file will store your secret API key. Add the following line to it:
   ```
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
   Replace `YOUR_API_KEY_HERE` with your actual Gemini API key from Google AI Studio.

**3. Install Dependencies**
   Open a terminal in the project directory and run the following command to install all the necessary backend packages listed in `package.json`:
   ```bash
   npm install
   ```

**4. Run the Backend Server**
   In the same terminal, start the backend server:
   ```bash
   node server.js
   ```
   You should see the message: `Server is running on http://localhost:3000`. Keep this terminal window open.

**5. Run the Frontend Server**
   This project uses the **Live Server** extension in Visual Studio Code to serve the frontend.
   * If you don't have it, install the "Live Server" extension from the VS Code marketplace.
   * In VS Code, right-click on the `index.html` file in the file explorer.
   * Select **"Open with Live Server"** from the context menu.

**6. Open the Application**
   A new tab will automatically open in your default web browser with an address like `http://127.0.0.1:5500`. The application should now be fully functional.

---

## Challenges & Lessons Learned

Developing this project highlighted several key concepts and common challenges in modern web development:

1.  **Frontend vs. Backend Separation**: A major challenge was understanding that `app.js` (frontend) and `server.js` (backend) are two separate programs that cannot directly call each other's functions. The frontend runs in the browser, while the backend runs on a server with Node.js.
    * **Lesson Learned**: The `fetch` API is the bridge between the two. The frontend makes an HTTP request to an endpoint defined in the backend (`/api/chat`), which is the correct and standard way to communicate.

2.  **API Key Security**: It was tempting to put the API key directly in `app.js` for a quick solution.
    * **Lesson Learned**: This is a major security vulnerability. The correct approach, implemented here, is to **never** expose API keys on the frontend. The backend acts as a secure proxy, handling the secret key and making API calls on behalf of the user. The use of `.env` files is the industry standard for this.

3.  **Asynchronous Operations**: Interacting with an external API (like Gemini) is an asynchronous operation. The program can't just wait for the response; it needs to handle the delay.
    * **Lesson Learned**: `async/await` syntax is a clean and powerful way to manage this. The `sendMessage` function in `app.js` is declared `async` so it can `await` the `fetch` call to the backend. This prevents the UI from freezing and allows for features like a "typing..." indicator.

4.  **CORS (Cross-Origin Resource Sharing)**: When running the frontend and backend on different ports (e.g., `:5500` and `:3000`), browsers block requests by default for security.
    * **Lesson Learned**: The `cors` package on the Express server is essential. It tells the browser, "It's okay for the website at this address to make requests to me." Without it, no communication would be possible.
