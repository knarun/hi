const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Register Project Route
router.post('/register', 
  upload.single('flowChart'),
  [
    body('projectTitle').notEmpty().withMessage('Project Title is required'),
    body('components').custom((value) => {
      if (!value) throw new Error('Components are required');
      try {
        const components = JSON.parse(value);
        if (!Array.isArray(components) || components.length === 0) {
          throw new Error('At least one component is required');
        }
      } catch (err) {
        throw new Error('Components must be a valid JSON array');
      }
      return true;
    }),
    body('teamMembers').custom((value) => {
      if (!value) throw new Error('Team Members are required');
      try {
        const teamMembers = JSON.parse(value);
        if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
          throw new Error('At least one team member is required');
        }
      } catch (err) {
        throw new Error('Team Members must be a valid JSON array');
      }
      return true;
    }),
    // Add other field validations as necessary
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      if (req.file) {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file due to validation errors.');
      }
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { projectTitle, components, teamMembers } = req.body;
      const flowChartPath = req.file ? req.file.path : '';

      console.log('Registering Project:', { projectTitle, components, teamMembers, flowChartPath });

      const parsedComponents = JSON.parse(components);
      const parsedTeamMembers = JSON.parse(teamMembers);

      const newProject = new Project({
        projectTitle,
        components: parsedComponents,
        teamMembers: parsedTeamMembers,
        flowChart: flowChartPath,
        status: 'Pending',
      });

      await newProject.save();

      console.log('Project Saved Successfully:', newProject);

      res.status(201).json({ message: 'Project registered successfully', project: newProject });
    } catch (error) {
      console.error('Error in Project Registration:', error);
      res.status(500).json({ message: 'Server Error: Unable to register project.' });
    }
  }
);

module.exports = router;
