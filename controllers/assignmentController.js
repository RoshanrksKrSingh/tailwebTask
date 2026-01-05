const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const newAssignment = new Assignment({ ...req.body, createdBy: req.user.id });
    await newAssignment.save();
    res.json(newAssignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    // Students only see PUBLISHED
    if (req.user.role === 'student') {
      query.status = 'PUBLISHED';
    } else {
       // Teachers can filter via query params, e.g., ?status=DRAFT
       if (req.query.status) query.status = req.query.status;
    }
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const { status } = req.body; // e.g., PUBLISHED or COMPLETED
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};