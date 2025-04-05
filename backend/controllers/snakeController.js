const Snake = require('../models/SnakeModel');
const PDFDocument = require('pdfkit');

// Get all snakes
//test and confirm getting all snakes works
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
//est and confirm adding new snake data works
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

// Generate snake report
const generateReport = async (req, res) => {
    try {
        const snake = await Snake.findById(req.params.id);
        
        if (!snake) {
            return res.status(404).json({
                success: false,
                error: 'Snake not found'
            });
        }

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=snake-report-${snake._id}.pdf`);

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Snake Report', { align: 'center' });
        doc.moveDown();
        
        // Add snake image if available
        if (snake.image) {
            doc.image(snake.image, {
                fit: [250, 250],
                align: 'center'
            });
            doc.moveDown();
        }

        // Basic Information
        doc.fontSize(16).text('Basic Information');
        doc.fontSize(12);
        doc.text(`Name: ${snake.name}`);
        doc.text(`Color: ${snake.color}`);
        doc.text(`Size: ${snake.size}`);
        doc.text(`Length: ${snake.length}`);
        doc.text(`Head Shape: ${snake.headShape}`);
        doc.text(`Pattern: ${snake.pattern}`);
        doc.moveDown();

        // Behavior & Venom Information
        doc.fontSize(16).text('Behavior & Venom Information');
        doc.fontSize(12);
        doc.text(`Behavior: ${snake.behavior}`);
        doc.text(`Venom Type: ${snake.venomType}`);
        doc.text(`Pain Level: ${snake.painLevel}/10`);
        doc.text(`Pain Type: ${snake.painType}`);
        doc.text(`Time to Symptoms: ${snake.timeToSymptoms}`);
        doc.moveDown();

        // Common Symptoms
        doc.fontSize(16).text('Common Symptoms');
        doc.fontSize(12);
        snake.commonSymptoms.forEach(symptom => {
            doc.text(`• ${symptom}`);
        });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating report:', error);
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
    deleteSnake,
    generateReport
}; 