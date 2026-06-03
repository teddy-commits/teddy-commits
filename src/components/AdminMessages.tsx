import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminMessages.css';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
  replyMessage?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'teddybrothedeveloper';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
    fetchStatistics();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact/messages`, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact/statistics`, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      await axios.get(`${API_URL}/api/contact/messages/${message._id}`, {
        headers: { 'admin-token': ADMIN_TOKEN }
      });
      fetchMessages();
      fetchStatistics();
    }
  };

  const handleMarkReplied = async () => {
    if (!selectedMessage) return;
    
    try {
      await axios.put(`${API_URL}/api/contact/messages/${selectedMessage._id}/reply`, 
        { replyMessage: replyText },
        { headers: { 'admin-token': ADMIN_TOKEN } }
      );
      alert('Message marked as replied!');
      fetchMessages();
      fetchStatistics();
      setSelectedMessage(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to mark as replied:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_URL}/api/contact/messages/${id}`, {
          headers: { 'admin-token': ADMIN_TOKEN }
        });
        fetchMessages();
        fetchStatistics();
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="badge unread">Unread</span>;
      case 'read':
        return <span className="badge read">Read</span>;
      case 'replied':
        return <span className="badge replied">Replied</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="admin-messages-container">
      <div className="messages-header">
        <h2>Contact Messages</h2>
        {statistics && (
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{statistics.unread}</span>
              <span className="stat-label">Unread</span>
            </div>
            <div className="stat">
              <span className="stat-value">{statistics.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{statistics.today}</span>
              <span className="stat-label">Today</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="messages-grid">
        <div className="messages-list">
          {messages.map(message => (
            <div 
              key={message._id} 
              className={`message-item ${selectedMessage?._id === message._id ? 'active' : ''} ${message.status === 'unread' ? 'unread' : ''}`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="message-preview">
                <h4>{message.name}</h4>
                <p>{message.subject}</p>
                <small>{new Date(message.createdAt).toLocaleDateString()}</small>
              </div>
              {getStatusBadge(message.status)}
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(message._id);
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        
        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h3>Message Details</h3>
                {getStatusBadge(selectedMessage.status)}
              </div>
              <div className="detail-content">
                <div className="detail-field">
                  <strong>From:</strong>
                  <p>{selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                <div className="detail-field">
                  <strong>Subject:</strong>
                  <p>{selectedMessage.subject}</p>
                </div>
                <div className="detail-field">
                  <strong>Message:</strong>
                  <p>{selectedMessage.message}</p>
                </div>
                <div className="detail-field">
                  <strong>Received:</strong>
                  <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                {selectedMessage.replyMessage && (
                  <div className="detail-field">
                    <strong>Your Reply:</strong>
                    <p className="reply-message">{selectedMessage.replyMessage}</p>
                  </div>
                )}
              </div>
              
              {selectedMessage.status !== 'replied' && (
                <div className="reply-section">
                  <textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <button onClick={handleMarkReplied} className="reply-btn">
                    Mark as Replied
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <i className="fas fa-envelope-open-text"></i>
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;