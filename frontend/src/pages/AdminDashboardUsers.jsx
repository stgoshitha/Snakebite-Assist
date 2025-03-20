import { React, useEffect, useState } from 'react';
import { get,patch } from '../services/ApiEndpoint';


const AdminDashboardUsers = () => {
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const getUsers = async () => {
      try {
        const request = await get('/api/admin/getUser');
        const response = request.data.users;  
        console.log(response);  
        setUsers(response);
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
  
      alert(isBlocked ? 'User unblocked' : 'User blocked');
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (err) {
      console.error('Error updating user status', err);
    }
  };

  return (
    <div>
      <h1>User Details</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
              <button 
                onClick={() => handleBlockUser(user._id, user.isBlocked)} 
                className={`px-2 py-1  ${user.isBlocked ? 'bg-green-600' : 'bg-red-600'} text-white`} 
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardUsers;
