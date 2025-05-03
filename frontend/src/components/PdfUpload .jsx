import React, { useState } from 'react';
import axios from 'axios';

const PdfUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:3000/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { url } = response.data; // assuming your backend returns the uploaded PDF URL as { url: "..." }
      console.log('Uploaded PDF URL:', url);
      setUploadStatus(`Uploaded successfully! ${url}`);
      onUpload(url);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed. Try again.');
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block"
      />
      <button
        type="button"
        onClick={handleUpload}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Upload PDF
      </button>
      {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
};

export default PdfUpload;
