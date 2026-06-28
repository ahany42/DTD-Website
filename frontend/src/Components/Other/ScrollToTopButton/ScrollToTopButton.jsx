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
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--surface-elevated)",
        color: "var(--primary-color)",
        fontSize: "24px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "var(--shadow-lg)",
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
