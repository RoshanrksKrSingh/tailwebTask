const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// @route   POST api/assignments
// @desc    Create a new assignment (Draft)
// @access  Private (Teacher only)
router.post(
  '/', 
  auth, 
  checkRole('teacher'), 
  assignmentController.createAssignment
);

// @route   GET api/assignments
// @desc    Get all assignments (Students get Published only, Teachers get all)
// @access  Private (Teacher & Student)
router.get(
  '/', 
  auth, 
  assignmentController.getAssignments
);

// @route   PUT api/assignments/:id/status
// @desc    Update assignment status (Draft -> Published -> Completed)
// @access  Private (Teacher only)
router.put(
  '/:id/status', 
  auth, 
  checkRole('teacher'), 
  assignmentController.updateStatus
);

module.exports = router;