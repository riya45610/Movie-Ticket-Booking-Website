import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_USER',
    email: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (isLogin) {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        onLogin(result.role);
      } else {
        setError(result.message);
      }
    } else {
      const result = await register(
        formData.username,
        formData.password,
        formData.role,
        formData.email,
        formData.fullName
      );
      if (result.success) {
        onLogin(result.role);
      } else {
        setError(result.message);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">C</span>
            <span className="logo-text">CineVerse</span>
          </div>
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to book your favorite movies' : 'Join us for an amazing movie experience'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>I am a</label>
                <div className="role-selector">
                  <label className={`role-option ${formData.role === 'ROLE_USER' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="ROLE_USER"
                      checked={formData.role === 'ROLE_USER'}
                      onChange={handleChange}
                    />
                    <span className="role-icon">🎬</span>
                    <span>Customer</span>
                  </label>
                  <label className={`role-option ${formData.role === 'ROLE_ADMIN' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="ROLE_ADMIN"
                      checked={formData.role === 'ROLE_ADMIN'}
                      onChange={handleChange}
                    />
                    <span className="role-icon">⚙️</span>
                    <span>Admin</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={toggleMode} className="toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
