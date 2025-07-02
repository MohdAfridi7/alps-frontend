import React, { useEffect, useState } from "react";
import {
  getAllProjects,
  getAllTickets,
  createTicket,
  uploadTicketAttachment,
  getTicketById,
} from "../api/apiRoute";
import { Briefcase, Plus, X, Eye, FileText, ChevronDown, Loader } from "lucide-react";

const TicketSection = () => {
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    details: "",
    priority: "low",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true); // State for data fetching
  const [createLoading, setCreateLoading] = useState(false); // State for create ticket action
  const [viewLoading, setViewLoading] = useState({}); // State for view ticket action per ticket

  const fetchProjects = async () => {
    setLoading(true); // Set loading state
    try {
      const res = await getAllProjects();
      setProjects(res.data);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load projects" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const fetchTickets = async () => {
    setLoading(true); // Set loading state
    try {
      const res = await getAllTickets();
      setTickets(res.data);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load tickets" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCreateLoading(true); // Set create loading state
    try {
      const payload = { ...ticketForm, project: activeProject._id };
      const res = await createTicket(payload);
      const ticketId = res?.data?._id;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await uploadTicketAttachment(ticketId, formData);
        setAlert({ type: "success", message: "Attachment uploaded successfully" });
      }

      setAlert({ type: "success", message: "Ticket created successfully" });
      setShowModal(false);
      setTicketForm({ subject: "", details: "", priority: "low" });
      setSelectedFile(null);
      await fetchTickets();
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to create ticket" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setCreateLoading(false); // Reset create loading state
    }
  };

  const handleViewTicket = async (ticketId) => {
    setViewLoading((prev) => ({ ...prev, [ticketId]: true })); // Set view loading for specific ticket
    try {
      const res = await getTicketById(ticketId);
      setViewTicket(res.data);
      setViewModal(true);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load ticket details" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setViewLoading((prev) => ({ ...prev, [ticketId]: false })); // Reset view loading for specific ticket
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state for initial fetch
      try {
        await Promise.all([fetchProjects(), fetchTickets()]);
      } catch (err) {
        setAlert({ type: "error", message: "Failed to load initial data" });
        setTimeout(() => setAlert(null), 5000);
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    fetchData();
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

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-2">
          <Briefcase className="text-indigo-600" size={28} /> Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter((proj) => proj.client)
            .map((proj) => {
              const existingTicket = tickets.find((t) => t.project?._id === proj._id);

              return (
                <div
                  key={proj._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white"
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="text-indigo-600" size={20} /> {proj.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{proj.description || "No description"}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="text-indigo-500">📊</span> Status: {proj.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="text-indigo-500">👤</span> Assigned to: {proj.client?.name} ({proj.client?.email})
                  </p>
                  {existingTicket ? (
                    <button
                      onClick={() => handleViewTicket(existingTicket._id)}
                      disabled={viewLoading[existingTicket._id]}
                      className={`mt-4 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 flex items-center gap-2 shadow-md ${
                        viewLoading[existingTicket._id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {viewLoading[existingTicket._id] ? (
                        <Loader className="animate-spin w-5 h-5" />
                      ) : (
                        <Eye size={18} />
                      )}
                      View Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setShowModal(true);
                      }}
                      disabled={createLoading}
                      className={`mt-4 px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 shadow-md ${
                        createLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {createLoading ? (
                        <Loader className="animate-spin w-5 h-5" />
                      ) : (
                        <Plus size={18} />
                      )}
                      Create Ticket
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Plus className="text-indigo-600" size={20} /> Create Ticket
              </h2>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    required
                    className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                    placeholder="Enter ticket subject"
                  />
                </div>
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                    Details
                  </label>
                  <textarea
                    id="details"
                    value={ticketForm.details}
                    onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                    className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                    placeholder="Enter ticket details"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <div className="relative mt-1">
                    <select
                      id="priority"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                    Attachment (optional)
                  </label>
                  <input
                    id="attachment"
                    type="file"
                    accept=".jpg,.png,.pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  />
                </div>
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
                    disabled={createLoading}
                    className={`px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 ${
                      createLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {createLoading ? (
                      <Loader className="animate-spin w-5 h-5" />
                    ) : (
                      <Plus size={18} />
                    )}
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewModal && viewTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setViewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="text-indigo-600" size={24} /> {viewTicket.subject}
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📊</span>
                  <span className="font-medium">Priority:</span> {viewTicket.priority}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📊</span>
                  <span className="font-medium">Status:</span> {viewTicket.status}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📝</span>
                  <span className="font-medium">Details:</span> {viewTicket.details || "No details"}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">👤</span>
                  <span className="font-medium">Assigned To:</span> {viewTicket.assignedTo?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">👤</span>
                  <span className="font-medium">Created By:</span> {viewTicket.createdBy?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-indigo-500">📅</span>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(viewTicket.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-indigo-500">📅</span>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(viewTicket.updatedAt).toLocaleString()}
                </p>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-indigo-500">💬</span> Comments
                  </h3>
                  {viewTicket.comments?.length > 0 ? (
                    viewTicket.comments.map((c, i) => (
                      <div
                        key={i}
                        className="text-sm text-gray-600 p-3 border border-gray-200 rounded-lg mb-2 bg-gray-50"
                      >
                        <strong>{c.user?.name || "Unknown"}:</strong> {c.message}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No comments available.</p>
                  )}
                </div>

                {viewTicket?.attachments?.length > 0 && viewTicket.attachments[0]?.fileName && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="text-indigo-500" size={18} /> Attachment
                    </h3>
                    {viewTicket.attachments[0].fileName.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={viewTicket.attachments[0].url}
                        title="PDF Viewer"
                        className="w-full h-[500px] border border-gray-200 rounded-lg"
                      ></iframe>
                    ) : (
                      <img
                        src={viewTicket.attachments[0].url}
                        alt="Ticket Attachment"
                        className="w-full max-h-96 object-contain border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSection;