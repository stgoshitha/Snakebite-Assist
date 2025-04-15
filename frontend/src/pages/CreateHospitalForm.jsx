import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../components/LocationPicker";
import Header from "../components/common/Header";

const CreateHospitalForm = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalType: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    latitude: "",
    longitude: "",
    is24hrService: false,
    workingHours: [{ day: "", open: "", close: "" }], // Default working hours
    proofCertificate: "",
    hospitalImages: ["https://example.com/default-hospital.jpg"], // Default Image URL
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
      workingHours: [
        ...formData.workingHours,
        { day: "", open: "", close: "" },
      ],
    });
  };

  // Remove a working hour entry
  const removeWorkingHours = (index) => {
    const updatedWorkingHours = formData.workingHours.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, workingHours: updatedWorkingHours });
  };

  // **Validation function**
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = "Hospital Name is required";
    }

    if (!formData.hospitalType.trim()) {
      newErrors.hospitalType = "Hospital Type is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be exactly 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    // if (!formData.proofCertificate.trim()) {
    //   newErrors.proofCertificate = 'Proof Certificate URL is required';
    // } else if (!/^https?:\/\/.+\.(pdf|jpg|jpeg|png)$/i.test(formData.proofCertificate)) {
    //   newErrors.proofCertificate = 'Proof Certificate must be a valid PDF or image URL';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Validation error");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assuming JWT token is stored
      const response = await axios.post(
        "http://localhost:3000/api/hospital/createHospital",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Hospital created successfully!");
      navigate("/hospital/hospitalprofile");
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to create hospital.");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 font- bg-white p-6 rounded shadow"
        >
          <div className="p-6 rounded-lg shadow-sm space-y-5">
            <h1 className="text-3xl font-semibold">Create Hospitals</h1>
          </div>

          <div className="p-6 rounded-lg shadow-sm space-y-5">
            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.hospitalName && (
                  <span className="text-red-500 text-sm italic">
                    {errors.hospitalName}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Type
                </label>
                <select
                  name="hospitalType"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select hospital type
                  </option>
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                  <option value="ayurvedic">Ayurvedic</option>
                </select>
                {errors.hospitalType && (
                  <span className="text-red-500 text-sm italic">
                    {errors.hospitalType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-sm space-y-5">
            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Address
                </label>
                <input
                  type="text"
                  name="address"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.address && (
                  <span className="text-red-500 text-sm italic">
                    {errors.address}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.city && (
                  <span className="text-red-500 text-sm italic">
                    {errors.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-sm space-y-5">
            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm italic">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm italic">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">
                  Hospital Website link(optional)
                </label>
                <input
                  type="text"
                  name="webSiteLink"
                  onChange={handleChange}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="p-4 shadow-md">
            <div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="is24hrService"
                  checked={formData.is24hrService}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is24hrService: e.target.checked,
                    })
                  }
                />
                <label className="flex items-center gap-2">
                  24/7 Service Available
                </label>
              </div>
            </div>
          </div>

          {!formData.is24hrService && (
            <div className="p-4 shadow-md">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-lg">Working Hours</h3>
                {formData.workingHours.map((hours, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      value={hours.day}
                      onChange={(e) =>
                        handleWorkingHoursChange(index, "day", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded w-full"
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        handleWorkingHoursChange(index, "open", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded w-full"
                    />

                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        handleWorkingHoursChange(index, "close", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded w-full"
                    />

                    <button
                      type="button"
                      onClick={() => removeWorkingHours(index)}
                      className="text-red-500 font-bold px-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addWorkingHours}
                className="bg-gray-700 text-white px-4 py-2 mt-2 rounded-md shadow"
              >
                + Add Working Hours
              </button>
            </div>
          )}

          <LocationPicker formData={formData} setFormData={setFormData} />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Proof Certificate
            </label>
            <input
              type="text"
              name="proofCertificate"
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.proofCertificate && (
              <span className="text-red-500 text-sm italic">
                {errors.proofCertificate}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Hospital Images
            </label>
            <input
              type="text"
              name="hospitalImages"
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.hospitalImages && (
              <span className="text-red-500 text-sm italic">
                {errors.hospitalImages}
              </span>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="font-semibold border border-blue-600 text-lg text-blue-600 px-4 py-2 w-40 rounded"
            >
              Create Hospital
            </button>

            <button
              type="button"
              onClick={() => navigate("/hospital/hospitalprofile")}
              className="font-semibold border border-red-600 text-lg text-red-600 px-4 py-2 w-40 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHospitalForm;
