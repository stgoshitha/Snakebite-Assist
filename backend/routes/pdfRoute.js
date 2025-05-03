const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPdf, getPdf } = require('../controllers/pdfController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadPdf);
router.get('/:public_id', getPdf);

module.exports = router;
