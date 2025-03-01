import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  username: string;
  email: string;
  admin: boolean;
  banned: boolean;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handlePromoteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/users/${userId}/promote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user.id === userId ? { ...user, admin: true } : user
      ));
    } catch (error) {
      console.error("Failed to promote user", error);
    }
  };

  const handleDemoteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/${userId}/demote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user.id === userId ? { ...user, admin: false } : user
      ));
    } catch (error) {
      console.error("Failed to demote user", error);
    }
  };

  const handleBanUser = async (userId: number, username: string) => {
    const confirmBan = window.confirm(`Are you sure you want to ban ${username}?`);
    if (!confirmBan) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/users/${userId}/ban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user.id === userId ? { ...user, banned: true } : user
      ));
      alert(`${username} has been banned.`);
    } catch (error) {
      console.error("Failed to ban user", error);
    }
  };

  const handleUnbanUser = async (userId: number, username: string) => {
    const confirmUnban = window.confirm(`Are you sure you want to unban ${username}?`);
    if (!confirmUnban) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/users/${userId}/unban`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map((user) =>
        user.id === userId ? { ...user, banned: false } : user
      ));
      alert(`${username} has been unbanned.`);
    } catch (error) {
      console.error("Failed to unban user", error);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${username}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user.id !== userId));
      alert(`${username} has been deleted.`);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Error deleting user.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="mt-2">Manage Users</p>

      <div className="mt-4">
        {users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="border p-4 rounded mt-2">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p>Email: {user.email}</p>
              <p className="text-sm text-gray-500">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>

              <div className="mt-2 flex space-x-2">
                {!user.admin ? (
                  <button
                    onClick={() => handlePromoteUser(user.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Promote to Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleDemoteUser(user.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Demote to User
                  </button>
                )}

                {!user.admin && !user.banned && (
                  <button
                    onClick={() => handleBanUser(user.id, user.username)}
                    className="px-3 py-1 bg-orange-500 text-white rounded"
                  >
                    Ban User
                  </button>
                )}

                {!user.admin && user.banned && (
                  <button
                    onClick={() => handleUnbanUser(user.id, user.username)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Unban User
                  </button>
                )}

                {!user.admin && (
                  <button
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
