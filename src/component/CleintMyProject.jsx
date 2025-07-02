import React, { useEffect, useState } from "react";
import {
  getClientProjects,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  addComment,
} from "../api/apiRoute";
import { Briefcase, X, Eye, Edit, FileText } from "lucide-react";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("open");
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      const projectRes = await getClientProjects();
      const ticketRes = await getMyTickets();
      const assigned = projectRes.data.filter((p) => p.client);
      setProjects(assigned);
      setTickets(ticketRes.data);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load projects and tickets" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleViewTicket = async (id) => {
    try {
      const res = await getTicketById(id);
      setSelectedTicket(res.data);
      setNewStatus(res.data.status);
      setViewModal(true);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load ticket details" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      if (newComment) {
        await addComment(selectedTicket._id, newComment);
      }
      if (newStatus && newStatus !== selectedTicket.status) {
        await updateTicketStatus(selectedTicket._id, newStatus);
      }
      setEditModal(false);
      setViewModal(false);
      setNewComment("");
      await fetchData();
      setAlert({ type: "success", message: "Ticket updated successfully" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to update ticket" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <Briefcase className="text-indigo-600" size={28} /> My Projects & Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const myTicket = tickets.find((t) => t.project._id === proj._id);
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
                {myTicket ? (
                  <button
                    onClick={() => handleViewTicket(myTicket._id)}
                    className="mt-4 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 flex items-center gap-2 shadow-md"
                  >
                    <Eye size={18} /> View Ticket
                  </button>
                ) : (
                  <p className="mt-4 text-sm italic text-gray-400">No ticket assigned</p>
                )}
              </div>
            );
          })}
        </div>

        {viewModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setViewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="text-indigo-600" size={24} /> {selectedTicket.subject}
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📝</span>
                  <span className="font-medium">Details:</span> {selectedTicket.details || "No details"}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📊</span>
                  <span className="font-medium">Priority:</span> {selectedTicket.priority}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-indigo-500">📊</span>
                  <span className="font-medium">Status:</span> {selectedTicket.status}
                </p>
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-indigo-500">💬</span> Comments
                  </h3>
                  {selectedTicket.comments?.length > 0 ? (
                    selectedTicket.comments.map((c, i) => (
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
                {selectedTicket.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="text-indigo-500" size={18} /> Attachment
                    </h3>
                    {selectedTicket.attachments[0].fileName.endsWith(".pdf") ? (
                      <iframe
                        src={selectedTicket.attachments[0].url}
                        className="w-full h-[500px] border border-gray-200 rounded-lg"
                        title="PDF Preview"
                      ></iframe>
                    ) : (
                      <img
                        src={selectedTicket.attachments[0].url}
                        alt="Ticket Attachment"
                        className="w-full max-h-96 object-contain border border-gray-200 rounded-lg"
                      />
                    )}
                  </div>
                )}
                <button
                  onClick={() => setEditModal(true)}
                  className="mt-6 px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2 shadow-md"
                >
                  <Edit size={18} /> Update Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {editModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <button
                onClick={() => setEditModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Edit className="text-indigo-600" size={20} /> Update Ticket
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Add Comment
                  </label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleUpdateTicket}
                    className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 flex items-center gap-2"
                  >
                    <Edit size={18} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;