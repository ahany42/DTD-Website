import { TabNav, Button } from "@radix-ui/themes";
import { IoHome } from "react-icons/io5";
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
        <TabNav.Root size="2" color="var(--primary-color)" className="navbar">
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
                onClick={() => navigate("/upload-dataset")}
                active={location.pathname === "/upload-dataset"}
                className={
                  location.pathname === "/upload-dataset" && "primary-bg"
                }
              >
                <MdFileUpload />
                Upload Dataset
              </TabNav.Link>

              <TabNav.Link
                onClick={() => navigate("/reports")}
                active={location.pathname === "/reports"}
                className={location.pathname === "/reports" && "primary-bg"}
              >
                <HiOutlineDocumentReport /> Reports
              </TabNav.Link>
            </div>

            {isAuthenticated ? (
              <Button color="red" variant="surface" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button
                color="indigo"
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
                onClick={() => navigate("/upload-dataset")}
              >
                <MdFileUpload />
                <button>Upload Dataset</button>
              </div>

              <div
                className="mobile-nav-icon-text"
                onClick={() => navigate("/reports")}
              >
                <HiOutlineDocumentReport />
                <button>Reports</button>
              </div>
              {isAuthenticated ? (
                <Button color="red" variant="surface" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button color="indigo" variant="surface" onClick={login}>
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
