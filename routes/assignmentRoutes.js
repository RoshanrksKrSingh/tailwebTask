const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Create (Draft)
router.post('/', auth, checkRole('teacher'), assignmentController.createAssignment);

// Get All
router.get('/', auth, assignmentController.getAssignments);

// Update Status (Publish/Complete)
router.put('/:id/status', auth, checkRole('teacher'), assignmentController.updateStatus);

// Edit Details (Only Draft)
router.put('/:id', auth, checkRole('teacher'), assignmentController.updateAssignment);

// Delete (Only Draft)
router.delete('/:id', auth, checkRole('teacher'), assignmentController.deleteAssignment);

module.exports = router;