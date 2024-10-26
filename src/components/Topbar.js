import React, { useContext } from 'react';
import './Topbar.css';
import { ProfileContext } from './ProjectContext';

function Topbar() {
  const { profileDetails } = useContext(ProfileContext);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const initials = name.split(' ').map(word => word[0].toUpperCase()).join('');
    return initials;
  };

  return (
    <div className="topbar">
      <div className="topbar-title">BIT Open Innovation Category Portal</div>
      <div className="user-info">
        <div className="user-icon">{getUserInitials(profileDetails.name)}</div>
        <div className="user-name">{profileDetails.name || 'User Name'}</div>
      </div>
    </div>
  );
}

export default Topbar;
