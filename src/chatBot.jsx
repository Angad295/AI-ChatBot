import React, { useState, useEffect, useRef } from "react";
import ProfileModal from "./components/ProfileModal";
import ChatHistoryDrawer from "./components/ChatHistoryDrawer";

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
// Vite exposes env variables prefixed with VITE_ via import.meta.env
// Avoid direct `process.env` access in the browser (would throw). Use a typeof guard.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined);

function ChatBot({ onBackToIntro, theme, onToggleTheme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showVoiceStatus, setShowVoiceStatus] = useState(false);
  const [voiceStatusText, setVoiceStatusText] = useState("Inactive");
  const [showHistory, setShowHistory] = useState(false);
  const [userContext, setUserContext] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true); // Start collapsed like original frontend
  const [isTyping, setIsTyping] = useState(false);
  const [pendingIntent, setPendingIntent] = useState(null); // { type: 'timetable|exam|notes', question: '...' }
  const chatAreaRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceHideTimeoutRef = useRef(null);

  // Load saved data on component mount
  useEffect(() => {
    const hasHistory = loadChatHistory();
    loadUserContext();
    
    // Show welcome message if no chat history
    if (!hasHistory) {
      const welcomeMessage = { 
        role: 'bot', 
        content: "Hi! I'm your GCET College Assistant. I can help with timetables, exam schedules, and study materials. What would you like to know?",
        isHtml: false,
        timestamp: new Date().toISOString() 
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('chatHistory', JSON.stringify([welcomeMessage]));
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // Initialize sheet gestures and focus toggles
  useEffect(() => {
    initSheetGestures();
    attachFocusAndClickToggles();
  }, []);

  const loadChatHistory = () => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        if (history && history.length > 0) {
          setMessages(history);
          return true; // Has existing history
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        setMessages([]);
      }
    }
    return false; // No existing history
  };

  const loadUserContext = () => {
    const saved = localStorage.getItem('userContext');
    if (saved) {
      try {
        setUserContext(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load user context:', error);
        setUserContext({});
      }
    }
  };

  const saveChatHistory = (newMessages) => {
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  const saveUserContext = (context) => {
    localStorage.setItem('userContext', JSON.stringify(context));
    setUserContext(context);
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    setShowHistory(false);
    // Add welcome message back
    setTimeout(() => {
      addBotMessage("Hi! I'm your GCET College Assistant. I can help with timetables, exam schedules, and study materials. What would you like to know?");
    }, 100);
  };

  const scrollToBottom = () => {
    console.log('scrollToBottom called');
    if (chatAreaRef.current) {
      console.log('Scrolling to bottom, height:', chatAreaRef.current.scrollHeight);
      // Use smooth scroll behavior for better UX
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      console.log('chatAreaRef.current is null');
    }
  };

  const handleChatAreaClick = () => {
    // Collapse sheet with smooth animation
    setIsSheetCollapsed(true);
    // Scroll down smoothly
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  // Core message functions following original frontend pattern
  const addUserMessage = (text) => {
    const newMessage = { 
      id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      role: 'user', 
      content: text, 
      timestamp: new Date().toISOString() 
    };
    // Use functional update to avoid stale state when bot reply comes quickly
    setMessages(prev => {
      const updated = [...prev, newMessage];
      saveChatHistory(updated);
      console.log('Added user message:', text, 'Total messages:', updated.length);
      return updated;
    });
    // No synchronous return; state update will happen asynchronously
  };

  const addBotMessage = (text, isHtml = false) => {
    const newMessage = { 
      id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      role: 'bot', 
      content: text, 
      isHtml,
      timestamp: new Date().toISOString() 
    };
    // Use functional update so we append to the latest messages array
    setMessages(prev => {
      const updated = [...prev, newMessage];
      saveChatHistory(updated);
      console.log('Added bot message:', (text || '').toString().substring(0, 50) + '...', 'Total messages:', updated.length);
      return updated;
    });
  };

  const showTypingIndicator = () => {
    setIsTyping(true);
  };

  const hideTypingIndicator = () => {
    setIsTyping(false);
  };

  // Main message sending function following original frontend pattern
  const sendMessage = async () => {
    const text = input.trim();
    console.log('sendMessage called with text:', text);
    if (!text) return; // Don't send empty messages

    // Add user's message to chat
    addUserMessage(text);
    setInput(""); // Clear input field
    showTypingIndicator();

    // Check if we have a pending intent to fulfill
    if (pendingIntent) {
      const intent = pendingIntent;
      setPendingIntent(null); // Clear pending
      hideTypingIndicator();
      handleIntentFulfillment(intent, text);
      return;
    }

    // Detect intent keywords
    const lowerText = text.toLowerCase();
    if (/timetable|schedule/i.test(lowerText)) {
      setPendingIntent({ type: 'timetable', question: 'What kind of timetable are you looking for? (e.g., today, this week, by subject)' });
      hideTypingIndicator();
      addBotMessage('What kind of timetable are you looking for? (e.g., today, this week, by subject)');
      return;
    }
    if (/exam/i.test(lowerText)) {
      setPendingIntent({ type: 'exam', question: 'What kind of exam information do you need? (e.g., upcoming exams, exam dates, previous papers)' });
      hideTypingIndicator();
      addBotMessage('What kind of exam information do you need? (e.g., upcoming exams, exam dates, previous papers)');
      return;
    }
    if (/notes?|material|study|pdf/i.test(lowerText)) {
      setPendingIntent({ type: 'notes', question: 'What subject or topic are you looking for notes on? (e.g., Web Technology, DSA, Operating Systems)' });
      hideTypingIndicator();
      addBotMessage('What subject or topic are you looking for notes on? (e.g., Web Technology, DSA, Operating Systems)');
      return;
    }

    // For conversational messages, use Gemini API if available
    const convoSnapshot = [...messages, { id: `${Date.now()}-u`, role: 'user', content: text, timestamp: new Date().toISOString() }];
    if (GEMINI_API_KEY) {
      try {
        const reply = await sendToGemini(convoSnapshot);
        hideTypingIndicator();
        if (reply) {
          addBotMessage(reply);
          return;
        }
      } catch (err) {
        console.error('Gemini call failed:', err);
        // fallthrough to offline handler
      }
    }

    // Fallback: if no API key or Gemini failed, use offline/mock handling
    hideTypingIndicator();
    handleOfflineResponse(text);
  };

  // Handle fulfillment of pending intents based on user's follow-up response
  const handleIntentFulfillment = (intent, userResponse) => {
    const lowerResponse = userResponse.toLowerCase();
    switch (intent.type) {
      case 'timetable':
        if (/today|current/i.test(lowerResponse)) {
          displayTimetable(mockTimetable());
        } else if (/week|schedule/i.test(lowerResponse)) {
          displayTimetable(mockTimetable());
        } else {
          displayTimetable(mockTimetable()); // Default to full timetable
        }
        break;
      case 'exam':
        if (/upcoming|dates|schedule/i.test(lowerResponse)) {
          displayExams(mockExams());
        } else if (/previous|papers/i.test(lowerResponse)) {
          displayPDFs(mockPDFs().filter(pdf => pdf.subject.toLowerCase().includes('exam') || pdf.title.toLowerCase().includes('paper')));
        } else {
          displayExams(mockExams()); // Default to exam schedule
        }
        break;
      case 'notes':
        const subject = lowerResponse.match(/(web technology|dsa|operating systems|database|computer networks)/i)?.[1];
        if (subject) {
          displayPDFs(mockPDFs().filter(pdf => pdf.subject.toLowerCase().includes(subject.toLowerCase())));
        } else {
          displayPDFs(mockPDFs()); // Default to all notes
        }
        break;
      default:
        addBotMessage("I'm not sure what you mean. Can you clarify?");
    }
  };

  // Send the conversation to the Gemini Generative API and return a single text reply.
  // NOTE: Placing API keys in client-side code is insecure for production. Use a backend proxy for real deployments.
  const sendToGemini = async (conversation) => {

    // Map local messages to the API's expected message shape
    const messagesForApi = [
      { author: 'system', content: [{ type: 'text', text: systemPrompt }] },
      ...conversation.map(m => ({ author: m.role === 'user' ? 'user' : 'assistant', content: [{ type: 'text', text: String(m.content) }] }))
    ];

    const body = {
      messages: messagesForApi,
      temperature: 0.4,
      maxOutputTokens: 512,
      topP: 0.95
    };

    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const payload = await res.json();

    // Try a few common response shapes (Gemini responses vary).
    // Support: payload.candidates[0].content.parts[0].text OR payload.output_text OR payload.message
    let textReply = null;
    if (payload.candidates && payload.candidates.length > 0) {
      textReply = payload.candidates[0].content?.parts?.[0]?.text || payload.candidates[0].content?.text;
    }
    if (!textReply && payload.output_text) textReply = payload.output_text;
    if (!textReply && payload.message) textReply = typeof payload.message === 'string' ? payload.message : payload.message.text;

    return textReply || null;
  };

  // Response handlers following original frontend pattern
  const handleStructuredResponse = (payload) => {
    switch (payload.type) {
      case 'timetable':
        return displayTimetable(payload.data);
      case 'exam':
        return displayExams(payload.data);
      case 'pdfs':
        return displayPDFs(payload.data || []);
      default:
        return addBotMessage(payload.message || 'How else can I assist you?');
    }
  };

  const handleOfflineResponse = (text) => {
    // Normalize input for simple intent checks
    const trimmed = (text || '').trim();
    const lower = trimmed.toLowerCase();

    // Greeting detection (covers 'hlo', 'hi', 'hello', 'hey', etc.)
    if (/^\s*(hlo|hi|hello|hey|hiya|sup|good\s(morning|afternoon|evening))\b/i.test(lower)) {
      addBotMessage(`Hi there! 👋 I'm your GCET College Assistant. How can I help you today?`);
      return;
    }

    // When backend is not available, show mock/demo data
    if (/timetable|schedule/i.test(text)) {
      displayTimetable(mockTimetable());
      return;
    }
    
    if (/exam/i.test(text)) {
      displayExams(mockExams());
      return;
    }
    
    if (/(pdf|material|question|note)/i.test(text)) {
      displayPDFs(mockPDFs());
      return;
    }
    
    addBotMessage(mockFallback(text));
  };

  // Display functions following original frontend patterns
  const displayTimetable = (data) => {
    if (!data) {
      addBotMessage('No timetable found for your context.');
      return;
    }

    // Build HTML for the timetable card following original structure
    let html = `<div class="timetable-card">
      <h3>📅 Timetable - ${data.branch} Sem ${data.semester} • Batch ${data.batch}</h3>`;
    
    // Add each day's schedule
    (data.schedule || []).forEach((day, index) => {
      const sectionId = `day-${Date.now()}-${index}`; // Unique ID for toggling
      
      html += `<div class="day-section">`;
      html += `<div class="day-header" onclick="event.stopPropagation(); toggleDay('${sectionId}')">${day.day}<span class="chevron">▾</span></div>`;
      html += `<div id="${sectionId}" class="day-body">`;
      
      // Add each class period for this day
      (day.periods || []).forEach(period => {
        html += `<div class="period">`;
        html += `<div class="period-time">${period.time}</div>`;
        html += `<div><strong>${period.subject}</strong></div>`;
        html += `<div style="font-size:12px;color:#666;">${period.teacher || ''}${period.room ? ` • ${period.room}` : ''}</div>`;
        html += `</div>`;
      });
      
      html += `</div></div>`;
    });
    
    html += `</div>`;
    addBotMessage(html, true);
  };

  const displayExams = (data) => {
    if (!data) {
      addBotMessage('No exam schedule found for your context.');
      return;
    }

    // Sort exams by date (earliest first)
    const exams = (data.exams || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));

    let html = `<div class="exam-card">
      <h3>📝 Exams - ${data.branch} Sem ${data.semester} • Batch ${data.batch}</h3>`;

    exams.forEach(exam => {
      const when = formatExamCountdown(exam.date); // e.g., "in 5 days"
      html += `<div class="exam-item">`;
      html += `<div class="exam-date">${when}</div>`;
      html += `<div><strong>${exam.subject}</strong>${exam.venue ? ` • ${exam.venue}` : ''}</div>`;
      html += `</div>`;
    });

    html += `</div>`;
    addBotMessage(html, true);
  };

  const displayPDFs = (items) => {
    let html = '';

    if (!items || !items.length) {
      html += 'No study materials found for your query.';
    } else {
      items.forEach(pdf => {
        html += `<div class="pdf-item">`;
        html += `<div class="pdf-info">`;
        html += `<div class="pdf-title">${pdf.title || pdf.filename}</div>`;
        html += `<div class="pdf-meta">${pdf.subject || ''} • Sem ${pdf.semester || ''} ${pdf.uploaded_at ? `• ${new Date(pdf.uploaded_at).toLocaleDateString()}` : ''}</div>`;
        html += `</div>`;
        html += `<div class="pdf-actions">`;
        
        if (pdf.file_url) {
          // Show view and download buttons if we have a URL
          html += `<button class="btn-small" onclick="openPreview('${pdf.file_url}')">View</button>`;
          html += `<a class="btn-small" href="${pdf.file_url}" download>Download</a>`;
        } else {
          html += `<button class="btn-small" onclick="alert('Connect the backend to enable downloads.')">Download</button>`;
        }
        
        html += `</div></div>`;
      });
    }

    addBotMessage(html, true);
  };

  // Utility functions following original frontend patterns
  const formatExamCountdown = (dateString) => {
    const examDate = new Date(dateString);
    const now = new Date();
    const diff = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
    const dateLabel = examDate.toDateString();
    if (diff > 0) return `${dateLabel} • in ${diff} day${diff === 1 ? '' : 's'}`;
    if (diff === 0) return `${dateLabel} • Today`;
    return `${dateLabel} • Completed`;
  };

  // Mock data functions following original frontend patterns
  const mockTimetable = () => {
    return {
      branch: userContext.branch || 'CSE',
      semester: userContext.semester || 3,
      batch: userContext.batch || '2025',
      schedule: [
        { 
          day: 'Monday', 
          periods: [
            { time: '09:00 - 10:00', subject: 'Web Technology', room: 'B201', teacher: 'Prof. Gupta' },
            { time: '10:00 - 11:00', subject: 'DSA', room: 'B202', teacher: 'Prof. Rao' },
            { time: '11:30 - 12:30', subject: 'Database Systems', room: 'C301', teacher: 'Dr. Singh' },
            { time: '01:30 - 02:30', subject: 'Operating Systems', room: 'B105', teacher: 'Prof. Kumar' }
          ]
        },
        { 
          day: 'Tuesday', 
          periods: [
            { time: '09:00 - 10:00', subject: 'Computer Networks', room: 'C101', teacher: 'Prof. Jain' },
            { time: '10:00 - 11:00', subject: 'Web Technology Lab', room: 'Lab-1', teacher: 'Prof. Gupta' },
            { time: '11:30 - 12:30', subject: 'Software Engineering', room: 'B203', teacher: 'Dr. Patel' }
          ]
        },
        { 
          day: 'Wednesday', 
          periods: [
            { time: '09:00 - 10:00', subject: 'Database Systems', room: 'C301', teacher: 'Dr. Singh' },
            { time: '10:00 - 11:00', subject: 'DSA Lab', room: 'Lab-2', teacher: 'Prof. Rao' },
            { time: '01:30 - 02:30', subject: 'Computer Networks', room: 'C101', teacher: 'Prof. Jain' }
          ]
        }
      ]
    };
  };

  const mockExams = () => {
    return {
      branch: userContext.branch || 'CSE',
      semester: userContext.semester || 3,
      batch: userContext.batch || '2025',
      exams: [
        { 
          subject: 'Web Technology', 
          date: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
          venue: 'Main Hall' 
        },
        { 
          subject: 'Database Systems', 
          date: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days from now
          venue: 'Seminar Room A' 
        },
        { 
          subject: 'DSA', 
          date: new Date(Date.now() + 12 * 86400000).toISOString(), // 12 days from now
          venue: 'Computer Lab' 
        },
        { 
          subject: 'Operating Systems', 
          date: new Date(Date.now() + 15 * 86400000).toISOString(), // 15 days from now
          venue: 'Main Hall' 
        }
      ]
    };
  };

  const mockPDFs = () => {
    return [
      { 
        title: 'Web Technology Notes - Complete Syllabus', 
        subject: 'Web Technology', 
        semester: userContext.semester || 3, 
        file_url: 'https://arxiv.org/pdf/1706.03762.pdf', 
        uploaded_at: new Date().toISOString() 
      },
      { 
        title: 'Database Systems Question Papers - Previous Years', 
        subject: 'Database Systems', 
        semester: userContext.semester || 3, 
        file_url: 'https://arxiv.org/pdf/1807.01697.pdf', 
        uploaded_at: new Date(Date.now() - 86400000).toISOString() 
      },
      { 
        title: 'DSA Lab Manual with Solutions', 
        subject: 'Data Structures', 
        semester: userContext.semester || 3, 
        file_url: 'https://arxiv.org/pdf/1409.0473.pdf', 
        uploaded_at: new Date(Date.now() - 2 * 86400000).toISOString() 
      },
      { 
        title: 'Operating Systems Concepts - Detailed Notes', 
        subject: 'Operating Systems', 
        semester: userContext.semester || 3, 
        file_url: 'https://arxiv.org/pdf/1906.05433.pdf', 
        uploaded_at: new Date(Date.now() - 3 * 86400000).toISOString() 
      }
    ];
  };

  const mockFallback = (text) => {
    const responses = [
      "Thanks for your question! I can help you with:\n• Class timetables and schedules\n• Exam dates and venues\n• Study materials and notes\n• Contact information\n\nWhat would you like to know more about?",
      "I'm here to assist with your academic needs! Try asking about:\n• Today's classes\n• Upcoming exams\n• Study materials for your subjects\n• Faculty contact details",
      "How can I help you today? I have information about:\n• Current timetables\n• Examination schedules\n• Course materials and resources\n• College contact information"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendQuickMessage = (text) => {
    setInput(text);
    // Send message immediately and collapse sheet
    setTimeout(() => {
      sendMessage();
      // Collapse sheet after sending
      setIsSheetCollapsed(true);
    }, 30);
  };

  // Voice functionality following original frontend pattern
  const toggleVoice = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported on this browser.');
      return;
    }
    
    // Initialize speech recognition on first use
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.interimResults = false; // Only give final results
      recognitionRef.current.lang = 'en-IN'; // Indian English
      
      // Set up event handlers
      recognitionRef.current.onstart = () => updateVoiceUI(true);
      recognitionRef.current.onend = () => updateVoiceUI(false);
      recognitionRef.current.onerror = () => updateVoiceUI(false);
      
      recognitionRef.current.onresult = (event) => {
        // When speech is recognized, put it in the input field
        const transcript = event.results[0][0].transcript;
        setInput(transcript.trim());
      };
    }
    
    // Toggle microphone on/off
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const updateVoiceUI = (active) => {
    setIsListening(active);
    setVoiceStatusText(active ? 'Listening…' : 'Inactive');
    setShowVoiceStatus(true);
    
    // Auto-hide popup after recording stops
    if (voiceHideTimeoutRef.current) clearTimeout(voiceHideTimeoutRef.current);
    if (!active) {
      voiceHideTimeoutRef.current = setTimeout(() => {
        setShowVoiceStatus(false);
      }, 1200);
    }
  };

  // Document functionality following original frontend pattern
  const handleDocUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    
    setUploadedDoc(file);
    setIsSheetCollapsed(false); // Expand sheet to show tools
    
    const safeName = escapeHtml(file.name);
    addBotMessage(`Document <strong>${safeName}</strong> uploaded. Tap summarise for a quick overview.`, true);
    event.target.value = ''; // Reset input
  };

  const summariseDocument = () => {
    if (!uploadedDoc) {
      addBotMessage('Please upload a document first.');
      return;
    }
    
    const safeName = escapeHtml(uploadedDoc.name);
    addBotMessage(`Summarising <strong>${safeName}</strong>...`, true);
    
    // Simulate document processing
    setTimeout(() => {
      addBotMessage(`<div class="pdf-item">
        <div class="pdf-info">
          <div class="pdf-title">Summary: ${safeName}</div>
          <div class="pdf-meta">Key concepts extracted • AI-generated summary</div>
        </div>
        <div class="pdf-actions">
          <button class="btn-small" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
      </div>
      <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin: 8px 0;">
        <strong>Document Summary:</strong><br/>
        This appears to be an academic document containing important concepts for your studies. 
        The document covers various topics that may be relevant to your current semester coursework.
        <br/><br/>
        <em>Note: Connect to backend for detailed AI-powered document analysis.</em>
      </div>`, true);
    }, 1500);
  };

  // Sheet gestures following original frontend pattern
  const initSheetGestures = () => {
    // This would be handled by pointer events in the actual DOM
    // For now, we'll handle basic collapse/expand with state
  };

  const attachFocusAndClickToggles = () => {
    // Auto-expand or collapse bottom sheet based on user interaction
    // This would be handled by event listeners in actual implementation
  };

  const openPreview = (url) => {
    setPreviewUrl(url);
    setShowPdfPreview(true);
  };

  const closePreview = () => {
    setShowPdfPreview(false);
    setPreviewUrl('');
  };

  // Utility functions following original frontend pattern
  const escapeHtml = (value = '') => {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] || char));
  };

  // Global function for day toggling (called from HTML)
  window.toggleDay = (id) => {
    const body = document.getElementById(id);
    if (body) {
      body.classList.toggle('hidden');
    }
  };

  // Global function for PDF preview (called from HTML)
  window.openPreview = (url) => {
    openPreview(url);
  };

  const renderMessages = () => {
    console.log('renderMessages called, messages length:', messages.length);
    return messages.map((message) => {
      console.log('Rendering message:', message.role, (message.content || '').toString().substring(0, 20));
      const key = message.id || message.timestamp || Math.random().toString(36).slice(2,8);
      if (message.isHtml) {
        return (
          <div key={key} className={`message ${message.role}`}>
            <div className="message-bubble" dangerouslySetInnerHTML={{ __html: message.content }} />
          </div>
        );
      } else {
        return (
          <div key={key} className={`message ${message.role}`}>
            <div className="message-bubble">{message.content}</div>
          </div>
        );
      }
    });
  };

  return (
    <div className="phone-container">
      {/* Header */}
      <div className="header">
        <div className="avatar">🎓</div>
        <div className="header-text">
          <h1>GCET Assistant</h1>
          <p>Your academic companion</p>
        </div>
        <button 
          className={`mode-toggle ${theme === 'dark' ? 'active' : ''}`}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="mode-icon">
            {theme === 'light' ? (
              <svg className="mode-sketch mode-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.6 4.2a7.2 7.2 0 1 0 6.2 10.7 5.6 5.6 0 0 1-6.2-10.7z"></path>
                <path d="M9.2 4.8c.5 1.4 1.3 2 2.7 2.6"></path>
                <path d="M10.1 18.4c-.9.3-1.6.2-2.4-.2"></path>
              </svg>
            ) : (
              <svg className="mode-sketch mode-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.2"></circle>
                <path d="M12 3.3v2.3M12 18.4v2.3M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M3.3 12h2.3M18.4 12h2.3M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"></path>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatAreaRef} 
        className="chat-area"
        onClick={handleChatAreaClick}
      >
        {renderMessages()}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message bot" id="typingIndicator">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className={`bottom-sheet ${isSheetCollapsed ? 'collapsed' : ''}`}>
        {/* Drag Handle - Hidden as per original frontend */}
        <div 
          className="drag-handle"
          onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}
        ></div>

        {/* Sheet Header - Only show when expanded */}
        {!isSheetCollapsed && (
          <div className="sheet-header">
            <button 
              className="history-btn"
              onClick={() => {
                console.log('Chat history button clicked');
                setShowHistory(true);
              }}
              type="button"
            >
              <span className="history-icon">📋</span>
              <span>Chat History</span>
            </button>
            <button 
              className="profile-btn"
              onClick={() => {
                console.log('Profile button clicked');
                setShowProfileModal(true);
              }}
              type="button"
            >
              <span className="profile-dot" aria-hidden="true"></span>
              <span>Update Info</span>
            </button>
          </div>
        )}

        {/* Quick Action Chips - Always visible, following original frontend pattern */}
        <div className="chip-row">
          <button className="chip" onClick={() => sendQuickMessage('Show my timetable')}>
            📅 Timetable
          </button>
          <button className="chip" onClick={() => sendQuickMessage('Exam dates')}>
            📝 Exams
          </button>
          <button className="chip" onClick={() => sendQuickMessage('Web Technology notes')}>
            📚 Web Technology Notes
          </button>
          <button className="chip" onClick={() => sendQuickMessage('Question papers')}>
            � Question Papers
          </button>
        </div>

        {/* Document Tools */}
        {!isSheetCollapsed && (
          <div className="sheet-tools">
            <div className="doc-toolbar">
              <label htmlFor="docUpload" className="doc-action-btn upload-btn">
                📎 Upload PDF
                <input
                  type="file"
                  id="docUpload"
                  accept=".pdf"
                  onChange={handleDocUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button 
                className="doc-action-btn summarise-btn"
                onClick={summariseDocument}
                disabled={!uploadedDoc}
              >
                ✨ Summarise
              </button>
            </div>
            <div className={`doc-status ${uploadedDoc ? 'active' : ''}`}>
              {uploadedDoc 
                ? `${uploadedDoc.name} • ${Math.max(1, Math.round(uploadedDoc.size / 1024))} KB ready to summarise.`
                : 'No document uploaded yet.'
              }
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="input-row">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsSheetCollapsed(false)}
              onClick={() => setIsSheetCollapsed(false)}
              placeholder="Ask me anything..."
            />
          </div>
          <button 
            className={`circle-btn voice-btn ${isListening ? 'listening' : ''}`}
            type="button"
            onClick={toggleVoice}
            title="Voice input"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"/>
              <path d="M19 11v1a7 7 0 0 1-14 0v-1"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
          </button>
          <button 
            className="circle-btn send-btn"
            type="button"
            onClick={sendMessage}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Voice Status Box */}
      {showVoiceStatus && (
        <div className="voice-status-box">
          <div className="voice-status-heading">Voice Input</div>
          <div className="voice-status-text">{voiceStatusText}</div>
          {isListening && (
            <button className="pill-btn" onClick={toggleVoice}>
              Stop
            </button>
          )}
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        userContext={userContext}
        onSave={saveUserContext}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Chat History Drawer */}
      <ChatHistoryDrawer
        isOpen={showHistory}
        chatHistory={messages}
        onClearHistory={clearChatHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="context-modal" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Document Preview</h3>
              <button 
                onClick={closePreview}
                style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '400px',
                border: 'none',
                borderRadius: '8px',
                background: '#fff'
              }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;