import { useDropzone } from "react-dropzone";
import axios from "axios";

const DropzoneUploader = ({ onUpload, accept, resourceType, multiple = false }) => {
  const  dbpd1cjwh = "dbpd1cjwh"; 
  const { getRootProps, getInputProps, isDragActive } =  // Cloudinary cloud name
  useDropzone({
    accept,
    multiple,
    onDrop: async (acceptedFiles) => {
      const uploadedUrls = []; // Array to store uploaded URLs

      try {
        if (multiple) {
          // Handle multiple file uploads
          for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "upload_blog");

            // Upload each file one by one
            const res = await axios.post(
              `https://api.cloudinary.com/v1_1/${dbpd1cjwh}/${resourceType}/upload`,
              formData
            );

            // Push the URL of the uploaded image into the uploadedUrls array
            uploadedUrls.push(res.data.secure_url);
          }

          // Once all images are uploaded, pass the array of URLs to the parent component
          onUpload(uploadedUrls);
        } else {
          // Handle single file upload
          const file = acceptedFiles[0]; // Only one file should be uploaded
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "upload_blog");

          // Upload the file
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${dbpd1cjwh}/${resourceType}/upload`,
            formData
          );

          // Once the file is uploaded, pass the URL to the parent component
          onUpload(res.data.secure_url);
        }
      } catch (err) {
        alert("Upload failed.");
        console.error(err);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-400 p-10 text-center rounded cursor-pointer bg-gray-50 hover:bg-gray-100"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag & drop a file here, or click to select</p>
      )}
    </div>
  );
};

export default DropzoneUploader;
