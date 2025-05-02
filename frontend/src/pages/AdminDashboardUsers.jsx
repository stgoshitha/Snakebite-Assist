import { React, useEffect, useState } from "react";
import { get, patch } from "../services/ApiEndpoint";
import { Lock, Unlock } from "lucide-react";
import { FaUsers, FaUser, FaHospital, FaUserSlash } from "react-icons/fa";
import AdminLoading from "../components/common/AdminLoading";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";

const AdminDashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const request = await get("/api/admin/getUser");
        const response = request.data.users;

        const filterUserHospital = response.filter(
          (user) => user.role === "user" || user.role === "hospital"
        );

        const filteredUsers = filterUserHospital.filter((user) => {
          const roleMatch = roleFilter ? user.role === roleFilter : true;
          const statusMatch =
            statusFilter === ""
              ? true
              : user.isBlocked === (statusFilter === "blocked");
          return roleMatch && statusMatch;
        });

        setUsers(filteredUsers);

        setUserCount(response.filter((user) => user.role === "user").length);
        setHospitalCount(
          response.filter((user) => user.role === "hospital").length
        );
        setBlockedCount(response.filter((user) => user.isBlocked).length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [roleFilter, statusFilter]);

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const endpoint = isBlocked
        ? `/api/admin/unblockUser/${userId}`
        : `/api/admin/blockUser/${userId}`;

      await patch(endpoint);

      alert(isBlocked ? "User unblocked" : "User blocked");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status", err);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-70 flex flex-col gap-2 overflow-auto w-full h-screen">
        <Header />

        <div className="p-4 flex flex-col gap-2 bg-gray-100 h-screen overflow-auto">
          <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
            <h1 className="text-2xl font-semibold">User Details</h1>
          </div>
          {/* Cards for Counts */}
          <div className="p-4 space-y-4 bg-white rounded-xl shadow-sm">
            <div className="grid grid-cols-4 gap-5">
              <div className="flex justify-between items-center bg-purple-100 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="font-semibold text-xl">All Users</h3>
                  <p className="text-5xl font-bold">{users.length}</p>
                </div>
                <FaUsers className="text-purple-600 text-5xl" />
              </div>

              <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="font-semibold text-xl">Users</h3>
                  <p className="text-5xl font-bold">{userCount}</p>
                </div>
                <FaUser className="text-blue-600 text-5xl" />
              </div>

              <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="font-semibold text-xl">Hospital Users</h3>
                  <p className="text-5xl font-bold">{hospitalCount}</p>
                </div>
                <FaHospital className="text-green-600 text-5xl" />
              </div>

              <div className="flex justify-between items-center bg-yellow-100 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="font-semibold text-xl">Blocked Users</h3>
                  <p className="text-5xl font-bold">{blockedCount}</p>
                </div>
                <FaUserSlash className="text-yellow-600 text-5xl" />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
            <div className="w-full overflow-auto ">
              <table className="min-w-max table-auto border-collapse bg-white shadow-md rounded-md">
                <thead>
                  <tr className="bg-gray-100 text-left space-x-40">
                    <th className="border-b py-2 px-4">#</th>
                    <th className="border-b py-2 px-4">Name</th>
                    <th className="py-2 px-4 border-b ">Email</th>
                    <th className="py-2 px-4 border-b text-left">
                      <div className="flex gap-1 justify-left items-center">
                        <label className="mr-2">Role </label>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="p-2 w-48 border rounded-md"
                        >
                          <option value="">All Roles</option>
                          <option value="user">User</option>
                          <option value="hospital">Hospital</option>
                        </select>
                      </div>
                    </th>
                    <th className="py-2 px-4 border-b w-sm">
                      <div className="flex gap-1 justify-left items-center">
                        <label className="mr-2">Access Status </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="p-2 w-48 border rounded-md"
                        >
                          <option value="">All Statuses</option>
                          <option value="blocked">Blocked</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                    </th>
                    <th className="py-2 px-4 border-b">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <th className="border-b py-2 px-4">{index + 1}</th>
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center items-center">
                          <div
                            className={`text-center w-20 rounded-2xl font-semibold border ${
                              user.isBlocked
                                ? "bg-red-100 text-red-600 border-none"
                                : "bg-green-100 text-green-600 border-none"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() =>
                              handleBlockUser(user._id, user.isBlocked)
                            }
                            className={`flex items-center gap-2 px-4 py-2 w-28 rounded-md text-white font-medium shadow-md ${
                              user.isBlocked
                                ? "bg-green-600 hover:bg-green-500"
                                : "bg-red-600 hover:bg-red-500"
                            }`}
                          >
                            {user.isBlocked ? (
                              <Unlock size={18} />
                            ) : (
                              <Lock size={18} />
                            )}
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardUsers;
