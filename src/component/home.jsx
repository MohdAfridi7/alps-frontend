import React, { useEffect, useState } from "react";
import {
  getDashboardStats,
  getTicketsLast7Days,
  getClientsLast7Days,
  getProjectsByStatus,
  getTicketsByPriority,
} from "../api/apiRoute";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader } from "lucide-react";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

const Home = () => {
  const [stats, setStats] = useState(null);
  const [ticketData, setTicketData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [projectStatus, setProjectStatus] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true); // State for data fetching loading

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true); // Set loading state
      try {
        const s = await getDashboardStats();
        const t = await getTicketsLast7Days();
        const c = await getClientsLast7Days();
        const p = await getProjectsByStatus();
        const tp = await getTicketsByPriority();

        setStats(s.data);
        setTicketData(
          t.data.labels.map((label, idx) => ({ day: label, count: t.data.counts[idx] }))
        );
        setClientData(
          c.data.labels.map((label, idx) => ({ day: label, count: c.data.counts[idx] }))
        );
        setProjectStatus(p.data);
        setTicketPriority(tp.data);
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: "error", message: "Failed to load dashboard data" });
        setTimeout(() => setAlert(null), 5000);
      } finally {
        setLoading(false); // Reset loading state
      }
    };
    fetchDashboard();
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
          <span className="text-indigo-600">📊</span> Dashboard Overview
        </h2>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="text-sm font-medium text-gray-600">Total Clients</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalClients}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-green-50 to-green-100">
              <h3 className="text-sm font-medium text-gray-600">Total Projects</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <h3 className="text-sm font-medium text-gray-600">Open Tickets</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.tickets.open}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-red-50 to-red-100">
              <h3 className="text-sm font-medium text-gray-600">Resolved Tickets</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.tickets.resolved}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-600">📅</span> Tickets Last 7 Days
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketData}>
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-emerald-600">👥</span> Clients Last 7 Days
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientData}>
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {projectStatus && (
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-purple-600">📁</span> Project Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={Object.entries(projectStatus).map(([k, v]) => ({ name: k, value: v }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                    animationDuration={1000}
                  >
                    {Object.entries(projectStatus).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {ticketPriority && (
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-amber-600">⚙️</span> Ticket Priority
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={Object.entries(ticketPriority).map(([k, v]) => ({ name: k, value: v }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                    animationDuration={1000}
                  >
                    {Object.entries(ticketPriority).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;