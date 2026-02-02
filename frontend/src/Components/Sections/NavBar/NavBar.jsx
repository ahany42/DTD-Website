import { TabNav, Button } from "@radix-ui/themes";
import { IoHome } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Check localStorage directly

  function logout() {
    localStorage.removeItem("token");
    // Force re-render by navigating to current page or using window.location
    window.location.href = "/login";
  }

  function login() {
    navigate("/login");
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

            {/* Only show protected links when authenticated */}
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
                  className={location.pathname === "/dashboard" && "primary-bg"}
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
  );
};

export default NavBar;
