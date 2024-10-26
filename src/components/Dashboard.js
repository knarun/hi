import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    rollNo: '',
    department: '',
    labName: '',
    phoneNo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        console.log('Attempting to fetch profile details...');
        const response = await getUserProfile();
        console.log('Profile Data:', response.data);
        setProfileDetails(response.data);
      } catch (error) {
        console.error('Error fetching profile details:', error);
        let errorMsg = 'Failed to fetch profile details.';
        if (error.response) {
          if (error.response.data && error.response.data.errors) {
            // Validation errors
            errorMsg += ' ' + error.response.data.errors.map(err => err.msg).join(', ');
          } else if (error.response.data && error.response.data.message) {
            // General error message
            errorMsg += ' ' + error.response.data.message;
          }
        } else if (error.message) {
          errorMsg += ' ' + error.message;
        }
        setError(errorMsg);
      }
    };

    fetchProfileDetails();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-info">
        <h2>Profile Information</h2>
        <p><strong>Name:</strong> {profileDetails.name}</p>
        <p><strong>Roll No:</strong> {profileDetails.rollNo}</p>
        <p><strong>Department:</strong> {profileDetails.department}</p>
        <p><strong>Lab Name:</strong> {profileDetails.labName}</p>
        <p><strong>Phone No:</strong> {profileDetails.phoneNo}</p>
      </div>
    </div>
  );
};

export default Dashboard;
