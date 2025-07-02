import React, { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientHome from "../component/ClientHome";
import MyProjects from "../component/CleintMyProject";

const ClientPanel = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { key: "home", label: "Home" },
    { key: "projects", label: "My Projects" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("clntToken"); // ✅ Only remove client token
    navigate("/"); // ✅ Redirect to login/home
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 w-52 bg-white shadow-lg z-20 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
          flex flex-col
        `}
      >
          <div className="p-4 border-b flex items-center h-16">
    <img src="https://www.cscs.ch/fileadmin/_processed_/b/b/csm_Alps_ALPS_Logo_ec2a1ca998.jpg" alt="Company Logo" className="h-[50px]" />
  </div>

        {/* Sidebar Content */}
        <div className="flex flex-col justify-between h-[calc(100vh-64px)] p-4">
          {/* Top Menu */}
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition 
                  ${
                    activeSection === item.key
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-red-600 hover:bg-red-100"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center p-4 bg-white shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-xl font-bold">Client Panel</h1>
        </div>

        <main className="p-6">
          {activeSection === "home" && <ClientHome />}
          {activeSection === "projects" && <MyProjects />}
        </main>
      </div>
    </div>
  );
};

export default ClientPanel;
