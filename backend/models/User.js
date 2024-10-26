const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rollNo: { type: String, unique: true, required: true },
  department: { type: String, required: true },
  labName: { type: String, required: true },
  labCode: { type: String, required: true },
  phoneNo: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
