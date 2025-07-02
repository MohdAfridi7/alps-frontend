import React, { useEffect, useState } from "react";
import { getUserById, updateUser, changePassword } from "../api/apiRoute";
import { User, Edit, Lock, X } from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const adminId = JSON.parse(atob(localStorage.getItem("admToken").split(".")[1])).id;

  const fetchAdmin = async () => {
    try {
      const res = await getUserById(adminId);
      setAdmin(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load profile" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(adminId, formData);
      setEditMode(false);
      await fetchAdmin();
      setAlert({ type: "success", message: "Profile updated successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to update profile" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await changePassword(adminId, newPassword);
      setNewPassword("");
      setPasswordModal(false);
      setAlert({ type: "success", message: "Password updated successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to update password" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  if (!admin) return <div className="text-center text-gray-600 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      {alert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-sm font-medium transition-all duration-300 transform z-50 ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          } animate-slideIn`}
        >
          {alert.message}
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <User className="text-indigo-600" size={28} /> Admin Profile
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-indigo-500">👤</span>
            <span className="font-medium">Name:</span> {admin.name}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-indigo-500">📧</span>
            <span className="font-medium">Email:</span> {admin.email}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-indigo-500">📞</span>
            <span className="font-medium">Phone:</span> {admin.phone || "Not Provided"}
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 shadow-md"
          >
            <Edit size={18} /> Edit Profile
          </button>
          <button
            onClick={() => setPasswordModal(true)}
            className="px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 flex items-center gap-2 shadow-md"
          >
            <Lock size={18} /> Change Password
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <button
              onClick={() => setEditMode(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Edit className="text-indigo-600" size={20} /> Update Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2"
                >
                  <Edit size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <button
              onClick={() => setPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="text-indigo-600" size={20} /> Update Password
            </h2>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setPasswordModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 flex items-center gap-2"
              >
                <Lock size={18} /> Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;