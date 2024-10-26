import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState(''); // Use email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setIsPopupOpen(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password }); // Correct payload
      localStorage.setItem('token', response.data.token);
      if (response.data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      setIsPopupOpen(false);
    } catch (error) {
      setError('Invalid Email or Password');
      console.error('Login Error:', error);
    }
  };

  const handleGoogleSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    console.log(decoded);
    if (decoded.email) {
      // Optionally, send decoded info to backend for authentication
      navigate('/dashboard');
      setIsPopupOpen(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google sign-in failed:', error);
    setError('Google sign-in failed. Please try again.');
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container">
        <h1>Open Innovation Category</h1>
        <div className="button-group">
          <button className="button" onClick={() => handleRoleClick('user')}>User Login</button>
          <button className="button" onClick={() => handleRoleClick('admin')}>Admin Login</button>
        </div>

        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={closePopup}>X</button>
              <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
              <input
                type="text" // Changed to email
                placeholder={`Enter ${selectedRole === 'user' ? 'User' : 'Admin'} Email`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <button className="button" onClick={handleLogin}>Login</button>
              {error && <div className="error">{error}</div>}

              <div className="google-login">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>

              <div className="signup-link">
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p> {/* Updated to /signup */}
              </div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
