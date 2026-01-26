import { TabNav, Button } from "@radix-ui/themes";
import { IoHome } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
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
            className={location.pathname === "/upload-dataset" && "primary-bg"}
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
        </div>
        <Button color="Gray" variant="surface">
          Get Started
        </Button>
      </div>
    </TabNav.Root>
  );
};

export default NavBar;
