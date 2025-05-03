import React from "react";
import LocationPicker from "./LocationPicker";
import { CiCircleRemove } from "react-icons/ci";

const HospitalProfileForm = ({
  formData,
  setFormData,
  handleChange,
  handleUpdate,
  handleImageUpload,
  handleWorkingHoursChange,
  addWorkingHours,
  removeWorkingHours,
  setIsEditing,
}) => {
  return (
    <form
      onSubmit={handleUpdate}
      className="space-y-4 font- bg-white p-6 rounded shadow"
    >
      <div className="p-6 rounded-lg shadow-sm space-y-5">
        <h1 className="text-3xl font-semibold">Edit Hospital Details</h1>
      </div>
      <div className="p-6 rounded-lg shadow-sm space-y-5">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Hospital Name
            </label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700">
              Hospital Type
            </label>
            <select
              name="hospitalType"
              value={formData.hospitalType}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select hospital type
              </option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="ayurvedic">Ayurvedic</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              name="webSiteLink"
              value={formData.webSiteLink}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="p-4  shadow-md">
        <LocationPicker formData={formData} setFormData={setFormData} />
      </div>

      <div className="p-4  shadow-md">
        <div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              name="is24hrService"
              checked={formData.is24hrService}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              24/7 Service Available{" "}
            </label>
          </div>
        </div>
      </div>

      <div className="p-4  shadow-md">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Working Hours</h3>
          {formData.workingHours?.map((hours, index) => (
            <div key={index} className="flex gap-2 items-center">
              <select
                value={hours.day}
                onChange={(e) =>
                  handleWorkingHoursChange(index, "day", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
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
                className=" text-red-500 font-bold px-2 cursor-pointer"
              >
                <CiCircleRemove size={30} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addWorkingHours}
          className="bg-[#0f1600] hover:bg-[#6a4c11] text-white px-4 py-2 mt-2 rounded-md shadow"
        >
          + Add Working Hours
        </button>
      </div>

      <div className="p-6 rounded-lg shadow-md space-y-5">
        <div className="flex flex-col gap-1">
          <label>Proof Certificate (PDF or URL):</label>
          <input
            type="text"
            name="proofCertificate"
            value={formData.proofCertificate}
            onChange={handleImageUpload}
            className="px-3 py-2 border border-gray-300 rounded w-full"
          />
        </div>
      </div>

      <div className="p-6  rounded-lg shadow-md space-y-5">
        <div className="flex flex-col gap-1">
          <label>Hospital Images (comma-separated URLs):</label>
          <input
            type="text"
            name="hospitalImages"
            value={formData.hospitalImages}
            onChange={handleImageUpload}
            className="px-3 py-2 border border-gray-300 rounded w-full"
          />
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          className="border bg-[#0f1600] hover:bg-[#6a4c11]  font-semibold text-white px-4 py-2 w-40 rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="border bg-red-600  font-semibold text-white hover:bg-white hover:text-red-700 px-4 py-2 w-40 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HospitalProfileForm;
