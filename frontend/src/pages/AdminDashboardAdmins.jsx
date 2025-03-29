import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get, patch, deleteUser } from "../services/ApiEndpoint";
import { useNavigate } from "react-router-dom";

const AdminDashboardUsers = () => {
  const user = useSelector((state) => state.Auth.user);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const request = await get("/api/admin/getUser");
        const response = request.data.users;
        //console.log(response);
        const filteredUsers = response.filter(
          (user) => user.role === "superadmin" || user.role === "admin"
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
  }, []);

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
    console.log(`Deleting user with ID: ${userId}`);
  
    try {
      const response = await deleteUser(`/api/admin/deleteUser/${userId}`);
  
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
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
      {user?.role === "superadmin" && (
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate("/admin/allAdmins/addAdminForm")}
            className="px-4 py-2 mb-3 bg-zinc-600 text-white rounded"
          >
            Create New Admins
          </button>
        </div>
      )}
      <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{user._id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                {user.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleBlockUser(user._id, user.isBlocked)}
                  className={`px-4 py-2 rounded-md text-white ${
                    user.isBlocked ? "bg-green-600" : "bg-red-600"
                  } hover:bg-opacity-80`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
              <td className="py-2 px-4 border-b"><button
                  onClick={() => handleDeleteUser(user._id)}
                  className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
                >
                  Delete
                </button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardUsers;
