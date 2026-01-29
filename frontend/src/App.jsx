import { Route, Routes } from "react-router-dom";
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
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        <Route path="/read more" element={<ReadMore />} />{" "}
        <Route path="/upload-dataset" element={<UploadDataset />} />{" "}
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/reports" element={<Reports />} />{" "}
      </Routes>
      <ChatWidget />
      <Footer />
    </>
  );
}

export default App;
