import React, { useState, useEffect } from 'react';
import AdminLoading from "../components/common/AdminLoading"; // Loading component
import SideBar from "../components/common/SideBar"; // Sidebar component
import Header from "../components/common/Header"; // Header component

// Dummy data for the dashboard
const dummyStats = [
  { title: "Snakebite Reports", value: 435, color: "bg-red-100 text-red-600" },
  { title: "Species Identified", value: 92, color: "bg-yellow-100 text-yellow-600" },
  { title: "Hospitals Registered", value: 78, color: "bg-green-100 text-green-600" },
  { title: "Emergency Responses", value: 120, color: "bg-blue-100 text-blue-600" },
];

const dummyReports = [
  { loc: "Matale", snake: "Russell’s Viper", sev: "High", time: "2 hrs ago", color: "text-red-600" },
  { loc: "Anuradhapura", snake: "Green Pit Viper", sev: "Moderate", time: "5 hrs ago", color: "text-yellow-600" },
  { loc: "Galle", snake: "Cobra", sev: "Critical", time: "1 day ago", color: "text-red-700" },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="flex gap-1">
      <div>
        <SideBar /> {/* Sidebar for navigation */}
      </div>
      <div className="ml-70 flex flex-col gap-4 w-full h-screen  bg-gray-100">
        <Header /> {/* Header with app name and user info */}

        {/* Dashboard Content */}
        <section className="p-6 space-y-6">

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {dummyStats.map((item, index) => (
              <div key={index} className={`rounded-2xl shadow hover:shadow-md transition p-5 ${item.color} border border-opacity-20`}>
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-3xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Latest Snakebite Reports */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Recent Snakebite Reports</h3>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Snake Type</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Reported Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyReports.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{r.loc}</td>
                      <td className="px-4 py-3">{r.snake}</td>
                      <td className={`px-4 py-3 font-semibold ${r.color}`}>{r.sev}</td>
                      <td className="px-4 py-3">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hospital Response Chart Placeholder */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center h-64">
            <p className="text-gray-400">[📊 Hospital response heatmap/chart coming soon...]</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
