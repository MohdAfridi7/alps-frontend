import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin, setAuthToken } from "../api/apiRoute";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await postLogin(formData);

      // 🔑 Store different token keys based on role
      if (res.user.role === "Admin") {
        localStorage.setItem("admToken", res.token);
      } else {
        localStorage.setItem("clntToken", res.token);
      }

      setAuthToken(res.token); // ✅ for axiosInstance
      setAlert({ type: "success", message: "Login successful" });

      setTimeout(() => {
        setAlert(null);
        if (res.user.role === "Admin") navigate("/adminDashboard");
        else navigate("/clientDashboard");
      }, 1000);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.msg || "Login failed" });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center px-4 py-12">
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <div className="text-center mb-8">
           <div className="p-4 border-b flex justify-center items-center h-16">
    <img src="https://www.cscs.ch/fileadmin/_processed_/b/b/csm_Alps_ALPS_Logo_ec2a1ca998.jpg" alt="Company Logo" className="h-[50px]" />
  </div>
          <p className="mt-2 text-sm text-gray-500">Login Admin and Client Both</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 outline-none py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;