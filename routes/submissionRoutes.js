const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Student: Submit
router.post('/', auth, checkRole('student'), submissionController.submitAssignment);

// Teacher: View Submissions
router.get('/:assignmentId', auth, checkRole('teacher'), submissionController.getSubmissionsForAssignment);

// Teacher: Mark as Reviewed
router.put('/:id/review', auth, checkRole('teacher'), submissionController.markReviewed);

module.exports = router;