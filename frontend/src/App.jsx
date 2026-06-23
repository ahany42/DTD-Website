import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { createContext, useMemo, useState } from "react";
import HomePage from "./Components/Pages/HomePage/HomePage.jsx";
import ChatWidget from "./Components/Other/ChatWidget/ChatWidget.jsx";
import ScrollToTopButton from "./Components/Other/ScrollToTopButton/ScrollToTopButton.jsx";
import NavBar from "./Components/Sections/NavBar/NavBar.jsx";
import Footer from "./Components/Sections/Footer/Footer.jsx";
import ReadMore from "./Components/Pages/ReadMore/ReadMore.jsx";
import UploadDataset from "./Components/Pages/UploadDataset/UploadDataset.jsx";
import ReportGetStarted from "./Components/Pages/ReportGetStarted/ReportGetStarted.jsx";
import Login from "./Components/Pages/Login/Login.jsx";
import Reports from "./Components/Pages/Reports/Reports.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./Components/Other/ScrollToTop/ScrollToTop.jsx";
import SignUp from "./Components/Pages/SignUp/SignUp.jsx";
import ForgotPassword from "./Components/Pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Components/Pages/ResetPassword/ResetPassword.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import ViewReport from "./Components/Pages/ViewReport/ViewReport.jsx";
import DynamicEda from "./Components/Pages/DynamicEda/DynamicEda.jsx";
import KnowledgeGraph from "./Components/Pages/KnowledgeGraph/KnowledgeGraph.jsx";
import EDAGraphPage from "./Components/Pages/KnowledgeGraph/EDAGraphPage.jsx";
import PreprocessingGraph from "./Components/Pages/KnowledgeGraph/PreprocessingGraph.jsx";
import FeatureEngineeringGraph from "./Components/Pages/KnowledgeGraph/FeatureEngineeringGraph.jsx";
import ModelSelectionGraph from "./Components/Pages/KnowledgeGraph/ModelSelectionGraph.jsx";
import ModelTrainGraph from "./Components/Pages/KnowledgeGraph/ModelTrainGraph.jsx";
import EvaluationGraphPage from "./Components/Pages/KnowledgeGraph/EvaluationGraphPage.jsx";
// Contexts
export const AppContext = createContext();
export const ReportContext = createContext();

// Backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Helper functions
const checkAuth = () => !!localStorage.getItem("DTD_token");
const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
function formatRunTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes} m ${remainingSeconds.toFixed(1)} secs`;
  } else {
    return `${remainingSeconds.toFixed(1)} secs`;
  }
}

const formatCustomTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const [datePart, timePart] = timestamp.split("_");

  const year = datePart.slice(0, 4);
  const month = datePart.slice(4, 6) - 1; // JS months are 0-indexed
  const day = datePart.slice(6, 8);

  const hour = timePart.slice(0, 2);
  const minute = timePart.slice(2, 4);
  const second = timePart.slice(4, 6);

  const date = new Date(year, month, day, hour, minute, second);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
// Protected Routes
const ProtectedRoute = ({ children }) => {
  if (!checkAuth()) return <Navigate to="/login" replace />;
  return children;
};
const downloadReport = async (reportId) => {
  const res = await fetch(`${BACKEND_URL}/api/reports/${reportId}/download`);

  if (!res.ok) {
    const err = await res.text();
    console.error("Download failed:", err);
    return;
  }

  const blob = await res.blob();

  if (blob.type !== "application/pdf") {
    console.error("Not a PDF:", blob);
    return;
  }
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "automl_report.pdf";
  a.click();
};
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("DTD_user"));
  if (!checkAuth()) return <Navigate to="/login" replace />;
  if (!user || user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUploadDataSet = location.pathname.startsWith("/upload-dataset");

  // App-level context
  const appContextValue = useMemo(
    () => ({
      BACKEND_URL,
      checkAuth,
      formatFileSize,
      formatDate,
      formatRunTime,
      downloadReport,
      formatCustomTimestamp,
    }),
    []
  );
  const [reportRefreshFlag, setReportRefreshFlag] = useState(0);

  const triggerReportRefresh = () => {
    // Increment flag to tell components to refetch
    setReportRefreshFlag((prev) => prev + 1);
  };

  const reportContextValue = useMemo(
    () => ({
      triggerReportRefresh,
      reportRefreshFlag,
    }),
    [reportRefreshFlag]
  );

  return (
    <AppContext.Provider value={appContextValue}>
      <ReportContext.Provider value={reportContextValue}>
        {/* NavBar */}
        {!isAdminRoute && <NavBar />}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/read-more" element={<ReadMore />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          />
          <Route
            path="/upload-dataset"
            element={
              <ProtectedRoute>
                <UploadDataset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-eda"
            element={
              <ProtectedRoute>
                <DynamicEda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-started"
            element={
              <ProtectedRoute>
                <ReportGetStarted />
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
          <Route
            path="/view-report/:reportId"
            element={
              <ProtectedRoute>
                <ViewReport />
              </ProtectedRoute>
            }
          />
          <Route path="/eda-graph" element={<EDAGraphPage />} />
          <Route path="/preprocess-graph" element={<PreprocessingGraph />} />
          <Route
            path="/feature-engineering-graph"
            element={<FeatureEngineeringGraph />}
          />
          <Route
            path="/model-selection-graph"
            element={<ModelSelectionGraph />}
          />
          <Route path="/training-graph" element={<ModelTrainGraph />} />
          <Route path="/evaluation-graph" element={<EvaluationGraphPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>

        {/* Widgets & Footer */}
        {/* {!isAdminRoute && !isUploadDataSet && <ChatWidget />} */}
        {!isAdminRoute && !isUploadDataSet && <ScrollToTopButton />}
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
      </ReportContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
