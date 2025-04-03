import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get, patch, deleteUser } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import { CgAddR } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AdminDashboardAdmins = () => {
  const user = useSelector((state) => state.Auth.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const request = await get("/api/admin/getUser");
        const response = request.data.users;
        const filteredAdmins = response.filter(
          (user) => user.role === "superadmin" || user.role === "admin"
        );

        const filteredUsers = filteredAdmins.filter((user) => {
          const roleMatch = roleFilter ? user.role === roleFilter : true;
          return roleMatch;
        });

        setUsers(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
  }, [roleFilter]);

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

  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(`/api/admin/deleteUser/${userId}`);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        alert("User has been deleted");
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">User Details</h1>
      <div className="flex justify-end items-center mb-4">
        {user?.role === "superadmin" && (
          <button
            onClick={() => navigate("/admin/allAdmins/addAdminForm")}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-600 text-white rounded shadow-md hover:bg-zinc-700 transition duration-300"
          >
            <CgAddR size={20} /> Create New Admin
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">
                <div className="flex gap-1 justify-left items-center">
                  <label className="mr-2">Role </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="p-2 w-48 border rounded-md"
                  >
                    <option value="">All Roles</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </th>
              <th className="py-2 px-4 border-b">Access Status</th>
              <th className="py-2 px-4 border-b">Change Access</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
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
                <td className="py-2 px-4 border-b text-center">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleBlockUser(user._id, user.isBlocked)}
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
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardAdmins;
