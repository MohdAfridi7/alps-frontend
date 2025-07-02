import React, { useEffect, useState } from "react";
import {
  getAllProjects,
  deleteProject,
  createProject,
  updateProject,
  getUsersByRole,
  assignProjectToClient,
} from "../api/apiRoute";
import { Briefcase, Edit, Trash2, MoreVertical, Plus, X, Search, ChevronDown } from "lucide-react";

const statusOptions = ["active", "on-hold", "completed"];

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    startDate: "",
    endDate: "",
    client: "",
  });
  const [alert, setAlert] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, projectId: null });

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      let filteredProjects = res.data;

      if (statusFilter) {
        filteredProjects = filteredProjects.filter((project) => project.status === statusFilter);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProjects = filteredProjects.filter(
          (project) =>
            project.title.toLowerCase().includes(query) ||
            (project.client?.name.toLowerCase().includes(query) || false) ||
            (project.client?.email.toLowerCase().includes(query) || false) ||
            (project.startDate && new Date(project.startDate).toLocaleDateString().includes(query)) ||
            (project.endDate && new Date(project.endDate).toLocaleDateString().includes(query)) ||
            project.status.toLowerCase().includes(query)
        );
      }

      setProjects(filteredProjects);
     
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load projects" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await getUsersByRole("Client");
      setClients(res.data);
 
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load clients" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteModal.projectId);
      await fetchProjects();
      setAlert({ type: "success", message: "Project deleted successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to delete project" });
      setTimeout(() => setAlert(null), 5000);
    }
    setDeleteModal({ open: false, projectId: null });
  };

  const handleEdit = (project) => {
    setEditMode(true);
    setEditId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      client: project.client?._id || "",
    });
    setShowModal(true);
    setShowMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateProject(editId, formData);
        setAlert({ type: "success", message: "Project updated successfully" });
      } else {
        await createProject(formData);
        setAlert({ type: "success", message: "Project created successfully" });
      }
      setShowModal(false);
      setFormData({ title: "", description: "", status: "active", startDate: "", endDate: "", client: "" });
      setEditMode(false);
      await fetchProjects();
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Operation failed" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleSubmitAssign = async (projectId, clientId) => {
    try {
      await assignProjectToClient({ projectId, clientId });
      await fetchProjects();
      setAlert({ type: "success", message: "Project assigned to client successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to assign project" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, statusFilter]);

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
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ open: false, projectId: null })}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
              >
                <Trash2 size={18} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={28} /> Projects
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, client, dates, or status..."
                className="w-64 px-4 py-2 pl-10 bg-gray-50 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="relative inline-block w-48">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full appearance-none px-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
  >
    <option value="">All Status</option>
    {statusOptions.map((s) => (
      <option key={s} value={s}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
    <ChevronDown size={18} />
  </div>
</div>

            <button
              onClick={() => {
                setFormData({ title: "", description: "", status: "active", startDate: "", endDate: "", client: "" });
                setEditMode(false);
                setShowModal(true);
              }}
              className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 shadow-md"
            >
              <Plus size={18} /> Add Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative bg-gradient-to-br from-gray-50 to-whiteachs">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowMenu(project._id)}
                    onMouseLeave={() => setShowMenu(null)}
                    className="p-2 text-gray-600 hover:text-indigo-600 transition duration-200"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showMenu === project._id && (
                    <div
                      className="absolute right-0 top-6 mt-2 w-[100px] bg-white rounded-lg shadow-xl z-10"
                      onMouseEnter={() => setShowMenu(project._id)}
                      onMouseLeave={() => setShowMenu(null)}
                    >
                      <button
                        onClick={() => handleEdit(project)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          setDeleteModal({ open: true, projectId: project._id });
                        }}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="text-indigo-600" size={20} /> {project.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{project.description || "No description"}</p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="text-indigo-500">📊</span> Status: {project.status}
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="text-indigo-500">📅</span> Start: {project.startDate?.split("T")[0] || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="text-indigo-500">📅</span> End: {project.endDate?.split("T")[0] || "N/A"}
              </p>
              {project.client ? (
                <div className="mt-3 text-sm text-green-700">
                  <p className="flex items-center gap-2">
                    <span className="text-indigo-500">👤</span> Assigned to: {project.client.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-indigo-500">📧</span> Email: {project.client.email}
                  </p>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-700">Assign to Client:</label>
                  <div className="relative mt-1">
  <select
    onChange={(e) => handleSubmitAssign(project._id, e.target.value)}
    defaultValue=""
    className="w-full px-3 py-2 pr-10 outline-none appearance-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
  >
    <option value="">-- Select Client --</option>
    {clients.map((client) => (
      <option key={client._id} value={client._id}>
        {client.name} ({client.email})
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
    <ChevronDown size={18} />
  </div>
</div>

                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl h-[90vh] overflow-y-auto w-full max-w-md">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                {editMode ? (
                  <>
                    <Edit className="text-indigo-600" size={20} /> Edit Project
                  </>
                ) : (
                  <>
                    <Plus className="text-indigo-600" size={20} /> Add Project
                  </>
                )}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="Enter project description"
                  ></textarea>
                </div>
                <div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
    Status
  </label>
  <div className="relative mt-1">
    <select
      id="status"
      value={formData.status}
      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition duration-200"
    >
      <option value="active">Active</option>
      <option value="on-hold">On Hold</option>
      <option value="completed">Completed</option>
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      <ChevronDown size={18} />
    </div>
  </div>
</div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
                {editMode &&
                <div>
  <label htmlFor="client" className="block text-sm font-medium text-gray-700">
    Assign to Client
  </label>
  <div className="relative mt-1">
    <select
      id="client"
      value={formData.client}
      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
      className="w-full px-4 py-3 pr-10 outline-none appearance-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
    >
      <option value="">Select Client</option>
      {clients.map((client) => (
        <option key={client._id} value={client._id}>
          {client.name} ({client.email})
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      <ChevronDown size={18} />
    </div>
  </div>
</div>

}
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
                    className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2"
                  >
                    {editMode ? <Edit size={18} /> : <Plus size={18} />}
                    {editMode ? "Update Project" : "Add Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSection;