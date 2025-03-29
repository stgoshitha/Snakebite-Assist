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
  const [errors, setErrors] = useState({});

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

  // **Validation function**
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital Name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be exactly 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // if (!formData.proofCertificate.trim()) {
    //   newErrors.proofCertificate = 'Proof Certificate URL is required';
    // } else if (!/^https?:\/\/.+\.(pdf|jpg|jpeg|png)$/i.test(formData.proofCertificate)) {
    //   newErrors.proofCertificate = 'Proof Certificate must be a valid PDF or image URL';
    // }

    if (formData.workingHours.some((hours) => !hours.open || !hours.close)) {
      newErrors.workingHours = 'All working hours must have both open and close times';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming JWT token is stored
      const response = await axios.post(
        'http://localhost:3000/api/hospital/createHospital',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      <h1 className='text-2xl mb-8'>Create Hospital</h1>
      <form onSubmit={handleSubmit}>
        <label>Hospital Name: </label>
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          onChange={handleChange}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1 w-72"
        />
        {errors.hospitalName && <span className="text-red-500">{errors.hospitalName}</span>}
        <br />

        <label>Hospital Address: </label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        {errors.address && <span className="text-red-500">{errors.address}</span>}
        <br />

        <label>City: </label>
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        {errors.city && <span className="text-red-500">{errors.city}</span>}
        <br />

        <label>Hospital Phone Number: </label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
          }}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
        <br />

        <label>Hospital Email: </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
        <br />

        <LocationPicker formData={formData} setFormData={setFormData} />
        <br />

        <label>Proof Certificate: </label>
        <input
          type="text"
          name="proofCertificate"
          placeholder="Proof Certificate URL"
          onChange={handleChange}
          required
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        {errors.proofCertificate && <span className="text-red-500">{errors.proofCertificate}</span>}
        <br />

        <label>Hospital Images: </label>
        <input
          type="text"
          name="hospitalImages"
          placeholder="Hospital Image URL"
          onChange={handleChange}
          className="p-1 border rounded focus:outline-none focus:ring-2 mb-1"
        />
        <br />

        {/* Working Hours Section */}
        <h3>Working Hours</h3>
        {formData.workingHours.map((hours, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>Day:</label>
            <select
              value={hours.day}
              onChange={(e) => handleWorkingHoursChange(index, 'day', e.target.value)}
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
              onChange={(e) => handleWorkingHoursChange(index, 'open', e.target.value)}
              required
            />
            -
            <input
              type="time"
              value={hours.close}
              onChange={(e) => handleWorkingHoursChange(index, 'close', e.target.value)}
              required
            />
            <button type="button" onClick={() => removeWorkingHours(index)} className="px-4 py-2 bg-red-600 text-white rounded">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addWorkingHours} className="px-4 py-2 bg-green-600 text-white rounded">
          + Add Working Hours
        </button>
        <br />

        <button type="submit" className="px-4 py-2 mt-4 bg-zinc-600 text-white rounded">
          Create Hospital
        </button>
      </form>
    </div>
  );
};

export default CreateHospitalForm;
