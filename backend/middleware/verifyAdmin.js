const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) return res.status(403).json({ message: 'Access denied' });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
