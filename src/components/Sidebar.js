import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <Link to="/">Main</Link>
      </div>
      <div className="sidebar-item">
        <Link to="/profile">Profile</Link>
      </div>
      <div className="sidebar-item">
        <Link to="/register">Register</Link>
      </div>
      <div className="sidebar-item">
        <Link to="/yourproject">Your Project</Link> {/* Changed to lowercase */}
      </div>
    </div>
  );
}

export default Sidebar;
