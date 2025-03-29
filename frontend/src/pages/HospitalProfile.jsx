import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocationPicker from '../components/LocationPicker';

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    latitude: "",
    longitude: "",
    is24hrService: false,
    workingHours: [],
    hospitalImages: [],
    proofCertificate: "",
  });

  const hospitalToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserHospital = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/hospital/getUserHospital", {
          headers: { Authorization: `Bearer ${hospitalToken}` },
        });
        setHospital(response.data);
        setFormData(response.data); // Populate form with hospital data
      } catch (error) {
        setError("Failed to fetch hospital details.");
      } finally {
        setLoading(false);
      }
    };

    if (hospitalToken) {
      fetchUserHospital();
    }
  }, [hospitalToken]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle working hours change
  const handleWorkingHoursChange = (index, field, value) => {
    const updatedHours = [...formData.workingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData({ ...formData, workingHours: updatedHours });
  };

  // Add a new working hours entry
  const addWorkingHours = () => {
    setFormData({
      ...formData,
      workingHours: [...formData.workingHours, { day: "", open: "", close: "" }],
    });
  };

  // Remove a working hours entry
  const removeWorkingHours = (index) => {
    const updatedHours = [...formData.workingHours];
    updatedHours.splice(index, 1);
    setFormData({ ...formData, workingHours: updatedHours });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = files.map((file) => URL.createObjectURL(file)); // Preview images
    setFormData({ ...formData, hospitalImages: [...formData.hospitalImages, ...newImageUrls] });
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/api/hospital/updateHospital/${hospital._id}`, formData, {
        headers: { Authorization: `Bearer ${hospitalToken}` },
      });
      setHospital(response.data.hospital);
      setIsEditing(false);
      alert("Hospital updated successfully!");
    } catch (error) {
      alert("Failed to update hospital.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await axios.delete(`http://localhost:3000/api/hospital/deleteHospital/${hospital._id}`, {
          headers: {
            Authorization: `Bearer ${hospitalToken}`,
          },
        });
        alert("Hospital deleted successfully!");
        setHospital(null);
      } catch (error) {
        alert("Failed to delete hospital.");
      }
    }
  };

  if (!hospital) {
    return (
      <div>
        <h2>No Hospital Found</h2>
        <p>You have not created a hospital profile yet.</p>
        <button onClick={() => navigate("/hospital/hospitalprofile/createHospitalForm")} className="px-4 py-2 bg-zinc-600 text-white rounded">Create Hospital</button>
      </div>
    );
  }

  if (loading) return <p>Loading hospital details...</p>;
  if (error) return <p>{error}</p>;
  if (!hospital) return <p>Hospital not found</p>;

  return (
    <div>
      <h2 className='text-2xl mb-8'>Hospital Profile</h2>
      {!isEditing ? (
        <div>
          <h2>{hospital.hospitalName}</h2>
          <p><strong>City:</strong> {hospital.city}</p>
          <p><strong>Address:</strong> {hospital.address}</p>
          <p><strong>Phone:</strong> {hospital.phoneNumber}</p>
          <p><strong>Email:</strong> {hospital.email}</p>
          <p><strong>Latitude:</strong> {hospital.latitude}</p>
          <p><strong>Longitude:</strong> {hospital.longitude}</p>
          <p><strong>24/7 Service:</strong> {hospital.is24hrService ? "Yes" : "No"}</p>

          <h3>Working Hours</h3>
          <ul>
            {hospital.workingHours?.map((hours, index) => (
              <li key={index}>
                <strong>{hours.day}:</strong> {hours.open} - {hours.close}
              </li>
            ))}
          </ul>

          <h3>Hospital Images</h3>
          <div>
            {hospital.hospitalImages?.map((image, index) => (
              <img key={index} src={image} alt={`Hospital Image ${index + 1}`} width="100" height="100" />
            ))}
          </div>

          <p><strong>Proof Certificate:</strong> {hospital.proofCertificate}</p>
          <p><strong>Approved:</strong> {hospital.isApproved ? "Yes" : "No"}</p>

          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-zinc-600 text-white rounded">Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          <button type="submit" onClick={()=> navigate('/hospital')}className="px-4 py-2 ml-2 bg-zinc-600 text-white rounded">Back</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <label>
            Hospital Name:
            <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />
          </label>
          <br/>
          <label>
            Address:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </label>
          <br/>
          <label>
            City:
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </label>
          <br/>
          <label>
            Phone Number:
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </label>
          <br/>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <br/>

           <LocationPicker formData={formData} setFormData={setFormData} />

          <br/>
          <label>
            24/7 Service:
            <input type="checkbox" name="is24hrService" checked={formData.is24hrService} onChange={handleChange} />
          </label>

          <h3>Update Working Hours</h3>
          {formData.workingHours?.map((hours, index) => (
            <div key={index}>
              <label>Day:</label>
              <input type="text" value={hours.day} onChange={(e) => handleWorkingHoursChange(index, "day", e.target.value)} />
              <input type="time" value={hours.open} onChange={(e) => handleWorkingHoursChange(index, "open", e.target.value)} />
              -
              <input type="time" value={hours.close} onChange={(e) => handleWorkingHoursChange(index, "close", e.target.value)} />
              <button type="button" onClick={() => removeWorkingHours(index)} className="px-4 py-2 mt-1 bg-red-600 text-white rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addWorkingHours} className="px-4 py-2 bg-zinc-600 text-white rounded">+ Add Working Hours</button>

          <h3>Update Hospital Images</h3>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

          <button type="submit" className="px-4 py-2 bg-zinc-600 text-white rounded">Update</button>
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 ml-4 bg-red-600 text-white rounded">Cancel</button>
          
        </form>
      )}
    </div>
  );
};

export default HospitalProfile;
