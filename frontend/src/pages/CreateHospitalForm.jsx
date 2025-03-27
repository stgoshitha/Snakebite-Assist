import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';

const CreateHospitalForm = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    latitude: '',
    longitude: '',
    is24hrService: false,
    workingHours: [{ day: 'Monday', open: '08:00', close: '18:00' }], // Default working hours
    proofCertificate: '',
    hospitalImages: ['https://example.com/default-hospital.jpg'] // Default Image URL
  });

  const navigate = useNavigate();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle working hours changes
  const handleWorkingHoursChange = (index, field, value) => {
    const updatedWorkingHours = [...formData.workingHours];
    updatedWorkingHours[index][field] = value;
    setFormData({ ...formData, workingHours: updatedWorkingHours });
  };

  // Add a new working hour entry
  const addWorkingHours = () => {
    setFormData({
      ...formData,
      workingHours: [...formData.workingHours, { day: 'Monday', open: '08:00', close: '18:00' }]
    });
  };

  // Remove a working hour entry
  const removeWorkingHours = (index) => {
    const updatedWorkingHours = formData.workingHours.filter((_, i) => i !== index);
    setFormData({ ...formData, workingHours: updatedWorkingHours });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Assuming JWT token is stored in localStorage
      const response = await axios.post('http://localhost:3000/api/hospital/createHospital', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Hospital created successfully!');
      navigate('/hospital/hospitalprofile');
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Failed to create hospital.');
    }
  };

  return (
    <div>
      <h2>Create Hospital</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <LocationPicker formData={formData} setFormData={setFormData} />
        <input type="text" name="proofCertificate" placeholder="Proof Certificate URL" onChange={handleChange} required />
        <input type="text" name="hospitalImages" placeholder="Hospital Image URL" onChange={handleChange} defaultValue="https://example.com/default-hospital.jpg" />

        {/* Working Hours Section */}
        <h3>Working Hours</h3>
        {formData.workingHours.map((hours, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>Day:</label>
            <select 
              value={hours.day} 
              onChange={(e) => handleWorkingHoursChange(index, "day", e.target.value)}
              required
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input 
              type="time" 
              value={hours.open} 
              onChange={(e) => handleWorkingHoursChange(index, "open", e.target.value)} 
              required
            />
            -
            <input 
              type="time" 
              value={hours.close} 
              onChange={(e) => handleWorkingHoursChange(index, "close", e.target.value)} 
              required
            />
            <button type="button" onClick={() => removeWorkingHours(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addWorkingHours}>+ Add Working Hours</button>

        <button type="submit">Create Hospital</button>
      </form>
    </div>
  );
};

export default CreateHospitalForm;
