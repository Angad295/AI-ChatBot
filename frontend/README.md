

This is exactly what we need to do. Your draft has all the right technical details, but it has some duplicate sections and a few typos (like accidentally calling it "Goa College" at the very end instead of Jammu).

I have cleaned up the duplicates, fixed the "Assistant" spelling, injected your live Render API link, and added a dedicated architectural note explaining that the backend is completely decoupled and can support multiple different GUIs.

Here is the finalized, professional README for your Frontend repository. Copy this entire block and commit it to GitHub.

---

```markdown
# GCET Jammu Assistant - Frontend 🎓

Your intelligent college companion powered by Google Gemini AI.

A modern, mobile-first chatbot interface designed specifically for GCET Jammu (Chak Bhalwal, Jammu & Kashmir) students. This application provides AI-powered assistance for college information, admissions, placements, hostel facilities, and more.

**[🔗 View Live Demo](https://heroic-sorbet-595707.netlify.app)**
**[⚙️ Live API Backend](https://ai-chatbot-1-80jj.onrender.com/api/health)**

---

## 🏗️ Architectural Note: Decoupled GUI
This project utilizes a strictly **decoupled architecture**. This repository contains *only* the frontend web application (the GUI). 

Because the backend is a standalone RESTful API, this web frontend is just one possible interface. The exact same backend can seamlessly power completely different user interfaces, including native Android/iOS apps, desktop clients, or alternative web portals, without changing a single line of backend code.

---

## ✨ Core Features

### 💬 Intelligent AI Chat
* **Gemini 2.5 Flash:** High-speed, context-aware responses.
* **Context Memory:** The AI remembers your profile and conversation history.
* **Voice Input:** Hands-free operation using the Web Speech API.

### 📱 Modern User Experience
* **Mobile-First Design:** Optimized for phones (320px+) with swipe-to-collapse bottom sheets.
* **Theme Management:** Eye-friendly Dark/Light mode toggle with `localStorage` persistence.
* **Quick Actions:** One-click chips for Timetables, Exams, and Web Technology Notes.

### 📁 Advanced File Management
* **Upload & Parse:** Support for PDF, DOC, DOCX, TXT, PPT, and PPTX (up to 50MB).
* **Cloud Storage:** Files are routed to the backend and securely managed.
* **Offline Fallback:** Graceful error handling and demo data when the backend is unreachable.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Modern web browser (Chrome, Firefox, Safari, Edge)
* Backend API server running locally (or pointing to the live Render URL).

### Installation
1. Clone this repository:
   ```bash
   git clone [https://github.com/YourUsername/GCET-Assistant-Frontend.git](https://github.com/YourUsername/GCET-Assistant-Frontend.git)
   cd GCET-Assistant-Frontend

```

2. Open `index.html` using **Live Server** in VS Code, or start a local web server:
```bash
npx http-server -p 8080

```


3. Set up your profile in the UI (Name, Branch, Semester, Batch) to start chatting.

---

## 🔌 API Integration & Configuration

The frontend communicates with the backend via REST endpoints.

To change the target environment (Local vs. Production), edit line 12 in `script.js`:

```javascript
// For Local Development:
// const API_BASE = 'http://localhost:4000/api';

// For Production (Live):
const API_BASE = '[https://ai-chatbot-1-80jj.onrender.com/api](https://ai-chatbot-1-80jj.onrender.com/api)';

```

**Key Endpoints Utilized:**

* `POST /api/query` - Send messages and receive AI responses
* `GET /api/history/:userId` - Retrieve chat history
* `POST /api/profile` - Save user context securely
* `POST /api/upload` - Handle multi-format file uploads

---

## 💾 Data Storage Strategy

No sensitive data is transmitted to third parties. The app uses browser `localStorage` for lightweight state management:

* `chatHistory` - Array of conversation messages (synced with backend)
* `userContext` - User profile (name, branch, semester, batch)
* `userId` - Unique anonymous identifier
* `gcet_theme` - Theme preference (light/dark)

---

## 🎨 Customization

**Change Theme Colors:**
Edit the variables at the top of `style.css`:

```css
:root {
  --primary: #7b3ff2;        /* Purple */
  --primary-dark: #6d28d9;
  --accent: #ec4899;         /* Pink */
}

```

**Add Quick Action Chips:**
Edit the `.chip-row` section in `index.html`:

```html
<button type="button" class="chip" onclick="sendQuickMessage('Your query here')">
  🆕 New Action
</button>

```

---

## 🔧 Troubleshooting

* **`TypeError: Failed to fetch`:** The frontend cannot reach the backend. Ensure your `API_BASE` in `script.js` matches your live Render link and that the backend is awake (Render free tier sleeps after 15 minutes).
* **Voice Input Not Working:** Grant microphone permissions. Note: The Web Speech API strictly requires a secure `HTTPS` connection (or `localhost`).
* **Dark Mode Not Persisting:** Ensure your browser is not blocking `localStorage` (common in strict Incognito modes).

---

## 📄 License & Support

**License:** MIT License. Created for educational purposes.

**Support:** For GCET Jammu specific queries, the AI assistant is programmed to handle questions regarding JEE Main/JKCET admissions, placement opportunities, hostel facilities, and CSE/ECE/ME/CE/EE course structures.

*Built with ❤️ for GCET Students.*

```

```



