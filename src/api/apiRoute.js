import axiosInstance from "./axiosInstance";


// ✅ Set token globally if needed
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// ==========================
// ✅ AUTH APIs
// ==========================
export const postRegister = async (userData) => {
  const res = await axiosInstance.post("/api/auth/register", userData);
  return res.data;
};

export const postLogin = async (userData) => {
  const res = await axiosInstance.post("/api/auth/login", userData);
  return res.data;
};

export const getUsersByRole = (role) =>
  axiosInstance.get(`/api/auth/users?role=${role}`);

export const getUserById = (id) =>
  axiosInstance.get(`/api/auth/users/${id}`);

export const updateUser = (id, data) =>
  axiosInstance.put(`/api/auth/users/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/api/auth/users/${id}`);


export const changePassword = (userId, newPassword) =>
  axiosInstance.put(`/api/auth/users/${userId}/password`, { password: newPassword });




// ==========================
// ✅ CLIENT APIs (Admin only)
// ==========================
// export const postClient = (data) => axiosInstance.post("/api/clients", data);
// export const getClients = () => axiosInstance.get("/api/clients");
// export const getClientById = (id) => axiosInstance.get(`/api/clients/${id}`);
// export const updateClient = (id, data) => axiosInstance.put(`/api/clients/${id}`, data);
// export const deleteClient = (id) => axiosInstance.delete(`/api/clients/${id}`);

// ==========================
// ✅ PROJECT APIs
// ==========================
// export const postProject = (data) => axiosInstance.post("/api/projects", data);
// export const getProjects = () => axiosInstance.get("/api/projects");
// export const getProjectById = (id) => axiosInstance.get(`/api/projects/${id}`);
// export const updateProject = (id, data) => axiosInstance.put(`/api/projects/${id}`, data);
// export const deleteProject = (id) => axiosInstance.delete(`/api/projects/${id}`);

export const getAllProjects = (status, sortBy, order) => {
  let query = `?sortBy=${sortBy}&order=${order}`;
  if (status) query = `?status=${status}&sortBy=${sortBy}&order=${order}`;
  return axiosInstance.get(`/api/projects${query}`);
};


export const createProject = (data) =>
  axiosInstance.post("/api/projects", data);

export const updateProject = (id, data) =>
  axiosInstance.put(`/api/projects/${id}`, data);

export const deleteProject = (id) =>
  axiosInstance.delete(`/api/projects/${id}`);

export const assignProjectToClient = (data) =>
  axiosInstance.put("/api/projects/assign", data);

export const getClientProjects = () => axiosInstance.get('/api/projects/my');



// ==========================
// ✅ TICKET APIs
// ==========================
export const createTicket = (data) => axiosInstance.post("/api/tickets", data); // Admin only
export const getAllTickets = () => axiosInstance.get("/api/tickets"); // Admin only
export const getMyTickets = () => axiosInstance.get("/api/tickets/my"); // Client
export const getTicketById = (id) => axiosInstance.get(`/api/tickets/${id}`);
export const updateTicket = (id, data) => axiosInstance.put(`/api/tickets/${id}`, data); // Admin
export const deleteTicket = (id) => axiosInstance.delete(`/api/tickets/${id}`); // Admin
export const addComment = (id, message) =>
  axiosInstance.post(`/api/tickets/${id}/comment`, { message }); // Both

export const updateTicketStatus = (id, status) =>
  axiosInstance.put(`/api/tickets/${id}/status`, { status }); // Client only

// ==========================
// ✅ ATTACHMENT UPLOAD
// ==========================
export const uploadTicketAttachment = (id, formData) => {
  return axiosInstance.post(`/api/upload/ticket/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ==========================
// ✅ DASHBOARD APIs (Admin only)
// ==========================
export const getDashboardStats = () => axiosInstance.get("/api/dashboard/stats");
export const getTicketsLast7Days = () => axiosInstance.get("/api/dashboard/tickets-last-7-days");
export const getClientsLast7Days = () => axiosInstance.get("/api/dashboard/clients-last-7-days");
export const getProjectsByStatus = () => axiosInstance.get("/api/dashboard/projects-by-status");
export const getTicketsByPriority = () => axiosInstance.get("/api/dashboard/tickets-by-priority");
