import { Routes, Route } from "react-router-dom";
import SideBar from "../Components/Sections/SideBar/SideBar.jsx";
import Messages from "../Components/Pages/Messages/Messages.jsx";
import AdminUsers from "../Components/Pages/AdminUsers/AdminUsers.jsx"; 
export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }} className="page">
      <SideBar />
      <div style={{ flex: 1 }} className="admin-page-layout">
        {children}
        <Routes>
          <Route path="/messages" element={<Messages />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
}
