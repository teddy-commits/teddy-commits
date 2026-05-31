import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './ChatWidget.css';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to your backend
    console.log('🔌 Connecting to backend at:', API_URL);
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    socketRef.current.on('receive_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && socketRef.current && isNameSet) {
      const message = {
        sender: senderName,
        text: inputMessage,
        timestamp: new Date()
      };
      socketRef.current.emit('send_message', message);
      setInputMessage('');
    }
  };

  const handleSetName = () => {
    if (senderName.trim()) {
      setIsNameSet(true);
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-toggle" onClick={() => setIsOpen(true)}>
        <i className="fas fa-comment-dots"></i>
      </button>
    );
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === senderName ? 'own' : 'other'}`}>
            <strong>{msg.sender}</strong>
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        {!isNameSet ? (
          <div className="name-setup">
            <input
              type="text"
              placeholder="Enter your name to chat..."
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
            />
            <button onClick={handleSetName}>Start Chat</button>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;