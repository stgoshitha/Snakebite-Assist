import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get, patch, deleteUser } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import { CgAddR } from "react-icons/cg";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AdminLoading from "../components/common/AdminLoading";
import SideBar from "../components/common/SideBar";
import Header from "../components/common/Header";

const AdminDashboardAdmins = () => {
  const user = useSelector((state) => state.Auth.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("");
  const [editAdminId, setEditAdminId] = useState(null);
  const [editAdminData, setEditAdminData] = useState({});
  const [loading, setLoading] = useState(true);

  //get all admins
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
      finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [roleFilter]);

  //block/unblock admins
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

  //delete admins
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

  const handleEditClick = (user) => {
    setEditAdminId(user._id);
    setEditAdminData({ ...user });
  };

  const handleInputChange = (e, field) => {
    setEditAdminData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  //update admins
  const handleSaveEdit = async () => {
    try {
      const updatedData = { ...editAdminData };
      if (!updatedData.password) delete updatedData.password;

      console.log("Updating Admin:", updatedData);

      const response = await patch(
        `/api/admin/updateAdmin/${editAdminId}`,
        updatedData
      );

      console.log("Update response:", response);

      setUsers(
        users.map((user) =>
          user._id === editAdminId ? { ...user, ...updatedData } : user
        )
      );
      setEditAdminId(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (loading) return <AdminLoading/>

  return (
    <div className="flex gap-1">
      <div><SideBar/></div>
      <div className="ml-70 flex flex-col gap-2 overflow-auto w-full h-screen">
        <Header/>
      <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Details</h1>
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
              <th className="py-2 px-4 border-b text-left w-64">Name</th>
              <th className="py-2 px-4 border-b text-left w-72">Email</th>
              <th className="py-2 px-4 border-b text-left w-64">
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
              <th className="py-2 px-4 border-b text-left w-32">Password</th>
              <th className="py-2 px-4 border-b">Access Status</th>
              <th className="py-2 px-4 border-b">Change Access</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {editAdminId === user._id ? (
                    <input
                      type="text"
                      value={editAdminData.name}
                      onChange={(e) => handleInputChange(e, "name")}
                      className="p-2 border rounded-md w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editAdminId === user._id ? (
                    <input
                      type="email"
                      value={editAdminData.email}
                      onChange={(e) => handleInputChange(e, "email")}
                      className="p-2 border rounded-md w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editAdminId === user._id ? (
                    <select
                      value={editAdminData.role || ""}
                      onChange={(e) => handleInputChange(e, "role")}
                      className="p-2 border rounded-md w-full"
                    >
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editAdminId === user._id ? (
                    <input
                      type="password"
                      value={editAdminData.password}
                      onChange={(e) => handleInputChange(e, "password")}
                      className="p-2 border rounded-md w-full"
                    />
                  ) : (
                    "******" 
                  )}
                </td>
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
                <td className="flex justify-center items-center py-2 px-4 border-b">
                  <button
                    onClick={() => handleBlockUser(user._id, user.isBlocked)}
                    className={`flex items-center gap-2 px-4 py-2 w-28 rounded-md text-white font-medium shadow-md ${
                      user.isBlocked
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-red-600 hover:bg-red-500"
                    }`}
                  >
                    {user.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2 justify-center">
                    {editAdminId === user._id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        <FaSave size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        <FaEdit size={20} />
                      </button>
                    )}
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
      </div>
    </div>
  );
};

export default AdminDashboardAdmins;
