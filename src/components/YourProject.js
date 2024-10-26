import React, { useEffect, useState, useContext } from 'react';
import { getMyProject } from '../services/api';
import './YourProject.css';
import { ProfileContext } from './ProjectContext';

const YourProject = () => {
  const { profileDetails } = useContext(ProfileContext);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, []);

  const fetchProject = async () => {
    try {
      const response = await getMyProject();
      setProject(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to fetch project. ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="your-project">
      <h2>Your Project</h2>
      {error && <div className="error-message">{error}</div>}
      {project ? (
        <div className="project-details">
          <p><strong>Title:</strong> {project.projectTitle}</p>
          <p><strong>Status:</strong> {project.status}</p>
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
      ) : (
        <p>No project found.</p>
      )}
    </div>
  );
};

export default YourProject;
