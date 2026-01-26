import { memo, useCallback } from "react";
import "./Footer.css";

const Footer = memo(() => {
  const year = new Date().getFullYear();

  const openRefundPolicy = useCallback(() => {
    window.open("", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <>
      <div className="Footer">
        <img
          className="FooterLogo"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLXn84m0ldNEy4b-doui_GKkeziMRUfEl71g&s"
          alt="Footer Logo"
          loading="lazy"
        />

        <span className="CopyRightsText">
          COPYRIGHT &copy; {year} DTD - AutoML Ainshams class 2026
        </span>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <span
            className="CopyRightsText"
            style={{ cursor: "pointer" }}
            onClick={openRefundPolicy}
          >
            Privacy Policy
          </span>
        </div>
      </div>
    </>
  );
});

export default Footer;
