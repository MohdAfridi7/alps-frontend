import React, { useEffect, useState } from "react";
import {
  getUsersByRole,
  getUserById,
  updateUser,
  deleteUser,
  postRegister,
  changePassword,
} from "../api/apiRoute";
import { User, Edit, Trash2, MoreVertical, Plus, X, Lock, Loader } from "lucide-react";

const ClientSection = () => {
  const [clients, setClients] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, clientId: null });
  const [loading, setLoading] = useState(true); // State for data fetching
  const [buttonLoading, setButtonLoading] = useState(false); // State for button API calls

  const fetchClients = async () => {
    setLoading(true); // Set loading state
    try {
      const res = await getUsersByRole("Client");
      setClients(res.data);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load clients" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleDelete = async () => {
    setButtonLoading(true); // Set button loading state
    try {
      await deleteUser(deleteModal.clientId);
      await fetchClients();
      setAlert({ type: "success", message: "Client deleted successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to delete client" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setButtonLoading(false); // Reset button loading state
    }
    setDeleteModal({ open: false, clientId: null });
  };

  const handleEdit = async (id) => {
    setLoading(true); // Set loading state
    try {
      const res = await getUserById(id);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
        password: "",
      });
      setEditId(id);
      setEditMode(true);
      setShowModal(true);
      setShowMenu(null);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to fetch client data" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true); // Set button loading state
    try {
      if (editMode) {
        await updateUser(editId, formData);
        setAlert({ type: "success", message: "Client updated successfully" });
      } else {
        await postRegister({ ...formData, role: "Client" });
        setAlert({ type: "success", message: "Client added successfully" });
      }
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", password: "" });
      setEditMode(false);
      setEditId(null);
      await fetchClients();
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Operation failed" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setButtonLoading(false); // Reset button loading state
    }
  };

  const handlePasswordChange = async () => {
    setButtonLoading(true); // Set button loading state
    try {
      await changePassword(passwordUserId, newPassword);
      setShowPasswordModal(false);
      setNewPassword("");
      setPasswordUserId(null);
      setShowMenu(null);
      setAlert({ type: "success", message: "Password updated successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to update password" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setButtonLoading(false); // Reset button loading state
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }

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

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 className="text-red-600" size={20} /> Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ open: false, clientId: null })}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={buttonLoading}
                className={`px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2 ${
                  buttonLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {buttonLoading ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  <Trash2 size={18} />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <User className="text-indigo-600" size={28} /> All Clients
          </h2>
          <button
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", password: "" });
              setEditMode(false);
              setShowModal(true);
            }}
            disabled={buttonLoading}
            className={`px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 shadow-md ${
              buttonLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {buttonLoading ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              <Plus size={18} />
            )}
            Add Client
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowMenu(client._id)}
                    onMouseLeave={() => setShowMenu(null)}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition duration-200"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showMenu === client._id && (
                    <div
                      className="absolute top-5 border right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10"
                      onMouseEnter={() => setShowMenu(client._id)}
                      onMouseLeave={() => setShowMenu(null)}
                    >
                      <button
                        onClick={() => handleEdit(client._id)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          setDeleteModal({ open: true, clientId: client._id });
                        }}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          setPasswordUserId(client._id);
                          setShowPasswordModal(true);
                        }}
                        className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Lock size={16} /> Update Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="text-indigo-600" size={20} /> {client.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                <span className="text-indigo-500">📧</span> {client.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <span className="text-indigo-500">📞</span> {client.phone || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                {editMode ? (
                  <>
                    <Edit className="text-indigo-600" size={20} /> Update Client
                  </>
                ) : (
                  <>
                    <Plus className="text-indigo-600" size={20} /> Add New Client
                  </>
                )}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 w-full outline-none px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-1 w-full outline-none px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter client email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter client phone"
                  />
                </div>
                {!editMode && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded159 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                      placeholder="Enter password"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={buttonLoading}
                    className={`px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 ${
                      buttonLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {buttonLoading ? (
                      <Loader className="animate-spin w-5 h-5" />
                    ) : editMode ? (
                      <Edit size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                    {editMode ? "Update Client" : "Add Client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
              <button
                onClick={() => setShowPasswordModal(false)}
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
                  className="mt-8 w-full outline-none px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={buttonLoading}
                  className={`px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 ${
                    buttonLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {buttonLoading ? (
                    <Loader className="animate-spin w-5 h-5" />
                  ) : (
                    <Lock size={18} />
                  )}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSection;