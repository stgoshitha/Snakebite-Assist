const Snake = require('../models/SnakeModel');

// Get all snakes
const getAllSnakes = async (req, res) => {
    try {
        const snakes = await Snake.find({});
        res.status(200).json({
            success: true,
            count: snakes.length,
            data: snakes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// Get single snake by ID
const getSnakeById = async (req, res) => {
    try {
        const snake = await Snake.findById(req.params.id);
        
        if (!snake) {
            return res.status(404).json({
                success: false,
                error: 'Snake not found'
            });
        }

        res.status(200).json({
            success: true,
            data: snake
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Snake not found'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// Add new snake
const addSnake = async (req, res) => {
    try {
        const snake = await Snake.create(req.body);
        
        res.status(201).json({
            success: true,
            data: snake
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// Update snake
const updateSnake = async (req, res) => {
    try {
        const snake = await Snake.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!snake) {
            return res.status(404).json({
                success: false,
                error: 'Snake not found'
            });
        }

        res.status(200).json({
            success: true,
            data: snake
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

// Delete snake
const deleteSnake = async (req, res) => {
    try {
        const snake = await Snake.findByIdAndDelete(req.params.id);

        if (!snake) {
            return res.status(404).json({
                success: false,
                error: 'Snake not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Snake deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

module.exports = {
    getAllSnakes,
    getSnakeById,
    addSnake,
    updateSnake,
    deleteSnake
}; 