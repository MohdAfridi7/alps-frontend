# 🌐 Alps CRM - Frontend

This is the frontend of the **Alps CRM** system built with **React**, **Vite**, and **Tailwind CSS**. It supports dynamic dashboard analytics, role-based panels (Admin & Client), project/ticket views, and interactive file handling.

---

## 🚀 Tech Stack

- **Framework:** React (with Vite for fast builds)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (optional), Lucide Icons
- **State Management:** useState, useEffect
- **API Handling:** Axios (custom instance with interceptors)
- **Routing:** React Router DOM
- **Charts:** Recharts (for dashboard graphs)
- **File Display:** PDF preview in `iframe`, Image rendering

---

## 🧾 Folder Structure

frontend/
│
├── components/ # Reusable UI components (Client, Admin, Modals)
├── pages/ # Main panels for Admin & Client
├── api/ # Axios instance & API functions
├── assets/ # Static assets (e.g., logo)
├── App.jsx # App entry with router
├── main.jsx # React root render
├── vite.config.js # Vite config
└── tailwind.config.js # Tailwind setup


---

## 🔐 Auth Flow

- Login available for both Admin & Client roles.
- Based on role, different tokens are stored:
  - `admToken` → for Admin
  - `clntToken` → for Client
- Interceptor auto-attaches the correct token based on current route:
  ```js
  const path = window.location.pathname;
  const token =
    path.includes("/admin") || path.includes("/adminDashboard")
      ? localStorage.getItem("admToken")
      : localStorage.getItem("clntToken");

 Features Overview
 Login
Single login screen

Password show/hide toggle

Role check and redirection after login

Admin Panel (/adminDashboard)
Sidebar Navigation: Home, Clients, Projects, Tickets, Logout

Clients:

Add/Edit/Delete client

Change client password

Projects:

Add/Edit/Delete projects

Assign project to client

Tickets:

View all tickets

View attachments (PDF/Image)

Update ticket status or add comments

Dashboard:

Stats like total tickets, clients, etc.

Graphs (tickets by priority/status, last 7 days)

👤 Client Panel (/clientDashboard)
Sidebar Navigation: Home, My Projects, Logout

My Projects:

View assigned projects

View ticket related to that project

View attachments

Add comment / Update status

 Ticket Attachments
Only one attachment per ticket supported

PDF files displayed via <iframe>

Images rendered directly with <img>