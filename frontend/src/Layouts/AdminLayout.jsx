import { Routes, Route } from "react-router-dom";
import SideBar from "../Components/Sections/SideBar/SideBar.jsx";
import Messages from "../Components/Pages/Messages/Messages.jsx";
import AdminUsers from "../Components/Pages/AdminUsers/AdminUsers.jsx"; 
import AdminComplaints from "../Components/Pages/AdminComplaints/AdminComplaints.jsx";
import AdminReports from "../Components/Pages/AdminReports/AdminReports.jsx";
export default function AdminLayout({ children }) {
  return (
    <div className="page admin-shell">
      <SideBar />
      <div className="admin-page-layout">
        {children}
        <Routes>
          <Route path="/messages" element={<Messages />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/complaints" element={<AdminComplaints />} />
          <Route path="/reports" element={<AdminReports />} />
        </Routes>
      </div>
    </div>
  );
}
