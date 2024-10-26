import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getAllProjects();
      setProjects(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. ' + (error.response?.data?.message || error.message));
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="projects-list">
        {projects.map((project) => (
          <div key={project._id} className="project-item" onClick={() => handleProjectClick(project._id)}>
            <p><strong>Title:</strong> {project.projectTitle}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
