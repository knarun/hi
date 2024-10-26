import React, { useState, useEffect } from 'react';
import { registerProject } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [components, setComponents] = useState([
    { name: '', quantity: '', productLink: '', price: '' }
  ]);
  const [teamMembers, setTeamMembers] = useState(['']);
  const [flowChart, setFlowChart] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...components];
    updatedComponents[index][field] = value;
    setComponents(updatedComponents);
  };

  const handleAddComponent = () => {
    setComponents([...components, { name: '', quantity: '', productLink: '', price: '' }]);
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers[index] = value;
    setTeamMembers(updatedTeamMembers);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const handleFlowChartUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFlowChart(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('projectTitle', projectTitle);
      formData.append('components', JSON.stringify(components));
      formData.append('teamMembers', JSON.stringify(teamMembers));
      if (flowChart) {
        formData.append('flowChart', flowChart);
      }

      const response = await registerProject(formData);
      setSuccessMessage('Project registered successfully!');
      setError('');
      console.log('Project registered:', response.data);
    } catch (error) {
      setError('Failed to register project. ' + (error.response?.data?.message || error.message));
      setSuccessMessage('');
      console.error('Error registering project:', error);
    }
  };

  return (
    <div className="register-page">
      <h2>Register Your Project</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Project Title</label>
          <input 
            type="text" 
            value={projectTitle} 
            onChange={(e) => setProjectTitle(e.target.value)} 
            required
          />
        </div>

        <div className="form-group">
          <h3>Components</h3>
          {components.map((component, index) => (
            <div key={index} className="component-row">
              <input
                type="text"
                placeholder="Component Name"
                value={component.name}
                onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={component.quantity}
                onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Product Link"
                value={component.productLink}
                onChange={(e) => handleComponentChange(index, 'productLink', e.target.value)}
              />
              <input
                type="text"
                placeholder="Price"
                value={component.price}
                onChange={(e) => handleComponentChange(index, 'price', e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddComponent}>Add Component</button>
        </div>

        <div className="form-group">
          <h3>Team Members</h3>
          {teamMembers.map((member, index) => (
            <input
              key={index}
              type="text"
              placeholder="Team Member Name"
              value={member}
              onChange={(e) => handleTeamMemberChange(index, e.target.value)}
              required
            />
          ))}
          <button type="button" onClick={handleAddTeamMember}>Add Team Member</button>
        </div>

        <div className="form-group">
          <label>Upload Flow Chart</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFlowChartUpload} 
          />
        </div>

        <button type="submit">Register Project</button>
      </form>
    </div>
  );
};

export default RegisterPage;
