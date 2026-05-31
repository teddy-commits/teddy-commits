import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import './AdminChat.css';

interface Chat {
  _id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: string;
}

interface Message {
  _id: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "teddybrothedeveloper";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminChat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [typingClients, setTypingClients] = useState<Set<string>>(new Set());
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🔄 Connecting to socket server at:', API_URL);
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      setConnectionStatus('connected');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionStatus('error');
    });
    
    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !isAuthenticated) {
      console.log('Waiting for authentication...', { socket: !!socket, isAuthenticated });
      return;
    }

    console.log('🔐 Sending admin auth with token:', ADMIN_TOKEN);
    socket.emit('admin_auth', ADMIN_TOKEN);

    socket.on('auth_error', (error) => {
      console.error('❌ Auth error from server:', error);
      setIsAuthenticated(false);
      alert(`Authentication failed: ${error}`);
    });

    socket.on('admin_chats_list', (chatsList: Chat[]) => {
      console.log('📋 Received chats list:', chatsList.length);
      setChats(chatsList);
    });

    socket.on('admin_new_message', (data) => {
      console.log('📨 New message received:', data);
      if (selectedChat?._id === data.chatId) {
        setMessages(prev => [...prev, {
          _id: data.messageId,
          sender: 'client',
          senderName: data.clientName,
          message: data.message,
          timestamp: new Date(data.timestamp),
          read: false
        }]);
        markMessagesAsRead(data.chatId);
      }
      
      setChats(prev => prev.map(chat => 
        chat._id === data.chatId 
          ? { ...chat, lastMessage: data.message, lastMessageTime: new Date(data.timestamp), unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    });

    socket.on('admin_client_typing', (data) => {
      console.log('⌨️ Client typing:', data);
      setTypingClients(prev => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.clientId);
        } else {
          newSet.delete(data.clientId);
        }
        return newSet;
      });
    });

    return () => {
      socket.off('auth_error');
      socket.off('admin_chats_list');
      socket.off('admin_new_message');
      socket.off('admin_client_typing');
    };
  }, [socket, isAuthenticated, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatMessages = async (chatId: string) => {
    try {
      console.log('Loading messages for chat:', chatId);
      const response = await axios.get(`${API_URL}/api/admin/chats/${chatId}/messages`, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
      console.log('Messages loaded:', response.data.length);
      setMessages(response.data);
      await markMessagesAsRead(chatId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      await axios.post(`${API_URL}/api/admin/chats/${chatId}/read`, {}, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    await loadChatMessages(chat._id);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket && selectedChat) {
      console.log('Sending admin message to:', selectedChat.clientId);
      socket.emit('admin_message', {
        clientId: selectedChat.clientId,
        message: inputMessage,
        adminName: 'Tewodros'
      });
      
      const tempMessage: Message = {
        _id: Date.now().toString(),
        sender: 'admin',
        senderName: 'Tewodros',
        message: inputMessage,
        timestamp: new Date(),
        read: true
      };
      setMessages(prev => [...prev, tempMessage]);
      setInputMessage('');
    }
  };

  const archiveChat = async (chatId: string) => {
    try {
      await axios.post(`${API_URL}/api/admin/chats/${chatId}/archive`, {}, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to archive chat:', error);
    }
  };

  const handleLogin = () => {
    console.log('Login attempt with token:', tokenInput);
    console.log('Expected token:', ADMIN_TOKEN);
    console.log('Tokens match:', tokenInput === ADMIN_TOKEN);
    
    if (tokenInput === ADMIN_TOKEN) {
      console.log('✅ Authentication successful!');
      setIsAuthenticated(true);
    } else {
      console.error('❌ Authentication failed - tokens do not match');
      alert(`Invalid admin token!\n\nExpected: ${ADMIN_TOKEN}\nReceived: ${tokenInput}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <i className="fas fa-shield-alt"></i>
          <h2>Admin Access</h2>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Socket Status: {connectionStatus}
          </p>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
            Backend URL: {API_URL}
          </p>
          <input 
            type="password" 
            placeholder="Enter admin token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>
            Authenticate
          </button>
          <p style={{ fontSize: '11px', color: '#999', marginTop: '15px' }}>
            Hint: The token is "{ADMIN_TOKEN}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-container">
      <div className="chats-sidebar">
        <h3>💬 Conversations ({chats.length})</h3>
        <div className="chats-list">
          {chats.length === 0 && (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>
              No active conversations yet
            </div>
          )}
          {chats.map(chat => (
            <div 
              key={chat._id} 
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-info">
                <h4>{chat.clientName}</h4>
                <p className="last-message">{chat.lastMessage || 'No messages yet'}</p>
                <small>{new Date(chat.lastMessageTime).toLocaleString()}</small>
              </div>
              {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
              {typingClients.has(chat.clientId) && <span className="typing-dot">typing...</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-area">
        {selectedChat ? (
          <>
            <div className="chat-area-header">
              <div>
                <h3>{selectedChat.clientName}</h3>
                {selectedChat.clientEmail && <p>{selectedChat.clientEmail}</p>}
              </div>
              <button onClick={() => archiveChat(selectedChat._id)} className="archive-btn">
                Archive Chat
              </button>
            </div>
            
            <div className="admin-messages">
              {messages.map(msg => (
                <div key={msg._id} className={`admin-message ${msg.sender === 'admin' ? 'sent' : 'received'}`}>
                  <strong>{msg.senderName}</strong>
                  <p>{msg.message}</p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="admin-input-area">
              <textarea
                placeholder="Type your response..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                rows={3}
              />
              <button onClick={handleSendMessage}>
                <i className="fas fa-paper-plane"></i> Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <i className="fas fa-comments"></i>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;