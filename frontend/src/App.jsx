import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage/HomePage.jsx";
import "./App.css";
import ChatWidget from "./Components/Other/ChatWidget/ChatWidget.jsx";
import NavBar from "./Components/Sections/NavBar/NavBar.jsx";
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;
