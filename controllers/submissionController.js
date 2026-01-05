const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// Submit Assignment (Student)
exports.submitAssignment = async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can submit' });
  try {
    const { assignmentId, answer } = req.body;
    
    // Check Assignment existence and status
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Assignment not available' });
    }

    // CHECK EXISTING SUBMISSION
    let submission = await Submission.findOne({ assignmentId, studentId: req.user.id });

    if (submission) {
      // If status is NOT 'REDO REQUESTED', block them.
      if (submission.status !== 'REDO_REQUESTED') {
        return res.status(400).json({ message: 'You have already submitted this assignment.' });
      }
      
      // If status IS 'REDO REQUESTED', update existing submission and reset status
      submission.answer = answer;
      submission.submittedAt = Date.now();
      submission.status = 'SUBMITTED'; // Reset to Submitted
      await submission.save();
      return res.json(submission);
    }

    // Create New Submission
    submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      answer,
      status: 'SUBMITTED'
    });
    
    await submission.save();
    res.json(submission);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Submissions (Teacher)
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

// Update Submission Status (Teacher - Allow Redo)
exports.updateSubmissionStatus = async (req, res) => {
  // Ensure only teachers can change status
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Access Denied' });

  try {
    const { status } = req.body; // Expect "REDO REQUESTED"
    
    const submission = await Submission.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};