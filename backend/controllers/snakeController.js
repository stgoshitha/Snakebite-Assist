const Snake = require('../models/SnakeModel');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Try to load the canvas module, but provide a fallback if it fails
let canvas = null;
try {
  const { createCanvas, Image } = require('canvas');
  canvas = { createCanvas, Image };
} catch (error) {
  console.warn('Canvas module not available, using fallback for image processing');
}

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

// Get snakes by province
const getSnakesByProvince = async (req, res) => {
    try {
        const { province } = req.params;
        const snakes = await Snake.find({ nativeProvinces: province });
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
            try {
                // Handle image based on URL type
                if (snake.image.startsWith('http')) {
                    if (canvas) {
                        // For remote images with canvas module, fetch them first
                        const response = await axios.get(snake.image, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(response.data);
                        
                        // Create temporary in-memory image
                        const img = new canvas.Image();
                        img.src = imageBuffer;
                        
                        // Draw the image to a canvas to handle potentially problematic images
                        const canvasEl = canvas.createCanvas(img.width || 300, img.height || 300);
                        const ctx = canvasEl.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // Add the processed image to PDF
                        doc.image(canvasEl.toBuffer(), {
                            fit: [250, 250],
                            align: 'center'
                        });
                    } else {
                        // Fallback: Download image to temp file
                        const response = await axios.get(snake.image, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(response.data);
                        
                        // Create a unique temp filename
                        const tempFilePath = path.join(__dirname, '..', 'temp', `temp_image_${Date.now()}.jpg`);
                        
                        // Ensure temp directory exists
                        const tempDir = path.dirname(tempFilePath);
                        if (!fs.existsSync(tempDir)) {
                            fs.mkdirSync(tempDir, { recursive: true });
                        }
                        
                        // Write the buffer to a temp file
                        fs.writeFileSync(tempFilePath, imageBuffer);
                        
                        // Add the image from temp file to PDF
                        doc.image(tempFilePath, {
                            fit: [250, 250],
                            align: 'center'
                        });
                        
                        // Clean up temp file (async, don't wait for it)
                        setTimeout(() => {
                            try {
                                fs.unlinkSync(tempFilePath);
                            } catch (cleanupError) {
                                console.error('Error cleaning up temp file:', cleanupError);
                            }
                        }, 5000);
                    }
                } else {
                    // For local images
                    doc.image(snake.image, {
                        fit: [250, 250],
                        align: 'center'
                    });
                }
            } catch (imgError) {
                console.error('Error adding image to PDF:', imgError);
                // Add error message instead of image
                doc.fontSize(10).text('(Image could not be loaded)', { align: 'center', color: 'grey' });
            }
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
        
        // Native Provinces
        doc.fontSize(16).text('Native Provinces');
        doc.fontSize(12);
        if (Array.isArray(snake.nativeProvinces)) {
            snake.nativeProvinces.forEach(province => {
                doc.text(`• ${province}`);
            });
        } else if (snake.nativeProvince) {
            doc.text(`• ${snake.nativeProvince}`);
        }
        doc.moveDown();

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
    getSnakesByProvince,
    generateReport
}; 