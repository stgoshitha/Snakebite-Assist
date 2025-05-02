const express = require('express');
const {
  getSnakes,
  getSnake,
  createSnake,
  deleteSnake,
  updateSnake,
  getSnakesByProvince
} = require('../controllers/snakeController');

const router = express.Router();

// GET all snakes
router.get('/', getSnakes);

// GET a single snake
router.get('/:id', getSnake);

// GET snakes by province
router.get('/province/:province', getSnakesByProvince);

// POST a new snake
router.post('/', createSnake);

// DELETE a snake
router.delete('/:id', deleteSnake);

// UPDATE a snake
router.patch('/:id', updateSnake);

module.exports = router; 