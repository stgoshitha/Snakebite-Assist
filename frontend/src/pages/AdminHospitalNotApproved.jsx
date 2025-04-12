import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegFilePdf } from "react-icons/fa6";

const AdminHospitalNotApproved = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleIds, setVisibleIds] = useState({});
  const [areAllVisible, setAreAllVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotApprovedHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/hospital/getAllHospitalNotApproved",
          { withCredentials: true }
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
        { withCredentials: true }
      );

      setHospitals((prev) =>
        prev.filter((hospital) => hospital._id !== hospitalId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve hospital");
    }
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllIdVisibility = () => {
    const newVisibility = {};
    hospitals.forEach((hospital) => {
      newVisibility[hospital._id] = !areAllVisible;
    });
    setVisibleIds(newVisibility);
    setAreAllVisible(!areAllVisible);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const query = searchTerm.toLowerCase();
    return (
      hospital.hospitalName?.toLowerCase().includes(query) ||
      hospital.hospitalType?.toLowerCase().includes(query) ||
      hospital.email?.toLowerCase().includes(query)
    );
  });

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Not Approved Hospitals</h2>

        {/* Search bar */}
        
      </div>

      <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
      <input
          type="text"
          placeholder="Search by name, type, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[400px] p-2 border border-gray-300 rounded"
        />
        <div className="overflow-x-auto">
          <table className="min-w-max table-auto border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    onChange={toggleAllIdVisibility}
                    checked={areAllVisible}
                    className="mr-2"
                  />
                  <label className="text-sm">
                    {!areAllVisible ? "" : "Hospital ID"}
                  </label>
                </th>
                <th className="py-2 px-4 border-b">Hospital Owner Name</th>
                <th className="py-2 px-4 border-b">Hospital Name</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">City</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Proof Certificate</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`toggle-${hospital._id}`}
                          onChange={() => toggleIdVisibility(hospital._id)}
                          checked={visibleIds[hospital._id] || false}
                          className="mr-2 text-sm"
                        />
                        {visibleIds[hospital._id] && (
                          <div className="text-sm text-gray-600 break-all">
                            {hospital._id}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">{hospital.user?.name}</td>
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
                      className="flex gap-2 hover:text-blue-500 hover:underline"
                    >
                      <FaRegFilePdf size={25} />
                      <label>View</label>
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleApprove(hospital._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHospitals.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No hospitals match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHospitalNotApproved;
