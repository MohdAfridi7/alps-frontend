// ✨ TicketSection.jsx
import React, { useEffect, useState } from "react";
import {
  getAllProjects,
  getAllTickets,
  createTicket,
  uploadTicketAttachment,
  getTicketById,
} from "../api/apiRoute";
import { X, Eye } from "lucide-react";

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

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data);
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) {
      console.error("Ticket fetch error:", err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ticketForm, project: activeProject._id };
      const res = await createTicket(payload);
      const ticketId = res?.data?._id;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await uploadTicketAttachment(ticketId, formData);
      }

      setShowModal(false);
      setTicketForm({ subject: "", details: "", priority: "low" });
      setSelectedFile(null);
      fetchTickets();
    } catch (err) {
      console.error("Ticket create error:", err);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const res = await getTicketById(ticketId);
      setViewTicket(res.data);
      setViewModal(true);
    } catch (err) {
      console.error("View ticket error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTickets();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projects & Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects
          .filter((proj) => proj.client) // ✅ Only assigned projects
          .map((proj) => {
            const existingTicket = tickets.find((t) => t.project === proj._id);
            return (
              <div key={proj._id} className="bg-white rounded shadow p-4">
                <h3 className="font-bold text-lg">{proj.title}</h3>
                <p className="text-gray-600 text-sm">{proj.description}</p>
                <p className="text-xs text-gray-400 mt-1">Status: {proj.status}</p>
                <p className="text-xs mt-1 text-gray-700">
                  Assigned to: {proj.client?.name} ({proj.client?.email})
                </p>
                {existingTicket ? (
                  <button
                    onClick={() => handleViewTicket(existingTicket._id)}
                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    👁️ View Ticket
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveProject(proj);
                      setShowModal(true);
                    }}
                    className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    + Create Ticket for this Project
                  </button>
                )}
              </div>
            );
          })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Create Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <input
                type="text"
                placeholder="Subject"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Details"
                value={ticketForm.details}
                onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              ></textarea>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <label className="text-sm text-gray-600">Attachment (optional)</label>
              <input
                type="file"
                accept=".jpg,.png,.pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {viewModal && viewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setViewModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-2">🎫 {viewTicket.subject}</h2>
            <p className="text-sm text-gray-700 mb-1">Priority: {viewTicket.priority}</p>
            <p className="text-sm text-gray-700 mb-1">Status: {viewTicket.status}</p>
            <p className="text-sm text-gray-700 mb-1">Details: {viewTicket.details}</p>

            <div className="mt-3">
              <h3 className="font-semibold text-sm">Comments:</h3>
              {viewTicket.comments?.map((c, i) => (
                <div key={i} className="text-sm text-gray-600 border-b py-1">
                  <strong>{c.user?.name || "Unknown"}:</strong> {c.message}
                </div>
              ))}
            </div>

            {viewTicket.attachments?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-1">📎 Attachment:</h3>
                {viewTicket.attachments[0].fileName.endsWith(".pdf") ? (
                  <iframe
                    src={viewTicket.attachments[0].url}
                    className="w-full h-64 border"
                    title="PDF Preview"
                  ></iframe>
                ) : (
                  <img
                    src={viewTicket.attachments[0].url}
                    alt="Ticket Attachment"
                    className="w-full max-h-64 object-contain border"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSection;
