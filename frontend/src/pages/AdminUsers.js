import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl mb-8 text-[#2C1E16] dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="admin-users-heading">Manage Users</h1>
        <div className="bg-white dark:bg-[#111111] border border-[rgba(44,30,22,0.15)] rounded-lg overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-[#D0B8A8]/20"><tr><th className="px-6 py-3 text-left text-sm font-semibold text-[#2C1E16] dark:text-white">Name</th><th className="px-6 py-3 text-left text-sm font-semibold text-[#2C1E16] dark:text-white">Email</th><th className="px-6 py-3 text-left text-sm font-semibold text-[#2C1E16] dark:text-white">Role</th><th className="px-6 py-3 text-left text-sm font-semibold text-[#2C1E16] dark:text-white">Joined</th></tr></thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx} className="border-t border-[rgba(44,30,22,0.15)]" data-testid={`user-${user.email}`}><td className="px-6 py-4 text-sm text-[#2C1E16] dark:text-white">{user.name}</td><td className="px-6 py-4 text-sm text-[#5C4A3D] dark:text-gray-400">{user.email}</td><td className="px-6 py-4 text-sm text-[#5C4A3D] dark:text-gray-400">{user.role}</td><td className="px-6 py-4 text-sm text-[#5C4A3D] dark:text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
