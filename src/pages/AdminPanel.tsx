import React from 'react';
import AdminChat from '../components/AdminChat';


const AdminPanel: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        background: '#0f172a', 
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>🔒 Admin Dashboard</h2>
          <small style={{ color: '#94a3b8' }}>Secure Chat Management</small>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Exit
        </button>
      </div>
      <AdminChat />
    </div>
  );
};

export default AdminPanel;