import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails, updateProjectStatus } from '../services/api';
// import './ProjectDetails.css';
import { ProfileContext } from './ProjectContext';

const ProjectDetails = () => {
  const { profileDetails } = useContext(ProfileContext);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await getProjectDetails(projectId);
      setProject(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to fetch project details. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      setSuccessMessage(`Project status updated to ${newStatus}`);
      fetchProjectDetails(); // Refresh project details
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Failed to update project status. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  // Check if the user is authorized to view this project
  const isAuthorized = profileDetails.isAdmin || (project.user === profileDetails.id);

  if (!isAuthorized) {
    return <div className="error-message">You do not have permission to view this project.</div>;
  }

  return (
    <div className="project-details">
      <button onClick={handleBack}>Back to Admin Dashboard</button>
      <h2>Project Details</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <p><strong>Title:</strong> {project.projectTitle}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <div className="status-buttons">
        <button onClick={() => handleStatusChange('Approved')} disabled={project.status === 'Approved'}>Approve</button>
        <button onClick={() => handleStatusChange('Rejected')} disabled={project.status === 'Rejected'}>Reject</button>
      </div>
      <h3>Components:</h3>
      <ul>
        {project.components.map((component, index) => (
          <li key={index}>
            {component.name} - Quantity: {component.quantity}, Price: {component.price}
            <br />
            <a href={component.productLink} target="_blank" rel="noopener noreferrer">Product Link</a>
          </li>
        ))}
      </ul>
      <h3>Team Members:</h3>
      <ul>
        {project.teamMembers.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <h3>Flow Chart:</h3>
      {project.flowChart && (
        <img src={project.flowChart} alt="Flow Chart" style={{maxWidth: '100%', height: 'auto'}} />
      )}
    </div>
  );
};

export default ProjectDetails;
