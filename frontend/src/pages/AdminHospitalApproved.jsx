import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoLocationSharp } from "react-icons/io5";

const AdminHospitalApproved = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and search state variables
  const [cityFilter, setCityFilter] = useState("");
  const [hospitalTypeFilter, setHospitalTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Fetch hospitals
  useEffect(() => {
    const fetchApprovedHospitals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/hospital/getAllHospitalApproved",
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

    fetchApprovedHospitals();
  }, []);

  // Debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 3000); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter hospitals
  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesCity = cityFilter
      ? hospital.city?.toLowerCase().includes(cityFilter.toLowerCase())
      : true;

    const matchesHospitalType = hospitalTypeFilter
      ? hospital.hospitalType
          ?.toLowerCase()
          .includes(hospitalTypeFilter.toLowerCase())
      : true;

    const matchesSearchQuery =
      (hospital.hospitalName &&
        hospital.hospitalName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (hospital.user &&
        hospital.user.name &&
        hospital.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hospital.address &&
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hospital.email &&
        hospital.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesHospitalType && matchesSearchQuery;
  });

  const [visibleIds, setVisibleIds] = useState({});
  const [areAllVisible, setAreAllVisible] = useState(false);

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllIdVisibility = () => {
    const newVisibility = {};
    filteredHospitals.forEach((hospital) => {
      newVisibility[hospital._id] = !areAllVisible;
    });
    setVisibleIds(newVisibility);
    setAreAllVisible(!areAllVisible);
  };

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Approved Hospitals</h2>
      </div>
      <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <input
            type="text"
            className="w-[400px] p-2 border border-gray-300 rounded"
            placeholder="Search hospital.. "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-10">
          <div>
            <label className="mr-2 font-medium">Filter by City:</label>
            <input
              type="text"
              className="w-[200px] p-2 border border-gray-300 rounded"
              placeholder="Enter city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="mr-2 font-medium">Filter by Hospital Type:</label>
            <select
              value={hospitalTypeFilter}
              onChange={(e) => setHospitalTypeFilter(e.target.value)}
              className="w-[200px] p-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="ayurvedic">Ayurvedic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      
      <div className="overflow-x-auto w-full">
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
              <th className="py-2 px-4 border-b">Hospital Type</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">24hr Service</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Created Date | Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital) => (
              <tr key={hospital._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-1 items-start justify-start flex-col">
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
                <td className="py-2 px-4 border-b">{hospital.hospitalType}</td>
                <td className="py-2 px-4 border-b">{hospital.address}</td>
                <td className="py-2 px-4 border-b">{hospital.city}</td>
                <td className="py-2 px-4 border-b">{hospital.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{hospital.email}</td>
                <td className="py-2 px-4 border-b">
                  {hospital.is24hrService ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center text-red-500 hover:text-red-600"
                  >
                    <IoLocationSharp size={25} />
                  </a>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(hospital.createdAt).toISOString().split("T")[0]} |{" "}
                  {
                    new Date(hospital.createdAt)
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default AdminHospitalApproved;
