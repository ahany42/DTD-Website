import { TabNav, Button } from "@radix-ui/themes";
import { IoHome, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("DTD_theme") || "light"
  );

  const isDarkTheme = theme === "dark";

  // Check localStorage directly

  function logout() {
    localStorage.removeItem("DTD_token");
    localStorage.removeItem("DTD_user");
    // Force re-render by navigating to current page or using window.location
    window.location.href = "/login";
    setMenuOpen(false);
  }

  function login() {
    navigate("/login");
    setMenuOpen(false);
  }

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("DTD_theme", theme);
  }, [theme]);

  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem("DTD_token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setMenuOpen(false);
    const handleStorageChange = () => {
      const token = localStorage.getItem("DTD_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]);

  return (
    <>
      <div className="desktop-nav">
        <TabNav.Root size="2" color="teal" className="navbar">
          <div className="navbar-container">
            <div className="navbar-links">
              <TabNav.Link
                onClick={() => navigate("/")}
                active={location.pathname === "/"}
                className={location.pathname === "/" && "primary-bg"}
              >
                <IoHome /> Home
              </TabNav.Link>
              <TabNav.Link
                onClick={() => navigate("/get-started")}
                active={location.pathname === "/get-started"}
                className={location.pathname === "/get-started" && "primary-bg"}
              >
                <MdFileUpload />
                Create Your Report
              </TabNav.Link>

              <TabNav.Link
                onClick={() => navigate("/reports")}
                active={location.pathname === "/reports"}
                className={location.pathname === "/reports" && "primary-bg"}
              >
                <HiOutlineDocumentReport /> Reports
              </TabNav.Link>
            </div>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
            >
              {isDarkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
              <span>{isDarkTheme ? "Light" : "Dark"}</span>
            </button>

            {isAuthenticated ? (
              <Button
                color="gray"
                variant="surface"
                className="logout-btn"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <Button
                color="gray"
                className="mobile-nav-btn"
                variant="surface"
                onClick={login}
              >
                Get Started
              </Button>
            )}
          </div>
        </TabNav.Root>
      </div>

      {/* Mobile Navbar */}
      <div className="mobile-nav">
        <div className="mobile-header">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className="mobile-nav-icon-text"
                onClick={() => navigate("/")}
              >
                <IoHome />
                <button>Home</button>
              </div>

              <div
                className="mobile-nav-icon-text"
                onClick={() => navigate("/get-started")}
              >
                <MdFileUpload />
                <button>Create Your Report</button>
              </div>

              <div
                className="mobile-nav-icon-text"
                onClick={() => navigate("/reports")}
              >
                <HiOutlineDocumentReport />
                <button>Reports</button>
              </div>
              <div className="mobile-nav-icon-text" onClick={toggleTheme}>
                {isDarkTheme ? <IoSunnyOutline /> : <IoMoonOutline />}
                <button>{isDarkTheme ? "Light Theme" : "Dark Theme"}</button>
              </div>
              {isAuthenticated ? (
                <Button
                  color="gray"
                  variant="surface"
                  className="logout-btn"
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  color="gray"
                  variant="surface"
                  className="mobile-nav-btn"
                  onClick={login}
                >
                  Get Started
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavBar;
