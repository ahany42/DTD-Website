import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { HiOutlineDocumentReport } from "react-icons/hi";

import { FaBars, FaTimes, FaSignOutAlt, FaHome, FaUsers } from "react-icons/fa";
import { MdError } from "react-icons/md";

import { FaMessage } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import { MdDiscount } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { GiConsoleController } from "react-icons/gi";

import NavLogo from "../../../assets/footerlogo.png";
import "./SideBar.css";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItemStyles = {
    button: ({ active }) => ({
      backgroundColor: active ? "var(--primary-color)" : "transparent",
      color: active ? "white" : "var(--grey-color)",
      fontSize: "16px",
      padding: "10px",
      "&:hover": {
        backgroundColor: active ? "var(--primary-color)" : "var(--primary-soft)",
        color: active ? "white" : "var(--primary-color)",
      },
    }),
  };

  const path = location.pathname;
  const handleLogout = () => {
    localStorage.removeItem("DTD_user");
    localStorage.removeItem("DTD_token");
    navigate("/login");
  };
  return (
    <Sidebar
      className={`side-bar ${isCollapsed ? "collapsed" : ""}`}
      collapsed={isCollapsed}
      collapsedWidth="60px"
      width="200px"
      backgroundColor="var(--bg-color)"
    >
      <img
        src={NavLogo}
        alt="DTD"
        width={50}
        height={64}
        loading="eager"
        decoding="async"
        style={{ marginTop: "10px", cursor: "pointer" }}
        onClick={() => navigate("/admin/home")}
      />

      <Menu menuItemStyles={menuItemStyles}>
        {/* Collapse */}
        <MenuItem
          icon={isCollapsed ? <FaBars /> : <FaTimes />}
          onClick={() => setIsCollapsed(!isCollapsed)}
          as="button"
          aria-label="Menu"
        />

        <MenuItem
          icon={<FaMessage />}
          active={path.startsWith("/admin/messages")}
          component={<Link to="/admin/messages" />}
        >
          Messages
        </MenuItem>

        <MenuItem
          icon={<FaUsers />}
          active={path.startsWith("/admin/users")}
          component={<Link to="/admin/users" />}
        >
          Users
        </MenuItem>

        <MenuItem
          icon={<MdError />}
          active={path.startsWith("/admin/complaints")}
          component={<Link to="/admin/complaints" />}
        >
          Complaints
        </MenuItem>
        <MenuItem
          icon={<HiOutlineDocumentReport />}
          active={path.startsWith("/admin/reports")}
          component={<Link to="/admin/reports" />}
        >
          Reports
        </MenuItem>

        <MenuItem
          icon={<FaSignOutAlt style={{ color: "var(--danger-color)" }} />}
          as="button"
          onClick={handleLogout}
        >
          Log Out
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
