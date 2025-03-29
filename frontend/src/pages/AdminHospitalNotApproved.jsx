import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminHospitalNotApproved = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchNotApprovedHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/hospital/getAllHospitalNotApproved",
          {
            withCredentials: true,
          }
        );
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
      await axios.put(
        `http://localhost:3000/api/hospital/approve/${hospitalId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve hospital");
    }
  };

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Not Approved Hospitals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Hospital Owner ID</th>
              <th className="py-2 px-4 border-b">Hospital Name</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">24hr Service</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{hospital._id}</td>
                <td className="py-2 px-4 border-b">{hospital.user}</td>
                <td className="py-2 px-4 border-b">{hospital.hospitalName}</td>
                <td className="py-2 px-4 border-b">{hospital.address}</td>
                <td className="py-2 px-4 border-b">{hospital.city}</td>
                <td className="py-2 px-4 border-b">{hospital.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{hospital.email}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={hospital.proofCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleApprove(hospital._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHospitalNotApproved;
