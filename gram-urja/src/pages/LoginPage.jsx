import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/pages.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if ((username === 'test' && password === 'test') || username.length > 0 && password.length > 0) {
        localStorage.setItem('token', 'gram-urja-token-2025');
        localStorage.setItem('user', JSON.stringify({ id: 1, username, email: `${username}@gramurja.com` }));
        setIsAuthenticated(true);
        toast.success('Welcome to GRAM URJA!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🌱 GRAM URJA</h1>
          <p>Renewable Energy Intelligence Platform</p>
          <p className="subtitle">Smart Energy Assessment for Rural India</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-info">
          <strong>Demo Credentials:</strong>
          <p>Username: <code>test</code></p>
          <p>Password: <code>test</code></p>
          <p style={{marginTop: '10px', fontSize: '12px', color: '#81C784'}}>Or use any username/password to login</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
