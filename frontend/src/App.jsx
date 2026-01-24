import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage/HomePage.jsx";
import "./App.css";
import ChatWidget from "./Components/Other/ChatWidget/ChatWidget.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
      </Routes>
      <ChatWidget />
    </>
  );
}

export default App;
