import React from 'react';

const ChatHistoryDrawer = ({ isOpen, onClose, chatHistory, onClearHistory }) => {
  if (!isOpen) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationSummary = (messages) => {
    // Group messages into conversations (user message + bot response pairs)
    const conversations = [];
    for (let i = 0; i < messages.length; i += 2) {
      if (messages[i] && messages[i].role === 'user') {
        conversations.push({
          userMessage: messages[i].content,
          botMessage: messages[i + 1]?.content || 'No response',
          timestamp: messages[i].timestamp
        });
      }
    }
    return conversations.reverse(); // Show most recent first
  };

  const conversations = getConversationSummary(chatHistory);

  return (
    <div className="history-drawer" onClick={onClose}>
      <div className="history-container" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h3>Chat History</h3>
          <button type="button" className="close-history-chip" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
          </button>
        </div>
        
        <div className="history-content">
          {conversations.length === 0 ? (
            <div className="history-empty">
              No chat history yet. Start a conversation to see your history here.
            </div>
          ) : (
            conversations.map((conv, index) => (
              <div key={index} className="history-item">
                <div className="history-item-title">
                  {conv.userMessage.length > 50 
                    ? conv.userMessage.substring(0, 50) + '...' 
                    : conv.userMessage}
                </div>
                <div className="history-item-preview">
                  {conv.botMessage.length > 80 
                    ? conv.botMessage.substring(0, 80) + '...' 
                    : conv.botMessage}
                </div>
                <div className="history-item-time">
                  {formatTime(conv.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>

        {chatHistory.length > 0 && (
          <div className="history-footer">
            <button 
              type="button" 
              className="clear-history-btn" 
              onClick={onClearHistory}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryDrawer;