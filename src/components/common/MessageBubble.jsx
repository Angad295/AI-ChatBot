import React from 'react';

/**
 * MessageBubble Component
 * Displays individual chat messages with support for both plain text and HTML content
 * 
 * Props:
 * - content: string - The message content (plain text or HTML)
 * - role: 'user' | 'bot' - The sender role
 * - isHtml: boolean - Whether the content contains HTML that should be rendered
 * - timestamp: string - ISO timestamp of when the message was sent
 */
function MessageBubble({ content, role = 'bot', isHtml = false, timestamp }) {
  return (
    <div className={`message ${role}`}>
      <div className="message-bubble">
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <span>{content}</span>
        )}
      </div>
      {timestamp && (
        <div className="message-time">
          {new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
