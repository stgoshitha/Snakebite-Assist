const express = require('express');
const router = express.Router();
const {
    getAllSnakes,
    getSnakeById,
    addSnake,
    updateSnake,
    deleteSnake
} = require('../controllers/snakeController');

// @route   GET /api/snakes
// @desc    Get all snakes
// @access  Public
router.get('/', getAllSnakes);

// @route   GET /api/snakes/:id
// @desc    Get snake by ID
// @access  Public
router.get('/:id', getSnakeById);

// @route   POST /api/snakes/add
// @desc    Add a new snake
// @access  Public
router.post('/add', addSnake);

// @route   PUT /api/snakes/:id
// @desc    Update a snake
// @access  Public
router.put('/:id', updateSnake);

// @route   DELETE /api/snakes/:id
// @desc    Delete a snake
// @access  Public
router.delete('/:id', deleteSnake);

module.exports = router; 