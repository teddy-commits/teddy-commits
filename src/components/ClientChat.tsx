import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './ClientChat.css';

interface Message {
  _id?: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

interface StoredClientData {
  clientId: string;
  clientName: string;
  clientEmail: string;
  firstVisit: string;
  lastVisit: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ClientChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [clientId, setClientId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  // Load saved client data on component mount
  useEffect(() => {
    const loadSavedClientData = () => {
      // Try to load saved client data from localStorage
      const savedData = localStorage.getItem('chat_client_data');
      
      if (savedData) {
        try {
          const parsed: StoredClientData = JSON.parse(savedData);
          console.log('✅ Found saved client data:', parsed);
          
          setClientId(parsed.clientId);
          setClientName(parsed.clientName);
          setClientEmail(parsed.clientEmail);
          setIsNameSet(true); // Auto-authenticate returning user
          
          // Update last visit time
          const updatedData = {
            ...parsed,
            lastVisit: new Date().toISOString()
          };
          localStorage.setItem('chat_client_data', JSON.stringify(updatedData));
          
        } catch (error) {
          console.error('Error loading saved client data:', error);
          createNewClient();
        }
      } else {
        createNewClient();
      }
    };
    
    const createNewClient = () => {
      // Generate new client ID
      const newId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setClientId(newId);
      console.log('🆕 Created new client ID:', newId);
    };
    
    loadSavedClientData();

    // Connect to socket
    console.log('🔌 Connecting to backend at:', API_URL);
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Save client data to localStorage when name is set
  const saveClientData = (name: string, email: string, id: string) => {
    const clientData: StoredClientData = {
      clientId: id,
      clientName: name,
      clientEmail: email,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };
    localStorage.setItem('chat_client_data', JSON.stringify(clientData));
    console.log('💾 Client data saved to localStorage:', clientData);
  };

  useEffect(() => {
    if (!socket || !isNameSet) return;

    console.log('🔗 Joining chat with:', { clientId, clientName, clientEmail });

    // Join chat
    socket.emit('client_join', {
      clientId,
      clientName,
      clientEmail
    });

    // Receive chat history
    socket.on('chat_history', (history: Message[]) => {
      console.log('📜 Received chat history:', history.length, 'messages');
      setMessages(history);
    });

    // Receive admin messages
    socket.on('admin_message', (data) => {
      console.log('📨 New admin message:', data);
      const newMessage: Message = {
        sender: 'admin',
        senderName: data.senderName,
        message: data.message,
        timestamp: new Date(data.timestamp)
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Play sound or show notification (optional)
      if (document.hidden) {
        // User is on different tab, show notification
        showBrowserNotification(data.senderName, data.message);
      }
    });

    // Message sent confirmation
    socket.on('message_sent', (message: Message) => {
      console.log('✅ Message sent:', message);
      setMessages(prev => [...prev, message]);
    });

    // Admin typing indicator
    socket.on('client_admin_typing', (data) => {
      setAdminTyping(data.isTyping);
      if (!data.isTyping) {
        setTimeout(() => setAdminTyping(false), 1000);
      }
    });

    return () => {
      socket.off('chat_history');
      socket.off('admin_message');
      socket.off('message_sent');
      socket.off('client_admin_typing');
    };
  }, [socket, isNameSet, clientId, clientName, clientEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Browser notification for new messages
  const showBrowserNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(`New message from ${title}`, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket && isNameSet) {
      socket.emit('client_message', {
        clientId,
        message: inputMessage,
        clientName
      });
      setInputMessage('');
      handleStopTyping();
    }
  };

  const handleStartTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('client_typing', { clientId, isTyping: true });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 2000);
    }
  };

  const handleStopTyping = () => {
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('client_typing', { clientId, isTyping: false });
    }
  };

  const handleSetName = () => {
    if (clientName.trim()) {
      // Save to localStorage
      saveClientData(clientName, clientEmail, clientId);
      setIsNameSet(true);
    }
  };

  const handleLogout = () => {
    // Optional: Clear saved data (useful for testing)
    if (window.confirm('Clear your saved information? This will reset your chat session.')) {
      localStorage.removeItem('chat_client_data');
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button className="client-chat-toggle" onClick={() => setIsOpen(true)}>
        <i className="fas fa-comment-dots"></i>
        <span className="chat-badge">Live Chat</span>
      </button>
    );
  }

  // Show name setup only for new users (no saved data)
  if (!isNameSet) {
    return (
      <div className="client-chat-widget">
        <div className="chat-header">
          <h3>Start Conversation</h3>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <div className="name-setup-form">
          <i className="fas fa-user-circle"></i>
          <h4>Enter your details to chat</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
            Your info will be saved for future conversations
          </p>
          <input
            type="text"
            placeholder="Your name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            autoFocus
          />
          <input
            type="email"
            placeholder="Your email (optional)"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <button onClick={handleSetName}>
            Start Chatting
          </button>
        </div>
      </div>
    );
  }

  // Main chat interface for returning users
  return (
    <div className="client-chat-widget">
      <div className="chat-header">
        <div>
          <h3>Chat with Tewodros</h3>
          {adminTyping && <small className="typing-indicator">Admin is typing...</small>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#94a3b8', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Clear saved info"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <i className="fas fa-smile-wink"></i>
            <p>Welcome back {clientName}! How can I help you today?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === 'client' ? 'client' : 'admin'}`}>
            <strong>{msg.sender === 'client' ? clientName : 'Tewodros'}</strong>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            {msg.sender === 'client' && msg.read && <i className="fas fa-check-double read-status"></i>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          placeholder={`Type your message, ${clientName}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onFocus={handleStartTyping}
          rows={2}
        />
        <button onClick={handleSendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ClientChat;