import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { createContext, useMemo } from "react";
import HomePage from "./Components/Pages/HomePage/HomePage.jsx";
import "./App.css";
import ChatWidget from "./Components/Other/ChatWidget/ChatWidget.jsx";
import NavBar from "./Components/Sections/NavBar/NavBar.jsx";
import Footer from "./Components/Sections/Footer/Footer.jsx";
import ReadMore from "./Components/Pages/ReadMore/ReadMore.jsx";
import UploadDataset from "./Components/Pages/UploadDataset/UploadDataset.jsx";
import Dashboard from "./Components/Pages/Dashboard/Dashboard.jsx";
import Login from "./Components/Pages/Login/Login.jsx";
import Reports from "./Components/Pages/Reports/Reports.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./Components/Other/ScrollToTop/ScrollToTop.jsx";
import SignUp from "./Components/Pages/SignUp/SignUp.jsx";
import ForgotPassword from "./Components/Pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Components/Pages/ResetPassword/ResetPassword.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";

export const AppContext = createContext();

const BACKEND_URL = "http://localhost:4000";

// Check if user is authenticated
const checkAuth = () => {
  return !!localStorage.getItem("DTD_token");
};
const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
// Protected Route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
const AdminRoute = ({ children }) => {
  const isAuthenticated = checkAuth();
  const user = JSON.parse(localStorage.getItem("DTD_user")); // assume you store user info on login

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />; // redirect non-admins to home
  }

  return children;
};
function App() {
  const location = useLocation(); // reactive location
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUploadDataSet = location.pathname.startsWith("/upload-dataset");

  const contextValue = useMemo(
    () => ({
      BACKEND_URL,
      checkAuth,
      formatFileSize,
      formatDate,
    }),
    []
  );

  return (
    <AppContext.Provider value={contextValue}>
      {/* Hide NavBar on admin routes */}
      {!isAdminRoute && <NavBar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read-more" element={<ReadMore />} />
        {
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          />
        }

        <Route
          path="/upload-dataset"
          element={
            <ProtectedRoute>
              <UploadDataset />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      {/* Hide widgets on admin routes */}
      {!isAdminRoute && !isUploadDataSet && <ChatWidget />}
      {!isAdminRoute && <Footer />}

      <ScrollToTop />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        limit={1}
      />
    </AppContext.Provider>
  );
}

export default App;
