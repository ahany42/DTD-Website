import { TabNav, Button } from "@radix-ui/themes";
import { IoHome } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
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
    localStorage.removeItem("token");
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
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Listen for storage events (changes from other tabs/windows)
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
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

              {isAuthenticated && (
                <>
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
                    onClick={() => navigate("/dashboard")}
                    active={location.pathname === "/dashboard"}
                    className={
                      location.pathname === "/dashboard" && "primary-bg"
                    }
                  >
                    <IoIosStats /> Dashboard
                  </TabNav.Link>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <Button color="red" variant="surface" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button color="Gray" variant="surface" onClick={login}>
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
              <button onClick={() => navigate("/")}>
                <IoHome /> Home
              </button>

              {isAuthenticated && (
                <>
                  <button onClick={() => navigate("/upload-dataset")}>
                    <MdFileUpload /> Upload Dataset
                  </button>

                  <button onClick={() => navigate("/dashboard")}>
                    <IoIosStats /> Dashboard
                  </button>
                </>
              )}

              {isAuthenticated ? (
                <Button color="red" variant="surface" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button color="Gray" variant="surface" onClick={login}>
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
