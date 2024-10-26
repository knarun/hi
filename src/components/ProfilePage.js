import React, { useState, useEffect, useContext } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import './ProfilePage.css';
import { ProfileContext } from './ProjectContext';

function ProfilePage() {
  const { profileDetails, setProfileDetails } = useContext(ProfileContext);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfileDetails(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to fetch profile. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(profileDetails);
      setProfileDetails(response.data);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. ' + (error.response?.data?.message || error.message));
      setSuccessMessage('');
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile Page</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileDetails.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Roll No</label>
          <input
            type="text"
            name="rollNo"
            value={profileDetails.rollNo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={profileDetails.department}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Lab Name</label>
          <input
            type="text"
            name="labName"
            value={profileDetails.labName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Lab Code</label>
          <input
            type="text"
            name="labCode"
            value={profileDetails.labCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <input
            type="text"
            name="phoneNo"
            value={profileDetails.phoneNo}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
