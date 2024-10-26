const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  productLink: { type: String },
  price: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  components: [ComponentSchema],
  teamMembers: [String],
  flowChart: { type: String }, // Path to the uploaded flow chart
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
