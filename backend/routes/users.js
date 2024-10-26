const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File Filter for Specific File Types (Optional)
const fileFilter = (req, file, cb) => {
  // Accept only images, for example
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize Multer Middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: fileFilter
});

// Sign-up route with validation and file upload
router.post('/signup', 
  upload.single('profileImage'), // 'profileImage' should match the frontend field name
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('rollNo').notEmpty().withMessage('Roll Number is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('labName').notEmpty().withMessage('Lab Name is required'),
    body('labCode').notEmpty().withMessage('Lab Code is required'),
    body('phoneNo').isMobilePhone().withMessage('Valid phone number is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete the uploaded file if validation fails
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, rollNo, department, labName, labCode, phoneNo } = req.body;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        rollNo,
        department,
        labName,
        labCode,
        phoneNo,
        profileImage: req.file ? req.file.path : '' // Save file path if uploaded
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, userId: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Login route with validation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile with validation
router.patch('/profile', 
  verifyToken, // Protect route with verifyToken middleware
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('rollNo').optional().notEmpty().withMessage('Roll Number cannot be empty'),
    body('department').optional().notEmpty().withMessage('Department cannot be empty'),
    body('labName').optional().notEmpty().withMessage('Lab Name cannot be empty'),
    body('labCode').optional().notEmpty().withMessage('Lab Code cannot be empty'),
    body('phoneNo').optional().isMobilePhone().withMessage('Valid phone number is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { name, rollNo, department, labName, labCode, phoneNo } = req.body;

      if (name) user.name = name;
      if (rollNo) user.rollNo = rollNo;
      if (department) user.department = department;
      if (labName) user.labName = labName;
      if (labCode) user.labCode = labCode;
      if (phoneNo) user.phoneNo = phoneNo;

      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log(`Fetching profile for user ID: ${req.user.id}`); // Debug log
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User profile fetched successfully');
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
