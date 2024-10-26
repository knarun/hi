import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/api';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    department: '',
    labName: '',
    labCode: '',
    phoneNo: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpUser(formData);
      // Handle successful signup (e.g., navigate to login or dashboard)
      navigate('/login');
    } catch (error) {
      setError('Failed to sign up. ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="rollNo" placeholder="Roll No" onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
        <input type="text" name="labName" placeholder="Lab Name" onChange={handleChange} required />
        <input type="text" name="labCode" placeholder="Lab Code" onChange={handleChange} required />
        <input type="text" name="phoneNo" placeholder="Phone No" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
