import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        width: "48px",
        height: "48px",
        borderRadius: "999px",
        border: "none",
        backgroundColor: "#111827",
        color: "#ffffff",
        fontSize: "24px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
