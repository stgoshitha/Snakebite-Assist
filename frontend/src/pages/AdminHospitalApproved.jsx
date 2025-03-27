import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHospitalApproved = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/hospital/getAllHospitalApproved", {
          withCredentials: true,
        });
        setHospitals(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedHospitals();
  }, []);

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Approved Hospitals</h2>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital._id}>
            <strong>{hospital.hospitalName}</strong> - {hospital.city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHospitalApproved;
