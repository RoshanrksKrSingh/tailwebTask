const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// 1. Submit Assignment (Student)
exports.submitAssignment = async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can submit' });
  try {
    const { assignmentId, answer } = req.body;
    
    // Check Assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Assignment not available' });
    }

    // STRICT CHECK: Cannot edit once sent
    const existingSubmission = await Submission.findOne({ assignmentId, studentId: req.user.id });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment.' });
    }

    // Create Submission
    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      answer
    });
    
    await submission.save();
    res.json(submission);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get Submissions (Teacher)
exports.getSubmissionsForAssignment = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate('studentId', 'name email');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Mark as Reviewed (Teacher)
exports.markReviewed = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { isReviewed: true },
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};