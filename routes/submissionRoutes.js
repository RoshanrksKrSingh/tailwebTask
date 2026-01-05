const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// @route   POST api/submissions
// @desc    Submit an answer for an assignment
// @access  Private (Student only)
router.post(
  '/', 
  auth, 
  checkRole('student'), 
  submissionController.submitAssignment
);

// @route   GET api/submissions/:assignmentId
// @desc    Get all submissions for a specific assignment
// @access  Private (Teacher only)
router.get(
  '/:assignmentId', 
  auth, 
  checkRole('teacher'), 
  submissionController.getSubmissionsForAssignment
);

// @route   PUT api/submissions/:id/status
// @desc    Update submission status (e.g., mark as REDO_REQUESTED)
// @access  Private (Teacher only)
router.put(
  '/:id/status',
  auth,
  checkRole('teacher'),
  submissionController.updateSubmissionStatus
);

module.exports = router;