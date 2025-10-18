import React, { useState, useEffect, useRef } from 'react';
import ChatBot from '../chatBot';

/**
 * ChatbotInterface Component
 * Main wrapper for the chatbot interface
 */
function ChatbotInterface({ onBackToIntro, theme, onToggleTheme }) {
  return (
    <div className="chatbot-interface">
      <ChatBot 
        onBackToIntro={onBackToIntro}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    </div>
  );
}

export default ChatbotInterface;
