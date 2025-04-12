// src/pages/HospitalProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HospitalProfileForm from "../components/HospitalProfileForm";
import HospitalProfileInfoItem from "../components/HospitalProfileInfoItem";
import { FaHospital, FaRegAddressCard } from "react-icons/fa";
import { MdEmail, MdPhotoLibrary } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { BiGlobe } from "react-icons/bi";
import { Ri24HoursLine } from "react-icons/ri";
import { PiCertificateBold } from "react-icons/pi";
import { AiOutlineClockCircle } from "react-icons/ai";

// Helper function
const capitalizeWords = (str) =>
  str?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const hospitalToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/hospital/getUserHospital",
          {
            headers: { Authorization: `Bearer ${hospitalToken}` },
          }
        );
        setHospital(response.data);
        setFormData({
          ...response.data,
          hospitalImages: response.data.hospitalImages?.join(",") || "",
        });
      } catch (error) {
        setError("Failed to fetch hospital.");
      } finally {
        setLoading(false);
      }
    };

    if (hospitalToken) fetchHospital();
  }, [hospitalToken]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/hospital/deleteHospital/${hospital._id}`,
          { headers: { Authorization: `Bearer ${hospitalToken}` } }
        );
        alert("Deleted successfully.");
        setHospital(null);
      } catch (error) {
        alert("Deletion failed.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleWorkingHoursChange = (index, field, value) => {
    const updated = [...formData.workingHours];
    updated[index][field] = value;
    setFormData({ ...formData, workingHours: updated });
  };

  const addWorkingHours = () => {
    setFormData({
      ...formData,
      workingHours: [
        ...(formData.workingHours || []),
        { day: "", open: "", close: "" },
      ],
    });
  };

  const removeWorkingHours = (index) => {
    const updated = formData.workingHours.filter((_, i) => i !== index);
    setFormData({ ...formData, workingHours: updated });
  };

  const handleImageUpload = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      hospitalImages: formData.hospitalImages
        .split(",")
        .map((img) => img.trim()),
    };
    try {
      await axios.put(
        `http://localhost:3000/api/hospital/updateHospital/${hospital._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${hospitalToken}` } }
      );
      alert("Updated successfully.");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!hospital) return <p>No hospital found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {isEditing ? (
        <HospitalProfileForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          handleImageUpload={handleImageUpload}
          handleWorkingHoursChange={handleWorkingHoursChange}
          addWorkingHours={addWorkingHours}
          removeWorkingHours={removeWorkingHours}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="bg-white font-semibold shadow-sm rounded-lg p-6">
          <div className="p-6 rounded-lg shadow-sm space-y-5 mb-10">
            <h1 className="text-3xl">Hospital Profile</h1>
          </div>
          <div className="flex justify-between items-start mb-5">
            <div className="text-2xl font-bold">
              {capitalizeWords(hospital.hospitalName)} -{" "}
              {capitalizeWords(hospital.city)}
            </div>
            <div
              className={
                hospital.isApproved
                  ? "text-green-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
                  : "text-red-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
              }
            >
              {hospital.isApproved ? "Approved" : "Not Approved"}
            </div>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
              <HospitalProfileInfoItem
                icon={FaHospital}
                label="Hospital Type"
                value={`${capitalizeWords(hospital.hospitalType)} Hospital`}
              />
              <HospitalProfileInfoItem
                icon={FaRegAddressCard}
                label="Address"
                value={capitalizeWords(hospital.address)}
              />
              <HospitalProfileInfoItem
                icon={HiOutlineLocationMarker}
                label="Location"
                value={
                  <a
                    href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center hover:underline"
                  >
                    My Location
                  </a>
                }
              />
            </div>

            <div className="flex p-4 pr-20 justify-between bg-white rounded-xl shadow-sm">
              <HospitalProfileInfoItem
                icon={FiPhone}
                label="Phone"
                value={hospital.phoneNumber}
              />
              <HospitalProfileInfoItem
                icon={MdEmail}
                label="Email"
                value={hospital.email}
              />
              <HospitalProfileInfoItem
                icon={BiGlobe}
                label="Website"
                value={hospital.website || "No link to show"}
              />
            </div>

            <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
              <HospitalProfileInfoItem
                icon={Ri24HoursLine}
                label="24h Service"
                value={hospital.is24hrService ? "Available" : "Not Available"}
              />
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AiOutlineClockCircle size={25} />
                <h4 className="font-semibold text-lg text-gray-800">
                  Working Hours
                </h4>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-1">
                {hospital.workingHours?.map((hours, index) => (
                  <li key={index}>
                    <span className="font-medium">{hours.day}:</span>{" "}
                    {hours.open} - {hours.close}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MdPhotoLibrary size={25} />
                <h4 className="font-semibold text-lg text-gray-800">
                  Hospital Images
                </h4>
              </div>
              <div className="flex gap-5">
                {hospital.hospitalImages?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hospital ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <HospitalProfileInfoItem
                icon={PiCertificateBold}
                label="Proof Certificate PDF"
                value={
                  hospital.proofCertificate ? (
                    <div
                      onClick={() =>
                        window.open(hospital.proofCertificate, "_blank")
                      }
                      className="font-semibold text-blue-600 cursor-pointer hover:underline"
                    >
                      Hospital Proof Certificate
                    </div>
                  ) : (
                    <div className="font-semibold text-gray-500">
                      No link to show
                    </div>
                  )
                }
              />
            </div>

            <div className="flex gap-4 mt-6 justify-end">
              <button
                className="px-4 py-2 border border-blue-600 text-lg text-blue-600 rounded hover:border-blue-700"
                onClick={() => setIsEditing(true)}
              >
                Edit hospital profile
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2  border-red-600 border text-lg text-red-600 rounded hover:border-red-700"
              >
                Delete hospital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalProfile;
