import React, { useState, useEffect } from "react";
import ChatBot from "./chatBot";
import IntroPage from "./components/IntroPage";
import "./styles.css";

function App() {
  const [currentView, setCurrentView] = useState('intro');
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('gcet_theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Apply theme to document body
  const applyTheme = (themeName) => {
    if (themeName === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('gcet_theme', newTheme);
    applyTheme(newTheme);
  };

  const startChat = () => {
    setCurrentView('chat');
  };

  const showIntro = () => {
    setCurrentView('intro');
  };

  return (
    <div className="app-container">
      {currentView === 'intro' ? (
        <IntroPage onStartChat={startChat} />
      ) : (
        <ChatBot 
          onBackToIntro={showIntro} 
          theme={theme} 
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;
