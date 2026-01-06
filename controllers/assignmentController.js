const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// 1. Create Assignment (Draft)
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

// 2. Get Assignments
exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    
    // STUDENT VIEW: Only Published
    if (req.user.role === 'student') {
      query.status = 'PUBLISHED';
      
      const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
      // Fetch this student's submissions to check if they already submitted
      const mySubmissions = await Submission.find({ studentId: req.user.id }).lean();

      // Merge data
      const mergedData = assignments.map(assign => {
        const submission = mySubmissions.find(sub => sub.assignmentId.toString() === assign._id.toString());
        return { ...assign, yourSubmission: submission || null };
      });

      return res.json(mergedData);

    } else {
       // TEACHER VIEW: Filter by query param (Draft, Published, Completed)
       if (req.query.status) query.status = req.query.status;
       const assignments = await Assignment.find(query).sort({ createdAt: -1 });
       return res.json(assignments);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Update Status (Draft -> Published -> Completed)
exports.updateStatus = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const { status } = req.body;
    // Logic: If Completed, it's locked. But we allow setting TO Completed.
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

// 4. Delete Assignment (ONLY DRAFT)
exports.deleteAssignment = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Only Draft assignments can be deleted' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Edit Assignment Details (ONLY DRAFT)
exports.updateAssignment = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.status !== 'DRAFT') {
      return res.status(400).json({ message: 'Only Draft assignments can be edited' });
    }

    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};