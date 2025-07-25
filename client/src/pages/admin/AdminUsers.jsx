import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/admin/AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setUsers(res.data));
  }, []);

  const deleteUser = async (id) => {
    await axios.delete(`/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminUsers;
