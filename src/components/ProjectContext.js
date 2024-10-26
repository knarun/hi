import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();
export const ProfileContext = createContext(); // Create separate context for profile

export const ProjectProvider = ({ children }) => {
  const [projectDetails, setProjectDetails] = useState({
    projectTitle: '',
    components: [],
    teamMembers: [],
    flowChart: null
  });

  // Separate profile details state
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    rollNo: '',
    department: '',
    labName: '',
    phoneNo: ''
  });

  return (
    <ProjectContext.Provider value={{ projectDetails, setProjectDetails }}>
      <ProfileContext.Provider value={{ profileDetails, setProfileDetails }}>
        {children}
      </ProfileContext.Provider>
    </ProjectContext.Provider>
  );
};
