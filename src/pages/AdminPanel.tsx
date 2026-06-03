import React, { useState } from 'react';
import AdminChat from '../components/AdminChat';
import AdminMessages from '../components/AdminMessages';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'messages'>('chats');

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h2>🔒 Admin Dashboard</h2>
          <small>Manage your chats and contact messages</small>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="exit-btn"
        >
          Exit
        </button>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'chats' ? 'active' : ''}
          onClick={() => setActiveTab('chats')}
        >
          <i className="fas fa-comments"></i> Live Chats
        </button>
        <button 
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          <i className="fas fa-envelope"></i> Contact Messages
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'chats' ? <AdminChat /> : <AdminMessages />}
      </div>
    </div>
  );
};

export default AdminPanel;