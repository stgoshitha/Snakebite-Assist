import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHospitalNotApproved = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotApprovedHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/hospital/getAllHospitalNotApproved", {
          withCredentials: true,
        });
        setHospitals(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchNotApprovedHospitals();
  }, []);

  const handleApprove = async (hospitalId) => {
    try {
      await axios.put(`http://localhost:3000/api/hospital/approve/${hospitalId}`, {}, {
        withCredentials: true,
      });

      setHospitals((prevHospitals) => prevHospitals.filter(hospital => hospital._id !== hospitalId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve hospital");
    }
  };

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Not Approved Hospitals</h2>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital._id}>
            <strong>{hospital.hospitalName}</strong> - {hospital.city}
            <button onClick={() => handleApprove(hospital._id)} style={{ marginLeft: "10px" }}>
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHospitalNotApproved;
