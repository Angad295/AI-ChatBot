# GCET College Assistant - AI ChatBot

A modern, responsive React-based chatbot application designed to help GCET college students with academic information including timetables, exam schedules, study materials, and document uploads.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-green)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)
- [API Integration](#-api-integration)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Chat Features
- **Real-time Messaging**: Instant bot responses with typing indicators
- **Voice Input**: Web Speech API integration for hands-free queries
- **Chat History**: Persistent conversation history using localStorage
- **Message Persistence**: All messages saved locally and restored on refresh

### Academic Features
- **📅 Timetable Display**: View class schedules with collapsible day sections
- **📝 Exam Schedule**: Upcoming exams sorted chronologically with times and venues
- **📚 Study Materials**: Browse and manage PDF documents and notes
- **❓ Question Papers**: Quick access to previous year question papers

### User Experience
- **Expandable Bottom Sheet**: Quick action chips for common queries
- **Dark Mode**: Full dark mode support with smooth transitions
- **Mobile Responsive**: Optimized for all screen sizes (mobile-first design)
- **Smooth Animations**: Cubic-bezier easing for natural, fluid transitions
- **Profile Management**: Save and update student information

### User Profile
- **📋 Chat History Drawer**: Browse previous conversations
- **👤 Update Info Modal**: Manage academic details (branch, semester, batch)
- **Theme Toggle**: Switch between light and dark modes
- **Auto-save**: All preferences and data saved to localStorage

---

## 📁 Project Structure

```
AI-ChatBot/
├── src/
│   ├── App.jsx                 # Main app component with intro/chat routing
│   ├── App.css                 # App-level styles
│   ├── chatBot.jsx             # Main chat interface component
│   ├── chatMessage.jsx         # Message display component
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global base styles
│   ├── styles.css              # Complete styling (2100+ lines)
│   ├── components/
│   │   ├── IntroPage.jsx       # Landing page with features
│   │   ├── ProfileModal.jsx    # User profile editor
│   │   ├── ChatHistoryDrawer.jsx # Chat history viewer
│   │   └── (child components)
│   └── assets/                 # Images and icons
├── public/                     # Static assets
│   └── index.html
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite build configuration
├── eslint.config.js           # ESLint rules
└── README.md                  # This file
```

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19**: Latest React with hooks and functional components
- **Vite 7**: Ultra-fast build tool with hot module reloading

### APIs & Libraries
- **Web Speech API**: Voice input recognition
- **localStorage**: Client-side data persistence
- **CSS3**: Modern styling with gradients, animations, and flexbox
- **PostCSS**: CSS processing via Vite

### Development Tools
- **ESLint**: Code quality checking
- **NPM**: Package management

---

## 🚀 Installation

### Prerequisites
- Node.js (v16+) and npm installed
- Git for version control

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/sahilaw22/AI-ChatBot.git
cd AI-ChatBot
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```
The app will open at `http://localhost:5174` (or next available port)

---

## 💻 Usage

### Starting the Application

**Development Mode:**
```bash
npm run dev
```
Opens the application with hot module reloading. Any file changes automatically refresh the browser.

**Production Build:**
```bash
npm run build
npm run preview
```
Creates an optimized production build and serves it locally for testing.

### Using the Chat Interface

1. **Sending Messages**
   - Type a message and press `Enter` or click the send button
   - Use quick action chips for instant responses:
     - 📅 Timetable
     - 📝 Exams
     - 📚 Web Technology Notes
     - ❓ Question Papers

2. **Voice Input**
   - Click the 🎤 microphone icon
   - Speak your query
   - Transcript appears in the input field

3. **Managing Documents**
   - Click "📎 Upload PDF" in the bottom sheet
   - Select a document
   - Use "Summarise" to get a quick overview

4. **Chat History**
   - Click "📋 Chat History" to view past conversations
   - Clear history permanently if needed

5. **Profile Settings**
   - Click "👤 Update Info" to set academic details
   - Information is saved to localStorage

---

## 🔨 Development

### Key Components

#### chatBot.jsx (Main Component)
- Manages chat state and message flow
- Handles API calls with fallback to mock data
- Coordinates all child components
- Implements localStorage persistence

#### styles.css (Comprehensive Styling)
- **2100+ lines** of organized CSS
- Responsive design with multiple breakpoints
- Dark mode support throughout
- Smooth animations and transitions
- Mobile-first approach

#### Integration Points
- **Mock Data**: Mock timetable, exams, PDFs (for demos)
- **Backend API**: `POST /api/query` endpoint
- **Web Speech API**: Browser voice recognition
- **localStorage**: Persistent data storage

### Code Style & Quality

The code follows these principles:

- **Functional Components**: React hooks-based architecture
- **Clear Naming**: Descriptive function and variable names
- **Organized Structure**: Related code grouped in sections with comments
- **Error Handling**: Try-catch blocks and fallback mechanisms
- **Type Safety**: JSDoc comments for functions

### Adding New Features

1. **New Message Type**
   - Add handler in `handleStructuredResponse()`
   - Create display function (e.g., `displayNewContent()`)
   - Add CSS styling in `styles.css`

2. **New API Endpoint**
   - Update API call in `sendMessage()`
   - Add fallback mock data
   - Update response handler

3. **New UI Component**
   - Create component file in `src/components/`
   - Import and integrate in appropriate parent
   - Add responsive styles

---

## 📦 Build & Deployment

### Building for Production
```bash
npm run build
```
Creates `dist/` directory with optimized files ready for deployment.

### Deployment Options

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
- Connect GitHub repo to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

**Option 3: Traditional Hosting**
- Upload `dist/` folder contents to your web server
- Configure server for SPA (Single Page Application) routing

### Environment Variables
Create `.env` file if needed:
```
VITE_API_URL=http://your-backend-api.com
```

---

## 🔌 API Integration

### Current State
The app currently uses **mock data** (offline mode) as a fallback. To integrate with a real backend:

### Backend API Expected Format

**Endpoint:** `POST /api/query`

**Request:**
```json
{
  "text": "Show my timetable",
  "context": {
    "branch": "IT",
    "semester": 3,
    "batch": "2023"
  }
}
```

**Response - Timetable:**
```json
{
  "ok": true,
  "type": "timetable",
  "data": {
    "branch": "IT",
    "semester": 3,
    "batch": "2023",
    "schedule": [
      {
        "day": "Monday",
        "periods": [
          {
            "time": "9:00-10:00",
            "subject": "Data Structures",
            "teacher": "Prof. Smith",
            "room": "Lab-101"
          }
        ]
      }
    ]
  }
}
```

**Response - Exams:**
```json
{
  "ok": true,
  "type": "exam",
  "data": {
    "exams": [
      {
        "subject": "Web Technology",
        "date": "2024-03-15T10:00:00Z",
        "venue": "Main Hall"
      }
    ]
  }
}
```

### Updating API_BASE
In `src/chatBot.jsx`, line 8:
```javascript
const API_BASE = 'http://your-backend-url/api';
```

---

## 🎨 Customization

### Colors & Theme

In `src/styles.css`:

- **Primary Color**: `#7b3ff2` (Purple)
- **Chat History Button**: Blue gradient (`#4a90e2` → `#357abd`)
- **Update Info Button**: Green gradient (`#10b981` → `#059669`)
- **Dark Mode Text**: `#d5ceff`, `#f3f0ff`

### Fonts & Typography

Default font stack: System fonts with fallbacks
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Responsive Breakpoints

- **Desktop**: > 500px
- **Tablet**: 450px - 500px
- **Mobile**: 380px - 450px
- **Extra Small**: < 380px

### Animation Timings

- **Bottom Sheet**: 0.35s ease-in-out
- **Buttons**: 0.2s ease-out
- **Smooth Scroll**: Native CSS `scroll-behavior: smooth`

---

## 🐛 Troubleshooting

### App Not Starting
```bash
# Clear node modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use
The app auto-selects next available port (5174, 5175, etc.)

### Chat History Not Saving
- Check browser's localStorage is enabled
- Clear site data and reload if corrupted

### Voice Input Not Working
- Supported browsers: Chrome, Edge, Safari (iOS)
- Not supported in Firefox and older browsers
- Requires HTTPS in production

### Dark Mode Issues
- Check CSS variables are properly applied
- Clear browser cache if colors don't update

### PDF Upload Failures
- File size limit: ~10MB (browser dependent)
- Supported: PDF files primarily
- CORS may block external PDFs

---

## 📊 Performance Optimizations

- **Code Splitting**: Vite automatically chunks code
- **Lazy Loading**: Components loaded on demand
- **CSS Optimization**: Minified and purged unused styles
- **Image Compression**: Optimized asset delivery
- **Smooth Animations**: GPU-accelerated transforms

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review code comments for implementation details

---

## 🎯 Future Roadmap

- [ ] Backend API integration
- [ ] Authentication system
- [ ] Real-time notifications
- [ ] File sharing capabilities
- [ ] Multiple language support
- [ ] Analytics dashboard
- [ ] Advanced search functionality

---

**Made with ❤️ for GCET College Students**

Last Updated: October 2024  
Version: 1.0.0
