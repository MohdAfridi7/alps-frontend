import React, { useEffect, useState } from "react";
import { getMyTickets, getClientProjects } from "../api/apiRoute";
import { Loader, Briefcase, Ticket, AlertCircle, User } from "lucide-react";

const ClientHome = () => {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ticketRes = await getMyTickets();
      const projectRes = await getClientProjects();

      // ✅ Filter assigned projects only (with client field)
      const assignedProjects = projectRes.data.filter((p) => p.client);

      setTickets(ticketRes.data);
      setProjects(assignedProjects);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Failed to load dashboard data" });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <User className="text-indigo-600" size={28} /> Welcome to Your Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white border-l-4 border-indigo-500">
            <h3 className="text-sm text-gray-600 flex items-center gap-2">
              <Briefcase className="text-indigo-500" size={18} /> Assigned Projects
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white border-l-4 border-green-500">
            <h3 className="text-sm text-gray-600 flex items-center gap-2">
              <Ticket className="text-green-500" size={18} /> Your Tickets
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{tickets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white border-l-4 border-yellow-500">
            <h3 className="text-sm text-gray-600 flex items-center gap-2">
              <AlertCircle className="text-yellow-500" size={18} /> Open Tickets
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {tickets.filter((t) => t.status === "open").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;