import { Route, Routes, Navigate } from "react-router-dom";
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

export const AppContext = createContext();
const BACKEND_URL = "http://localhost:4000";

// Simple function to check if user is authenticated
const checkAuth = () => {
  return !!localStorage.getItem("token");
};

// Protected Route Component - depends only on localStorage
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const contextValue = useMemo(
    () => ({
      BACKEND_URL,
      checkAuth, // Optional: expose checkAuth function
    }),
    [BACKEND_URL]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read more" element={<ReadMore />} />
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ChatWidget />
      <Footer />
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
