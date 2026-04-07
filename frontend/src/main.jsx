import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Theme } from "@radix-ui/themes";

import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";

const ScrollToTop = lazy(
  () => import("./Components/Other/ScrollToTop/ScrollToTop.jsx")
);
const ToastContainer = lazy(() =>
  import("react-toastify").then((m) => ({ default: m.ToastContainer }))
);

import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Theme className="App" defaultColorScheme="light">
        <App />

        {/* Non-blocking UI helpers */}
        <Suspense fallback={null}>
          <ScrollToTop />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
        </Suspense>
      </Theme>
    </Router>
  </StrictMode>
);
