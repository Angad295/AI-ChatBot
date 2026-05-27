# Decoupled AI Assistant API

A full-stack, decoupled chatbot application utilizing a RESTful architecture. 

## 🏗️ Architecture
* **Frontend:** Hosted on Netlify CDN (HTML/CSS/Vanilla JS)
* **Backend:** Node.js API deployed on Render
* **Database:** Ephemeral SQLite for session data
* **AI Integration:** Google Gemini API for real-time inference

## ⚙️ Features
* Implemented CORS security to restrict cross-origin requests exclusively to the deployed frontend.
* [Add one more bullet point about a feature, like the admin endpoints or error handling]

## 🚀 Run Locally
1. Clone the repository
2. Run `npm install` in the backend directory
3. Add a `.env` file with `GEMINI_API_KEY`, `CORS_ORIGIN`, and `ADMIN_TOKEN`
4. Run `node server.js`
